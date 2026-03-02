import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/globals/floating-buttons`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch floating buttons: ${response.status}`);
    }

    const cmsData = await response.json();
    
    // Chuyển đổi dữ liệu từ CMS sang cấu trúc frontend mong đợi
    const transformedData = {
      enabled: cmsData.enabled !== false,
      buttons: [
        {
          type: 'phone',
          label: 'Gọi ngay',
          url: `tel:${cmsData.hotlinePhone || '0912345678'}`,
          backgroundColor: '#25D366',
          enabled: true,
        },
        {
          type: 'messenger',
          label: 'Messenger',
          url: cmsData.messengerUrl || 'https://m.me/vinhphatprinting',
          backgroundColor: '#0084FF',
          enabled: true,
        },
        {
          type: 'zalo',
          label: 'Zalo',
          url: `https://zalo.me/${cmsData.zaloPhone || '0912345678'}`,
          backgroundColor: '#0068FF',
          enabled: true,
        },
        {
          type: 'gmail',
          label: 'Email',
          url: `mailto:${cmsData.emailAddress || 'info@vinhphatprinting.com'}`,
          backgroundColor: '#EA4335',
          enabled: true,
        },
        {
          type: 'website',
          label: 'Bản đồ',
          url: cmsData.mapUrl || 'https://maps.google.com/?q=VinhPhat+Printing',
          backgroundColor: '#4A90E2',
          enabled: true,
        },
      ],
    };
    
    return NextResponse.json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching floating buttons:', error);
    
    // Return error instead of fallback data
    return NextResponse.json({
      success: false,
      error: error.message,
      data: null,
    }, { status: 500 });
  }
}
