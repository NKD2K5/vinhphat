"use client";

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { GoogleUser, loginWithGoogle, saveAuthData } from '@/lib/auth';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';

interface LoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function LoginButton({ onSuccess, onError }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAdminAuth();
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError(null);

        // Lấy user info từ Google
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info from Google');
        }

        const googleUser: GoogleUser = await response.json();

        // Gọi API backend để xác thực
        const authResponse = await loginWithGoogle(googleUser);

        if (authResponse.success && authResponse.token && authResponse.user) {
          // Lưu token và user data
          const userData: any = {
            id: authResponse.user.id,
            name: authResponse.user.name,
            email: authResponse.user.email,
            image: authResponse.user.image,
            token: authResponse.token,
          };

          saveAuthData(authResponse.token, userData);
          login(userData);

          onSuccess?.();
          
          // Redirect về admin dashboard
          router.push('/admin/dashboard');
        } else {
          // Login thất bại
          const errorMsg = authResponse.message || 'Đăng nhập thất bại';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      } catch (error) {
        console.error('Google login error:', error);
        const errorMsg = 'Có lỗi xảy ra trong quá trình đăng nhập';
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      const errorMsg = 'Lỗi xác thực Google. Vui lòng thử lại.';
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
    },
    flow: 'implicit', // Dùng implicit flow cho client-side
    scope: 'email profile',
  });

  const handleLogin = () => {
    setError(null);
    googleLogin();
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang đăng nhập...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Đăng nhập bằng Google</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
