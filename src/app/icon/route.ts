import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  // Return a 204 No Content response for the icon route
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Content-Type': 'image/x-icon',
    },
  });
}

export const dynamicParams = true;
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
