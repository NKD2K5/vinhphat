import { FaPrint, FaBoxOpen, FaFileAlt, FaTags, FaTshirt, FaNewspaper } from 'react-icons/fa';
import { GiCardExchange, GiPaperCrane } from 'react-icons/gi';
import { MdOutlineLocalPrintshop } from 'react-icons/md';
import { RiPrinterCloudLine } from 'react-icons/ri';

const Services = () => {
  const services = [
    {
      icon: <FaFileAlt className="w-8 h-8" />,
      title: "In Catalogue",
      description: "Dịch vụ in catalogue chất lượng cao với màu sắc sống động và chi tiết sắc nét, giúp quảng bá sản phẩm của bạn một cách hiệu quả."
    },
    {
      icon: <FaPrint className="w-8 h-8" />,
      title: "In Brochure",
      description: "Thiết kế brochure ấn tượng, truyền tải thông điệp hiệu quả và thu hút khách hàng tiềm năng."
    },
    {
      icon: <GiPaperCrane className="w-8 h-8" />,
      title: "In Tờ Rơi",
      description: "Dịch vụ in tờ rơi giá cả phải chăng, hiệu quả cho các chương trình khuyến mãi, sự kiện và thông báo."
    },
    {
      icon: <FaBoxOpen className="w-8 h-8" />,
      title: "In Bao Bì",
      description: "Giải pháp in bao bì tùy chỉnh giúp bảo vệ sản phẩm và nâng cao nhận diện thương hiệu."
    },
    {
      icon: <GiCardExchange className="w-8 h-8" />,
      title: "In Danh Thiếp",
      description: "Danh thiếp chuyên nghiệp tạo ấn tượng lâu dài với đối tác và khách hàng."
    },
    {
      icon: <FaTags className="w-8 h-8" />,
      title: "In Nhãn Mác & Decal",
      description: "Dịch vụ in nhãn mác và decal chất lượng cao cho nhận diện sản phẩm, bao bì và chương trình khuyến mãi."
    },
    {
      icon: <MdOutlineLocalPrintshop className="w-8 h-8" />,
      title: "In Offset",
      description: "Dịch vụ in offset tiết kiệm chi phí cho đơn hàng số lượng lớn với chất lượng đồng đều."
    },
    {
      icon: <RiPrinterCloudLine className="w-8 h-8" />,
      title: "In Kỹ Thuật Số",
      description: "Dịch vụ in kỹ thuật số nhanh chóng và linh hoạt cho số lượng in từ ít đến trung bình."
    },
    {
      icon: <FaTshirt className="w-8 h-8" />,
      title: "In UV",
      description: "Công nghệ in UV chất lượng cao cho màu sắc rực rỡ và độ bền cao trên nhiều chất liệu khác nhau."
    },
    {
      icon: <FaNewspaper className="w-8 h-8" />,
      title: "In Bạt & Hiflex",
      description: "Dịch vụ in khổ lớn cho băng rôn, biển hiệu và vật phẩm trưng bày thu hút sự chú ý."
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Dịch Vụ In Ấn Của Chúng Tôi
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Chúng tôi cung cấp đa dạng các dịch vụ in ấn chất lượng cao đáp ứng mọi nhu cầu kinh doanh của bạn.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 mx-auto">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/services" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Xem Tất Cả Dịch Vụ
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
