import { NextRequest, NextResponse } from 'next/server';

// This file replaces the deprecated middleware.ts
// It handles caching rules for specific routes

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();
  
  // Pages that should never be cached
  const noCachePages = [
    '/tin-tuc',
    '/dich-vu', 
    '/contact',
    '/ve-chung-toi',
    '/about',
    '/checkout',
    '/gio-hang',
    '/san-pham'
  ];
  
  const pathname = request.nextUrl.pathname;
  
  // Check if current path starts with any no-cache page
  if (noCachePages.some(page => pathname.startsWith(page))) {
    // Set strong no-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};
