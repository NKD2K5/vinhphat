'use client';

import { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';

// Dữ liệu mẫu cập nhật
const homePageData = {
  featuredProducts: [
    {
      id: 'p1001',
      name: 'In danh thiếp cao cấp',
      description: 'Chất liệu giấy mỹ thuật, bóng mờ, cán mờ/màng nhũ vàng',
      image: 'https://picsum.photos/seed/namecard/600/400',
      price: 'Liên hệ',
      rating: 4.8,
      category: 'Văn phòng phẩm',
      isFeatured: true,
      features: ['In offset 4 màu', 'Đóng gói miễn phí', 'Giao hàng tận nơi']
    },
    {
      id: 'p1002',
      name: 'In catalogue chuyên nghiệp',
      description: 'Thiết kế chuyên nghiệp, in ấn sắc nét, bắt mắt',
      image: 'https://picsum.photos/seed/catalogue/600/400',
      price: 'Từ 10.000đ/trang',
      rating: 4.7,
      category: 'Tài liệu quảng cáo',
      isFeatured: true,
      features: ['In offset 4 màu', 'Bìa cứng hoặc mềm', 'Đa dạng kích thước']
    },
    {
      id: 'p1003',
      name: 'In tờ rơi quảng cáo',
      description: 'Giấy couche, bristol, ford định lượng cao, bền đẹp',
      image: 'https://picsum.photos/seed/to-roi/600/400',
      price: 'Từ 1.000đ/tờ',
      rating: 4.6,
      category: 'Khuyến mãi',
      isFeatured: true,
      features: ['In offset 4 màu', 'Cán mờ/bóng', 'Giao hàng nhanh']
    },
    {
      id: 'p1004',
      name: 'In namecard doanh nghiệp',
      description: 'Thiết kế sang trọng, chất lượng in sắc nét, chuyên nghiệp',
      image: 'https://picsum.photos/seed/namecard2/600/400',
      price: 'Liên hệ',
      rating: 4.9,
      category: 'Văn phòng phẩm',
      isFeatured: true,
      features: ['Giấy mỹ thuật cao cấp', 'Ép kim/đục nổi', 'Giao hàng toàn quốc']
    },
    {
      id: 'p1005',
      name: 'In túi giấy đựng quà',
      description: 'Túi giấy cao cấp, in ấn tinh xảo, thân thiện môi trường',
      image: 'https://picsum.photos/seed/tui-giay/600/400',
      price: 'Từ 5.000đ/chiếc',
      rating: 4.5,
      category: 'Bao bì',
      isFeatured: true,
      features: ['Nhiều kích thước', 'In 1-4 màu', 'Tùy chỉnh thiết kế']
    }
  ],
  reviews: [
    {
      id: 'r1001',
      userName: 'Anh Minh',
      reviewTitle: 'Dịch vụ tuyệt vời',
      reviewText: 'Dịch vụ in ấn rất chuyên nghiệp, mẫu thiết kế đẹp và giao hàng đúng hẹn. Tôi rất hài lòng với chất lượng sản phẩm.',
      rating: 5,
      productId: 'p1001',
      date: '2025-10-28T14:30:00+07:00',
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 'r1002',
      userName: 'Chị Hương',
      reviewTitle: 'Chất lượng in ấn tốt',
      reviewText: 'Chất lượng in ấn tốt, giá cả hợp lý, nhân viên tư vấn nhiệt tình. Sẽ tiếp tục ủng hộ cửa hàng.',
      rating: 4.5,
      productId: 'p1002',
      date: '2025-10-25T09:15:00+07:00',
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 'r1003',
      userName: 'Anh Tùng',
      reviewTitle: 'Hài lòng về dịch vụ',
      reviewText: 'Đã hợp tác nhiều năm, luôn hài lòng về chất lượng và dịch vụ. Đội ngũ tư vấn rất tận tâm.',
      rating: 4.8,
      productId: 'p1003',
      date: '2025-10-22T16:45:00+07:00',
      image: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: 'r1004',
      userName: 'Chị Lan',
      reviewTitle: 'Giao hàng nhanh',
      reviewText: 'Đặt in hôm trước hôm sau đã nhận được hàng. Chất lượng in ấn sắc nét, đúng như thiết kế.',
      rating: 4.7,
      productId: 'p1004',
      date: '2025-10-20T11:20:00+07:00',
      image: 'https://i.pravatar.cc/150?img=4'
    }
  ],
  news: [
    {
      id: 'n1001',
      title: 'Xu hướng thiết kế bao bì năm 2025',
      summary: 'Cập nhật những xu hướng thiết kế bao bì mới nhất năm 2025, tập trung vào yếu tố bền vững và thân thiện môi trường.',
      image: 'https://picsum.photos/seed/baobi1/600/400',
      publishedAt: '2025-10-28T09:15:00+07:00',
      category: 'Thiết kế',
      author: 'Nguyễn Thị Mai, Chuyên gia thiết kế'
    },
    {
      id: 'n1002',
      title: 'Công nghệ in UV mới cho chất lượng vượt trội',
      summary: 'Giới thiệu công nghệ in UV tiên tiến, cho chất lượng in sắc nét, bền màu và thân thiện với môi trường hơn.',
      image: 'https://picsum.photos/seed/inan1/600/400',
      publishedAt: '2025-10-25T14:30:00+07:00',
      category: 'Công nghệ',
      author: 'Trần Văn Nam, Kỹ sư in ấn'
    },
    {
      id: 'n1003',
      title: 'Hướng dẫn chọn giấy in phù hợp với từng mục đích',
      summary: 'Bài viết cung cấp những lời khuyên hữu ích để lựa chọn loại giấy in phù hợp với từng nhu cầu sử dụng.',
      image: 'https://picsum.photos/seed/giay1/600/400',
      publishedAt: '2025-10-22T11:20:00+07:00',
      category: 'Kinh nghiệm',
      author: 'Lê Thị Hoa, Chuyên gia vật liệu in ấn'
    },
    {
      id: 'n1004',
      title: 'Xu hướng in ấn số lượng ít nhưng chất lượng cao',
      summary: 'Nhiều doanh nghiệp đang chuyển sang mô hình in ấn số lượng ít nhưng chất lượng cao để tiết kiệm chi phí và bảo vệ môi trường.',
      image: 'https://picsum.photos/seed/xuhuong1/600/400',
      publishedAt: '2025-10-20T15:45:00+07:00',
      category: 'Xu hướng',
      author: 'Phạm Văn Đức, Chuyên gia tiếp thị'
    },
    {
      id: 'n1005',
      title: 'Cách tối ưu chi phí in ấn cho doanh nghiệp nhỏ',
      summary: 'Những bí quyết giúp các doanh nghiệp nhỏ tiết kiệm chi phí in ấn mà vẫn đảm bảo chất lượng sản phẩm.',
      image: 'https://picsum.photos/seed/tietkiem1/600/400',
      publishedAt: '2025-10-18T10:30:00+07:00',
      category: 'Tài chính',
      author: 'Hoàng Thị Hương, Chuyên gia tư vấn doanh nghiệp'
    }
  ]
};

// Tắt cảnh báo hydration
const useClientOnly = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return mounted;
};

// Tắt cảnh báo hydration cho toàn bộ component
const useSuppressHydrationWarning = () => {
  const [isMounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return isMounted;
};

// Cấu hình hiệu ứng chuyển động
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

const item: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      mass: 0.5
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

// Tùy chỉnh transition cho từng section
const sectionTransition: Transition = {
  duration: 0.8,
  ease: [0.2, 0.8, 0.2, 1],
  staggerChildren: 0.2
};

// Component loading skeleton
const LoadingSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`} />
);

// Tùy chỉnh dynamic import với loading state tốt hơn
const createDynamicComponent = (component: any, loadingHeight: string) => 
  dynamic(() => component, { 
    ssr: false,
    loading: () => <LoadingSkeleton className={`w-full ${loadingHeight}`} />
  });

// Import components với SSR tắt để tối ưu hiệu năng
const PhanDauTrang = createDynamicComponent(import('./components/PhanDauTrang/PhanDauTrang'), 'h-20');
const Hero = createDynamicComponent(import('./components/Hero/Hero'), 'h-screen');
const About = createDynamicComponent(import('./components/About/About'), 'h-[500px]');
const Services = createDynamicComponent(import('./components/Services/Services'), 'h-[600px]');
const Products = createDynamicComponent(import('@/components/Products/Products'), 'h-[1000px]');
const Process = createDynamicComponent(import('@/components/Process/Process'), 'h-[700px]');
const Testimonials = createDynamicComponent(import('@/components/Testimonials/Testimonials'), 'h-[600px]');
const News = createDynamicComponent(import('@/components/News/News'), 'h-[800px]');
const WhyChooseUs = createDynamicComponent(import('@/components/WhyChooseUs/WhyChooseUs'), 'h-[800px]');
const Footer = createDynamicComponent(import('./components/Footer/Footer'), 'h-64');

// Component nút cuộn lên đầu trang
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
        controls.start('visible');
      } else {
        controls.start('hidden');
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial="hidden"
          animate={controls}
          exit="hidden"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl z-50 transition-colors duration-200 flex items-center justify-center"
          aria-label="Lên đầu trang"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 15l7-7 7 7" 
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Tạo một component riêng cho nội dung để tránh lỗi hydration
const HomeContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [yBg, setYBg] = useState("0%");
  const controls = useAnimation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isClient = useClientOnly();

  // Sử dụng useLayoutEffect để xử lý các hiệu ứng phụ liên quan đến DOM
  useLayoutEffect(() => {
    // Chỉ chạy trên client
    if (typeof window === 'undefined') return;
    
    // Khởi tạo Intersection Observer
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          controls.start("show");
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    // Lưu observer vào ref
    observerRef.current = intersectionObserver;

    // Xử lý scroll cho hiệu ứng parallax
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setYBg(`${Math.min(scrollY * 0.5, 50)}%`);
    };

    // Đăng ký sự kiện
    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      intersectionObserver.observe(currentSectionRef);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

      // Cleanup
    return () => {
      if (currentSectionRef && intersectionObserver) {
        intersectionObserver.unobserve(currentSectionRef);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Chỉ chạy một lần khi mount

  // Hiển thị loading nếu chưa mount
  if (typeof window === 'undefined') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="h-screen w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  // Sử dụng useCallback để tối ưu hiệu năng
  const renderSection = useCallback((Component: React.ComponentType<any>, props: Record<string, any> = {}, index: number = 0) => {
    return (
      <motion.section
        key={`section-${index}`}
        ref={index === 0 ? sectionRef : undefined}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={container}
        transition={{
          ...sectionTransition,
          delay: index * 0.1
        }}
        className="relative overflow-hidden"
        suppressHydrationWarning
      >
        <Component {...props} />
      </motion.section>
    );
  }, [inView]);

  if (typeof window === 'undefined') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
        <div className="h-screen w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden"
      suppressHydrationWarning
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="page-content"
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative"
          suppressHydrationWarning
        >
          {/* Background parallax */}
          <div 
            className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10"
            style={{ transform: `translate3d(0, ${yBg}, 0)` }}
            suppressHydrationWarning
          />

          {/* Nội dung chính */}
          <main className="relative">
            {renderSection(PhanDauTrang, {}, 0)}
            {renderSection(Hero, {}, 1)}
            {renderSection(About, {}, 2)}
            {renderSection(Services, {}, 3)}
            {renderSection(Products, { products: homePageData.featuredProducts }, 4)}
            {renderSection(Process, {}, 5)}
            {renderSection(Testimonials, { reviews: homePageData.reviews }, 6)}
            <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
                  {/* Image Section */}
                  <div className="w-full md:w-1/2 h-64 md:h-auto">
                    <img 
                      src="/images/office-team-contact.jpg" 
                      alt="Đội ngũ tư vấn chuyên nghiệp của chúng tôi" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="w-full md:w-1/2 p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Đội ngũ chuyên nghiệp sẵn sàng hỗ trợ</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                      Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp in ấn phù hợp nhất cho doanh nghiệp của bạn.
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-xl font-medium mb-8">
                      Hãy liên hệ với chúng tôi để có trải nghiệm tốt nhất.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a 
                        href="tel:0123456789" 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
                      >
                        Gọi ngay: 0123 456 789
                      </a>
                      <a 
                        href="/lien-he" 
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg text-center transition-colors dark:border-blue-500 dark:text-blue-400 dark:hover:bg-gray-700"
                      >
                        Gửi yêu cầu
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {renderSection(News, { news: homePageData.news }, 7)}
            {renderSection(WhyChooseUs, {}, 8)}
            {renderSection(Footer, {}, 9)}
          </main>

          {/* Nút cuộn lên đầu trang */}
          <ScrollToTop />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Export the main page component
export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="h-screen w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }
  
  return <HomeContent />;
}
