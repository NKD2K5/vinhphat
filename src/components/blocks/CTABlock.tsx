import React from 'react';
import Link from 'next/link';

interface TextNode {
  children?: Array<{
    text?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface Button {
  text: string;
  link: string;
}

interface CTABlockProps {
  data: {
    text?: string;
    primaryButton?: Button;
    secondaryButton?: Button;
  };
}

export const CTABlock: React.FC<CTABlockProps> = ({ data }) => {
  if (!data.text && !data.primaryButton) return null;

  return (
    <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        {/* CTA Box with rounded corners */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 py-16 md:py-20 px-6 md:px-12 lg:px-16 text-center">
            {/* Text Content */}
            {data.text && (
              <div className="mb-10">
                {(() => {
                  // Handle both string and array types for text
                  if (Array.isArray(data.text)) {
                    // If it's an array of rich text nodes
                    return data.text.map((item: TextNode, i: number) => (
                      <p key={i} className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                        {item.children?.map((child, j) => 
                          child?.text || ''
                        ).join('')}
                      </p>
                    ));
                  } else if (typeof data.text === 'string') {
                    // If it's a simple string with newlines
                    return data.text.split('\n').map((line: string, i: number) => (
                      <p key={i} className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                        {line}
                      </p>
                    ));
                  }
                  return null;
                })()}
              </div>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              {data.primaryButton && (
                <Link 
                  href={data.primaryButton.link || '#'}
                  className="group inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                >
                  <span>{data.primaryButton.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
              
              {data.secondaryButton && (
                <Link 
                  href={data.secondaryButton.link || '#'}
                  className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span>{data.secondaryButton.text}</span>
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

export default CTABlock;
