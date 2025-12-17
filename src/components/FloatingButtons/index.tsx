'use client';

import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import ContactModal directly since it's a client component
import ContactModal from './ContactModal';

type ContactData = {
  companyInfo?: {
    phone?: string;
    email?: string;
  };
  socialMedia?: {
    zalo?: string;
    messenger?: string;
  };
};

export default function FloatingButtons() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Only run on client side
    if (typeof window === 'undefined') return;

    const fetchContactData = async () => {
      try {
        setIsLoading(true);
        
        // Fallback data in case API is not available
        const fallbackData = {
          phoneNumber: '0965952000',
          email: 'invinhphat6868@gmail.com',
          zaloLink: 'https://zalo.me/0965952000',
          messengerLink: 'https://www.facebook.com/people/In-Vinh-Ph%C3%A1t/61575271242570/'
        };

        try {
          const timestamp = Date.now(); // Move timestamp generation inside useEffect
          const response = await fetch(`/api/floating-buttons?t=${timestamp}`, {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            },
            cache: 'no-store'
          });
          if (response.ok) {
            const result = await response.json();
            console.log('API Response:', result); // Debug log
            const data = result.data;
            console.log('Contact Data:', data); // Debug log
            
            // Map buttons array to contactData structure
            const phoneButton = data.buttons?.find((btn: any) => btn.type === 'phone');
            const messengerButton = data.buttons?.find((btn: any) => btn.type === 'messenger');
            const zaloButton = data.buttons?.find((btn: any) => btn.type === 'zalo');
            const gmailButton = data.buttons?.find((btn: any) => btn.type === 'gmail');
            
            setContactData({
              companyInfo: {
                phone: phoneButton?.url?.replace('tel:', '') || fallbackData.phoneNumber,
                email: gmailButton?.url?.replace('mailto:', '') || fallbackData.email
              },
              socialMedia: {
                zalo: zaloButton?.url || fallbackData.zaloLink,
                messenger: messengerButton?.url || fallbackData.messengerLink
              }
            });
            console.log('Set Contact Data:', {
              companyInfo: {
                phone: phoneButton?.url?.replace('tel:', '') || fallbackData.phoneNumber,
                email: gmailButton?.url?.replace('mailto:', '') || fallbackData.email
              },
              socialMedia: {
                zalo: zaloButton?.url || fallbackData.zaloLink,
                messenger: messengerButton?.url || fallbackData.messengerLink
              }
            }); // Debug log
          } else {
            console.log('API Response not ok:', response.status); // Debug log
            throw new Error('API not available');
          }
        } catch (err) {
          console.warn('Using fallback contact data');
          setContactData({
            companyInfo: {
              phone: fallbackData.phoneNumber,
              email: fallbackData.email
            },
            socialMedia: {
              zalo: fallbackData.zaloLink,
              messenger: fallbackData.messengerLink
            }
          });
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu liên hệ:', err);
        setError('Không thể tải thông tin liên hệ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactData();

    // Fetch lại mỗi 30 giây
    const interval = setInterval(() => {
      fetchContactData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't render anything on the server
  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fixed left-4 bottom-4 flex flex-col gap-3 z-50">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed left-4 bottom-4 bg-red-100 text-red-700 p-2 rounded text-sm max-w-xs z-50">
        {error}
      </div>
    );
  }

  return (
    <>
      {console.log('Rendering with contactData:', contactData)}
      <div className="fixed left-4 bottom-4 flex flex-col gap-3 z-50">
        {contactData?.companyInfo?.phone && (
          <a
            href={`tel:${contactData.companyInfo.phone}`}
            className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
            aria-label="Gọi điện"
          >
            <Phone className="h-6 w-6" />
          </a>
        )}

        {contactData?.socialMedia?.messenger && (
          <a
            href={contactData.socialMedia.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
            aria-label="Nhắn tin qua Messenger"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        )}

        {contactData?.socialMedia?.zalo && (
          <a
            href={contactData.socialMedia.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors"
            aria-label="Nhắn tin qua Zalo"
          >
            <span className="font-bold">Z</span>
          </a>
        )}

        {contactData?.companyInfo?.email && (
          <a
            href={`mailto:${contactData.companyInfo.email}`}
            className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            aria-label="Gửi email"
          >
            <Mail className="h-6 w-6" />
          </a>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Xem thông tin liên hệ"
        >
          <MapPin className="h-6 w-6" />
        </button>
      </div>

      {isMounted && (
        <ContactModal
          isOpen={isModalOpen}
          data={contactData}
        />
      )}
    </>
  );
}