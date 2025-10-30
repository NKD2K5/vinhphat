import React from 'react';

const Process: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Tư Vấn & Báo Giá',
      description: 'Đội ngũ tư vấn viên sẽ lắng nghe yêu cầu và tư vấn giải pháp phù hợp nhất với nhu cầu của bạn.',
      icon: (
        <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Thiết Kế & Duyệt Mẫu',
      description: 'Đội ngũ thiết kế sẽ tạo mẫu thiết kế theo yêu cầu và chỉnh sửa đến khi bạn hài lòng.',
      icon: (
        <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Sản Xuất',
      description: 'Sau khi duyệt mẫu, chúng tôi tiến hành in ấn với công nghệ hiện đại, đảm bảo chất lượng cao nhất.',
      icon: (
        <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Giao Hàng & Lắp Đặt',
      description: 'Giao hàng tận nơi và hỗ trợ lắp đặt nhanh chóng, chuyên nghiệp.',
      icon: (
        <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-5a1 1 0 01.707.293l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414l3-3A1 1 0 0112 11zm4 0h4" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-800" id="process">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Quy Trình Làm Việc
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Với quy trình chuyên nghiệp, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative flex flex-col items-center text-center px-4 py-6 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  index % 2 === 0 ? 'md:mb-8' : 'md:mt-8'
                }`}
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white dark:bg-gray-700 rotate-45"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
