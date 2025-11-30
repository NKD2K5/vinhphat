"use client";

import CustomGoogleLoginButton from '@/components/LoginButton/CustomGoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Đăng nhập hệ thống
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
          Chỉ admin mới có quyền truy cập trang quản trị. Sử dụng tài khoản Google được cấp phép.
        </p>
        <div className="flex justify-center">
          <CustomGoogleLoginButton redirectTo="/admin" />
        </div>
      </div>
    </div>
  );
}