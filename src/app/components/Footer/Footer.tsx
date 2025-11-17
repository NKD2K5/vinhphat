'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/footer-info');
        const result = await response.json();
        if (result.success && result.data) {
          setFooterData(result.data);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{footerData?.companyInfo?.name || 'CÔNG TY TNHH IN ẤN VÀ THƯƠNG MẠI VĨNH PHÁT'}</h3>
            <p className="text-gray-400">{footerData?.companyInfo?.description || 'Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.'}</p>
            <div className="flex space-x-4">
              {footerData?.socialMedia?.facebook && (
                <a href={footerData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                  <FaFacebook className="w-6 h-6" />
                </a>
              )}
              {footerData?.socialMedia?.gmail && (
                <a href={`mailto:${footerData.socialMedia.gmail}`} className="text-gray-400 hover:text-white transition-colors" title="Email">
                  <FaEnvelope className="w-6 h-6" />
                </a>
              )}
              {footerData?.socialMedia?.zalo && (
                <a href={footerData.socialMedia.zalo} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors" title="Zalo">
                  <SiZalo className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerData?.quickLinks?.column1?.title || 'Thông tin liên hệ'}</h4>
            <ul className="space-y-2">
              {footerData?.quickLinks?.column1?.links?.map((link: any, index: number) => (
                <li key={index}>
                  <Link href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              )) || (
                <>
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Trang chủ</Link></li>
                  <li><Link href="/dich-vu" className="text-gray-400 hover:text-white transition-colors">Dịch vụ</Link></li>
                  <li><Link href="/san-pham" className="text-gray-400 hover:text-white transition-colors">Sản phẩm</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerData?.quickLinks?.column2?.title || 'Liên kết nhanh'}</h4>
            <ul className="space-y-2">
              {footerData?.quickLinks?.column2?.links?.map((link: any, index: number) => (
                <li key={index}>
                  <Link href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              )) || (
                <>
                  <li><Link href="/san-pham" className="text-gray-400 hover:text-white transition-colors">In offset</Link></li>
                  <li><Link href="/san-pham" className="text-gray-400 hover:text-white transition-colors">In kỹ thuật số</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerData?.quickLinks?.column3?.title || 'Dịch vụ chính'}</h4>
            <ul className="space-y-2">
              {footerData?.quickLinks?.column3?.links?.map((link: any, index: number) => (
                <li key={index}>
                  <Link href={link.url} className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </li>
              )) || (
                <>
                  <li><Link href="/dich-vu" className="text-gray-400 hover:text-white transition-colors">In offset</Link></li>
                  <li><Link href="/dich-vu" className="text-gray-400 hover:text-white transition-colors">In kỹ thuật số</Link></li>
                </>
              )}
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>{footerData?.copyright?.text || `© ${currentYear} VinhPhat Printing. Tất cả các quyền được bảo lưu.`}</p>
          {footerData?.copyright?.links && footerData.copyright.links.length > 0 && (
            <div className="mt-2 space-x-4">
              {footerData.copyright.links.map((link: any, index: number) => (
                <span key={index}>
                  {index > 0 && <span className="mx-2">|</span>}
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.text}
                  </Link>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
