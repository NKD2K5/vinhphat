import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Handle getting navigation preferences
    console.log('Getting nav preferences');
    
    // Return default preferences or saved ones
    return NextResponse.json({
      collapsed: false,
      hiddenCollections: [],
      customOrder: []
    });
  } catch (error) {
    console.error('Error getting payload preferences:', error);
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle saving navigation preferences
    console.log('Saving nav preferences:', body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving payload preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
