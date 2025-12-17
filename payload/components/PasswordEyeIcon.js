const React = require('react');

const PasswordEyeIcon = () => {
  React.useEffect(() => {
    // Find password fields in the login form
    const addEyeIcon = () => {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      
      passwordInputs.forEach(input => {
        // Skip if already has eye icon
        if (input.parentElement.querySelector('.password-eye-icon')) return;
        
        // Create eye icon container
        const eyeContainer = document.createElement('div');
        eyeContainer.style.position = 'relative';
        eyeContainer.style.display = 'inline-block';
        eyeContainer.style.width = '100%';
        
        // Wrap the input
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        
        // Move input into wrapper
        const parent = input.parentElement;
        if (parent) {
          parent.insertBefore(wrapper, input);
          wrapper.appendChild(input);
          
          // Create eye icon button
          const eyeButton = document.createElement('button');
          eyeButton.type = 'button';
          eyeButton.className = 'password-eye-icon';
          eyeButton.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          `;
          eyeButton.style.cssText = `
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: #666;
            z-index: 10;
          `;
          eyeButton.title = 'Hiển thị mật khẩu';
          
          // Toggle password visibility
          let isVisible = false;
          eyeButton.addEventListener('click', () => {
            isVisible = !isVisible;
            input.type = isVisible ? 'text' : 'password';
            eyeButton.innerHTML = isVisible ? `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ` : `
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            `;
            eyeButton.title = isVisible ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu';
          });
          
          wrapper.appendChild(eyeButton);
        }
      });
    };

    // Run immediately and also watch for changes
    addEyeIcon();
    
    // Set up observer to catch dynamically added elements
    const observer = new MutationObserver(() => {
      addEyeIcon();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything visible
};

module.exports = PasswordEyeIcon;
