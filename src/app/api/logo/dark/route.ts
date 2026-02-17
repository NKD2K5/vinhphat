import { NextRequest, NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// POST - Cập nhật logo nền đen trực tiếp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrlDark } = body;

    if (!imageUrlDark) {
      return NextResponse.json({
        success: false,
        error: 'Vui lòng cung cấp imageUrlDark',
      }, { status: 400 });
    }

    // Lấy data hiện tại
    const currentResponse = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`);
    if (!currentResponse.ok) {
      throw new Error(`Failed to fetch current data: ${currentResponse.status}`);
    }
    const currentData = await currentResponse.json();

    // Cập nhật chỉ trường imageUrlDark
    const updatedData = {
      ...currentData,
      logo: {
        ...currentData.logo,
        imageUrlDark: imageUrlDark
      }
    };

    console.log('Updating dark logo:', { imageUrlDark });

    // Trigger logo update event cho client-side
    const response = NextResponse.json({
      success: true,
      message: 'Logo nền đen đã được cập nhật thành công',
      data: updatedData,
    });

    // Add headers để trigger client-side refresh
    response.headers.set('X-Logo-Updated', 'true');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return response;

  } catch (error) {
    console.error('Error updating dark logo:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Không thể cập nhật logo nền đen',
    }, { status: 500 });
  }
}

// GET - Lấy logo nền đen hiện tại
export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo data: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: {
        imageUrlDark: data.logo?.imageUrlDark || null
      },
    });

  } catch (error) {
    console.error('Error fetching dark logo:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Không thể tải logo nền đen',
      data: { imageUrlDark: null }
    }, { status: 500 });
  }
}
