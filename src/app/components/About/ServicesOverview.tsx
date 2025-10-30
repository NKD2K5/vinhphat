import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Printer, LayoutTemplate, Palette, Truck } from 'lucide-react';

const services = [
  {
    icon: <Printer className="w-10 h-10 mb-4 text-primary" />,
    title: "In ấn Công Nghiệp",
    description: "Cung cấp giải pháp in ấn công nghiệp với công nghệ hiện đại, đảm bảo chất lượng và thời gian giao hàng nhanh chóng."
  },
  {
    icon: <LayoutTemplate className="w-10 h-10 mb-4 text-primary" />,
    title: "Thiết kế Đồ họa",
    description: "Đội ngũ thiết kế chuyên nghiệp, sáng tạo, luôn cập nhật xu hướng mới nhất để mang đến sản phẩm ấn tượng."
  },
  {
    icon: <Palette className="w-10 h-10 mb-4 text-primary" />,
    title: "In Theo Yêu Cầu",
    description: "Đáp ứng mọi yêu cầu in ấn đặc biệt với chất liệu đa dạng, kích thước linh hoạt và số lượng tùy chọn."
  },
  {
    icon: <Truck className="w-10 h-10 mb-4 text-primary" />,
    title: "Giao Hàng Tận Nơi",
    description: "Dịch vụ giao hàng nhanh chóng, đúng hẹn trên toàn quốc với chi phí cạnh tranh."
  }
];

export default function ServicesOverview() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            Cung cấp giải pháp in ấn toàn diện với chất lượng vượt trội và dịch vụ chuyên nghiệp
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="h-full transition-all hover:shadow-lg hover:-translate-y-1 dark:bg-gray-700 dark:border-gray-600">
              <CardHeader>
                <div className="flex flex-col items-center">
                  {React.cloneElement(service.icon, {
                    className: `${service.icon.props.className} dark:text-blue-400`
                  })}
                  <CardTitle className="text-center dark:text-white">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground dark:text-gray-300">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
