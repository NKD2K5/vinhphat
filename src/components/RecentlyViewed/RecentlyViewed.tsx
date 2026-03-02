'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaTimes, FaChevronRight } from 'react-icons/fa';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

// Define interface locally to avoid import issues
interface RecentlyViewedProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: string;
  viewedAt: number;
}

// Local implementation to avoid import issues
const getRecentlyViewed = (): RecentlyViewedProduct[] => {
  if (typeof window === 'undefined') return [];

  try {
    const STORAGE_KEY = 'vinhphat_recently_viewed';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const items = JSON.parse(stored) as RecentlyViewedProduct[];
    
    // Filter out items older than 1 day
    const expiryTime = Date.now() - (1 * 24 * 60 * 60 * 1000);
    const filtered = items.filter(item => item.viewedAt > expiryTime);
    
    // Update storage if items were filtered
    if (filtered.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
    
    return filtered;
  } catch (error) {
    console.error('Error reading recently viewed:', error);
    return [];
  }
};

const RecentlyViewedContent: React.FC = () => {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      setMounted(true);
      // Load recently viewed products
      const recentProducts = getRecentlyViewed();
      if (recentProducts && Array.isArray(recentProducts)) {
        setProducts(recentProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error in RecentlyViewed component:', error);
      setHasError(true);
      setProducts([]);
    }
  }, []);

  // Show only first 3 products when collapsed
  const displayProducts = isExpanded ? (products || []) : (products || []).slice(0, 3);

  // Don't render on server to avoid hydration mismatch
  if (!mounted || hasError || !products || products.length === 0) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed right-4 bottom-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
        aria-label="Show recently viewed"
      >
        <FaClock className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {products.length}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 w-80 max-h-[80vh] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-2">
          <FaClock className="text-lg" />
          <h3 className="font-bold">Vừa Xem ({products.length})</h3>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="hover:bg-white/20 p-1 rounded transition-colors"
          aria-label="Minimize"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Products List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {displayProducts.map((product) => (
          <Link
            key={product.id}
            href={`/san-pham/${product.slug}`}
            className="group flex gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            {/* Product Image */}
            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
              <Image
                src={product.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image'}
                alt={product.name}
                fill
                sizes="64px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h4>
              <p className="text-xs font-bold text-red-600 dark:text-red-400">
                {product.price}
              </p>
            </div>

            <FaChevronRight className="w-3 h-3 text-gray-400 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Show More/Less Button */}
      {products.length > 3 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors font-medium"
          >
            {isExpanded ? 'Thu gọn' : `Xem thêm ${products.length - 3} sản phẩm`}
          </button>
        </div>
      )}
    </div>
  );
};

// Main component with Error Boundary
const RecentlyViewed: React.FC = () => {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <RecentlyViewedContent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default RecentlyViewed;
