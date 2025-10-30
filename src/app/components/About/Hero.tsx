'use client';

import Image from 'next/image';
import { Button } from '../../../components/ui/button';

export default function Hero() {
  return (
    <section className="relative h-[500px] flex items-center justify-center text-center text-white">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-800 to-purple-600 dark:from-gray-900 dark:to-gray-800">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950')"
          }}
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-gray-900/80 transition-colors duration-300" />
      </div>
      
      <div className="container relative z-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Về Chúng Tôi</h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
          Đồng hành cùng sự thành công của bạn thông qua những sản phẩm in ấn chất lượng cao và dịch vụ chuyên nghiệp
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="default" size="lg">Liên Hệ Ngay</Button>
          <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
            Xem Sản Phẩm
          </Button>
        </div>
      </div>
    </section>
  );
}
