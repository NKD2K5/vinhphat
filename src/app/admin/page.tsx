'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu đang load thì không làm gì
    if (isLoading) return;

    // Nếu chưa authenticated thì redirect về login
    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    // Nếu đã authenticated thì redirect về dashboard
    router.push('/admin/dashboard');
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang chuyển hướng...</h1>
        <p className="text-gray-600">Vui lòng đợi giây lát...</p>
      </div>
    </div>
  );
}
