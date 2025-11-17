'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Redirect to Payload admin on separate server
    window.location.href = 'http://localhost:3001/admin';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang chuyển hướng đến trang quản trị...</h1>
        <p className="mb-4">Nếu không tự động chuyển hướng, vui lòng nhấn vào:</p>
        <a 
          href="http://localhost:3001/admin" 
          className="text-blue-500 hover:underline text-lg font-semibold"
          target="_blank"
          rel="noopener noreferrer"
        >
          http://localhost:3001/admin
        </a>
      </div>
    </div>
  );
}
