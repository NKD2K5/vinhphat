'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const PhanDauTrang = dynamic(() => import('../components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer/Footer'), { ssr: false });
const ContactCTA = dynamic(() => import('@/components/ContactCTA/ContactCTA'), { ssr: false });

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar: string;
  bio: string;
  experience?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  facebook?: string;
}

// Helper to render rich text (HTML from CKEditor or Slate format)
const renderRichText = (content: any): string => {
  // Nếu content là HTML string (từ CKEditor)
  if (typeof content === 'string') {
    return content;
  }
  
  // Fallback: Nếu vẫn còn Slate format (array) - legacy data
  if (!content || !Array.isArray(content)) return '';
  return content.map((node: any) => {
    if (node.children) {
      return node.children.map((child: any) => child.text || '').join('');
    }
    return '';
  }).filter(text => text).join('\n\n');
};

// Custom hook for counter animation
const useCounterAnimation = (end: number, duration: number = 2000, startAnimation: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, startAnimation]);

  return count;
};

// Counter Card Component with Intersection Observer
const CounterCard = ({ number, label }: { number: string; label: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  // Parse number from string (e.g., "15+" -> 15, "5000+" -> 5000, "100K+" -> 100000)
  const parseNumber = (numStr: string): number => {
    const cleanStr = numStr.replace(/[+,]/g, '');
    if (cleanStr.includes('K')) {
      return parseFloat(cleanStr.replace('K', '')) * 1000;
    }
    return parseInt(cleanStr);
  };

  const targetNumber = parseNumber(number);
  const animatedCount = useCounterAnimation(targetNumber, 2000, isVisible);

  // Format number back to display format
  const formatNumber = (num: number): string => {
    if (number.includes('K')) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return `${num}+`;
  };

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref]);

  return (
    <div ref={setRef} className="text-center">
      <div className="text-5xl md:text-6xl font-bold mb-2">
        {isVisible ? formatNumber(animatedCount) : '0+'}
      </div>
      <div className="text-lg text-white/90">{label}</div>
    </div>
  );
};

export default function AboutUsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function fetchData() {
      try {
        // Fetch team members
        const teamResponse = await fetch('/api/team-members');
        if (teamResponse.ok) {
          const teamResult = await teamResponse.json();
          if (teamResult.success) {
            setTeamMembers(teamResult.members);
          }
        }

        // Fetch about page data
        const aboutResponse = await fetch('/api/about-page', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (aboutResponse.ok) {
          const aboutResult = await aboutResponse.json();
          console.log('📦 About Page Data (Ve-chung-toi):', aboutResult);
          if (aboutResult.success && aboutResult.aboutPage) {
            setAboutData(aboutResult.aboutPage);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [mounted]);

  if (!mounted) return null;

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PhanDauTrang />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              {aboutData?.hero?.heading ? (
                <>
                  {aboutData.hero.heading.split(' ').slice(0, -2).join(' ')}{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {aboutData.hero.heading.split(' ').slice(-2).join(' ')}
                  </span>
                </>
              ) : (
                <>
                  Về <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">VinhPhat Printing</span>
                </>
              )}
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {aboutData?.hero?.subheading || 'Đối tác in ấn đáng tin cậy với hơn 15 năm kinh nghiệm'}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={aboutData?.companyStory?.image || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop'}
                alt="VinhPhat Printing Office"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                {aboutData?.companyStory?.heading || 'Câu Chuyện Thành Lập'}
              </h2>
              <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg md:text-xl lg:text-2xl prose prose-lg dark:prose-invert max-w-none">
                {aboutData?.companyStory?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: renderRichText(aboutData.companyStory.content) }} />
                ) : (
                  <>
                    <p className="leading-relaxed">Được thành lập vào năm 2009, VinhPhat Printing bắt đầu từ một xưởng in nhỏ với niềm đam mê mang đến những sản phẩm in ấn chất lượng cao cho khách hàng Việt Nam.</p>
                    <p className="leading-relaxed">Qua hơn 15 năm phát triển, chúng tôi đã trở thành một trong những đơn vị tiên phong trong lĩnh vực in ấn kỹ thuật số và in offset, phục vụ hàng ngàn khách hàng từ doanh nghiệp nhỏ đến tập đoàn lớn.</p>
                    <p className="leading-relaxed">Với đội ngũ hơn 50 nhân viên chuyên nghiệp và hệ thống máy móc hiện đại nhập khẩu từ Đức và Nhật Bản, chúng tôi cam kết mang đến sản phẩm đạt tiêu chuẩn quốc tế.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sứ Mệnh & Tầm Nhìn
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {aboutData?.mission?.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={aboutData.mission.image}
                    alt={aboutData.mission.title || 'Sứ Mệnh'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8 border-l-4 border-blue-600">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {aboutData?.mission?.title || 'Sứ Mệnh'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {aboutData?.mission?.content || 'Mang đến những sản phẩm in ấn chất lượng cao nhất, góp phần nâng tầm thương hiệu và thành công của khách hàng thông qua công nghệ hiện đại và dịch vụ tận tâm.'}
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              {aboutData?.vision?.image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={aboutData.vision.image}
                    alt={aboutData.vision.title || 'Tầm Nhìn'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-8 border-l-4 border-purple-600">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {aboutData?.vision?.title || 'Tầm Nhìn'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {aboutData?.vision?.content || 'Trở thành công ty in ấn hàng đầu Việt Nam, được khách hàng tin tưởng lựa chọn và đối tác ưu tiên hợp tác trong lĩnh vực in ấn và truyền thông.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(aboutData?.coreValues && aboutData.coreValues.length > 0) ? (
              aboutData.coreValues.map((value: any, index: number) => {
                const iconMap: Record<string, JSX.Element> = {
                  check: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  lightning: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  users: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                  lightbulb: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  star: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                  shield: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  target: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  ),
                  rocket: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                };

                return (
                  <div key={index} className="text-center group">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {iconMap[value.icon] || iconMap.check}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                  </div>
                );
              })
            ) : (
              // Fallback default values
              [
                {
                  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
                  title: 'Chất Lượng',
                  description: 'Cam kết sản phẩm đạt tiêu chuẩn quốc tế'
                },
                {
                  image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=200&fit=crop',
                  title: 'Tốc Độ',
                  description: 'Giao hàng nhanh chóng, đúng hẹn'
                },
                {
                  image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=200&fit=crop',
                  title: 'Tận Tâm',
                  description: 'Hỗ trợ khách hàng 24/7'
                },
                {
                  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=200&fit=crop',
                  title: 'Sáng Tạo',
                  description: 'Luôn đổi mới và cải tiến'
                },
              ].map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={value.image}
                      alt={value.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Thành Tựu Nổi Bật
            </h2>
            <div className="h-1 w-20 mx-auto bg-white rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(aboutData?.achievements && aboutData.achievements.length > 0 ? aboutData.achievements : [
              { number: '15+', label: 'Năm Kinh Nghiệm' },
              { number: '5000+', label: 'Khách Hàng Tin Tưởng' },
              { number: '50+', label: 'Nhân Viên Chuyên Nghiệp' },
              { number: '100K+', label: 'Đơn Hàng Hoàn Thành' },
            ]).map((stat: any, index: number) => (
              <CounterCard key={index} number={stat.number} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Đội Ngũ Lãnh Đạo
            </h2>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Đội ngũ lãnh đạo giàu kinh nghiệm, tận tâm và luôn đặt khách hàng lên hàng đầu
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Chưa có thông tin đội ngũ</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="group w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-sm">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Avatar */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Experience Badge */}
                      {member.experience && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {member.experience}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                        {member.position}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        {member.bio}
                      </p>

                      {/* Social Links */}
                      <div className="flex gap-3">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-300"
                            title="Email"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                        {member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors duration-300"
                            title="Phone"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-colors duration-300"
                            title="LinkedIn"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {member.facebook && (
                          <a
                            href={member.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors duration-300"
                            title="Facebook"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <ContactCTA />

      <Footer />
    </div>
  );
}
