import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/globals/footer-info`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch footer info: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching footer info:', error);
    
    // Return default data if API fails
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch footer info',
      data: null,
    }, { status: 500 });
  }
}
