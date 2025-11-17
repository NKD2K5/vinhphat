'use client';

import React, { useState, useEffect } from 'react';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// Custom hook for counter animation
const useCounterAnimation = (end: number, duration: number = 2000, startAnimation: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, startAnimation]);

  return count;
};

interface Slide {
  headline: any[];
  subheadline: any[];
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
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  const parseNumber = (numStr: string): number => {
    const cleanStr = numStr.replace(/[+,]/g, '');
    if (cleanStr.includes('K')) {
      return parseFloat(cleanStr.replace('K', '')) * 1000;
    }
    return parseInt(cleanStr) || 0;
  };

  const targetNumber = parseNumber(value);
  const animatedCount = useCounterAnimation(targetNumber, 2000, isVisible);

  const formatNumber = (num: number): string => {
    if (value.includes('K')) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return `${num}+`;
  };

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref]);

  return (
    <div
      ref={setRef}
      className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
        {isVisible ? formatNumber(animatedCount) : '0+'}
      </div>
      <div className="text-white/70 text-sm md:text-base font-medium uppercase tracking-wider leading-tight">
        {label}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
    </div>
  );
};

export function HeroBlock({ data }: HeroBlockProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = data.slides || [];
  const hasMultipleSlides = slides.length > 1;

  // Auto-advance slides
  useEffect(() => {
    if (!hasMultipleSlides) return;
    
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

  if (slides.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Chưa có banner</h1>
          <p className="text-lg mt-4">Vui lòng thêm slides trong Admin Panel</p>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];
  const headlineText = currentSlideData.headline?.[0]?.children?.[0]?.text || '';
  const subheadlineText = currentSlideData.subheadline?.[0]?.children?.[0]?.text || '';
  const bgColor = currentSlideData.backgroundColor || '#1e40af';
  // backgroundImage is a text field containing URL directly
  const bgImage = currentSlideData.backgroundImage || null;

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background - Image or Color with Modern Overlay */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{ backgroundColor: bgColor }}
      >
        {bgImage && (
          <>
            {/* Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-10"></div>
            <img
              src={bgImage}
              alt="Hero Background"
              className="w-full h-full object-cover transition-opacity duration-1000"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </>
        )}
        
        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-5"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Content - Left Aligned for Modern Look */}
          <div className="max-w-3xl">
            {/* Headline with Modern Typography */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight animate-fade-in">
              {headlineText}
            </h1>

            {/* Subheadline with Better Spacing */}
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-white/90 leading-relaxed font-light">
              {subheadlineText}
            </p>

            {/* CTA Buttons - Modern Style */}
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              {currentSlideData.primaryCTA && (
                <a
                  href={currentSlideData.primaryCTA.link}
                  className="group relative inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100 font-semibold py-5 px-10 rounded-xl text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-3xl overflow-hidden"
                >
                  <span className="relative z-10">{currentSlideData.primaryCTA.text}</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
              {currentSlideData.secondaryCTA && (
                <a
                  href={currentSlideData.secondaryCTA.link}
                  className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold py-5 px-10 rounded-xl text-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span>{currentSlideData.secondaryCTA.text}</span>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
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
