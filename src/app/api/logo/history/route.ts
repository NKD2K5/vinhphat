import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// GET - Fetch logo history
export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/logo-history?sort=-timestamp&limit=20`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch logo history: ${response.status}`);
    }

    const data = await response.json();
    
    // Format the data to include user information
    const formattedHistory = await Promise.all(
      data.docs.map(async (item: any) => {
        let userInfo = { name: 'Unknown', email: 'unknown@example.com' };
        
        if (item.changedBy) {
          try {
            const userResponse = await fetch(`${PAYLOAD_URL}/api/users/${item.changedBy}`, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              userInfo = {
                name: userData.name || 'Unknown',
                email: userData.email || 'unknown@example.com',
              };
            }
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }

        return {
          id: item.id,
          action: item.action,
          logoUrl: item.logoUrl,
          alt: item.alt,
          filename: item.filename,
          timestamp: item.timestamp,
          changedBy: userInfo,
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      data: formattedHistory,
    });
  } catch (error) {
    console.error('Error fetching logo history:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Không thể tải lịch sử logo',
      data: [],
    }, { status: 500 });
  }
}
