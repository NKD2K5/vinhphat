'use client';

import React from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number | string;
  rating: number;
  category: string;
  isFeatured?: boolean;
}

interface FeaturedProductsBlockProps {
  sectionId?: string;
  title?: string;
  description?: string;
  products?: Product[];
  ctaText?: string;
  ctaLink?: string;
}

export const FeaturedProductsBlock: React.FC<FeaturedProductsBlockProps> = ({
  sectionId,
  title = 'Sản Phẩm Nổi Bật',
  description = 'Khám phá các sản phẩm in ấn chất lượng cao được khách hàng tin dùng',
  products = [],
  ctaText = 'Xem Tất Cả Sản Phẩm',
  ctaLink = '/san-pham',
}) => {
  const formatPrice = (price: number | string) => {
    if (typeof price === 'string' && (price.startsWith('Từ ') || price === 'Liên hệ')) {
      return price;
    }
    
    const priceNumber = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
    
    if (!isNaN(priceNumber)) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(priceNumber);
    }
    
    return price;
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" id={sectionId || 'featured-products'}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
              Sản phẩm
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h2>
          <div 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-56 bg-gray-100 dark:bg-gray-700">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.currentTarget;
                    // Chỉ set fallback 1 lần để tránh vòng lặp
                    if (!target.dataset.errorHandled) {
                      console.error('Image failed to load:', product.image);
                      target.dataset.errorHandled = 'true';
                      target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
                    }
                  }}
                />
                {product.isFeatured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    🔥 Nổi bật
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                {/* Category & Rating */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                    <span className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={product.name}>
                  {product.name}
                </h3>
                
                {/* Description */}
                <div 
                  className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]"
                  dangerouslySetInnerHTML={{ 
                    __html: product.description?.replace(/<[^>]*>/g, (tag) => {
                      // Chỉ giữ lại các tag cơ bản, loại bỏ các tag phức tạp
                      if (tag.match(/<\/?(?:strong|b|em|i|br)>/)) return tag;
                      return '';
                    }) || '' 
                  }}
                />
                
                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Giá từ</p>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-5 py-2.5 text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    Xem ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {ctaLink && (
          <div className="text-center mt-16">
            <Link 
              href={ctaLink} 
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {ctaText}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
