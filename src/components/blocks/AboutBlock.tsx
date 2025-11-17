'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface AboutBlockProps {
  data: {
    title: string;
    description: any[];
    image?: any;
    primaryButton?: {
      text: string;
      link: string;
    };
    secondaryButton?: {
      text: string;
      link: string;
    };
  };
}

export function AboutBlock({ data }: AboutBlockProps) {
  const router = useRouter();
  
  // Helper function to render rich text
  const renderRichText = (content: any[]): string => {
    if (!content || !Array.isArray(content)) return '';
    
    return content.map((node: any) => {
      if (node.children) {
        return node.children.map((child: any) => child.text || '').join('');
      }
      return node.text || '';
    }).join('\n\n');
  };
  
  const descriptionText = renderRichText(data.description);
  
  // Handler for buttons - simple navigation
  const handleButtonClick = (link: string) => {
    router.push(link);
  };
  
  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-900 relative overflow-hidden" suppressHydrationWarning>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" suppressHydrationWarning>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10" suppressHydrationWarning>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image - Modern with overlay effects */}
          {data.image && (
            <div className="relative group order-2 lg:order-1">
              <div className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl -z-10 opacity-20"></div>
            </div>
          )}

          {/* Content - Modern typography */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {data.title}
            </h2>
            
            <div className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed space-y-4">
              {descriptionText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="break-words">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTA Buttons - Modern style */}
            <div className="flex flex-col sm:flex-row gap-4">
              {data.primaryButton && (
                <button
                  onClick={() => handleButtonClick(data.primaryButton.link)}
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                >
                  <span>{data.primaryButton.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
              {data.secondaryButton && (
                <button
                  onClick={() => handleButtonClick(data.secondaryButton.link)}
                  className="group inline-flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:border-blue-600 dark:hover:border-blue-400 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <span>{data.secondaryButton.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
