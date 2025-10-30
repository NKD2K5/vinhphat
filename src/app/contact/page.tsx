'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiMail, FiPhone, FiClock, FiUpload, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { MessageCircle, MessageSquareText } from 'lucide-react';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamically import PhanDauTrang and Footer to avoid SSR issues
const PhanDauTrang = dynamic(() => import('@/app/components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('@/app/components/Footer/Footer'), { ssr: false });

type FormData = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  file?: FileList;
};

type FAQItem = {
  question: string;
  answer: string;
  isOpen: boolean;
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: 'Thời gian phản hồi liên hệ là bao lâu?',
      answer: 'Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
      isOpen: false,
    },
    {
      question: 'Làm thế nào để đặt lịch hẹn trực tiếp?',
      answer: 'Bạn có thể gọi điện trực tiếp đến số 0977 344 567 hoặc điền vào form liên hệ để đặt lịch hẹn.',
      isOpen: false,
    },
    {
      question: 'Tôi có thể gửi yêu cầu báo giá qua form này không?',
      answer: 'Được, bạn có thể gửi yêu cầu báo giá qua form liên hệ. Vui lòng cung cấp đầy đủ thông tin về yêu cầu của bạn để chúng tôi báo giá chính xác nhất.',
      isOpen: false,
    },
  ]);

  const toggleFaq = (index: number) => {
    setFaqs(faqs.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : false,
    })));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>();

  const file = watch('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    
    if (file.size > maxSize) {
      alert('Lỗi: Kích thước file không được vượt quá 5MB');
      e.target.value = ''; // Reset file input
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert('Lỗi: Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG');
      e.target.value = ''; // Reset file input
      return;
    }
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
  };

  const removeFile = () => {
    setPreviewImage(null);
    setValue('file', undefined);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Additional validation before submit
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', data);
      setSubmitStatus({
        success: true,
        message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
      });
      reset();
      setPreviewImage(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: 'Đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau ít phút.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: i * 0.1,
      },
    }),
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
        ease: [0.4, 0, 0.2, 1]
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PhanDauTrang />
      <main className="flex-grow bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 text-white"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}></div>
            <motion.div 
              className="absolute -top-1/2 -right-1/4 w-full h-full bg-blue-400/10 rounded-full mix-blend-soft-light"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-blue-500/10 rounded-full mix-blend-soft-light"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -15, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: 0.5
              }}
            ></motion.div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
              </p>
            </motion.div>
            <motion.div 
              className="absolute top-1/2 right-10 -translate-y-1/2 hidden lg:flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
                opacity: 1 
              }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8,
                rotate: {
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut"
                },
                scale: {
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/50">
                  <MessageSquareText className="w-24 h-24 text-blue-500" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-7xl mx-auto"
          >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Left Column - Contact Info */}
              <motion.div 
                variants={fadeIn}
                className="space-y-8"
                custom={0}
              >
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg h-full border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Thông Tin Liên Hệ</h2>
                  
                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Địa chỉ</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Khu công nghiệp Thạch Khôi, Hải Dương, Việt Nam</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <FiPhone className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Điện thoại</h3>
                        <a href="tel:0977344567" className="mt-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors block">
                          0977 344 567
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Email</h3>
                        <a href="mailto:invinhphat2025@gmail.com" className="mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors block">
                          invinhphat2025@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <FiClock className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Giờ làm việc</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-400">Thứ Hai – Chủ Nhật</p>
                        <p className="text-gray-600 dark:text-gray-400">Sáng 7:00–11:00, Chiều 8:00–12:00</p>
                      </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="pt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Kết nối với chúng tôi</h3>
                      <div className="flex space-x-4">
                        <a 
                          href="#" 
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-full transition-colors"
                          aria-label="Facebook"
                        >
                          <FaFacebook className="w-5 h-5" />
                        </a>
                        <a 
                          href="#" 
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-full transition-colors"
                          aria-label="Twitter"
                        >
                          <FaTwitter className="w-5 h-5" />
                        </a>
                        <a 
                          href="#" 
                          className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-full transition-colors"
                          aria-label="LinkedIn"
                        >
                          <FaLinkedin className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Section */}
                <motion.div 
                  variants={fadeIn}
                  custom={1}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Vị Trí Của Chúng Tôi</h3>
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.526365454746!2d106.2995123153738!3d20.94026299422636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a8e9a7e1f0c5d%3A0x7f8f6c1a1c3b3e1f!2sKhu%20C%C3%B4ng%20Nghi%E1%BB%87p%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Ph%C6%B0%E1%BB%9Dng%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
                      width="100%"
                      height="300" 
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      className="w-full"
                      title="Google Maps - Vinh Phat Printing"
                    ></iframe>
                  </div>
                  <a 
                    href="https://www.google.com/maps/place/Khu+C%C3%B4ng+Nghi%E1%BB%87p+Th%E1%BA%A1ch+Kh%C3%B4i,+Ph%C6%B0%E1%BB%9Dng+Th%E1%BA%A1ch+Kh%C3%B4i,+Th%C3%A0nh+Ph%E1%BB%91+H%E1%BA%A3i+D%C6%B0%C6%A1ng,+H%E1%BA%A3i+D%C6%B0%C6%A1ng,+Vi%E1%BB%87t+Nam/@20.940263,106.2995123,17z/data=!3m1!4b1!4m6!3m5!1s0x3135a8e9a7e1f0c5d:0x7f8f6c1a1c3b3e1f!8m2!3d20.940263!4d106.3020872!16s%2Fg%2F11q2q9q9q9?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
                  >
                    Xem bản đồ lớn hơn
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </motion.div>
              </motion.div>

              {/* Right Column - Contact Form */}
              <motion.div 
                variants={fadeIn}
                custom={1}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-12"
              >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Gửi Tin Nhắn</h2>
                
                <AnimatePresence>
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 mb-6 rounded-lg ${
                        submitStatus.success ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-100' : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100'
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { 
                        required: 'Vui lòng nhập họ tên',
                        minLength: {
                          value: 3,
                          message: 'Họ tên phải có ít nhất 3 ký tự'
                        },
                        maxLength: {
                          value: 50,
                          message: 'Họ tên không được vượt quá 50 ký tự'
                        },
                        pattern: {
                          value: /^[\p{L} ]+$/u,
                          message: 'Họ tên không được chứa ký tự đặc biệt hoặc số'
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                      placeholder="Nhập họ và tên của bạn"
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        {...register('phone', {
                          required: 'Vui lòng nhập số điện thoại',
                          pattern: {
                            value: /^(\+84|0)[1-9][0-9]{8,9}$/,
                            message: 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10-11 số)'
                          },
                          minLength: {
                            value: 10,
                            message: 'Số điện thoại phải có ít nhất 10 số'
                          },
                          maxLength: {
                            value: 11,
                            message: 'Số điện thoại không được vượt quá 11 số'
                          }
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                        placeholder="Nhập số điện thoại"
                        aria-invalid={errors.phone ? "true" : "false"}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register('email', {
                          required: 'Vui lòng nhập email',
                          maxLength: {
                            value: 100,
                            message: 'Email không được vượt quá 100 ký tự'
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại',
                          },
                        })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                        placeholder="Nhập email của bạn"
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      {...register('subject', { 
                        required: 'Vui lòng nhập tiêu đề',
                        minLength: {
                          value: 5,
                          message: 'Tiêu đề phải có ít nhất 5 ký tự'
                        },
                        maxLength: {
                          value: 200,
                          message: 'Tiêu đề không được vượt quá 200 ký tự'
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                      placeholder="Nhập tiêu đề tin nhắn"
                      aria-invalid={errors.subject ? "true" : "false"}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register('message', { 
                        required: 'Vui lòng nhập nội dung tin nhắn',
                        minLength: {
                          value: 10,
                          message: 'Nội dung phải có ít nhất 10 ký tự'
                        },
                        maxLength: {
                          value: 2000,
                          message: 'Nội dung không được vượt quá 2000 ký tự'
                        },
                        validate: (value) => {
                          const wordCount = value.trim().split(/\s+/).length;
                          if (wordCount < 5) {
                            return 'Nội dung phải có ít nhất 5 từ';
                          }
                          return true;
                        }
                      })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition duration-200 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      aria-invalid={errors.message ? "true" : "false"}
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tệp đính kèm (tùy chọn)
                    </label>
                    <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-2 text-center">
                        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600 dark:text-gray-400 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 whitespace-nowrap"
                          >
                            <span className="inline-flex items-center">Tải lên tệp</span>
                            <input 
                              id="file-upload"
                              type="file" 
                              className="sr-only"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              {...register('file')}
                              onChange={handleFileChange}
                            />
                          </label>
                          <span className="text-gray-500 dark:text-gray-400">hoặc kéo thả</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOC, DOCX, JPG, PNG (tối đa 5MB)
                        </p>
                      </div>
                    </div>
                    {previewImage && (
                      <div className="mt-2 flex items-center">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 object-cover rounded-md" 
                            src={previewImage} 
                            alt="Preview" 
                          />
                        </div>
                        <div className="ml-2 flex-1">
                          <div className="text-sm text-gray-700 dark:text-white truncate">
                            {file && file.length > 0 ? file[0].name : 'Tệp đã tải lên'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {file && file.length > 0 ? `${(file[0].size / 1024).toFixed(1)} KB` : ''}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                          aria-label="Remove file"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang gửi...
                        </div>
                      ) : (
                        'Gửi liên hệ'
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => reset()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2"
                    >
                      Quay lại
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Map and FAQ Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              {/* Map Section */}
              <motion.div 
                variants={fadeIn}
                custom={2}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-full"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Vị Trí Của Chúng Tôi</h3>
                <div className="rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14896.123456789012!2d106.2995123!3d20.940263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a8e9a7e1f0c5d%3A0x7f8f6c1a1c3b3e1f!2sKhu%20C%C3%B4ng%20Nghi%E1%BB%87p%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Ph%C6%B0%E1%BB%9Dng%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-[300px]"
                  ></iframe>
                </div>
                <a 
                  href="https://www.google.com/maps/place/Khu+C%C3%B4ng+Nghi%E1%BB%87p+Th%E1%BA%A1ch+Kh%C3%B4i,+Ph%C6%B0%E1%BB%9Dng+Th%E1%BA%A1ch+Kh%C3%B4i,+Th%C3%A0nh+Ph%E1%BB%91+H%E1%BA%A3i+D%C6%B0%C6%A1ng,+H%E1%BA%A3i+D%C6%B0%C6%A1ng,+Vi%E1%BB%87t+Nam/@20.940263,106.2995123,17z/data=!3m1!4b1!4m6!3m5!1s0x3135a8e9a7e1f0c5d:0x7f8f6c1a1c3b3e1f!8m2!3d20.940263!4d106.3020872!16s%2Fg%2F11q2q9q9q9?entry=ttu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors"
                >
                  Xem bản đồ lớn hơn
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </motion.div>

              {/* FAQ Section */}
              <motion.div 
                variants={fadeIn}
                custom={2}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-full"
              >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-center">Câu Hỏi Thường Gặp</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                      >
                        <span className="font-medium text-gray-900 dark:text-gray-100">{faq.question}</span>
                        {faq.isOpen ? (
                          <FiChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <FiChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      <AnimatePresence>
                        {faq.isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-4 pt-0 text-gray-600 dark:text-gray-300">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
