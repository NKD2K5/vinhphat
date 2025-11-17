'use client';

import React from 'react';
import Link from 'next/link';

interface NewsPost {
  id: string;
  title: string;
  publishedAt: string;
  summary: string;
  image: string;
  category: string;
  author: string;
}

interface LatestNewsBlockProps {
  sectionId?: string;
  title?: string;
  description?: string;
  posts?: NewsPost[];
  ctaText?: string;
  ctaLink?: string;
}

export const LatestNewsBlock: React.FC<LatestNewsBlockProps> = ({
  sectionId,
  title = 'Tin Tức Mới Nhất',
  description,
  posts = [],
  ctaText = 'Xem Tất Cả Tin Tức',
  ctaLink = '/tin-tuc',
}) => {
  return (
    <section className="py-1 md:py-15 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden" id={sectionId || 'latest-news'}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Header Section - Modern Typography */}
        <div className="text-center mb-20">
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-4">
            Tin Tức
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title}
          </h2>
          {description && (
            <div 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
        
        {/* News Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {posts.slice(0, 4).map((post) => (
            <article 
              key={post.id} 
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.currentTarget;
                    // Chỉ set fallback 1 lần để tránh vòng lặp
                    if (!target.dataset.errorHandled) {
                      console.error('News image failed to load:', post.image);
                      target.dataset.errorHandled = 'true';
                      target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-purple-600 dark:text-purple-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {String(post.category || 'Tin tức')}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Date & Author */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{String(post.author || 'Admin')}</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" title={String(post.title || '')}>
                  {String(post.title || 'Tin tức')}
                </h3>
                
                {/* Summary */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 min-h-[4rem] leading-relaxed">
                  {String(post.summary || '')}
                </p>
                
                {/* Read More Link */}
                <Link
                  href={`/tin-tuc/${post.id}`}
                  className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                >
                  Đọc tiếp
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        {ctaLink && (
          <div className="text-center mt-12">
            <Link 
              href={ctaLink} 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>{ctaText}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
