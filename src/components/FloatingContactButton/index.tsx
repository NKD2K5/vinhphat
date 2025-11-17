'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, Loader2 } from 'lucide-react';

type ButtonType = 'phone' | 'zalo' | 'email' | 'gmail' | 'website' | 'facebook' | 'messenger';

interface FloatingButton {
  id: string;
  type: ButtonType;
  label: string;
  url: string;
  icon?: string;
  enabled: boolean;
  order?: number;
  backgroundColor?: string;
  color?: string;
}

interface FloatingButtonsConfig {
  enabled: boolean;
  position: 'left' | 'right';
  buttons: FloatingButton[];
  styling?: {
    buttonSize?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
  };
}

const FloatingContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FloatingButtonsConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/floating-buttons');
        const data = await response.json();
        
        if (data.success && data.data.enabled) {
          // Lọc ra các nút đã bật
          const enabledButtons = data.data.buttons.filter(
            (btn: FloatingButton) => btn.enabled !== false
          );
          
          // Sắp xếp theo thứ tự
          enabledButtons.sort((a: FloatingButton, b: FloatingButton) => 
            (a.order || 0) - (b.order || 0)
          );
          
          setConfig({
            ...data.data,
            buttons: enabledButtons
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải cấu hình nút liên hệ:', err);
        setError('Không thể tải cấu hình nút liên hệ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Nếu đang tải hoặc có lỗi hoặc không bật tính năng
  if (isLoading) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full text-white shadow-lg">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !config) {
    return null; // Ẩn nếu có lỗi hoặc không có cấu hình
  }

  // Lấy kích thước nút từ cấu hình
  const getButtonSize = () => {
    switch (config.styling?.buttonSize) {
      case 'small': return 'w-10 h-10 text-sm';
      case 'large': return 'w-16 h-16 text-xl';
      case 'medium':
      default:
        return 'w-14 h-14 text-base';
    }
  };

  // Lấy icon tương ứng với loại nút
  const getButtonIcon = (type: ButtonType) => {
    switch (type) {
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'zalo':
        return <MessageCircle className="w-5 h-5" />;
      case 'email':
      case 'gmail':
        return <Mail className="w-5 h-5" />;
      case 'facebook':
        return <span className="w-5 h-5">f</span>;
      case 'messenger':
        return <span className="w-5 h-5">💬</span>;
      default:
        return <span className="w-5 h-5">🔗</span>;
    }
  };

  // Xử lý URL dựa trên loại nút
  const getButtonUrl = (button: FloatingButton) => {
    if (button.url) return button.url;
    
    switch (button.type) {
      case 'phone':
        return `tel:${button.label.replace(/\D/g, '')}`;
      case 'zalo':
        return `https://zalo.me/${button.label.replace(/\D/g, '')}`;
      case 'email':
      case 'gmail':
        return `mailto:${button.label}`;
      default:
        return '#';
    }
  };

  return (
    <div className={`fixed ${config.position === 'left' ? 'left-6' : 'right-6'} bottom-6 z-50`}>
      {/* Main Button */}
      <button
        onClick={toggleMenu}
        className={`flex items-center justify-center rounded-full text-white shadow-lg hover:opacity-90 transition-all duration-300 ${getButtonSize()} ${
          config.buttons[0]?.backgroundColor 
            ? `bg-[${config.buttons[0].backgroundColor}]` 
            : 'bg-blue-600'
        }`}
        style={{
          backgroundColor: config.buttons[0]?.backgroundColor || '#3b82f6',
          color: config.buttons[0]?.color || 'white'
        }}
        aria-label="Liên hệ"
      >
        {isOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          getButtonIcon(config.buttons[0]?.type || 'phone')
        )}
      </button>

      {/* Contact Options */}
      <div
        className={`absolute ${
          config.position === 'left' ? 'left-0' : 'right-0'
        } bottom-full mb-2 flex flex-col space-y-2 transition-all duration-300 transform ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {config.buttons.slice(1).map((button, index) => (
          <a
            key={button.id || index}
            href={getButtonUrl(button)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center rounded-full text-white shadow-md hover:opacity-90 transition-opacity ${getButtonSize()} ${
              button.backgroundColor ? `bg-[${button.backgroundColor}]` : 'bg-gray-700'
            }`}
            style={{
              backgroundColor: button.backgroundColor || '#4b5563',
              color: button.color || 'white'
            }}
            aria-label={button.label || button.type}
          >
            {getButtonIcon(button.type)}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FloatingContactButton;
