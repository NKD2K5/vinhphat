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

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data,
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
