'use client';

import React, { useState, useEffect } from 'react';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';


const toPlainText = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value
      .map((n: any) => {
        if (n.text) return n.text;
        if (n.children) return toPlainText(n.children);
        return '';
      })
      .join('');
  }
  if (typeof value === 'object') {
    if (value.text) return value.text;
    if (value.children) return toPlainText(value.children);
    if (value.content) return toPlainText(value.content);
    if (value.description) return toPlainText(value.description);
    if (value.title) return String(value.title);
  }
  return '';
};

interface Slide {
  headline: any;
  subheadline: any;
  backgroundImage?: any;
  backgroundColor?: string;
  primaryCTA?: {
    text: string;
    link: string;
  };
  secondaryCTA?: {
    text: string;
    link: string;
  };
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
}

interface HeroBlockProps {
  data: {
    slides?: Slide[];
    stats?: Array<{
      value: string;
      label: string;
      icon?: string;
    }>;
  };
}

// Stat Card Component with Counter Animation
const StatCard = ({ value, label }: { value: string; label: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    // Extract numeric value from string
    const numericValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
    
    if (numericValue === 0) {
      setDisplayValue(0);
      return;
    }
    
    let currentValue = 0;
    const increment = Math.ceil(numericValue / 50); // Animate over ~50 steps
    
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(interval);
      } else {
        setDisplayValue(currentValue);
      }
    }, 30); // Update every 30ms
    
    return () => clearInterval(interval);
  }, [value]);
  
  // Reconstruct the value with non-numeric parts
  const suffix = value.replace(/\d/g, '');
  const displayText = displayValue + suffix;

  return (
    <div className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2">
      <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
        {displayText}
      </div>
      <div className="text-white/70 text-sm md:text-base font-medium uppercase tracking-wider leading-tight">
        {label}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
    </div>
  );
};

export function HeroBlock({ data }: HeroBlockProps) {
  // All hooks must be called unconditionally at the top
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = data?.slides || [];
  const hasMultipleSlides = slides.length > 1;
  
  // Auto-advance slides
  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [hasMultipleSlides, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  // Show fallback if no data or no slides - AFTER hooks are called
  if (!data || slides.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="text-center p-8 rounded-xl bg-white/10 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-4">Chưa có banner</h1>
          <p className="text-lg mb-6">Vui lòng thêm slides trong Admin Panel</p>
          <a 
            href="/admin/collections/home-page"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Slides
          </a>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];
  const headlineText = toPlainText(currentSlideData.headline);
  const subheadlineText = toPlainText(currentSlideData.subheadline);
  const bgColor = currentSlideData.backgroundColor || '#1e40af';
  // backgroundImage is a text field containing URL directly
  const bgImage = currentSlideData.backgroundImage || null;
  const primary = currentSlideData.primaryCTA || currentSlideData.primaryButton;
  const secondary = currentSlideData.secondaryCTA || currentSlideData.secondaryButton;

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background - Base layer */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{ backgroundColor: bgColor }}
      />

      {/* Background Image - Layer 1 */}
      {bgImage && (
        <div className="absolute inset-0 z-[1] overflow-hidden">
          <img
            src={bgImage}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Gradient Overlays - Layer 2 */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Content - Layer 10 */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Content - Left Aligned for Modern Look */}
          <div className="max-w-3xl">
            {/* Headline with Modern Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight animate-fade-in drop-shadow-2xl">
              {headlineText}
            </h1>

            {/* Subheadline with Better Spacing */}
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-white/90 leading-relaxed font-light drop-shadow-lg">
              {subheadlineText}
            </p>

            {/* CTA Buttons - Modern Style */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              {primary && (
                <a
                  href={primary.link}
                  className="group relative inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 font-semibold py-5 px-10 rounded-xl text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-3xl overflow-hidden"
                >
                  <span className="relative z-10">{primary.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
              {secondary && (
                <a
                  href={secondary.link}
                  className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold py-5 px-10 rounded-xl text-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span>{secondary.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Stats - Modern Card Design with Counter Animation */}
          {data.stats && data.stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl">
              {data.stats.map((stat, index) => (
                <StatCard key={index} value={stat.value} label={stat.label} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Carousel Controls */}
      {hasMultipleSlides && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll Indicator - Layer 15 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[15] animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
