'use client';

import React, { useState, useRef } from 'react';

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

const categoryDefaults: Record<string, { image: string; description: string; neon: string }> = {
  'in-an-van-phong': {
    image: 'https://placehold.co/800x600/10b981/ffffff?text=Office+Printing',
    description: 'Giải pháp in ấn văn phòng hoàn chỉnh cho doanh nghiệp của bạn',
    neon: '#10b981',
  },
  'in-bao-bi-nhan-mac': {
    image: 'https://placehold.co/800x600/f59e0b/ffffff?text=Packaging',
    description: 'In bao bì và nhãn mác chuyên nghiệp giúp sản phẩm nổi bật',
    neon: '#f59e0b',
  },
  'an-pham-tiep-thi': {
    image: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Marketing+Materials',
    description: 'Ấn phẩm tiếp thị chuyên nghiệp cho chiến dịch quảng cáo',
    neon: '#8b5cf6',
  },
  'in-catalogue': {
    image: 'https://placehold.co/800x600/3b82f6/ffffff?text=Catalogue',
    description: 'In catalogue và brochure chất lượng cao',
    neon: '#3b82f6',
  },
  'qua-tang': {
    image: 'https://placehold.co/800x600/ef4444/ffffff?text=Premium+Gifts',
    description: 'Quà tặng doanh nghiệp sang trọng và độc đáo',
    neon: '#ef4444',
  },
};

const neonColors = ['#10b981', '#f59e0b', '#8b5cf6', '#3b82f6', '#ef4444'];

export function ServicesBlock({ data }: ServicesBlockProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [data.categories]);

  const handleMouseLeaveCard = () => {
    closeTimeoutRef.current = setTimeout(() => setHoveredCategory(null), 120);
  };
  const handleMouseEnterTooltip = () => {
    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
  };
  const handleMouseLeaveTooltip = () => setHoveredCategory(null);

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

  console.log('🔍 Raw categories data:', data.categories);
  const categories = data.categories.filter((c): c is ServiceCategory => typeof c !== 'string');
  const limitedCategories = categories.slice(0, 2);
  console.log('✅ Filtered categories:', limitedCategories);
  console.log('📊 Categories count:', limitedCategories.length);
  if (limitedCategories.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes pulseNeon {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        .tooltip-enter { animation: tooltipIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .scanline-bar  { animation: scanline 2.4s linear infinite; }
        .neon-pulse    { animation: pulseNeon 2s ease-in-out infinite; }
      `}</style>

      <section
        key={`services-block-${forceUpdate}`}
        className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden"
      >
        {/* Background Pattern — gốc */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          {/* Header — gốc */}
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {data.title}
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6" />
            {data.description && (
              <div
                className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            )}
          </div>

          {/* Categories Grid — gốc */}
          <div className="relative mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
              {limitedCategories.map((category, index) => {
                const defaults = categoryDefaults[category.slug] || categoryDefaults['in-an-van-phong'];
                const imageUrl = category.image || defaults.image;
                const neon = defaults.neon || neonColors[index % neonColors.length];
                const isHovered = hoveredCategory === category.id;
                const isActive = activeCategory === category.id;

                return (
                  <div
                    key={category.id || index}
                    className="relative group"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {/* Card — gốc */}
                    <a
                      href={`/dich-vu#${category.slug}`}
                      className={`
                        block relative h-[200px] rounded-xl overflow-hidden
                        transition-all duration-400 ease-out
                        ${isActive ? 'ring-4 ring-blue-500 shadow-2xl scale-105' : 'shadow-md hover:shadow-xl'}
                        ${isHovered ? 'scale-105' : 'scale-100'}
                      `}
                      onMouseEnter={() => {
                        if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
                        setHoveredCategory(category.id);
                      }}
                      onMouseLeave={handleMouseLeaveCard}
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={imageUrl}
                          alt={category.name}
                          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        {/* Scanline effect on hover */}
                        {isHovered && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div
                              className="scanline-bar absolute left-0 right-0 h-[60px] opacity-10"
                              style={{ background: `linear-gradient(to bottom, transparent, ${neon}, transparent)` }}
                            />
                          </div>
                        )}
                        {/* Gradient Overlay — gốc */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-60'}`} />
                      </div>

                      {/* Number Badge — gốc */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className={`w-10 h-10 flex items-center justify-center bg-blue-600/90 backdrop-blur-sm rounded-lg font-bold text-white text-sm transition-all duration-300 ${isHovered ? 'scale-110 bg-blue-500' : 'scale-100'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      </div>

                      {/* Category Name — gốc */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-xl font-bold text-white mb-1 tracking-wide drop-shadow-lg">
                          {category.name}
                        </h3>
                        <div
                          className="h-0.5 rounded-full transition-all duration-300"
                          style={{
                            width: isHovered ? '100%' : '3rem',
                            background: `linear-gradient(to right, ${neon}, transparent)`,
                            boxShadow: isHovered ? `0 0 8px ${neon}` : 'none',
                          }}
                        />
                      </div>

                      {/* Hover Glow — gốc */}
                      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
                      </div>
                    </a>

                    {/* ── TOOLTIP — giao diện gốc (white/light) ── */}
                    {isHovered && (
                      <div
                        className="fixed inset-0 z-[90] flex items-center justify-center"
                        style={{ pointerEvents: 'none' }}
                      >
                        {/* Backdrop mờ nhẹ như bản gốc */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

                        {/* White card — đúng giao diện gốc */}
                        <div
                          className="tooltip-enter relative z-10 w-[90%] max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
                          style={{ pointerEvents: 'auto' }}
                          onMouseEnter={handleMouseEnterTooltip}
                          onMouseLeave={handleMouseLeaveTooltip}
                        >
                          {/* Category Image */}
                          <div className="mb-4 rounded-xl overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={category.name}
                              className="w-full h-48 object-cover"
                              onError={(e) => { e.currentTarget.src = defaults.image; }}
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

                          {/* CTA Button — gradient gốc */}
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

          {/* CTA Button — gốc */}
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
    </>
  );
}