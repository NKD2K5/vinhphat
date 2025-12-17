// Middleware xử lý OAuth callback từ Google cho Payload CMS
const jwt = require('jsonwebtoken');
const axios = require('axios');
const https = require('https');

function handleOAuthCallback(req, res, next) {
  console.log('=== Middleware Called ===');
  console.log('Request path:', req.path);
  console.log('Query params:', req.query);
  console.log('Original URL:', req.originalUrl);
  
  // CHỈ xử lý OAuth callback khi có authorization code, KHÔNG xử lý /admin thông thường
  if (req.path === '/auth/google/callback' && req.query.code) {
    console.log('✅ Found authorization code - Processing OAuth...');
    const code = req.query.code;
    const baseURL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

    (async () => {
      try {
        // 1. Exchange authorization code lấy access_token từ Google
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${baseURL}/auth/google/callback`,
          grant_type: 'authorization_code',
        });

        const { access_token } = tokenRes.data;
        if (!access_token) {
          throw new Error('Cannot get access_token from Google');
        }

        // 2. Lấy Google user info
        const { data: googleUser } = await axios.get(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        const email = googleUser.email;
        const name = googleUser.name || googleUser.given_name || '';
        const googleId = String(googleUser.id || '');

        if (!email) {
          throw new Error('Google user has no email');
        }

        // 3. Gọi C# API chỉ để xác thực business
        const csharpApiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118/api';

        const csharpRes = await axios.post(
          `${csharpApiUrl}/Auth/oauth-login`,
          {
            email,
            sub: googleId,
            name,
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
            httpsAgent: new https.Agent({
              // Cho phép self-signed cert ở môi trường dev
              rejectUnauthorized: false,
            }),
          }
        );

        const businessUser = csharpRes.data && csharpRes.data.user;

        if (!businessUser) {
          throw new Error('No user returned from C# API');
        }

        if (businessUser.role !== 'admin') {
          throw new Error('User is not allowed to access admin');
        }

        // 4. Tạo hoặc cập nhật user trong Payload `users`
        const GENERATED_PASSWORD =
          process.env.GOOGLE_OAUTH_PASSWORD || 'google-oauth-internal-secret';

        const existing = await req.payload.find({
          collection: 'users',
          where: { email: { equals: email } },
          limit: 1,
        });

        let payloadUser;

        if (existing.docs && existing.docs.length > 0) {
          // User đã tồn tại: đồng bộ lại thông tin và đảm bảo password khớp với GENERATED_PASSWORD
          payloadUser = await req.payload.update({
            collection: 'users',
            id: existing.docs[0].id,
            data: {
              email,
              name: businessUser.name || name,
              role: 'admin',
              googleId: googleId,
              password: GENERATED_PASSWORD,
            },
          });
        } else {
          payloadUser = await req.payload.create({
            collection: 'users',
            data: {
              email,
              name: businessUser.name || name,
              role: 'admin',
              googleId: googleId,
              // Password nội bộ cho Payload auth
              password: GENERATED_PASSWORD,
            },
          });
        }

        // 5. Đăng nhập user bằng Payload auth (Payload là auth master)
        await req.payload.login({
          collection: 'users',
          data: {
            email,
            password: GENERATED_PASSWORD,
          },
          req,
          res,
        });

        console.log('✅ Google OAuth login via Payload success for:', email);
        return res.redirect('/admin');
      } catch (error) {
        console.error('❌ Google OAuth middleware error:', error);
        return res.redirect(
          `/admin?error=oauth_failed&message=${encodeURIComponent(
            error.message || 'OAuth failed'
          )}`
        );
      }
    })();

    return;
  }
  
  // Kiểm tra nếu có error parameter từ OAuth redirect
  if (req.query.error && (req.path === '/admin' || req.path === '/auth/google/callback')) {
    console.log('❌ OAuth error received:', req.query.error);
    console.log('Error details:', req.query.details || 'No details provided');
    
    if (req.query.details) {
      try {
        const decodedDetails = decodeURIComponent(req.query.details);
        console.log('Decoded error details:', decodedDetails);
      } catch (e) {
        console.log('Could not decode error details');
      }
    }
    
    console.log('Continuing to admin page with error...');
    return next();
  }
  
  console.log('Not an OAuth callback, continuing normal processing...');
  next();
}

async function processAuthorizationCode(code, state, path, req, res) {
  try {
    console.log('=== OAuth Authorization Code Processing Started ===');
    console.log('Authorization code:', code);
    console.log('Client secret available:', !!process.env.GOOGLE_CLIENT_SECRET);
    
    // 1. Exchange authorization code for access token
    console.log('Step 1: Exchanging authorization code for access token...');
    
    try {
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: '398534795337-370j22gken1h6of3vmbf5p2i12sakhml.apps.googleusercontent.com',
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3001/auth/google/callback',
        grant_type: 'authorization_code'
      });
      
      const { access_token, id_token } = tokenResponse.data;
      console.log('Step 1 SUCCESS - Received tokens from Google');
      console.log('Access token length:', access_token ? access_token.length : 'null');
      
      // 2. Fetch user info từ Google
      console.log('Step 2: Fetching user info from Google...');
      const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      const googleUser = googleResponse.data;
      console.log('Step 2 SUCCESS - Google user info:', { 
        id: googleUser.id, 
        email: googleUser.email,
        name: googleUser.name 
      });
      
      // 3. Gọi C# API để xác thực và nhận JWT token
      console.log('Step 3: Calling C# API...');
      const csharpApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118/api';
      console.log('C# API URL:', csharpApiUrl);
      
      const payload = {
        email: googleUser.email || '',
        sub: String(googleUser.id || ''),
        name: googleUser.name || '',
      };

      console.log('📤 Payload being sent to C# API:');
      console.log('   - email:', payload.email, '(type:', typeof payload.email + ')');
      console.log('   - sub:', payload.sub, '(type:', typeof payload.sub + ')');
      console.log('   - name:', payload.name, '(type:', typeof payload.name + ')');
      console.log('   - Full payload object:', JSON.stringify(payload, null, 2));
      
      try {
        const authResponse = await axios.post(`${csharpApiUrl}/Auth/oauth-login`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false
          })
        });
        
        console.log('Step 3 SUCCESS - C# API response:', authResponse.data);
        
        const { token, user: csharpUser } = authResponse.data;
        if (!token) {
          throw new Error('No token received from C# API');
        }
        
        // 4. Decode JWT token
        console.log('Step 4: Decoding JWT token...');
        const decoded = jwt.decode(token);
        
        if (!decoded || !decoded.sub) {
          throw new Error('Invalid JWT token from C# API');
        }
        
        console.log('Step 4 SUCCESS - JWT decoded, token payload:', {
          sub: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role
        });
        
        const user = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || 'admin'
        };
        
        console.log('Step 4 FINAL - User object for Payload:', user);
        console.log('=== OAuth Authorization Code Processing Completed ===');
        
        return { user };
        
      } catch (apiError) {
        console.error('Step 3 FAILED - C# API Error:', {
          message: apiError.message,
          code: apiError.code,
          response: apiError.response?.data,
          status: apiError.response?.status
        });
        
        if (apiError.code === 'ECONNREFUSED') {
          throw new Error('C# API is not running. Please start the C# API server on port 7118.');
        }
        
        throw new Error(`C# API Error: ${apiError.message}`);
      }
      
    } catch (tokenError) {
      console.error('Step 1 FAILED - Token Exchange Error:', {
        message: tokenError.message,
        response: tokenError.response?.data,
        status: tokenError.response?.status
      });
      
      if (tokenError.response?.status === 400) {
        throw new Error('Invalid authorization code or redirect URI mismatch');
      }
      
      throw new Error(`Token exchange failed: ${tokenError.message}`);
    }
    
  } catch (error) {
    console.error('=== OAuth Authorization Code Processing FAILED ===', error);
    throw error;
  }
}

async function processGoogleToken(accessToken, state) {
  try {
    console.log('=== OAuth Processing Started ===');
    
    // 1. Fetch user info từ Google
    console.log('Step 1: Fetching user info from Google...');
    const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const googleUser = googleResponse.data;
    console.log('Step 1 SUCCESS - Google user info:', { 
      id: googleUser.id, 
      email: googleUser.email,
      name: googleUser.name 
    });
    
    // 2. Gọi C# API để xác thực và nhận JWT token
    const csharpApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118/api';
    console.log('Step 2: Calling C# API at:', `${csharpApiUrl}/Auth/oauth-login`);
    
    const payload = {
      email: googleUser.email || '',
      sub: String(googleUser.id || ''),
      name: googleUser.name || '',
    };

    console.log('📤 Payload being sent to C# API:');
    console.log('   - email:', payload.email, '(type:', typeof payload.email + ')');
    console.log('   - sub:', payload.sub, '(type:', typeof payload.sub + ')');
    console.log('   - name:', payload.name, '(type:', typeof payload.name + ')');
    console.log('   - Full payload object:', JSON.stringify(payload, null, 2));
    
    try {
      const authResponse = await axios.post(`${csharpApiUrl}/Auth/oauth-login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      console.log('Step 2 SUCCESS - C# API response:', authResponse.data);
      
      const { token, user: csharpUser } = authResponse.data;
      if (!token) {
        throw new Error('No token received from C# API');
      }
      
      // 3. Decode JWT token
      console.log('Step 3: Decoding JWT token...');
      const decoded = jwt.decode(token);
      
      if (!decoded || !decoded.sub) {
        throw new Error('Invalid JWT token from C# API');
      }
      
      console.log('Step 3 SUCCESS - JWT decoded, token payload:', {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      });
      
      const user = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'admin'
      };
      
      console.log('Step 3 FINAL - User object for Payload:', user);
      console.log('=== OAuth Processing Completed ===');
      
      return { user };
      
    } catch (apiError) {
      console.error('Step 2 FAILED - C# API Error:', {
        message: apiError.message,
        code: apiError.code,
        response: apiError.response?.data,
        status: apiError.response?.status
      });
      
      if (apiError.code === 'ECONNREFUSED') {
        throw new Error('C# API is not running. Please start the C# API server on port 7118.');
      }
      
      throw new Error(`C# API Error: ${apiError.message}`);
    }
    
  } catch (error) {
    console.error('=== OAuth Processing FAILED ===', error);
    throw error;
  }
}

module.exports = handleOAuthCallback;
module.exports.processGoogleToken = processGoogleToken;