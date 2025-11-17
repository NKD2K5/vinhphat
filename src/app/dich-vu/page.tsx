'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const PhanDauTrang = dynamic(() => import('../components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer/Footer'), { ssr: false });
const ContactCTA = dynamic(() => import('../../components/ContactCTA/ContactCTA'), { ssr: false });

// Types
interface Subcategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch services from CMS
  useEffect(() => {
    if (!mounted) return;
    
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.categories && result.categories.length > 0) {
            setCategories(result.categories);
            setActiveCategory(result.categories[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [mounted]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === activeCategory) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveCategory(categoryId);
      setIsAnimating(false);
    }, 150);
  };

  const currentCategory = categories.find(cat => cat.id === activeCategory);

  if (!mounted) return null;

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <PhanDauTrang />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Chưa có dữ liệu dịch vụ
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Vui lòng thêm dữ liệu trong CMS Admin Panel hoặc chạy lệnh seed data.
          </p>
          <code className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded">
            npm run seed:services
          </code>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PhanDauTrang />
      
      {/* Page Header */}
      <section className="relative py-20 md:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-800 dark:via-blue-900 dark:to-gray-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Dịch Vụ Của Chúng Tôi
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
              Khám phá đa dạng các dịch vụ in ấn và thiết kế chuyên nghiệp, 
              đáp ứng mọi nhu cầu của doanh nghiệp và cá nhân.
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Category Navigation */}
      <section className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex items-center overflow-x-auto scrollbar-hide py-4 gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  flex-shrink-0 px-6 py-3 rounded-full font-semibold text-sm md:text-base
                  transition-all duration-300 transform hover:scale-105
                  ${activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Subcategories Display */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          {/* Category Title */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {currentCategory?.name}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Subcategories Grid */}
          <div 
            className={`
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8
              transition-opacity duration-300
              ${isAnimating ? 'opacity-0' : 'opacity-100'}
            `}
          >
            {currentCategory?.subcategories.map((subcategory, index) => (
              <div
                key={subcategory.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container - Clickable to products */}
                <Link href={`/san-pham?service=${subcategory.id}`}>
                  <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                        <span className="font-semibold">Xem Sản Phẩm</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {subcategory.name}
                  </h3>
                  {subcategory.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {subcategory.description}
                    </p>
                  )}
                  
                  {/* Action Button */}
                  <Link
                    href={`/san-pham?service=${subcategory.id}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors"
                  >
                    Xem sản phẩm
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <ContactCTA />

      <Footer />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
