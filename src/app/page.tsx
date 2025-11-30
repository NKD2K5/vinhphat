'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import './animations.css';
import { 
  HeroBlock, 
  AboutBlock, 
  ServicesBlock,
  FeaturedProductsBlock,
  WorkflowBlock, 
  TestimonialsBlock,
  LatestNewsBlock,
  WhyChooseUsBlock
} from '@/components/blocks';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// Extend Window interface for custom properties
declare global {
  interface Window {
    __aboutBlockButtons?: {
      primaryButton?: any;
      secondaryButton?: any;
    };
  }
}

// Helper function để chuyển rich text thành plain text
const richTextToPlainText = (richText: any): string => {
  if (!richText) return '';
  if (typeof richText === 'string') return richText;
  
  // Nếu là object với keys như {id, name, slug, description, ...} thì lấy description hoặc name
  if (typeof richText === 'object' && !Array.isArray(richText)) {
    if (richText.description) return richTextToPlainText(richText.description);
    if (richText.name) return richText.name;
    if (richText.title) return richText.title;
    if (richText.text) return richText.text;
    if (richText.content) return richTextToPlainText(richText.content);
    
    // Nếu có children thì xử lý children
    if (richText.children) return richTextToPlainText(richText.children);
    
    // Nếu không có gì thì return empty
    return '';
  }
  
  if (Array.isArray(richText)) {
    return richText
      .map((node: any) => {
        if (node.children) return richTextToPlainText(node.children);
        if (node.text) return node.text;
        return '';
      })
      .join('');
  }
  
  return '';
};

// Helper function để xử lý image URL
const getImageUrl = (image: any, fallback: string = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'): string => {
  if (!image) return fallback;
  
  if (typeof image === 'object') {
    if (image.filename) return `${PAYLOAD_URL}/media/${image.filename}`;
    if (image.url) {
      const url = image.url;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      if (url.startsWith('/')) return `${PAYLOAD_URL}${url}`;
      return `${PAYLOAD_URL}/${url}`;
    }
  }
  
  if (typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.startsWith('/')) return `${PAYLOAD_URL}${image}`;
    if (/^[0-9a-fA-F]{24}$/.test(image)) {
      console.warn('Image is just an ID, using fallback');
      return fallback;
    }
    return `${PAYLOAD_URL}/media/${image}`;
  }
  
  return fallback;
};

// Import components
const PhanDauTrang = dynamic(() => import('./components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('./components/Footer/Footer'), { ssr: false });
const ContactCTA = dynamic(() => import('@/components/ContactCTA/ContactCTA'), { ssr: false });


export default function HomeCMSPage() {
  console.log('🔥 HomeCMSPage component rendering!');
  
  const [pageData, setPageData] = useState<any>(null);
  const [aboutPageData, setAboutPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    async function fetchData() {
      try {
        const timestamp = Date.now();
        
        // Enhanced fetch for home page with cache control
        console.log('🔍 Fetching home page data...');
        const homeResponse = await fetch(`/api/home-page?t=${timestamp}`, {
          method: 'GET',
          cache: 'no-store',
          next: { revalidate: 0 },
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        console.log('🔍 Home API Status:', homeResponse.status);
        
        if (homeResponse.ok) {
          const result = await homeResponse.json();
          console.log('🔍 Home API Response:', result);
          
          // Log hero block data for debugging
          const heroBlock = result.homePage?.layout?.find((b: any) => b.blockType === 'hero');
          console.log('🔍 Hero Block Data:', heroBlock);
          console.log('🔍 Hero Slides:', heroBlock?.slides);
          
          if (result.homePage?.layout?.length > 0) {
            setPageData(result.homePage);
          } else {
            console.warn('⚠️ No layout data found in API response');
            setPageData(null);
          }
        } else {
          console.error('❌ Home API Error:', {
            status: homeResponse.status,
            statusText: homeResponse.statusText
          });
          setPageData(null);
        }

        // Enhanced fetch for about page
        console.log('🔍 Fetching about page data...');
        const aboutResponse = await fetch(`/api/about-page?t=${timestamp}`, {
          method: 'GET',
          cache: 'no-store',
          next: { revalidate: 0 },
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        if (aboutResponse.ok) {
          const aboutResult = await aboutResponse.json();
          console.log('🔍 About Page Data:', aboutResult.aboutPage);
          console.log('🔍 Company Story:', aboutResult.aboutPage?.companyStory);
          setAboutPageData(aboutResult.aboutPage);
        } else {
          console.error('❌ About Page API Error:', {
            status: aboutResponse.status,
            statusText: aboutResponse.statusText
          });
        }
      } catch (err) {
        console.error('❌ Error fetching data:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        setPageData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [mounted]);

  if (!mounted) return null;

  // Loading state với shimmer skeleton
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Empty state hiện đại
  if (!pageData || !pageData.layout || pageData.layout.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden" suppressHydrationWarning>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <PhanDauTrang />
        <div className="container mx-auto px-4 py-24 relative z-10" suppressHydrationWarning>
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon with animation */}
            <div className="mb-8 animate-scale-in">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            
            {/* Title with gradient */}
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in">
              Chưa Có Nội Dung
            </h2>
            
            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Trang chủ chưa có nội dung.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Vui lòng vào Admin Panel để thêm các block nội dung cho trang.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
              <a 
                href="http://localhost:3001/admin/collections/home-page" 
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Thêm Nội Dung</span>
              </a>
              <a 
                href="http://localhost:3001/admin" 
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 font-semibold py-4 px-8 rounded-xl transition-all hover:shadow-xl shadow-md"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Mở Admin Panel</span>
              </a>
            </div>

            {/* Help text */}
            <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                💡 <strong>Mẹo:</strong> Bạn có thể thêm các block như Hero, About, Services, Products, News và nhiều hơn nữa từ Admin Panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }



  // Render blocks với badge
  const renderBlock = (block: any, index: number) => {
    const animationDelay = `${index * 100}ms`;
    
    switch (block.blockType) {
      case 'hero':
        return (
          <div key={index} className="relative animate-fade-in-up" style={{ animationDelay }} suppressHydrationWarning>
            <HeroBlock data={block} />
          </div>
        );
        
      case 'about':
      case 'aboutBlock':
        // Lưu buttons từ block để dùng cho AboutBlock tự động
        if (!window.__aboutBlockButtons) {
          window.__aboutBlockButtons = {
            primaryButton: block.primaryButton,
            secondaryButton: block.secondaryButton,
          };
        }
        // Bỏ qua render block này vì AboutBlock tự động thêm sau Hero
        return null;
        
      case 'services':
        return (
          <div key={index} className="relative animate-fade-in-up" style={{ animationDelay }} suppressHydrationWarning>
            <ServicesBlock data={block} />
          </div>
        );
        
      case 'featuredProducts':
        if (!block.products || block.products.length === 0) return null;
        try {
          const mappedProducts = (block.products || []).map((p: any, pIndex: number) => {
            if (typeof p === 'string') return null;
            
            const imageUrl = getImageUrl(p.image, 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image');
            
            return {
              id: p.id || p._id || `product-${index}-${pIndex}`,
              name: p.name || p.title || 'Sản phẩm',
              description: richTextToPlainText(p.description) || richTextToPlainText(p.summary) || '',
              image: imageUrl,
              price: p.price || 0,
              rating: p.rating || 5,
              category: p.category || 'Sản phẩm',
              isFeatured: p.isFeatured || false,
            };
          }).filter(Boolean);
          
          if (!mappedProducts || mappedProducts.length === 0) return null;
          
          return (
            <div key={`featured-${index}`} className="relative animate-fade-in-up" style={{ animationDelay }} suppressHydrationWarning>
                <FeaturedProductsBlock
                sectionId={block.sectionId || 'featured-products'}
                title={richTextToPlainText(block.title) || 'Sản Phẩm Nổi Bật'}
                description={richTextToPlainText(block.description) || ''}
                products={mappedProducts}
                ctaText={block.ctaText || 'Xem Tất Cả'}
                ctaLink={block.ctaLink || '/san-pham'}
              />
            </div>
          );
        } catch (error) {
          console.error('❌ Error rendering FeaturedProductsBlock:', error);
          return null;
        }
        
      case 'workflow':
        return (
          <div key={index} className="relative animate-fade-in-up" style={{ animationDelay }} suppressHydrationWarning>
            <WorkflowBlock data={block} />
          </div>
        );
        
      case 'testimonials':
        return (
          <div key={index} className="relative animate-fade-in-up" style={{ animationDelay }} suppressHydrationWarning>
            <TestimonialsBlock data={block} />
          </div>
        );
        
      case 'latestNews':
        const mappedPosts = (block.posts || []).map((p: any, pIndex: number) => {
          if (typeof p === 'string') return null;
          if (!p || typeof p !== 'object') return null;
          
          const imageUrl = getImageUrl(
            p.featuredImage || p.image, 
            'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'
          );
          
          // Ensure all fields are strings
          const safePost = {
            id: String(p.id || p._id || `news-${index}-${pIndex}`),
            title: String(p.title || 'Tin tức'),
            publishedAt: String(p.publishedAt || p.createdAt || new Date().toISOString()),
            summary: String(richTextToPlainText(p.summary) || richTextToPlainText(p.excerpt) || richTextToPlainText(p.description) || ''),
            image: String(imageUrl),
            category: String(richTextToPlainText(p.category) || 'Tin tức'),
            author: String(p.author?.name || p.author || 'Admin'),
          };
          
          console.log('🔍 Mapped post:', safePost);
          return safePost;
        }).filter(Boolean);
        
        // Safety check cho title và description
        const safeTitle = richTextToPlainText(block.title) || 'Tin Tức Mới Nhất';
        const safeDescription = richTextToPlainText(block.description) || '';
        
        console.log('🔍 LatestNews Debug:', {
          originalTitle: block.title,
          safeTitle,
          originalDescription: block.description,
          safeDescription,
          postsCount: mappedPosts.length
        });
        
        return (
          <div key={`news-${index}`} className="relative animate-fade-in-up" style={{ animationDelay }} suppressHydrationWarning>
            <LatestNewsBlock
              sectionId={typeof block.sectionId === 'string' ? block.sectionId : 'latest-news'}
              title={safeTitle}
              description={safeDescription}
              posts={mappedPosts}
              ctaText={typeof block.ctaText === 'string' ? block.ctaText : 'Xem Tất Cả Tin Tức'}
              ctaLink={typeof block.ctaLink === 'string' ? block.ctaLink : '/tin-tuc'}
            />
          </div>
        );
        
      case 'whyChooseUs':
        return (
          <div key={index} className="relative animate-fade-in-up" style={{ animationDelay }} suppressHydrationWarning>
            <WhyChooseUsBlock data={block} />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" suppressHydrationWarning>
      <PhanDauTrang />
      
      <main className="relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/30 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content blocks */}
        <div className="relative z-10">
          {pageData.layout.map((block: any, index: number) => {
            try { console.log('🔧 Rendering block:', block.blockType); } catch {}
            const renderedBlock = renderBlock(block, index);
            
            // Tự động thêm AboutBlock sau Hero block
            if (block.blockType === 'hero' && aboutPageData?.companyStory) {
              // Lấy buttons từ AboutBlock trong layout (nếu có)
              const buttons = (window as any).__aboutBlockButtons || {};
              
              const aboutBlockData = {
                title: aboutPageData.companyStory.heading || 'VinhPhat Printing - Đối Tác In Ấn Đáng Tin Cậy',
                description: aboutPageData.companyStory.content || [],
                image: aboutPageData.companyStory.image || '',
                primaryButton: buttons.primaryButton || {
                  text: 'Tìm hiểu thêm',
                  link: '/ve-chung-toi'
                },
                secondaryButton: buttons.secondaryButton || {
                  text: 'Liên hệ ngay',
                  link: '/lien-he'
                }
              };
              
              return (
                <React.Fragment key={`hero-about-${index}`}>
                  {renderedBlock}
                  <div className="relative animate-fade-in-up" style={{ animationDelay: `${(index + 1) * 100}ms` }} suppressHydrationWarning>
                            <AboutBlock data={aboutBlockData} />
                  </div>
                </React.Fragment>
              );
            }
            
            return renderedBlock;
          })}
        </div>
      </main>
      
      {/* Contact CTA Section */}
      <ContactCTA />
      
      <Footer />
    </div>
  );
}
