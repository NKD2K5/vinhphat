"use client";

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="398534795337-370j22gken1h6of3vmbf5p2i12sakhml.apps.googleusercontent.com">
      <AdminAuthProvider>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </AdminAuthProvider>
    </GoogleOAuthProvider>
  );
}
