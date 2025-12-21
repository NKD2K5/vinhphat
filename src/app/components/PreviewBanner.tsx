"use client";

import React from 'react';

/**
 * PreviewBanner
 * Hiển thị banner nhỏ ở đầu trang khi đang ở chế độ draft/preview (Next.js draftMode).
 * Chỉ là UI đơn giản để tránh lỗi build do thiếu component.
 */
export default function PreviewBanner() {
  return (
    <div className="w-full bg-amber-500 text-white text-sm py-2 px-4 text-center z-40">
      <span className="font-semibold mr-2">Chế độ xem trước (Draft/Preview)</span>
      <span>- Nội dung đang hiển thị từ bản nháp trong Payload CMS.</span>
    </div>
  );
}
