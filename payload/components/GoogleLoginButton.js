const React = require('react');

// Google OAuth Login Button cho Payload CMS
const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  console.log('GoogleLoginButton component rendered');
  console.log('Current URL:', window.location.href);
  console.log('Query params:', window.location.search);

  // Check for OAuth callback on page load (authorization code flow)
  React.useEffect(() => {
    console.log('useEffect triggered, checking auth code...');
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    console.log('Code found:', code);
    console.log('Error found:', error);
    
    if (error) {
      console.error('OAuth error:', error);
      setError('Đăng nhập thất bại: ' + error);
      return;
    }
    
    if (code) {
      console.log('Found OAuth authorization code, processing...');
      handleOAuthCallback(code);
    } else {
      console.log('No authorization code, showing login button');
    }
  }, []);

  const handleOAuthCallback = async (code) => {
    try {
      console.log('Processing OAuth callback with code...');
      
      // Send authorization code to server for processing
      const response = await fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirectUri: window.location.origin + '/auth/google/callback'
        })
      });

      if (response.ok) {
        console.log('OAuth processed successfully, redirecting...');
        window.location.href = '/admin/collections';
      } else {
        const error = await response.text();
        console.error('OAuth processing failed:', error);
        setError('Đăng nhập thất bại: ' + error);
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      setError('Đăng nhập thất bại');
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Google OAuth configuration (Authorization Code Flow)
      const clientId = '398534795337-370j22gken1h6of3vmbf5p2i12sakhml.apps.googleusercontent.com';
      
      // ✅ FIX: Dùng callback endpoint riêng thay vì /admin
      const redirectUri = window.location.origin + '/auth/google/callback';
      
      console.log('Redirect URI:', redirectUri); // Debug log
      
      // Tạo Google OAuth URL với Authorization Code Flow
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'email profile');
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      console.log('Redirecting to Google OAuth:', authUrl.toString());
      
      // Redirect đến Google OAuth
      window.location.href = authUrl.toString();
      
    } catch (error) {
      console.error('Google login error:', error);
      setError('Đăng nhập thất bại');
      setIsLoading(false);
    }
  };

  return React.createElement(
    'div',
    { 
      style: { 
        marginTop: 24, 
        textAlign: 'center',
        padding: '16px'
      } 
    },
    
    // Divider
    React.createElement(
      'div',
      { 
        style: { 
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        } 
      },
      React.createElement('div', { 
        style: { 
          flex: 1, 
          height: '1px', 
          backgroundColor: '#e5e7eb' 
        } 
      }),
      React.createElement(
        'span',
        { 
          style: { 
            fontSize: '14px', 
            color: '#6b7280',
            fontWeight: '500'
          } 
        },
        'Hoặc đăng nhập với'
      ),
      React.createElement('div', { 
        style: { 
          flex: 1, 
          height: '1px', 
          backgroundColor: '#e5e7eb' 
        } 
      })
    ),

    // Google Login Button
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: handleLogin,
        disabled: isLoading,
        style: {
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          backgroundColor: '#ffffff',
          color: '#374151',
          fontSize: '14px',
          fontWeight: '500',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          opacity: isLoading ? 0.5 : 1,
        },
        onMouseOver: (e) => {
          if (!isLoading) {
            e.target.style.backgroundColor = '#f9fafb';
            e.target.style.borderColor = '#9ca3af';
          }
        },
        onMouseOut: (e) => {
          if (!isLoading) {
            e.target.style.backgroundColor = '#ffffff';
            e.target.style.borderColor = '#d1d5db';
          }
        },
      },
      
      // Google Icon
      isLoading 
        ? React.createElement(
            'div',
            {
              style: {
                width: '20px',
                height: '20px',
                border: '2px solid #3b82f6',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }
            }
          )
        : React.createElement(
            'svg',
            {
              width: '20',
              height: '20',
              viewBox: '0 0 24 24',
              fill: 'none'
            },
            React.createElement('path', {
              d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
              fill: '#4285F4'
            }),
            React.createElement('path', {
              d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z',
              fill: '#34A853'
            }),
            React.createElement('path', {
              d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z',
              fill: '#FBBC05'
            }),
            React.createElement('path', {
              d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
              fill: '#EA4335'
            })
          ),

      // Button Text
      React.createElement(
        'span',
        null,
        isLoading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Google'
      )
    ),

    // Error Message
    error && React.createElement(
      'div',
      {
        style: {
          marginTop: '12px',
          padding: '8px 12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#dc2626'
        }
      },
      error
    ),

    // CSS Animation
    React.createElement(
      'style',
      null,
      `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `
    )
  );
};

module.exports = GoogleLoginButton;