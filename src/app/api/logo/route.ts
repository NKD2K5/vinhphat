import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';
const LOGO_DIR = join(process.cwd(), 'public', 'assets', 'logo');
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Helper function to ensure logo directory exists
async function ensureLogoDir() {
  if (!existsSync(LOGO_DIR)) {
    await mkdir(LOGO_DIR, { recursive: true });
  }
}

// Helper function to validate SVG file
function validateSVGFile(buffer: Buffer): { isValid: boolean; error?: string } {
  // Check file size
  if (buffer.length > MAX_FILE_SIZE) {
    return { isValid: false, error: 'File vượt quá 2MB' };
  }

  // Check MIME type by looking at file content
  const content = buffer.toString('utf8', 0, Math.min(1000, buffer.length));
  
  // Check if it's actually an SVG file
  if (!content.includes('<svg') && !content.includes('<?xml')) {
    return { isValid: false, error: 'Chỉ chấp nhận file định dạng SVG' };
  }

  // Additional SVG validation
  const svgRegex = /^\s*<\?xml[^>]*\?>\s*<svg[^>]*>/i;
  const simpleSvgRegex = /^\s*<svg[^>]*>/i;
  
  if (!svgRegex.test(content) && !simpleSvgRegex.test(content)) {
    return { isValid: false, error: 'File không phải là SVG hợp lệ' };
  }

  return { isValid: true };
}

// Helper function to generate unique filename
function generateFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const nameWithoutExt = originalName.replace(/\.svg$/i, '');
  return `${nameWithoutExt}_${timestamp}_${random}.svg`;
}

// GET - Fetch current logo
export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/globals/site-branding?t=${Date.now()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site branding: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw Payload data:', JSON.stringify(data, null, 2));
    
    // Transform Payload CMS data to expected format
    const transformedData = {
      logo: {
        imageUrl: data.logo?.primary || '',
        imageUrlDark: '', // không còn logo phụ
        alt: 'VinhPhat Printing Logo',
        displayMode: 'auto',
        width: 200,
        height: 56,
        maxWidth: 200,
        maxHeight: 56,
      },
      logoMobile: {
        enabled: !!data.logo?.mobileLogo,
        imageUrl: data.logo?.mobileLogo || '',
        imageUrlDark: '',
        width: 160,
        height: 48,
        customWidth: 140,
        customHeight: 42,
      },
      siteInfo: {
        siteName: data.siteName || 'VinhPhat Printing',
        tagline: data.siteDescription || 'Dịch vụ in ấn chuyên nghiệp',
        description: data.siteDescription || 'VinhPhat Printing - Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.',
      },
    };
    
    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
    
    return NextResponse.json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error fetching logo:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Không thể tải thông tin logo',
      data: null,
    }, { status: 500 });
  }
}

// POST - Upload new logo
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string || 'VinhPhat Printing Logo';
    const isDarkLogo = formData.get('isDarkLogo') === 'true'; // Check if this is for dark background
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Vui lòng chọn file logo',
      }, { status: 400 });
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.svg')) {
      return NextResponse.json({
        success: false,
        error: 'Chỉ chấp nhận file định dạng SVG',
      }, { status: 400 });
    }

    // Convert file to buffer for validation
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Validate SVG content
    const validation = validateSVGFile(buffer);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
      }, { status: 400 });
    }

    // Generate unique filename and save file
    const filename = generateFilename(file.name);
    const filepath = join(LOGO_DIR, filename);
    
    // Ensure logo directory exists
    await ensureLogoDir();
    
    await writeFile(filepath, buffer);

    // Update Payload CMS with new logo URL
    const logoUrl = `/assets/logo/${filename}`;
    
    // Get current logo data first
    const currentResponse = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`);
    if (!currentResponse.ok) {
      console.error('Failed to fetch current logo data:', currentResponse.status, currentResponse.statusText);
      throw new Error(`Failed to fetch current logo data: ${currentResponse.status}`);
    }
    const currentData = await currentResponse.json();
    console.log('Current logo data:', JSON.stringify(currentData, null, 2));
    
    // Determine which field to update
    const logoUpdate = isDarkLogo 
      ? { ...currentData.logo, imageUrlDark: logoUrl, alt }
      : { ...currentData.logo, imageUrl: logoUrl, alt };
    
    console.log('Logo update payload:', JSON.stringify(logoUpdate, null, 2));
    
    const payloadResponse = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logo: logoUpdate,
      }),
    });

    if (!payloadResponse.ok) {
      const errorText = await payloadResponse.text();
      console.error('Payload CMS update failed:', {
        status: payloadResponse.status,
        statusText: payloadResponse.statusText,
        errorText: errorText,
        requestBody: JSON.stringify({ logo: logoUpdate }, null, 2)
      });
      
      // If Payload update fails, try to delete the uploaded file
      try {
        await deleteFile(filepath);
      } catch (deleteError) {
        console.error('Failed to cleanup file after Payload error:', deleteError);
      }
      
      throw new Error(`Failed to update logo in CMS: ${payloadResponse.status} - ${errorText}`);
    }

    const responseData = await payloadResponse.json();
    console.log('Payload CMS update successful:', JSON.stringify(responseData, null, 2));

    // Log the change to LogoHistory
    try {
      const historyResponse = await fetch(`${PAYLOAD_URL}/api/logo-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'upload',
          logoUrl,
          alt: alt,
          filename: filename,
          fileSize: buffer.length,
          dimensions: {
            width: 200, // Default width, will be updated by display settings
            height: 72, // Default height
            displayMode: 'auto',
          },
          changedBy: null, // Will be set by hook based on authenticated user
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          notes: 'Uploaded via Logo Management Interface',
        }),
      });

      if (!historyResponse.ok) {
        console.error('Failed to log logo change to history:', historyResponse.status);
      }
    } catch (historyError) {
      console.error('Error logging logo change:', historyError);
    }

    console.log(`Logo updated: ${logoUrl} (${isDarkLogo ? 'dark' : 'light'} version) by user at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      message: `Logo ${isDarkLogo ? 'cho nền đen' : 'cho nền trắng'} đã được cập nhật thành công`,
      data: {
        logoUrl,
        alt,
        filename,
        isDarkLogo,
      },
    });

  } catch (error) {
    console.error('Error uploading logo:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra, vui lòng thử lại',
    }, { status: 500 });
  }
}

// PATCH - Update logo settings (alt text, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      alt, 
      displayMode, 
      width, 
      height, 
      maxWidth, 
      maxHeight,
      imageUrlDark, // Thêm trường cho logo nền đen
      logoMobile // Thêm cấu hình cho mobile logo
    } = body;

    // Get current logo data first
    const currentResponse = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`);
    if (!currentResponse.ok) {
      throw new Error('Failed to fetch current logo data');
    }
    
    const currentData = await currentResponse.json();

    // Update only provided fields
    const updatedLogo = {
      ...currentData.logo,
      ...(alt !== undefined && { alt }),
      ...(displayMode !== undefined && { displayMode }),
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
      ...(maxWidth !== undefined && { maxWidth }),
      ...(maxHeight !== undefined && { maxHeight }),
      ...(imageUrlDark !== undefined && { imageUrlDark }),
    };

    // Update logoMobile if provided
    const updatedLogoMobile = logoMobile 
      ? { ...currentData.logoMobile, ...logoMobile }
      : currentData.logoMobile;

    const payloadResponse = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logo: updatedLogo,
        logoMobile: updatedLogoMobile,
      }),
    });

    if (!payloadResponse.ok) {
      throw new Error(`Failed to update logo settings: ${payloadResponse.status}`);
    }

    console.log('Logo settings updated:', updatedLogo);

    const response = NextResponse.json({
      success: true,
      message: 'Cài đặt logo đã được cập nhật',
      data: updatedLogo,
    });

    // Add header to trigger client-side refresh
    response.headers.set('X-Logo-Updated', 'true');
    
    return response;

  } catch (error) {
    console.error('Error updating logo settings:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Không thể cập nhật cài đặt logo',
    }, { status: 500 });
  }
}

// DELETE - Restore default logo
export async function DELETE(req: NextRequest) {
  try {
    const defaultLogoUrl = 'https://res.cloudinary.com/da21jhapz/image/upload/f_auto,q_auto:best/v1767188237/vinhphat/general/Đen_Trắng_Tối_Giản_Studio_Sáng_Tạo_Logo_1_jvrnhw.png';
    
    const payloadResponse = await fetch(`${PAYLOAD_URL}/api/globals/site-branding`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logo: {
          imageUrl: defaultLogoUrl,
          alt: 'VinhPhat Printing Logo',
          displayMode: 'auto',
          width: 240,
          height: 72,
          maxWidth: 280,
          maxHeight: 80,
        },
      }),
    });

    if (!payloadResponse.ok) {
      throw new Error(`Failed to restore default logo: ${payloadResponse.status}`);
    }

    console.log(`Logo restored to default at ${new Date().toISOString()}`);

    // Log the restore action to LogoHistory
    try {
      const historyResponse = await fetch(`${PAYLOAD_URL}/api/logo-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'restore',
          logoUrl: defaultLogoUrl,
          alt: 'VinhPhat Printing Logo',
          filename: 'default-logo.png',
          fileSize: 0,
          dimensions: {
            width: 200,
            height: 72,
            displayMode: 'auto',
          },
          changedBy: null, // Will be set by hook based on authenticated user
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          notes: 'Restored default logo',
        }),
      });

      if (!historyResponse.ok) {
        console.error('Failed to log logo restore to history:', historyResponse.status);
      }
    } catch (historyError) {
      console.error('Error logging logo restore:', historyError);
    }

    return NextResponse.json({
      success: true,
      message: 'Logo đã được khôi phục về mặc định',
      data: {
        logoUrl: defaultLogoUrl,
      },
    });

  } catch (error) {
    console.error('Error restoring default logo:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Không thể khôi phục logo mặc định',
    }, { status: 500 });
  }
}

// Helper function to delete file (cleanup)
async function deleteFile(filepath: string) {
  try {
    const fs = require('fs').promises;
    await fs.unlink(filepath);
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
}
