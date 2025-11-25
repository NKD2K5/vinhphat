import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextAuthOptions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.redirect(new URL('/login?error=no_session', request.url));
    }

    const token = (session as any)?.payloadToken;
    
    if (!token) {
      return NextResponse.redirect(new URL('/login?error=no_token', request.url));
    }

    // Lưu token vào cookie an toàn (httpOnly, secure)
    const response = NextResponse.redirect(new URL('http://localhost:3001/admin', request.url));
    response.cookies.set('payload_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return response;
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
}
