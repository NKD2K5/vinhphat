'use client';

import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import ContactModal to avoid SSR issues
const ContactModal = dynamic(() => import('./ContactModal'), {
  ssr: false,
  loading: () => <div className="w-12 h-12" aria-hidden="true" />
});

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
          phoneNumber: '0123456789',
          email: 'contact@example.com',
          zaloLink: 'https://zalo.me/0123456789',
          messengerLink: 'https://m.me/yourpage'
        };

        try {
          const response = await fetch('/api/globals/contact');
          if (response.ok) {
            const data = await response.json();
            setContactData({
              companyInfo: {
                phone: data.phoneNumber || fallbackData.phoneNumber,
                email: data.email || fallbackData.email
              },
              socialMedia: {
                zalo: data.zaloLink || fallbackData.zaloLink,
                messenger: data.messengerLink || fallbackData.messengerLink
              }
            });
          } else {
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
  }, []);

  // Don't render anything on the server
  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="fixed right-4 bottom-4 flex flex-col gap-3 z-50">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed right-4 bottom-4 bg-red-100 text-red-700 p-2 rounded text-sm max-w-xs z-50">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-4 bottom-4 flex flex-col gap-3 z-50">
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
          onClose={() => setIsModalOpen(false)}
          data={contactData}
        />
      )}
    </>
  );
}