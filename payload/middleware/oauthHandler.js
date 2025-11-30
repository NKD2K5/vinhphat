// Middleware xử lý OAuth callback từ Google
const jwt = require('jsonwebtoken');
const axios = require('axios');

function handleOAuthCallback(req, res, next) {
  console.log('=== Middleware Called ===');
  console.log('Request path:', req.path);
  console.log('Query params:', req.query);
  console.log('Original URL:', req.originalUrl);
  
  // Xử lý OAuth callback với authorization code
  if (req.path === '/admin' && req.query.code) {
    console.log('✅ Found authorization code - Processing OAuth...');
    const code = req.query.code;
    const state = req.query.state || 'http://localhost:3001/admin';
    
    console.log('OAuth callback received, processing authorization code...');
    
    processAuthorizationCode(code, state)
      .then((result) => {
        console.log('✅ OAuth processing successful, setting cookie...');
        
        // Set Payload token cookie
        const payloadSecret = process.env.PAYLOAD_SECRET || 'your-super-secret-payload-secret-here';
        const payloadToken = jwt.sign(
          {
            id: result.user.id,
            email: result.user.email,
            collection: 'users',
            role: 'admin',
          },
          payloadSecret,
          { expiresIn: '7d' }
        );

        // Set cookie với Payload token
        res.cookie('payload-token', payloadToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log('✅ Set Payload token cookie, redirecting to admin dashboard');
        // Redirect về admin dashboard
        return res.redirect('/admin/collections');
      })
      .catch((error) => {
        console.error('❌ OAuth processing failed:', error);
        console.error('Error details:', error.message);
        console.error('Full error stack:', error.stack);
        
        // Encode error details for URL
        const errorDetails = encodeURIComponent(`${error.message} | Stack: ${error.stack}`);
        return res.redirect(`/admin?error=oauth_failed&details=${errorDetails}`);
      });
    
    return; // Ngừng xử lý tiếp theo
  }
  
  // Kiểm tra nếu có error parameter từ redirect
  if (req.path === '/admin' && req.query.error) {
    console.log('❌ OAuth error received:', req.query.error);
    console.log('Error details:', req.query.details || 'No details provided');
    
    // Decode error details if present
    if (req.query.details) {
      try {
        const decodedDetails = decodeURIComponent(req.query.details);
        console.log('Decoded error details:', decodedDetails);
      } catch (e) {
        console.log('Could not decode error details');
      }
    }
    
    // Không redirect nữa để tránh infinite loop, chỉ tiếp tục xử lý bình thường
    console.log('Continuing to admin page with error...');
    return next();
  }
  
  console.log('Not an OAuth callback, continuing normal processing...');
  // Nếu không phải OAuth callback, tiếp tục xử lý bình thường
  next();
}

async function processAuthorizationCode(code, state) {
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
        redirect_uri: 'http://localhost:3001/admin',
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
      
      try {
        const authResponse = await axios.post(`${csharpApiUrl}/Auth/oauth-login`, {
          id: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          // ✅ Bỏ qua SSL verification cho self-signed certificate
          httpsAgent: new (require('https').Agent)({
            rejectUnauthorized: false
          })
        });
        
        console.log('Step 3 SUCCESS - C# API response:', authResponse.data);
        
        const { token } = authResponse.data;
        if (!token) {
          throw new Error('No token received from C# API');
        }
        
        // 4. Verify JWT token với C# API secret
        console.log('Step 4: Verifying JWT token...');
        const secret = process.env.CSHARP_API_SECRET || 'your-csharp-api-secret';
        console.log('C# API secret available:', !!secret);
        
        const decoded = jwt.verify(token, secret);
        
        if (!decoded || !decoded.user) {
          throw new Error('Invalid JWT token from C# API');
        }
        
        console.log('Step 4 SUCCESS - JWT verified, user:', decoded.user);
        console.log('=== OAuth Authorization Code Processing Completed ===');
        
        return { user: decoded.user };
        
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
    
    try {
      const authResponse = await axios.post(`${csharpApiUrl}/Auth/oauth-login`, {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      });
      
      console.log('Step 2 SUCCESS - C# API response:', authResponse.data);
      
      const { token } = authResponse.data;
      if (!token) {
        throw new Error('No token received from C# API');
      }
      
      // 3. Verify JWT token với C# API secret
      console.log('Step 3: Verifying JWT token...');
      const secret = process.env.CSHARP_API_SECRET || 'your-csharp-api-secret';
      const decoded = jwt.verify(token, secret);
      
      if (!decoded || !decoded.user) {
        throw new Error('Invalid JWT token from C# API');
      }
      
      console.log('Step 3 SUCCESS - JWT verified, user:', decoded.user);
      console.log('=== OAuth Processing Completed ===');
      
      return { user: decoded.user };
      
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
