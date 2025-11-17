'use client';

import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';

type ContactData = {
  companyInfo?: {
    address?: string;
    phone?: string;
    email?: string;
    workingHours?: {
      days?: string;
      morning?: string;
      afternoon?: string;
    };
  };
  googleMaps?: {
    embedUrl?: string;
    directionsUrl?: string;
  };
  socialMedia?: {
    facebook?: string;
    gmail?: string;
    zalo?: string;
  };
  faq?: Array<{
    question?: string;
    answer?: string;
  }>;
};

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: ContactData | null;
  isLoading?: boolean;
};

export default function ContactModal({
  isOpen,
  onClose,
  data,
  isLoading = false,
}: ContactModalProps) {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Thông Tin Liên Hệ</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : data ? (
            <>
              {/* Company Info */}
              {data.companyInfo && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="text-green-600" size={20} />
                    Thông Tin Công Ty
                  </h3>

                  {/* Address */}
                  {data.companyInfo.address && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Địa chỉ</p>
                        <p className="text-gray-800 font-medium">{data.companyInfo.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {data.companyInfo.phone && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Điện thoại</p>
                        <a
                          href={`tel:${data.companyInfo.phone}`}
                          className="text-green-600 font-medium hover:underline"
                        >
                          {data.companyInfo.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {data.companyInfo.email && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a
                          href={`mailto:${data.companyInfo.email}`}
                          className="text-green-600 font-medium hover:underline"
                        >
                          {data.companyInfo.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Working Hours */}
                  {data.companyInfo.workingHours && (
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="text-green-600 flex-shrink-0 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Giờ làm việc</p>
                        <p className="text-gray-800 font-medium">
                          {data.companyInfo.workingHours.days}
                        </p>
                        <div className="text-sm text-gray-700 mt-1 space-y-1">
                          {data.companyInfo.workingHours.morning && (
                            <p>{data.companyInfo.workingHours.morning}</p>
                          )}
                          {data.companyInfo.workingHours.afternoon && (
                            <p>{data.companyInfo.workingHours.afternoon}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* Google Maps */}
              {data.googleMaps?.embedUrl && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">Vị Trí Trên Bản Đồ</h3>
                  <div className="rounded-lg overflow-hidden h-64">
                    <iframe
                      src={data.googleMaps.embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps"
                    ></iframe>
                  </div>
                  {data.googleMaps.directionsUrl && (
                    <a
                      href={data.googleMaps.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Chỉ Đường
                    </a>
                  )}
                </div>
              )}

              {/* Divider */}
              {data.faq && data.faq.length > 0 && <hr className="border-gray-200" />}

              {/* FAQ */}
              {data.faq && data.faq.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">Câu Hỏi Thường Gặp</h3>
                  <div className="space-y-2">
                    {data.faq.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-medium text-gray-800 text-left">
                            {item.question}
                          </span>
                          {expandedFaqIndex === index ? (
                            <ChevronUp className="text-green-600 flex-shrink-0" size={20} />
                          ) : (
                            <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                          )}
                        </button>
                        {expandedFaqIndex === index && (
                          <div className="p-4 bg-white border-t border-gray-200">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Không thể tải thông tin liên hệ
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
