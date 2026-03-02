"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import dynamic from 'next/dynamic';
import Logo from '@/components/Logo/Logo';
import { useTheme } from 'next-themes';

// Dynamically import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(() => import('../ThemeToggle/ThemeToggle'), { ssr: false });

const Header = () => {
  const { resolvedTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial checks
    handleScroll();
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { name: 'Trang Chủ', href: '/' },
    { name: 'Dịch Vụ', href: '/dich-vu' },
    { name: 'Sản Phẩm', href: '/san-pham' },
    { name: 'Tin Tức', href: '/tin-tuc' },
    { name: 'Liên Hệ', href: '/lien-he' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg py-2' 
          : 'bg-white/95 backdrop-blur-sm py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`relative flex items-center justify-between gap-4 ${isMobile ? 'h-16' : ''}`}>
          
          {/* Mobile Layout: Hamburger on left, Logo center (absolute), Cart on right */}
          {isMobile && (
            <>
              {/* Hamburger Menu - Left */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-200 z-10"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>

              {/* Logo - Absolutely Centered */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                <Logo 
                  isMobile={true} 
                  isScrolled={isScrolled} 
                  theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                />
              </div>

              {/* Shopping Cart - Right */}
              <button
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-200 z-10"
                aria-label="Shopping cart"
              >
                <FiShoppingCart size={24} />
              </button>
            </>
          )}

          {/* Desktop Layout: Logo on left, Navigation center, Theme toggle on right */}
          {!isMobile && (
            <>
              {/* Logo */}
              <div className={`flex-shrink-0 transition-all duration-300 ${
                isScrolled ? 'scale-90' : 'scale-100'
              }`}>
                <Logo 
                  isMobile={false} 
                  isScrolled={isScrolled} 
                  theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                />
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="ml-4">
                  <ThemeToggle />
                </div>
              </nav>

              {/* Desktop Theme Toggle */}
              <div className="hidden lg:flex items-center">
                <ThemeToggle />
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 py-3">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
