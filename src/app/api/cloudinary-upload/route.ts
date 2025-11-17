import { NextRequest, NextResponse } from 'next/server';

// C# API URL
const CSHARP_API_URL = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118/api';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Forward the request to C# API
    const csharpFormData = new FormData();
    csharpFormData.append('file', file);
    csharpFormData.append('folder', folder);

    console.log(`📤 Uploading to C# API: ${CSHARP_API_URL}/Upload`);

    const response = await fetch(`${CSHARP_API_URL}/Upload`, {
      method: 'POST',
      body: csharpFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('C# API error:', errorText);
      return NextResponse.json(
        { success: false, error: errorText || 'Upload failed' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ Upload successful:', result);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url || result.secureUrl,
        secureUrl: result.secureUrl || result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

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

    console.log(`🗑️ Deleting via C# API: ${publicId}`);

    // Forward delete request to C# API
    const response = await fetch(`${CSHARP_API_URL}/Upload/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('C# API delete error:', errorText);
      return NextResponse.json(
        { success: false, error: errorText || 'Delete failed' },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`✅ Deleted successfully: ${publicId}`);

    return NextResponse.json({
      success: result.success !== false,
      result: result,
    });
  } catch (error: any) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}
