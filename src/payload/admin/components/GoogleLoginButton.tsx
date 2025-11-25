// @ts-nocheck
import React from 'react';

const NEXT_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const GoogleLoginButton = () => {
  const handleClick = () => {
    // Chuyển sang NextAuth Google trên app Next.js
    window.location.href = `${NEXT_APP_URL}/api/auth/signin/google`;
  };

  return (
    <div style={{ marginTop: 24, textAlign: 'center' }}>
      <button
        type="button"
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 4,
          border: '1px solid #444',
          backgroundColor: '#fff',
          color: '#222',
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 18,
            height: 18,
            backgroundColor: '#fff',
            borderRadius: '50%',
            marginRight: 4,
            border: '1px solid #ccc',
            textAlign: 'center',
            lineHeight: '16px',
            fontWeight: 'bold',
            fontSize: 12,
          }}
        >
          G
        </span>
        <span>Đăng nhập với Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
