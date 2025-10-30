import Image from 'next/image';
import { FaAward, FaUsers, FaProjectDiagram } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    {
      icon: <FaAward className="w-8 h-8" />,
      value: "15+",
      label: "Năm Kinh Nghiệm"
    },
    {
      icon: <FaProjectDiagram className="w-8 h-8" />,
      value: "500+",
      label: "Dự Án Đã Hoàn Thành"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      value: "200+",
      label: "Khách Hàng Hài Lòng"
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Image */}
          <motion.div 
            className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/images/about/about-printing.jpg"
                  alt="About VinhPhat Printing"
                  width={800}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCIgZmlsbD0iI2VlZSI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiLz48dGV4dCB4PSI0MDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+RmFpbGVkIHRvIGxvYWQgaW1hZ2U8L3RleHQ+PC9zdmc+';
                  }}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-600 rounded-full z-10 flex items-center justify-center text-white">
                <span className="text-4xl font-bold">15+</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div 
            className="lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              ...fadeIn,
              visible: {
                ...fadeIn.visible,
                transition: { ...fadeIn.visible.transition, delay: 0.2 }
              }
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              VinhPhat Printing - Đối Tác In Ấn Đáng Tin Cậy
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Với hơn 15 năm kinh nghiệm trong ngành in ấn, VinhPhat Printing đã khẳng định vị thế dẫn đầu trong việc cung cấp các giải pháp in ấn chất lượng cao cho mọi quy mô doanh nghiệp.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Chúng tôi chuyên cung cấp đa dạng các dịch vụ in ấn bao gồm catalogue, tờ rơi, bao bì, danh thiếp, nhãn mác và nhiều hơn nữa. Với trang thiết bị hiện đại và đội ngũ chuyên nghiệp, chúng tôi cam kết mang đến cho mỗi dự án những tiêu chuẩn chất lượng và độ chính xác cao nhất.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href="/about" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 inline-flex items-center"
              >
                Tìm Hiểu Thêm
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a 
                href="/contact" 
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors duration-300 inline-flex items-center"
              >
                Liên Hệ
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
