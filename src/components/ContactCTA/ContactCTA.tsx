'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Button {
  text: string;
  link: string;
  icon?: string;
}

interface ContactCTAData {
  title?: string;
  subtitle?: string;
  primaryButton?: Button;
  secondaryButton?: Button;
  tertiaryButton?: Button;
  backgroundImage?: string;
  isActive?: boolean;
}

export const ContactCTA: React.FC<{ showOnContactPage?: boolean }> = ({ showOnContactPage = false }) => {
  const [ctaData, setCtaData] = useState<ContactCTAData | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Don't show on contact page
  if (!showOnContactPage && pathname === '/lien-he') {
    return null;
  }

  useEffect(() => {
    async function fetchCTA() {
      try {
        console.log('🔄 Fetching CTA data...');
        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const response = await fetch(`/api/contact-cta?t=${timestamp}`);
        if (response.ok) {
          const result = await response.json();
          console.log('📥 CTA API Response:', result);
          if (result.success && result.cta) {
            console.log('✅ Setting CTA data:', result.cta);
            setCtaData(result.cta);
          }
        }
      } catch (error) {
        console.error('Error fetching contact CTA:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCTA();
  }, []);

  // Don't render if loading
  if (loading || !ctaData) {
    return null;
  }

  // Don't render if explicitly disabled
  if (ctaData.isActive === false) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background Image */}
          {ctaData.backgroundImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${ctaData.backgroundImage})` }}
            >
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          )}
          
          {/* Decorative background elements - only show when no background image */}
          {!ctaData.backgroundImage && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 py-16 md:py-20 px-6 md:px-12 lg:px-16 text-center">
            {/* Heading - Large, Bold */}
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
              dangerouslySetInnerHTML={{ 
                __html: (ctaData.title || 'Bạn Cần Tư Vấn Về Dịch Vụ?').replace(/<[^>]*>/g, '') 
              }}
            />
            
            {/* Subtitle - Smaller, Normal Weight */}
            {ctaData.subtitle && (
              <p 
                className="text-lg md:text-xl text-white/90 font-normal leading-relaxed mb-10 max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ 
                  __html: ctaData.subtitle.replace(/<[^>]*>/g, '') 
                }}
              />
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              {ctaData.primaryButton && (
                <Link 
                  href={ctaData.primaryButton.link || '#'}
                  className="group inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                >
                  <span>{ctaData.primaryButton.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              
              {ctaData.secondaryButton && (
                <Link 
                  href={ctaData.secondaryButton.link || '#'}
                  className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span>{ctaData.secondaryButton.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
