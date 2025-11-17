import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site branding: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching site branding:', error);
    
    // Return default data if API fails
    return NextResponse.json({
      success: false,
      data: {
        logo: {
          alt: 'VinhPhat Printing Logo',
          width: 180,
          height: 50,
        },
        logoMobile: {
          enabled: false,
          width: 120,
          height: 35,
        },
        siteInfo: {
          siteName: 'VinhPhat Printing',
          tagline: 'Dịch vụ in ấn chuyên nghiệp',
          description: 'VinhPhat Printing - Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.',
        },
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#F59E0B',
        },
      },
    });
  }
}
