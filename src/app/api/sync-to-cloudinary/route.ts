import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary - ONLY on server-side
// TEMPORARY: Hardcoded values for testing (DO NOT COMMIT TO GIT!)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'da21jhapz',
  api_key: process.env.CLOUDINARY_API_KEY || '773795369182169',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'jMXSuYdIt9uOT9-tZVgTYutEAX8',
  secure: true,
});

const CLOUDINARY_FOLDERS = {
  products: 'vinhphat/products',
  news: 'vinhphat/news',
  banners: 'vinhphat/banners',
  users: 'vinhphat/users',
  media: 'vinhphat/media',
  general: 'vinhphat/general',
};

/**
 * POST /api/sync-to-cloudinary
 * Sync a local media file to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mediaId, filePath, folder = 'general' } = body;

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      );
    }

    // Get full file path
    const fullPath = path.join(process.cwd(), 'media', filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Upload to Cloudinary
    const cloudinaryFolder = CLOUDINARY_FOLDERS[folder as keyof typeof CLOUDINARY_FOLDERS] || CLOUDINARY_FOLDERS.general;
    
    const result = await cloudinary.uploader.upload(fullPath, {
      folder: cloudinaryFolder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
    });

    // Update media document in Payload (if mediaId provided)
    if (mediaId) {
      const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';
      await fetch(`${PAYLOAD_URL}/api/media/${mediaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cloudinaryPublicId: result.public_id,
          cloudinaryUrl: result.secure_url,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error: any) {
    console.error('Sync to Cloudinary error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/sync-to-cloudinary
 * Delete a file from Cloudinary
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return NextResponse.json({
      success: result.result === 'ok',
      result: result.result,
    });
  } catch (error: any) {
    console.error('Delete from Cloudinary error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
