'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function PreviewBanner() {
  const router = useRouter();

  const exitPreview = async () => {
    try {
      // Gọi API để tắt preview mode
      await fetch('/api/exit-preview');
      // Refresh trang để cập nhật trạng thái
      router.refresh();
    } catch (error) {
      console.error('Error exiting preview mode:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2 text-center font-medium shadow-lg">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Chế độ xem trước - Bạn đang xem nội dung chưa được xuất bản</span>
        </div>
        <button
          onClick={exitPreview}
          className="bg-black text-yellow-500 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Thoát xem trước
        </button>
      </div>
    </div>
  );
}
