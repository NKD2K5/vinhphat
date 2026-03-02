"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { useNavigation } from '@/hooks/useNavigation';
import Logo from '@/components/Logo/Logo';
import SearchSuggestions from '@/components/SearchSuggestions/SearchSuggestions';

// Dynamically import ThemeToggle to avoid SSR issues with proper loading state
const ChuyenDoiGiaoDien = dynamic(
  () => import('../ChuyenDoiGiaoDien/ChuyenDoiGiaoDien'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-10 h-10" aria-hidden="true" />
    )
  }
);

const PhanDauTrang = () => {
  const [daCuon, setDaCuon] = useState(false);
  const [moMenu, setMoMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setDaCuon(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkDarkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(isDark);
    };

    handleScroll();
    handleResize();
    checkDarkTheme();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    const observer = new MutationObserver(checkDarkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const trimmedValue = searchValue.trim();
      console.log('🔍 Searching for:', trimmedValue);
      console.log('🔍 Navigating to:', `/san-pham?search=${encodeURIComponent(trimmedValue)}`);
      router.push(`/san-pham?search=${encodeURIComponent(trimmedValue)}`);
      setMoMenu(false);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowSuggestions(true);
  };

  const handleSuggestionSelect = (product: any) => {
    setSearchValue(product.name);
    setShowSuggestions(false);
  };

  const handleSuggestionsClose = () => {
    setShowSuggestions(false);
  };

  const { data: danhSachLienKet, isLoading } = useNavigation();

  if (!isMounted || isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[60] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-3 h-16 flex items-center">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-48 rounded"></div>
          <div className="hidden md:flex ml-auto space-x-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`fixed w-full z-[60] transition-all duration-300 bg-gray-200 dark:bg-gray-800 ${
        daCuon 
          ? 'bg-opacity-90 backdrop-blur-sm shadow-md py-2' 
          : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Hamburger - Left (mobile only) */}
          <button
            onClick={() => setMoMenu(!moMenu)}
            className="z-10 md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {moMenu ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo Mobile - chỉ hiện trên mobile, căn giữa */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden flex items-center justify-center">
            <Logo 
              isMobile={true} 
              isScrolled={daCuon} 
              isDarkBackground={isDarkTheme} 
            />
          </div>

          {/* Logo Desktop - nằm gọn trong header */}
          <div className="hidden md:flex items-center">
            <Logo 
              isMobile={false} 
              isScrolled={daCuon} 
              isDarkBackground={isDarkTheme} 
            />
          </div>

          {/* Desktop Layout - không cần padding-left vì logo không bị cắt */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <FaSearch className="w-4 h-4" />
                </button>
                <SearchSuggestions
                  searchValue={searchValue}
                  onSelect={handleSuggestionSelect}
                  onClose={handleSuggestionsClose}
                />
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-6">
              {(danhSachLienKet || []).map((lienKet, index) => (
                <Link 
                  key={`${lienKet.link}-${index}`}
                  href={lienKet.link}
                  target={lienKet.newTab ? '_blank' : '_self'}
                  rel={lienKet.newTab ? 'noopener noreferrer' : ''}
                  className={`font-medium transition-colors whitespace-nowrap ${
                    pathname === lienKet.link 
                      ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {lienKet.label}
                </Link>
              ))}
              <div className="ml-4">
                <ChuyenDoiGiaoDien />
              </div>
            </nav>
          </div>

          {/* Theme Toggle - Right (mobile only) */}
          <div className="z-10 md:hidden p-2">
            <ChuyenDoiGiaoDien />
          </div>
        </div>

        {/* Mobile Menu */}
        {moMenu && (
          <div className="md:hidden mt-4 pb-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <FaSearch className="w-4 h-4" />
                </button>
                <SearchSuggestions
                  searchValue={searchValue}
                  onSelect={handleSuggestionSelect}
                  onClose={handleSuggestionsClose}
                />
              </form>
            </div>
            
            <div className="flex flex-col space-y-3">
              {(danhSachLienKet || []).map((lienKet, index) => (
                <Link
                  key={`mobile-${lienKet.link}-${index}`}
                  href={lienKet.link}
                  target={lienKet.newTab ? '_blank' : '_self'}
                  rel={lienKet.newTab ? 'noopener noreferrer' : ''}
                  className={`block px-4 py-2 rounded-md transition-colors ${
                    pathname === lienKet.link
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setMoMenu(false)}
                >
                  {lienKet.label}
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