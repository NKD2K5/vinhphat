import { NextResponse } from 'next/server';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const response = await fetch(`${PAYLOAD_URL}/api/about-page?limit=1`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn('Payload CMS not available, using fallback data');
      // Return fallback data when Payload CMS is not available
      return NextResponse.json({
        success: true,
        aboutPage: {
          title: 'Về Chúng Tôi - VinhPhat Printing',
          companyStory: {
            root: {
              children: [
                {
                  children: [
                    {
                      text: 'VinhPhat Printing là công ty in ấn hàng đầu tại Việt Nam với hơn 15 năm kinh nghiệm trong ngành. Chúng tôi tự hào mang đến những giải pháp in ấn chất lượng cao, đáp ứng mọi nhu cầu của khách hàng từ cá nhân đến doanh nghiệp.'
                    }
                  ],
                  type: 'paragraph'
                },
                {
                  children: [
                    {
                      text: 'Với đội ngũ kỹ thuật viên tay nghề cao và trang thiết bị hiện đại, chúng tôi cam kết mang đến sản phẩm hoàn hảo với giá cả cạnh tranh nhất.'
                    }
                  ],
                  type: 'paragraph'
                }
              ]
            }
          },
          mission: 'Cung cấp giải pháp in ấn toàn diện, chất lượng cao và dịch vụ khách hàng xuất sắc.',
          vision: 'Trở thành công ty in ấn hàng đầu khu vực Đông Nam Á.',
          values: [
            'Chất lượng hàng đầu',
            'Uy tín và trách nhiệm',
            'Đổi mới sáng tạo',
            'Khách hàng là trung tâm'
          ]
        }
      });
    }

    const data = await response.json();
    
    const aboutPage = data.docs?.[0] || null;

    // If no data found, return fallback
    if (!aboutPage) {
      console.warn('No about page data found, using fallback');
      return NextResponse.json({
        success: true,
        aboutPage: {
          title: 'Về Chúng Tôi - VinhPhat Printing',
          companyStory: {
            root: {
              children: [
                {
                  children: [
                    {
                      text: 'VinhPhat Printing là công ty in ấn hàng đầu tại Việt Nam với hơn 15 năm kinh nghiệm trong ngành.'
                    }
                  ],
                  type: 'paragraph'
                }
              ]
            }
          },
          mission: 'Cung cấp giải pháp in ấn toàn diện, chất lượng cao.',
          vision: 'Trở thành công ty in ấn hàng đầu khu vực Đông Nam Á.',
          values: ['Chất lượng hàng đầu', 'Uy tín và trách nhiệm']
        }
      });
    }

    return NextResponse.json({
      success: true,
      aboutPage: aboutPage,
    });
  } catch (error) {
    console.error('Error fetching about page:', error);
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      aboutPage: {
        title: 'Về Chúng Tôi - VinhPhat Printing',
        companyStory: {
          root: {
            children: [
              {
                children: [
                  {
                    text: 'VinhPhat Printing là công ty in ấn hàng đầu tại Việt Nam với hơn 15 năm kinh nghiệm trong ngành.'
                  }
                ],
                type: 'paragraph'
              }
            ]
          }
        },
        mission: 'Cung cấp giải pháp in ấn toàn diện, chất lượng cao.',
        vision: 'Trở thành công ty in ấn hàng đầu khu vực Đông Nam Á.',
        values: ['Chất lượng hàng đầu', 'Uy tín và trách nhiệm']
      }
    });
  }
}
