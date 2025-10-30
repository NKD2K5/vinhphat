'use client';

import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaYoutube } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">CÔNG TY TNHH IN ẤN VÀ THƯƠNG MẠI VĨNH PHÁT</h3>
            <p className="text-gray-400">Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/vinhphatprinting" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="mailto:invinhphat6868@gmail.com" className="text-gray-400 hover:text-white transition-colors" title="Gmail">
                <svg className="w-5 h-5 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
              <a href="https://zalo.me/0977344567" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors" title="Zalo">
                <SiZalo className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400">Khu Công Nghiệp Thạch Khôi, Phường Thạch Khôi, Thành Phố Hải Dương, Hải Dương, Việt Nam</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3" />
                <a href="tel:0977344567" className="text-gray-400 hover:text-white transition-colors">0977 344 567</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3" />
                <a href="mailto:invinhphat6868@gmail.com" className="text-gray-400 hover:text-white transition-colors">invinhphat6868@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Trang chủ</Link></li>
              <li><Link href="/dich-vu" className="text-gray-400 hover:text-white transition-colors">Dịch vụ</Link></li>
              <li><Link href="/san-pham" className="text-gray-400 hover:text-white transition-colors">Sản phẩm</Link></li>
              <li><Link href="/gioi-thieu" className="text-gray-400 hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link href="/lien-he" className="text-gray-400 hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Dịch vụ chính</h4>
            <ul className="space-y-2">
              <li><Link href="/dich-vu/in-offset" className="text-gray-400 hover:text-white transition-colors">In offset</Link></li>
              <li><Link href="/dich-vu/in-ky-thuat-so" className="text-gray-400 hover:text-white transition-colors">In kỹ thuật số</Link></li>
              <li><Link href="/dich-vu/in-bao-bi" className="text-gray-400 hover:text-white transition-colors">In bao bì giấy</Link></li>
              <li><Link href="/dich-vu/in-tui-giay" className="text-gray-400 hover:text-white transition-colors">In túi giấy</Link></li>
              <li><Link href="/dich-vu/in-an-khac-laser" className="text-gray-400 hover:text-white transition-colors">In ấn khắc laser</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} VinhPhat Printing. Tất cả các quyền được bảo lưu.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
