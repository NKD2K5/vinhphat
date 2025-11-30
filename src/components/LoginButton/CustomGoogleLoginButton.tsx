"use client";

import { useState } from 'react';

interface CustomGoogleLoginButtonProps {
  redirectTo?: string;
  onSuccess?: (userData: any) => void;
  onError?: (error: string) => void;
}

export default function CustomGoogleLoginButton({ 
  redirectTo = '/', 
  onSuccess,
  onError 
}: CustomGoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      // Redirect đến C# Google OAuth endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7118/api';
      const googleOAuthUrl = `${apiUrl}/Auth/google-signin`;
      
      // Mở popup hoặc redirect đến Google OAuth
      window.location.href = `${googleOAuthUrl}?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&state=${encodeURIComponent(redirectTo)}`;
      
    } catch (error) {
      console.error('Google login error:', error);
      onError?.('Đăng nhập thất bại');
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-gray-800 border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36 16.8 36 11 30.2 11 23S16.8 10 24 10c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.6 4.2 29.6 2 24 2 12.3 2 3 11.3 3 23s9.3 21 21 21c10.5 0 19.5-7.6 21-17.5.1-.8.2-1.6.2-2.5 0-1.7-.2-3.3-.6-4.8z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.4 16.2 18.8 14 24 14c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.6 6.2 29.6 4 24 4 16 4 9.1 8.5 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 42c5.2 0 10-2 13.6-5.3L31.4 31C29.3 32.5 26.8 33.4 24 33.4 18.8 33.4 14.4 30.2 12.9 25.8l-6.6 5C9.1 37.5 16 42 24 42z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.3 4.5-4.3 6l6.2 5.7C39 37.6 41.5 33.1 41.5 28c0-1.7-.2-3.3-.6-4.8z"
        />
      </svg>
      <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}</span>
    </button>
  );
}
