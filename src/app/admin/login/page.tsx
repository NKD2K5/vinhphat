"use client";

import LoginButton from '@/components/admin/LoginButton';

export default function AdminLoginPage() {
  const handleSuccess = () => {
    // Success sẽ được xử lý trong LoginButton component
    console.log('Login successful');
  };

  const handleError = (error: string) => {
    console.error('Login failed:', error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng nhập Admin
          </h1>
          <p className="text-sm text-gray-600">
            Sử dụng tài khoản Google được cấp phép để truy cập trang quản trị
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-6">
            {/* Google Login Button */}
            <LoginButton 
              onSuccess={handleSuccess}
              onError={handleError}
            />

            {/* Instructions */}
            <div className="text-center text-xs text-gray-500">
              <p>Chỉ admin mới có quyền truy cập</p>
              <p>Vui lòng liên hệ quản trị viên nếu cần hỗ trợ</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <p>Bảo mật bởi Google OAuth</p>
        </div>
      </div>
    </div>
  );
}
