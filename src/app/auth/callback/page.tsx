"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithGoogle, saveAuthData } from '@/lib/auth/customAuth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Đang xử lý đăng nhập...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Lấy các parameter từ URL sau khi redirect từ C# API
        const token = searchParams.get('token');
        const error = searchParams.get('error');
        const state = searchParams.get('state'); // Redirect URL

        if (error) {
          setStatus('error');
          setMessage(`Đăng nhập thất bại: ${error}`);
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('Không tìm thấy token xác thực');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        // Gọi API để xác thực token và lấy user data
        const authResponse = await loginWithGoogle(token);

        if (authResponse.success) {
          // Kiểm tra role - chỉ admin mới được đăng nhập
          if (authResponse.user?.role !== 'admin') {
            setStatus('error');
            setMessage('Bạn không có quyền truy cập trang quản trị. Vui lòng liên hệ admin.');
            setTimeout(() => router.push('/login'), 3000);
            return;
          }

          // Lưu token và user data
          saveAuthData(authResponse);
          
          setStatus('success');
          setMessage('Đăng nhập thành công! Đang chuyển hướng...');
          
          // Redirect về trang được chỉ định trong state hoặc về trang admin
          const redirectTo = state || '/admin';
          setTimeout(() => router.push(decodeURIComponent(redirectTo)), 1500);
        } else {
          setStatus('error');
          setMessage(authResponse.message || 'Đăng nhập thất bại');
          setTimeout(() => router.push('/login'), 3000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra trong quá trình đăng nhập');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {status === 'loading' && 'Xác thực đăng nhập...'}
          {status === 'success' && 'Đăng nhập thành công!'}
          {status === 'error' && 'Đăng nhập thất bại'}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300">
          {message}
        </p>
      </div>
    </div>
  );
}
