'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaPhoneAlt, FaFacebookMessenger } from 'react-icons/fa';
import { SiZalo, SiGmail } from 'react-icons/si';
import { useTheme } from 'next-themes';

type IconProps = {
  className?: string;
  [key: string]: any;
};

type ContactIconProps = {
  icon: React.ReactElement<IconProps>;
  label: string;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

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

const FloatingContactIcons = () => {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const controls = useAnimation();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Wave animation effect
  useEffect(() => {
    if (activeIcon) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 }
      });
      
      // Reset active icon after animation
      timeoutRef.current = setTimeout(() => {
        setActiveIcon(null);
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [activeIcon, controls]);

  const handleIconClick = (iconName: string) => {
    setActiveIcon(iconName);
  };

  const handlePhoneClick = () => {
    handleIconClick('phone');
    window.location.href = 'tel:0977344567';
  };

  const handleMessengerClick = () => {
    handleIconClick('messenger');
    window.open('https://www.facebook.com/people/In-Vinh-Ph%C3%A1t/61575271242570/', '_blank');
  };

  const handleZaloClick = () => {
    handleIconClick('zalo');
    window.open('https://zalo.me/0977344567', '_blank');
  };

  const handleGmailClick = () => {
    handleIconClick('gmail');
    window.location.href = 'mailto:invinhphat6868@gmail.com';
  };

  return (
    <div className="fixed left-5 bottom-5 z-50">
      <div className="flex flex-col gap-4">
        {/* Phone Icon with Wave Effect */}
        <div className="relative">
          {activeIcon === 'phone' && (
            <>
              <motion.div 
                className="absolute inset-0 border-2 border-green-500 rounded-full"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ 
                  scale: 1.5, 
                  opacity: 0,
                  transition: { duration: 1.5, ease: 'easeOut' }
                }}
              />
              <motion.div 
                className="absolute inset-0 border-2 border-green-400 rounded-full"
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
            animate={activeIcon === 'phone' ? controls : {}}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ContactIcon
              icon={<FaPhoneAlt size={24} className="text-white" />}
              label="Gọi điện thoại"
              onClick={handlePhoneClick}
              className="from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              }}
            />
          </motion.div>
        </div>
        
        {/* Messenger Icon with Wave Effect */}
        <div className="relative">
          {activeIcon === 'messenger' && (
            <>
              <motion.div 
                className="absolute inset-0 border-2 border-blue-500 rounded-full"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ 
                  scale: 1.5, 
                  opacity: 0,
                  transition: { duration: 1.5, ease: 'easeOut' }
                }}
              />
              <motion.div 
                className="absolute inset-0 border-2 border-blue-400 rounded-full"
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
            animate={activeIcon === 'messenger' ? controls : {}}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ContactIcon
              icon={<FaFacebookMessenger size={26} className="text-white" />}
              label="Facebook Messenger"
              onClick={handleMessengerClick}
              className="hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #0084FF 0%, #006AFF 100%)',
              }}
            />
          </motion.div>
        </div>
        
        {/* Zalo Icon with Wave Effect */}
        <div className="relative">
          {activeIcon === 'zalo' && (
            <>
              <motion.div 
                className="absolute inset-0 border-2 border-blue-400 rounded-full"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ 
                  scale: 1.5, 
                  opacity: 0,
                  transition: { duration: 1.5, ease: 'easeOut' }
                }}
              />
              <motion.div 
                className="absolute inset-0 border-2 border-blue-300 rounded-full"
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
            animate={activeIcon === 'zalo' ? controls : {}}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ContactIcon
              icon={<SiZalo size={24} className="text-white" />}
              label="Zalo"
              onClick={handleZaloClick}
              className="hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #0068FF 0%, #004BFF 100%)',
              }}
            />
          </motion.div>
        </div>

        {/* Gmail Icon with Wave Effect */}
        <div className="relative">
          {activeIcon === 'gmail' && (
            <>
              <motion.div 
                className="absolute inset-0 border-2 border-red-500 rounded-full"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ 
                  scale: 1.5, 
                  opacity: 0,
                  transition: { duration: 1.5, ease: 'easeOut' }
                }}
              />
              <motion.div 
                className="absolute inset-0 border-2 border-red-400 rounded-full"
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
            animate={activeIcon === 'gmail' ? controls : {}}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ContactIcon
              icon={<SiGmail size={24} className="text-white" />}
              label="Gửi email"
              onClick={handleGmailClick}
              className="from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              style={{
                background: 'linear-gradient(135deg, #EA4335 0%, #D14836 100%)',
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FloatingContactIcons;
