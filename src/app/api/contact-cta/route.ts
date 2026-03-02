import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    // ContactCTA is now a global, not a collection
    const timestamp = Date.now();
    const response = await fetch(`${PAYLOAD_URL}/api/globals/contact-cta?t=${timestamp}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch contact CTA: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      cta: data || null,
    });
  } catch (error) {
    console.error('Error fetching contact CTA:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact CTA' },
      { status: 500 }
    );
  }
}
