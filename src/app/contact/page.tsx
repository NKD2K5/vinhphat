'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiMail, FiPhone, FiClock, FiUpload, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { MessageCircle, MessageSquareText } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import PhanDauTrang from '@/app/components/PhanDauTrang/PhanDauTrang';
import Footer from '@/app/components/Footer/Footer';

// Custom motion components with simplified animation
const Motion = {
  Section: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    return (
      <section 
        className={`${className} transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
      </section>
    );
  },
  Div: ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  Button: ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
    <button className={className} {...props}>
      {children}
    </button>
  )
};

// Dynamically import components to avoid SSR issues
const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed/RecentlyViewed'), { 
  ssr: false,
  loading: () => <LoadingSkeleton />
});

type FormData = {
  name: string;
  phone: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  file?: FileList;
};

type FAQItem = {
  question: string;
  answer: string;
  isOpen: boolean;
};

// Animation styles
const getFadeInStyle = (delay = 0) => ({
  opacity: 1,
  transform: 'translateY(0)',
  transition: `opacity 0.6s ease-out ${delay * 0.1}s, transform 0.6s ease-out ${delay * 0.1}s`,
  willChange: 'opacity, transform'
});

const initialStyle = {
  opacity: 0,
  transform: 'translateY(20px)'
};

// Animated section component
const AnimatedSection = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? getFadeInStyle(delay) : initialStyle}
    >
      {children}
    </div>
  );
};

// Contact info data
const contactInfo = {
  address: '123 Đường ABC, Quận 1, TP.HCM',
  phone: '0901234567',
  email: 'contact@example.com',
  workingHours: 'Thứ 2 - Thứ 7: 8:00 - 17:00',
  socialMedia: {
    facebook: 'https://facebook.com',
    zalo: 'https://zalo.me/0901234567'
  },
  googleMaps: {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4968614643515!2d106.69522431533428!3d10.776889992320476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0xb5a5e6b6c5b6e6b6!2zUXXhuq1uIDEsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s',
    directionsUrl: 'https://maps.google.com?q=10.776889992320476,106.69522431533428'
  }
};

// FAQ data
const faqs = [
  {
    question: 'Làm thế nào để liên hệ với chúng tôi?',
    answer: 'Bạn có thể liên hệ với chúng tôi qua số điện thoại, email hoặc điền vào mẫu liên hệ trên trang này. Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc.'
  },
  {
    question: 'Thời gian làm việc của công ty?',
    answer: 'Chúng tôi làm việc từ thứ 2 đến thứ 7, từ 8:00 sáng đến 5:00 chiều. Nghỉ các ngày lễ và chủ nhật.'
  },
  {
    question: 'Có hỗ trợ khách hàng ngoài giờ không?',
    answer: 'Có, chúng tôi có đội ngũ hỗ trợ 24/7 cho các trường hợp khẩn cấp. Vui lòng liên hệ qua hotline để được hỗ trợ ngay lập tức.'
  },
  {
    question: 'Tôi có thể ghé thăm văn phòng trực tiếp không?',
    answer: 'Có, bạn có thể đến văn phòng của chúng tôi trong giờ làm việc. Tuy nhiên, chúng tôi khuyến khích bạn đặt lịch hẹn trước để được phục vụ tốt nhất.'
  }
];

function ContactPage() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [contactData, setContactData] = useState(contactInfo);
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Clean up object URL when component unmounts or previewImage changes
  useEffect(() => {
    return () => {
      if (previewImage) {
        try {
          URL.revokeObjectURL(previewImage);
        } catch (error) {
          console.error('Error revoking object URL:', error);
        }
      }
    };
  }, [previewImage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>();

  const file = watch('file');

  // Fetch contact info from API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact-info');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setContactData(prev => ({
              ...prev,
              ...data.data
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    if (isClient) {
      fetchContactInfo();
    }
  }, [isClient]);

  // Show loading state on server-side rendering
  if (!isClient) {
    return <LoadingSkeleton />;
  }

  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e?.target?.files || e.target.files.length === 0) {
        if (e?.target) e.target.value = '';
        return;
      }
      
      const file = e.target.files[0];
      if (!file) {
        if (e?.target) e.target.value = '';
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'image/jpeg', 
        'image/png'
      ];
      
      if (file.size > maxSize) {
        alert('Lỗi: Kích thước file không được vượt quá 5MB');
        e.target.value = '';
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert('Lỗi: Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG');
        e.target.value = '';
        return;
      }
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    } catch (error) {
      console.error('Error handling file upload:', error);
      if (e?.target) e.target.value = '';
    }
  };

  const removeImage = () => {
    try {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setValue('file', undefined);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    if (data.file && data.file.length > 0) {
      const file = data.file[0];
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          success: false,
          message: 'Lỗi: Kích thước file không được vượt quá 5MB'
        });
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone || '');
      formData.append('company', data.company || '');
      formData.append('subject', data.subject || '');
      formData.append('message', data.message);
      
      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0]);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra');
      }

      setSubmitStatus({
        success: true,
        message: result.message || 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
      });
      reset();
      removeImage();
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PhanDauTrang />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Contact Info */}
            <AnimatedSection className="space-y-8" delay={0.1}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Thông Tin Liên Hệ</h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <FiMapPin className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Địa chỉ</h3>
                      <p className="text-gray-600 dark:text-gray-300">{contactData.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <FiPhone className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Điện thoại</h3>
                      <a 
                        href={`tel:${contactData.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {contactData.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <FiMail className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Email</h3>
                      <a 
                        href={`mailto:${contactData.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {contactData.email}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start space-x-4">
                    <FiClock className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Giờ làm việc</h3>
                      <p className="text-gray-600 dark:text-gray-300">{contactData.workingHours}</p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">Kết nối với chúng tôi</h3>
                    <div className="flex space-x-4">
                      <a
                        href={contactData.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <FaFacebook className="w-5 h-5" />
                      </a>
                      <a
                        href={contactData.socialMedia.zalo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <SiZalo className="w-5 h-5" />
                      </a>
                      <a
                        href={`mailto:${contactData.email}`}
                        className="p-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                      >
                        <FiMail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Column - Contact Form */}
            <AnimatedSection className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700" delay={0.2}>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Gửi Tin Nhắn</h2>
              
              {submitStatus && (
                <div 
                  className={`p-4 mb-6 rounded-lg ${
                    submitStatus.success 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-100 border border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-100 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name', { required: 'Vui lòng nhập họ tên' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Nhập họ và tên của bạn"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email', { 
                      required: 'Vui lòng nhập email',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone', { 
                      required: 'Vui lòng nhập số điện thoại',
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="0901234567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Công ty
                  </label>
                  <input
                    type="text"
                    id="company"
                    {...register('company')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Tên công ty (nếu có)"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject', { required: 'Vui lòng nhập tiêu đề' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Tiêu đề tin nhắn"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    {...register('message', { required: 'Vui lòng nhập nội dung' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Đính kèm file (tùy chọn)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                    <div className="space-y-1 text-center">
                      {previewImage ? (
                        <div className="relative">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Tải file lên</span>
                              <input
                                id="file-upload"
                                type="file"
                                className="sr-only"
                                {...register('file')}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />
                            </label>
                            <p className="pl-1">hoặc kéo thả</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, DOC, DOCX, JPG, PNG tối đa 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </span>
                  ) : (
                    'Gửi tin nhắn'
                  )}
                </button>
              </form>
            </AnimatedSection>
          </div>

          {/* Map and FAQ Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Map Section */}
            <AnimatedSection 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-full"
              delay={0.3}
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Vị Trí Của Chúng Tôi</h2>
              <div className="h-96 rounded-lg overflow-hidden">
                <iframe
                  src={contactData.googleMaps.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                  className="rounded-lg"
                />
              </div>
              <a
                href={contactData.googleMaps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <FiMapPin className="w-5 h-5 mr-2" />
                Xem chỉ đường trên Google Maps
              </a>
            </AnimatedSection>

            {/* FAQ Section */}
            <AnimatedSection 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-full"
              delay={0.4}
            >
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Câu Hỏi Thường Gặp</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      type="button"
                    >
                      <span className="font-medium text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </span>
                      <span className="flex-shrink-0">
                        {expandedFaqs.includes(index) ? (
                          <FiChevronUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </span>
                    </button>
                    
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: expandedFaqs.includes(index) ? '500px' : '0',
                        opacity: expandedFaqs.includes(index) ? 1 : 0,
                      }}
                    >
                      <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Additional Info Section */}
          <AnimatedSection 
            className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl shadow-lg"
            delay={0.5}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Cần Hỗ Trợ Ngay?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={`tel:${contactData.phone}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  <FiPhone className="w-5 h-5 mr-2" />
                  Gọi ngay: {contactData.phone}
                </a>
                <a
                  href={`mailto:${contactData.email}`}
                  className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md border border-blue-200 dark:border-gray-600"
                >
                  <FiMail className="w-5 h-5 mr-2" />
                  Gửi email
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
      <RecentlyViewed />
    </div>
  );
}

export default ContactPage;