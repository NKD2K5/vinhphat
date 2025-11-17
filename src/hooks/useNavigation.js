'use client';

import { useState, useEffect } from 'react';

export function useNavigation() {
  const [navigation, setNavigation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const response = await fetch('/api/globals/navigation');
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu điều hướng');
        }
        const data = await response.json();
        setNavigation(data.mainNav || getDefaultNavigation());
      } catch (err) {
        console.error('Lỗi khi tải menu:', err);
        setError(err);
        setNavigation(getDefaultNavigation());
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  return { data: navigation, isLoading, error };
}

// Default navigation items in case of error or loading
function getDefaultNavigation() {
  return [
    { label: 'Trang Chủ', link: '/' },
    { label: 'Dịch Vụ', link: '/dich-vu' },
    { label: 'Sản Phẩm', link: '/san-pham' },
    { label: 'Tin Tức', link: '/tin-tuc' },
    { label: 'Liên Hệ', link: '/lien-he' },
  ];
}
