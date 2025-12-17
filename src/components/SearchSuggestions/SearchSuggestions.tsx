'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  priceText: string;
  image: string;
  category: string;
}

interface SearchSuggestionsProps {
  searchValue: string;
  onSelect: (product: Product) => void;
  onClose: () => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  searchValue,
  onSelect,
  onClose
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchValue.trim().length < 2) {
      setProducts([]);
      setIsOpen(false);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchValue)}&limit=5`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
          setIsOpen(data.data.length > 0);
        } else {
          setProducts([]);
          setIsOpen(false);
        }
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <div className="p-2">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tìm kiếm...</span>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sản phẩm gợi ý
            </div>
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/san-pham/${product.slug}`}
                className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => {
                  onSelect(product);
                  setIsOpen(false);
                  onClose();
                }}
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="48px"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {product.category}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                    {product.priceText}
                  </div>
                </div>
              </Link>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
              <Link
                href={`/tim-kiem?q=${encodeURIComponent(searchValue)}`}
                className="flex items-center justify-center w-full px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
              >
                <FaSearch className="w-4 h-4 mr-2" />
                Xem tất cả kết quả cho "{searchValue}"
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <FaSearch className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">Không tìm thấy sản phẩm nào</p>
            <p className="text-xs mt-1">Thử tìm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSuggestions;
