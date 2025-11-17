'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaPhoneAlt, FaFacebookMessenger, FaWhatsapp, FaGlobe } from 'react-icons/fa';
import { SiZalo, SiGmail } from 'react-icons/si';
import { useTheme } from 'next-themes';
import { useFloatingButtons } from '@/hooks/useFloatingButtons';

type ButtonType = 'phone' | 'messenger' | 'zalo' | 'gmail' | 'website' | 'whatsapp';

interface ButtonConfig {
  type: ButtonType;
  label: string;
  url: string;
  backgroundColor?: string;
  enabled: boolean;
}

interface FloatingButtonsData {
  enabled: boolean;
  position: 'left' | 'right';
  buttons: ButtonConfig[];
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

interface ContactIconProps {
  icon: React.ReactElement<IconProps>;
  label: string;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const ContactIcon = ({
  icon,
  label,
  href = '#',
  className = '',
  style,
  onClick,
}: ContactIconProps) => {
  // Create a wrapper div to ensure the icon is always visible and perfectly centered
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative z-10 dark:brightness-100 flex items-center justify-center w-full h-full">
      {children}
    </div>
  );

  // Add a background circle to ensure visibility
  const BackgroundCircle = () => (
    <div className="absolute inset-0 rounded-full bg-white bg-opacity-30 dark:bg-opacity-40"></div>
  );

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${className} hover:shadow-2xl border-2 border-white border-opacity-50 overflow-hidden`}
      style={{
        ...style,
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
      }}
      whileHover={{ 
        scale: 1.15,
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.4)',
        borderColor: 'rgba(255, 255, 255, 0.8)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 10,
        borderColor: { duration: 0.2 }
      }}
      onClick={onClick}
    >
      <BackgroundCircle />
      <IconWrapper>
        {React.cloneElement(icon, {
          className: `${icon.props.className || ''} text-white flex-shrink-0`,
          'aria-hidden': 'true',
          style: {
            color: 'white',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
            width: '60%',
            height: '60%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        })}
      </IconWrapper>
    </motion.a>
  );
};

interface FloatingContactIconsProps {
  hidden?: boolean;
}

const FloatingContactIcons: React.FC<FloatingContactIconsProps> = ({ hidden = false }) => {
  const { data: floatingButtons, isLoading, error } = useFloatingButtons();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const controls = useAnimation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();

  // Debug log
  useEffect(() => {
    console.log('Floating buttons data:', {
      data: floatingButtons,
      isLoading,
      error,
      hidden
    });
  }, [floatingButtons, isLoading, error, hidden]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleIconClick = useCallback((iconName: string) => {
    setActiveIcon(iconName);
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3 }
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setActiveIcon(null);
    }, 1000);
  }, [controls]);

  const getIconByType = useCallback((type: ButtonType) => {
    const iconProps = { className: 'text-white' };
    
    switch (type) {
      case 'phone':
        return <FaPhoneAlt size={24} {...iconProps} />;
      case 'zalo':
        return <SiZalo size={24} {...iconProps} />;
      case 'messenger':
        return <FaFacebookMessenger size={26} {...iconProps} />;
      case 'gmail':
        return <SiGmail size={24} {...iconProps} />;
      case 'whatsapp':
        return <FaWhatsapp size={24} {...iconProps} />;
      case 'website':
        return <FaGlobe size={24} {...iconProps} />;
      default:
        return null;
    }
  }, []);

  const getDefaultBackground = useCallback((type: ButtonType) => {
    switch (type) {
      case 'phone':
        return 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
      case 'zalo':
        return 'linear-gradient(135deg, #0068FF 0%, #004BFF 100%)';
      case 'messenger':
        return 'linear-gradient(135deg, #0084FF 0%, #006AFF 100%)';
      case 'gmail':
        return 'linear-gradient(135deg, #EA4335 0%, #D14836 100%)';
      case 'whatsapp':
        return 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
      case 'website':
        return 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)';
      default:
        return 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)';
    }
  }, []);

  const handleButtonClick = useCallback((button: ButtonConfig) => {
    handleIconClick(button.type);
    
    if (button.type === 'phone' || button.type === 'gmail') {
      window.location.href = button.url;
    } else {
      window.open(button.url, '_blank', 'noopener,noreferrer');
    }
  }, [handleIconClick]);

  // Don't render anything if hidden, loading, or no data
  if (hidden || isLoading || !floatingButtons) {
    return null;
  }

  const { enabled, position = 'left', buttons = [] } = floatingButtons;
  const enabledButtons = buttons.filter(button => button?.enabled);

  if (!enabled || enabledButtons.length === 0) {
    return null;
  }

  return (
    <div 
      className={`fixed ${position === 'left' ? 'left-5' : 'right-5'} bottom-5 z-50`}
      data-testid="floating-contact-icons"
    >
      <div className="flex flex-col gap-4">
        {enabledButtons.map((button, index) => (
          <div key={`${button.type}-${index}`} className="relative">
            {activeIcon === button.type && (
              <>
                <motion.div 
                  className="absolute inset-0 border-2 rounded-full"
                  style={{ borderColor: button.backgroundColor || getDefaultBackground(button.type).split(' ')[1] }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ 
                    scale: 1.5, 
                    opacity: 0,
                    transition: { duration: 1.5, ease: 'easeOut' }
                  }}
                />
                <motion.div 
                  className="absolute inset-0 border-2 rounded-full opacity-60"
                  style={{ borderColor: button.backgroundColor || getDefaultBackground(button.type).split(' ')[1] }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ 
                    scale: 2, 
                    opacity: 0,
                    transition: { 
                      delay: 0.3,
                      duration: 1.5, 
                      ease: 'easeOut' 
                    }
                  }}
                />
              </>
            )}
            <motion.div
              animate={activeIcon === button.type ? controls : {}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ContactIcon
                icon={getIconByType(button.type)}
                label={button.label}
                onClick={() => handleButtonClick(button)}
                className="hover:brightness-110"
                style={{
                  background: button.backgroundColor || getDefaultBackground(button.type),
                }}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingContactIcons;
