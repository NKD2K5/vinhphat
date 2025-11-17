'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ChuyenDoiGiaoDien() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  // Ensure component is mounted to the DOM before rendering
  useEffect(() => {
    setMounted(true);
  }, []); 

  // Prevent rendering the button until we're on the client side
  if (!mounted) {
    return (
      <div className="p-2 w-10 h-10" aria-hidden="true">
        {/* Empty div with same dimensions to prevent layout shift */}
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={currentTheme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
    >
      {currentTheme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
}
