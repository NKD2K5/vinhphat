import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/about-page?limit=1`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch about page: ${response.statusText}`);
    }

    const data = await response.json();
    
    const aboutPage = data.docs?.[0] || null;

    return NextResponse.json({
      success: true,
      aboutPage: aboutPage,
    });
  } catch (error) {
    console.error('Error fetching about page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about page' },
      { status: 500 }
    );
  }
}
