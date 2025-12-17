import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !body.customerName || !body.customerPhone || !body.shippingAddress || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin đơn hàng hoặc giỏ hàng trống.' },
        { status: 400 },
      );
    }

    const response = await fetch(`${PAYLOAD_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data?.message || 'Không thể tạo đơn hàng trên máy chủ.' },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Lỗi không xác định khi tạo đơn hàng.' },
      { status: 500 },
    );
  }
}
