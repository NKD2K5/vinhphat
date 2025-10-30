'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: "Công Ty In Ấn Vĩnh Phát",
    subtitle: "In Ấn Chất Lượng - Xây Dựng Thương Hiệu",
    image: "/images/hero/printing-factory-1.jpg"
  },
  {
    id: 2,
    title: "Dịch Vụ In Ấn Chuyên Nghiệp",
    subtitle: "Đa Dạng Mẫu Mã - Giá Cả Hợp Lý",
    image: "/images/hero/printing-factory-2.jpg"
  },
  {
    id: 3,
    title: "Công Nghệ In Ấn Hiện Đại",
    subtitle: "Màu Sắc Sắc Nét - Độ Bền Cao",
    image: "/images/hero/printing-factory-3.jpg"
  }
];

// Function to handle image loading errors
const addDefaultImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null; // Prevent infinite loop if the default image also fails
  target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCIgZmlsbD0iI2VlZSI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiLz48dGV4dCB4PSI0MDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+RmFpbGVkIHRvIGxvYWQgaW1hZ2U8L3RleHQ+PC9zdmc+';
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Giải Pháp In Ấn Chuyên Nghiệp Cho Mọi Nhu Cầu
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              VinhPhat Printing - Đối tác đáng tin cậy của bạn cho các dịch vụ in ấn chất lượng cao. 
              Chúng tôi hiện thực hóa ý tưởng của bạn với độ chính xác và xuất sắc.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/lien-he" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg text-lg text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Nhận Báo Giá Ngay
              </Link>
              <Link 
                href="/dich-vu" 
                className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-semibold py-3 px-8 rounded-lg text-lg text-center transition-all duration-300"
              >
                Dịch Vụ Của Chúng Tôi
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-white">15+</div>
                <div className="text-blue-100 font-medium">Năm Kinh Nghiệm</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-white">500+</div>
                <div className="text-blue-100 font-medium">Dự Án Đã Hoàn Thành</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-white">200+</div>
                <div className="text-blue-100 font-medium">Khách Hàng Hài Lòng</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Image Slider */}
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[currentSlide].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="aspect-w-16 aspect-h-9 w-full"
                >
                  <Image
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                    onError={addDefaultImage}
                    unoptimized={process.env.NODE_ENV !== 'production'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{slides[currentSlide].title}</h3>
                    <p className="text-blue-200">{slides[currentSlide].subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            
            {/* Decorative elements */}
            <div className="hidden lg:block absolute -top-8 -right-8 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          className="w-full h-16 md:h-24" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity="0.25" 
            className="fill-blue-600 dark:fill-blue-800"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity="0.5" 
            className="fill-blue-600 dark:fill-blue-800"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-blue-600 dark:fill-blue-800"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
