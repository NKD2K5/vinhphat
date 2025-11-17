'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
}

interface ServicesBlockProps {
  data: {
    title: string;
    description?: string;
    categories?: Array<ServiceCategory | string>;
    ctaText?: string;
    ctaLink?: string;
  };
}

// Default images and descriptions for categories
const categoryDefaults: Record<string, { image: string; description: string }> = {
  'in-an-ky-thuat-so': {
    image: 'https://placehold.co/800x600/3b82f6/ffffff?text=Digital+Printing',
    description: 'Dịch vụ in ấn kỹ thuật số chất lượng cao với công nghệ hiện đại'
  },
  'thiet-ke-do-hoa': {
    image: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Graphic+Design',
    description: 'Thiết kế đồ họa sáng tạo và chuyên nghiệp cho mọi nhu cầu thương hiệu'
  },
  'in-an-van-phong': {
    image: 'https://placehold.co/800x600/10b981/ffffff?text=Office+Printing',
    description: 'Giải pháp in ấn văn phòng hoàn chỉnh cho doanh nghiệp của bạn'
  },
  'in-bao-bi-nhan-mac': {
    image: 'https://placehold.co/800x600/f59e0b/ffffff?text=Packaging',
    description: 'In bao bì và nhãn mác chuyên nghiệp giúp sản phẩm nổi bật'
  },
  'hoan-thien-sau-in': {
    image: 'https://placehold.co/800x600/ef4444/ffffff?text=Finishing',
    description: 'Dịch vụ hoàn thiện sau in đa dạng cho sản phẩm hoàn hảo'
  }
};

export function ServicesBlock({ data }: ServicesBlockProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Check if categories exist
  if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <section className="py-20 bg-yellow-50 dark:bg-yellow-900/20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
              Services Block: Chưa có danh mục dịch vụ
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300">
              Vui lòng vào CMS Admin Panel → Trang Chủ → Services Block → Chọn Danh Mục Dịch Vụ
            </p>
          </div>
        </section>
      );
    }
    return null;
  }

  // Filter out string IDs and only keep populated category objects
  const categories = data.categories.filter((c): c is ServiceCategory => typeof c !== 'string');

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {data.title}
          </h2>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
          {data.description && (
            <div 
              className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          )}
        </div>

        {/* Categories Grid */}
        <div className="relative mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
            {categories.map((category, index) => {
              const defaults = categoryDefaults[category.slug] || categoryDefaults['in-an-ky-thuat-so'];
              // Ưu tiên ảnh từ CMS, fallback về defaults
              const imageUrl = category.image || defaults.image;
              console.log('Category:', category.name, 'Image URL:', imageUrl);
              const isHovered = hoveredCategory === category.id;
              const isActive = activeCategory === category.id;

              return (
                <div
                  key={category.id || index}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onClick={() => setActiveCategory(category.id)}
                >
                    {/* Card */}
                    <a
                      href={`/dich-vu#${category.slug}`}
                      className={`
                        block relative h-[200px] rounded-xl overflow-hidden
                        transition-all duration-400 ease-out
                        ${isActive ? 'ring-4 ring-blue-500 shadow-2xl scale-105' : 'shadow-md hover:shadow-xl'}
                        ${isHovered ? 'scale-105' : 'scale-100'}
                      `}
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className={`
                            w-full h-full object-cover
                            transition-transform duration-500 ease-out
                            ${isHovered ? 'scale-110' : 'scale-100'}
                          `}
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            // Fallback to gradient if image fails
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20
                          transition-opacity duration-300
                          ${isHovered ? 'opacity-80' : 'opacity-60'}
                        `}></div>
                      </div>

                      {/* Number Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className={`
                          w-10 h-10 flex items-center justify-center
                          bg-blue-600/90 backdrop-blur-sm rounded-lg
                          font-bold text-white text-sm
                          transition-all duration-300
                          ${isHovered ? 'scale-110 bg-blue-500' : 'scale-100'}
                        `}>
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      </div>

                      {/* Category Name */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-xl font-bold text-white mb-1 tracking-wide drop-shadow-lg">
                          {category.name}
                        </h3>
                        <div className={`
                          h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full
                          transition-all duration-300
                          ${isHovered ? 'w-full' : 'w-12'}
                        `}></div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className={`
                        absolute inset-0 rounded-xl
                        transition-opacity duration-300
                        ${isHovered ? 'opacity-100' : 'opacity-0'}
                      `}>
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                      </div>
                    </a>

                    {/* Tooltip - Centered on Screen */}
                    {isHovered && (
                      <div 
                        className="fixed inset-0 z-[90] flex items-center justify-center"
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {/* Backdrop */}
                        <div 
                          className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
                          onClick={() => setHoveredCategory(null)}
                        ></div>
                        
                        {/* Tooltip Content */}
                        <div 
                          className="relative z-10 w-[90%] max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in"
                        >
                          {/* Category Image */}
                          <div className="mb-4 rounded-xl overflow-hidden">
                            <img 
                              src={defaults.image} 
                              alt={category.name}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                          
                          {/* Category Name */}
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {category.name}
                          </h3>
                          
                          {/* Description */}
                          <div 
                            className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{ __html: category.description || defaults.description }}
                          />
                          
                          {/* View Services Link */}
                          <a
                            href={`/dich-vu#${category.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                          >
                            <span>Xem chi tiết dịch vụ</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* CTA Button */}
        {data.ctaText && data.ctaLink && (
          <div className="text-center">
            <a
              href={data.ctaLink}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-base md:text-lg rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
            >
              <span>{data.ctaText}</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
