import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// POST - Lưu logo dark URL vào file config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrlDark } = body;

    if (!imageUrlDark) {
      return NextResponse.json({
        success: false,
        error: 'imageUrlDark is required',
      }, { status: 400 });
    }

    console.log('Saving dark logo URL:', imageUrlDark);

    // Lưu vào file config tạm
    const configDir = join(process.cwd(), 'config');
    const configFile = join(configDir, 'dark-logo.json');

    try {
      await mkdir(configDir, { recursive: true });
      await writeFile(configFile, JSON.stringify({
        imageUrlDark,
        updatedAt: new Date().toISOString()
      }, null, 2));

      console.log('Dark logo URL saved to file:', configFile);

      return NextResponse.json({
        success: true,
        message: 'Logo nền đen đã được lưu thành công',
        data: { imageUrlDark, configFile }
      });

    } catch (fileError) {
      console.error('Error saving config file:', fileError);
      return NextResponse.json({
        success: false,
        error: 'Không thể lưu file config',
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in save-dark API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

// GET - Đọc logo dark URL từ file config
export async function GET() {
  try {
    const configFile = join(process.cwd(), 'config', 'dark-logo.json');
    
    try {
      const fs = require('fs');
      const data = fs.readFileSync(configFile, 'utf8');
      const config = JSON.parse(data);
      
      return NextResponse.json({
        success: true,
        data: config
      });
    } catch (fileError) {
      // File không tồn tại
      return NextResponse.json({
        success: true,
        data: { imageUrlDark: null, updatedAt: null }
      });
    }

  } catch (error) {
    console.error('Error reading dark logo config:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Không thể đọc file config',
      data: { imageUrlDark: null }
    }, { status: 500 });
  }
}
