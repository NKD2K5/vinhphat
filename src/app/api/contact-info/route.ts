import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/globals/contact-info`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contact info: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    
    // Return default data if API fails
    return NextResponse.json({
      success: false,
      data: {
        companyInfo: {
          address: 'Khu công nghiệp Thạch Khôi, Hải Dương, Việt Nam',
          phone: '0977 344 567',
          email: 'invinhphat2025@gmail.com',
          workingHours: {
            days: 'Thứ Hai – Chủ Nhật',
            morning: 'Sáng 7:00–11:00',
            afternoon: 'Chiều 8:00–12:00',
          },
        },
        googleMaps: {
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3728.526365454746!2d106.2995123153738!3d20.94026299422636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a8e9a7e1f0c5d%3A0x7f8f6c1a1c3b3e1f!2sKhu%20C%C3%B4ng%20Nghi%E1%BB%87p%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Ph%C6%B0%E1%BB%9Dng%20Th%E1%BA%A1ch%20Kh%C3%B4i%2C%20Th%C3%A0nh%20Ph%E1%BB%91%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%2C%20Vi%E1%BB%87t%20Nam!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s',
          directionsUrl: 'https://www.google.com/maps/place/Khu+C%C3%B4ng+Nghi%E1%BB%87p+Th%E1%BA%A1ch+Kh%C3%B4i',
        },
        socialMedia: {
          facebook: '#',
          twitter: '#',
          linkedin: '#',
          zalo: '#',
        },
        faq: [
          {
            question: 'Thời gian phản hồi liên hệ là bao lâu?',
            answer: 'Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.',
          },
          {
            question: 'Làm thế nào để đặt lịch hẹn trực tiếp?',
            answer: 'Bạn có thể gọi điện trực tiếp đến số 0977 344 567 hoặc điền vào form liên hệ để đặt lịch hẹn.',
          },
        ],
      },
    });
  }
}
