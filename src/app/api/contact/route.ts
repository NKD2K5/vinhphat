import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let body: any;
    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileType: string = 'other';

    // Xử lý FormData (có file upload)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        company: formData.get('company') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      };

      const file = formData.get('file') as File | null;
      if (file) {
        try {
          // Upload file lên Cloudinary qua C# API
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);

          console.log('Uploading file to C# API:', process.env.CSHARP_API_URL + '/api/Upload');
          const uploadUrl = process.env.CSHARP_API_URL + '/api/Upload';

          // Chỉ tắt SSL verification trong môi trường không phải production
          const shouldDisableTLS = process.env.NODE_ENV !== 'production';
          const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

          if (shouldDisableTLS) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
          }

          const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: uploadFormData,
          });
          
          // Khôi phục lại setting nếu đã thay đổi
          if (shouldDisableTLS) {
            if (originalRejectUnauthorized !== undefined) {
              process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
            } else {
              delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
            }
          }
          
          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            console.log('Upload success:', uploadResult);
            fileUrl = uploadResult.url;
            fileName = file.name;
            
            // Xác định loại file
            if (file.type.startsWith('image/')) {
              fileType = 'image';
            } else if (file.type === 'application/pdf') {
              fileType = 'pdf';
            } else if (file.type.includes('document') || file.type.includes('word')) {
              fileType = 'document';
            }
          } else {
            const errorText = await uploadResponse.text();
            console.error('Upload failed:', uploadResponse.status, errorText);
          }
        } catch (uploadError) {
          console.error('File upload error (continuing without file):', uploadError);
          // Tiếp tục gửi form ngay cả khi upload file thất bại
        }
      }
    } else {
      // Xử lý JSON (không có file)
      body = await request.json();
    }
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Send to Payload CMS
    const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';
    const response = await fetch(`${payloadUrl}/api/contact-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        company: body.company || '',
        subject: body.subject || '',
        message: body.message,
        attachment: fileUrl || '',
        attachmentType: fileType,
        attachmentName: fileName || '',
        status: 'new',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Payload API error:', errorData);
      throw new Error('Failed to submit contact form');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
      data: data.doc,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { 
        error: 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại sau.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
