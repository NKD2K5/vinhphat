"use client";

import { useEffect, ReactNode } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    // Nếu đã load xong và chưa authenticated thì redirect về login
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Hiển thị loading state
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

  // Nếu chưa authenticated và có fallback thì hiển thị fallback
  if (!isAuthenticated && fallback) {
    return <>{fallback}</>;
  }

  // Nếu chưa authenticated thì không render gì (đang redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Nếu đã authenticated thì hiển thị children
  return <>{children}</>;
}
