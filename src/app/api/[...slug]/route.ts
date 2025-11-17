import { NextRequest, NextResponse } from 'next/server';

// This route proxies all requests to Payload CMS server
// Payload runs separately on port 3001

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

async function proxyToPayload(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url);
    const payloadUrl = `${PAYLOAD_URL}${url.pathname}${url.search}`;

    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(payloadUrl, options);
    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error(`Payload ${method} Error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return proxyToPayload(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyToPayload(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyToPayload(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return proxyToPayload(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
  return proxyToPayload(request, 'PATCH');
}
