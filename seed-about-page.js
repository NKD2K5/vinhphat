// For Node.js 18+, fetch is built-in
// For older versions, you might need: npm install node-fetch
// const fetch = require('node-fetch');

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3001';

const aboutPageData = {
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
  mission: 'Cung cấp giải pháp in ấn toàn diện, chất lượng cao và dịch vụ khách hàng xuất sắc, giúp khách hàng truyền tải thông điệp hiệu quả qua ấn phẩm in.',
  vision: 'Trở thành công ty in ấn hàng đầu khu vực Đông Nam Á, tiên phong trong công nghệ in ấn và giải pháp truyền thông đa phương tiện.',
  values: [
    'Chất lượng hàng đầu',
    'Uy tín và trách nhiệm',
    'Đổi mới sáng tạo',
    'Khách hàng là trung tâm'
  ],
  meta: {
    title: 'Về Chúng Tôi | VinhPhat Printing',
    description: 'Tìm hiểu về VinhPhat Printing - công ty in ấn chuyên nghiệp với hơn 15 năm kinh nghiệm, cam kết chất lượng và dịch vụ khách hàng xuất sắc.'
  }
};

async function seedAboutPage() {
  try {
    console.log('🌱 Seeding About Page data...');
    
    // Check if about page already exists
    const checkResponse = await fetch(`${PAYLOAD_URL}/api/about-page?limit=1`);
    
    if (checkResponse.ok) {
      const existingData = await checkResponse.json();
      
      if (existingData.docs && existingData.docs.length > 0) {
        console.log('✅ About Page already exists. Skipping seed.');
        return;
      }
    }
    
    // Create about page
    const response = await fetch(`${PAYLOAD_URL}/api/about-page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aboutPageData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ About Page seeded successfully:', result.doc.title);
    } else {
      console.error('❌ Failed to seed About Page:', await response.text());
    }
    
  } catch (error) {
    console.error('❌ Error seeding About Page:', error);
  }
}

seedAboutPage();
