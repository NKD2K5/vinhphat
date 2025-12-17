const React = require('react');
const PasswordField = require('./PasswordField');

const CustomLogin = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Hide the original login form
  React.useEffect(() => {
    const originalForm = document.querySelector('form[data-testid="login-form"]');
    if (originalForm) {
      originalForm.style.display = 'none';
    }
    
    // Also hide the original login title
    const originalTitle = document.querySelector('h1');
    if (originalTitle && originalTitle.textContent.includes('Welcome')) {
      originalTitle.style.display = 'none';
    }
    
    return () => {
      // Cleanup when component unmounts
      if (originalForm) {
        originalForm.style.display = '';
      }
      if (originalTitle) {
        originalTitle.style.display = '';
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Find the original hidden form and submit it properly
      const originalForm = document.querySelector('form[data-testid="login-form"]');
      if (originalForm) {
        const emailInput = originalForm.querySelector('input[name="email"]');
        const passwordInput = originalForm.querySelector('input[name="password"]');
        
        if (emailInput) {
          emailInput.value = email;
          emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (passwordInput) {
          passwordInput.value = password;
          passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Submit the original form
        originalForm.dispatchEvent(new Event('submit', { cancelable: false }));
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback: try direct API call
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
          window.location.href = '/admin';
        } else {
          alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
      } catch (fetchError) {
        alert('Lỗi kết nối. Vui lòng thử lại.');
      }
    }
  };

  return React.createElement(
    'div',
    {
      style: {
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
      },
    },
    React.createElement('h2', { style: { textAlign: 'center', marginBottom: '20px' } }, 'Đăng nhập'),
    React.createElement(
      'form',
      { onSubmit: handleSubmit },
      React.createElement(
        'div',
        { style: { marginBottom: '15px' } },
        React.createElement('label', { style: { display: 'block', marginBottom: '5px' } }, 'Email'),
        React.createElement('input', {
          type: 'email',
          value: email,
          onChange: (e) => setEmail(e.target.value),
          placeholder: 'Nhập email...',
          required: true,
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            boxSizing: 'border-box',
          },
        })
      ),
      React.createElement(
        'div',
        { style: { marginBottom: '15px' } },
        React.createElement('label', { style: { display: 'block', marginBottom: '5px' } }, 'Mật khẩu'),
        React.createElement(
          'div',
          { style: { position: 'relative' } },
          React.createElement('input', {
            type: showPassword ? 'text' : 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: 'Nhập mật khẩu...',
            required: true,
            style: {
              width: '100%',
              padding: '8px 40px 8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            },
          }),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: () => setShowPassword(!showPassword),
              style: {
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                color: '#666',
              },
              title: showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu',
            },
            React.createElement(
              'svg',
              {
                width: '18',
                height: '18',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              },
              showPassword
                ? [
                    React.createElement('path', {
                      key: 'slash',
                      d: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24',
                    }),
                    React.createElement('line', {
                      key: 'line',
                      x1: '1',
                      y1: '1',
                      x2: '23',
                      y2: '23',
                    }),
                  ]
                : [
                    React.createElement('path', {
                      key: 'eye',
                      d: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
                    }),
                    React.createElement('circle', {
                      key: 'pupil',
                      cx: '12',
                      cy: '12',
                      r: '3',
                    }),
                  ]
            )
          )
        )
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          style: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
          },
        },
        'Đăng nhập'
      )
    )
  );
};

module.exports = CustomLogin;
