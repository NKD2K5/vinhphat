import dynamic from 'next/dynamic';
import Hero from '../components/About/Hero';
import ServicesOverview from '../components/About/ServicesOverview';
import CoreTeam from '../components/About/CoreTeam';
import Values from '../components/About/Values';

// Dynamically import Header and Footer to avoid SSR issues
const Header = dynamic(() => import('../components/Header/Header'), { ssr: true });
const Footer = dynamic(() => import('../components/Footer/Footer'), { ssr: true });

export const metadata = {
  title: 'Về Chúng Tôi - Công Ty In Ấn Vinh Phát',
  description: 'Tìm hiểu về Công Ty In Ấn Vinh Phát - Đơn vị chuyên cung cấp các dịch vụ in ấn chất lượng cao, uy tín hàng đầu tại Việt Nam.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
      <section className="py-16">
        <div className="w-full">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Công Ty In Ấn Vĩnh Phát</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Được thành lập từ năm 2010, Công Ty In Ấn Vĩnh Phát tự hào là đơn vị đi đầu trong lĩnh vực in ấn công nghiệp tại Việt Nam. 
                Với hơn 13 năm kinh nghiệm, chúng tôi đã và đang phục vụ hàng nghìn khách hàng trong và ngoài nước.
              </p>
              <p>
                Chúng tôi không chỉ cung cấp các sản phẩm in ấn chất lượng mà còn mang đến giải pháp toàn diện 
                từ tư vấn, thiết kế đến thi công và hoàn thiện sản phẩm.
              </p>
              <p>
                Với đội ngũ nhân viên chuyên nghiệp, nhiệt huyết cùng hệ thống máy móc hiện đại, 
                chúng tôi cam kết mang đến cho khách hàng những sản phẩm hoàn hảo nhất.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="w-full">
        <ServicesOverview />
        <Values />
        <CoreTeam />
      </div>
      
      <section className="py-16 bg-primary text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn Sàng Bắt Đầu Dự Án Của Bạn?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi ngay hôm nay để nhận tư vấn và báo giá tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/lien-he" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10"
            >
              Liên Hệ Ngay
            </a>
            <a 
              href="tel:+84912345678" 
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 md:py-4 md:text-lg md:px-10"
            >
              0977 344 567
            </a>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
