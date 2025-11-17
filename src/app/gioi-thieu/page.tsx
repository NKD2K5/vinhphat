import React from 'react';
import Image from 'next/image';
import { draftMode } from 'next/headers';
import PreviewBanner from '../components/PreviewBanner';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// Helper to get image URL
function getImageUrl(image: any): string {
  if (!image) return '';
  if (typeof image === 'object' && image.filename) {
    return `${PAYLOAD_URL}/media/${image.filename}`;
  }
  if (typeof image === 'string') {
    return `${PAYLOAD_URL}/media/${image}`;
  }
  return '';
}

// Fetch About data from Payload CMS
async function getAboutData(isDraft = false) {
  try {
    const draftParam = isDraft ? '&draft=true' : '';
    const response = await fetch(`${PAYLOAD_URL}/api/about-page?limit=1${draftParam}`, {
      next: { revalidate: isDraft ? 0 : 60 }, // No cache for draft mode
      cache: isDraft ? 'no-store' : 'default',
    });

    if (!response.ok) {
      console.error('Failed to fetch About data');
      return null;
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching About data:', error);
    return null;
  }
}

export default async function GioiThieuPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const aboutData = await getAboutData(isDraftMode);

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy thông tin
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Vui lòng quay lại trang chủ và nhấn "Thông tin chi tiết" để xem nội dung.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  const descriptionText = aboutData.description?.[0]?.children?.[0]?.text || '';
  const imageUrl = getImageUrl(aboutData.image);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {isDraftMode && <PreviewBanner />}
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {aboutData.title}
            </h1>
            <div className="h-1 w-24 mx-auto bg-blue-600 rounded-full mb-8"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image */}
            {imageUrl && (
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl}
                  alt={aboutData.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className={imageUrl ? '' : 'md:col-span-2'}>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {descriptionText}
                </p>
              </div>

              {/* Buttons */}
              {(aboutData.primaryButton || aboutData.secondaryButton) && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  {aboutData.primaryButton && (
                    <a
                      href={aboutData.primaryButton.link}
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      {aboutData.primaryButton.text}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                  {aboutData.secondaryButton && (
                    <a
                      href={aboutData.secondaryButton.link}
                      className="inline-flex items-center justify-center bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
                    >
                      {aboutData.secondaryButton.text}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại trang chủ
          </a>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Giới Thiệu - VinhPhat Printing',
  description: 'Tìm hiểu về VinhPhat Printing - Đối tác in ấn đáng tin cậy',
};
