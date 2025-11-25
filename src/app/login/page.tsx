"use client";

import { SessionProvider } from 'next-auth/react';
import GoogleLoginButton from '@/components/LoginButton/GoogleLoginButton';

export default function LoginPage() {
  return (
    <SessionProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Đăng nhập hệ thống
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Sử dụng tài khoản Google để đăng nhập vào hệ thống quản trị.
          </p>
          <div className="flex justify-center">
            {/* QUAN TRỌNG: Redirect về /auth/callback thay vì / */}
            <GoogleLoginButton redirectTo="/auth/callback" />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}