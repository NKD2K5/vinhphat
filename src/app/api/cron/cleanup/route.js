import { NextResponse } from 'next/server';

/**
 * Cron Job Endpoint - Cleanup unused images
 * 
 * Cách sử dụng:
 * 1. Manual: Gọi GET https://your-domain.com/api/cron/cleanup?secret=YOUR_SECRET
 * 2. Cron service: Cấu hình trên Vercel Cron hoặc cron-job.org
 * 
 * Khuyến nghị: Chạy 1 lần/tuần vào lúc ít traffic (VD: Chủ nhật 2AM)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Kiểm tra secret
    if (secret !== process.env.CLEANUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret' },
        { status: 401 }
      );
    }

    console.log('[CRON] Starting image cleanup job...');
    const startTime = Date.now();

    // Gọi cleanup API
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const cleanupResponse = await fetch(`${baseUrl}/api/cleanup-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secret: process.env.CLEANUP_SECRET }),
    });

    if (!cleanupResponse.ok) {
      throw new Error('Cleanup API failed');
    }

    const result = await cleanupResponse.json();
    const duration = Date.now() - startTime;

    console.log('[CRON] Cleanup completed:', result.stats);
    console.log('[CRON] Duration:', duration, 'ms');

    // Log vào database (optional)
    try {
      const payload = (await import('payload')).default;
      
      if (!payload.initialized) {
        await payload.init({
          secret: process.env.PAYLOAD_SECRET,
          mongoURL: process.env.MONGODB_URI,
          local: true,
        });
      }

      // Tạo collection để log cleanup history (nếu muốn)
      // await payload.create({
      //   collection: 'cleanup-logs',
      //   data: {
      //     timestamp: new Date(),
      //     stats: result.stats,
      //     deletedImages: result.deletedImages,
      //     duration,
      //   },
      // });

    } catch (logError) {
      console.error('[CRON] Failed to log cleanup:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Cleanup job completed successfully',
      stats: result.stats,
      deletedCount: result.deletedImages?.length || 0,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[CRON] Cleanup job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint (same as GET for flexibility)
 */
export async function POST(request) {
  const { secret } = await request.json();
  
  // Redirect to GET with secret as query param
  const url = new URL(request.url);
  url.searchParams.set('secret', secret);
  
  return GET(new Request(url));
}
