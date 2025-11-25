import { NextResponse } from 'next/server';

// Disable cache for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Default navigation items
const defaultNavigation = [
  { label: 'Trang Chủ', link: '/' },
  { label: 'Dịch Vụ', link: '/dich-vu' },
  { label: 'Sản Phẩm', link: '/san-pham' },
  { label: 'Tin Tức', link: '/tin-tuc' },
  { label: 'Liên Hệ', link: '/lien-he' },
];

export async function GET() {
  try {
    // You can fetch from Payload CMS here if needed
    // For now, returning default navigation
    const mainNav = defaultNavigation;

    return NextResponse.json(
      { mainNav },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { mainNav: defaultNavigation, error: 'Using default navigation' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}
