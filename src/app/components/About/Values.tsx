import React from 'react';
import { Award, Heart, Shield, Users } from 'lucide-react';

const values = [
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Chất Lượng Hàng Đầu",
    description: "Cam kết mang đến sản phẩm in ấn chất lượng cao với độ chính xác tuyệt đối."
  },
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Đam Mê Sáng Tạo",
    description: "Không ngừng đổi mới, sáng tạo để mang đến những giải pháp in ấn độc đáo."
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Đáng Tin Cậy",
    description: "Đặt chữ tín lên hàng đầu, đảm bảo mọi cam kết với khách hàng đều được thực hiện."
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Hợp Tác Bền Vững",
    description: "Xây dựng mối quan hệ đối tác lâu dài dựa trên sự tin cậy và cùng phát triển."
  }
];

export default function Values() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Giá Trị Cốt Lõi</h2>
          <p className="text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            Những nguyên tắc dẫn dắt mọi hoạt động và quyết định của chúng tôi
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-center mb-4">
                {React.cloneElement(value.icon, {
                  className: `${value.icon.props.className} dark:text-blue-400`
                })}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{value.title}</h3>
              <p className="text-muted-foreground dark:text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
