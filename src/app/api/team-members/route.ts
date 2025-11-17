import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/team-members?limit=100&sort=order`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter only active members
    const activeMembers = data.docs?.filter((member: any) => member.isActive !== false) || [];

    return NextResponse.json({
      success: true,
      members: activeMembers,
      total: activeMembers.length,
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
