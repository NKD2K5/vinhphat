'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX } from 'react-icons/fi';
import dynamic from 'next/dynamic';

// Dynamically import ThemeToggle to avoid SSR issues
const ChuyenDoiGiaoDien = dynamic(() => import('../ChuyenDoiGiaoDien/ChuyenDoiGiaoDien'), { ssr: false });

const PhanDauTrang = () => {
  const [daCuon, setDaCuon] = useState(false);
  const [moMenu, setMoMenu] = useState(false);

  useEffect(() => {
    const xuLyCuon = () => {
      setDaCuon(window.scrollY > 10);
    };
    window.addEventListener('scroll', xuLyCuon);
    return () => window.removeEventListener('scroll', xuLyCuon);
  }, []);

  const danhSachLienKet = [
    { ten: 'Trang Chủ', duongDan: '/' },
    { ten: 'Dịch Vụ', duongDan: '/dich-vu' },
    { ten: 'Sản Phẩm', duongDan: '/san-pham' },
    { ten: 'Tin Tức', duongDan: '/tin-tuc' },
    { ten: 'Liên Hệ', duongDan: '/lien-he' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 bg-gray-200 dark:bg-gray-800 ${
        daCuon 
          ? 'bg-opacity-90 backdrop-blur-sm shadow-md py-2' 
          : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            VinhPhat<span className="text-blue-600">Printing</span>
          </Link>

          {/* Điều hướng trên desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {danhSachLienKet.map((lienKet) => (
              <Link 
                key={lienKet.duongDan} 
                href={lienKet.duongDan}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {lienKet.ten}
              </Link>
            ))}
            <div className="ml-4">
              <ChuyenDoiGiaoDien />
            </div>
          </nav>

          {/* Nút menu di động */}
          <div className="md:hidden flex items-center">
            <ChuyenDoiGiaoDien />
            <button
              onClick={() => setMoMenu(!moMenu)}
              className="ml-4 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Chuyển đổi menu"
            >
              {moMenu ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu di động */}
        {moMenu && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-3">
              {danhSachLienKet.map((lienKet) => (
                <Link
                  key={lienKet.duongDan}
                  href={lienKet.duongDan}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setMoMenu(false)}
                >
                  {lienKet.ten}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default PhanDauTrang;
