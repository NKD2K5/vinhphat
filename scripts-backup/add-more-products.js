require('dotenv').config();
const axios = require('axios');

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

// Additional product templates (6-10)
const additionalTemplates = [
  {
    suffix: 'Premium',
    description: 'Sản phẩm in ấn cao cấp nhất, chất liệu đặc biệt',
    price: 'Từ 150.000đ',
  },
  {
    suffix: 'Tiết Kiệm',
    description: 'Sản phẩm in ấn tiết kiệm, phù hợp với ngân sách nhỏ',
    price: 'Từ 10.000đ',
  },
  {
    suffix: 'Sang Trọng',
    description: 'Sản phẩm in ấn sang trọng, thiết kế tinh tế',
    price: 'Từ 120.000đ',
  },
  {
    suffix: 'Nhanh',
    description: 'Sản phẩm in ấn nhanh, giao hàng trong 24h',
    price: 'Từ 40.000đ',
  },
  {
    suffix: 'Số Lượng Lớn',
    description: 'Sản phẩm in ấn số lượng lớn, giá ưu đãi',
    price: 'Từ 20.000đ',
  },
];

// Sample images
const sampleImages = [
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
  'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=800&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
];

function getRandomImage() {
  return sampleImages[Math.floor(Math.random() * sampleImages.length)];
}

async function addMoreProducts() {
  try {
    console.log('🌱 Adding 5 more products per service...\n');

    // Fetch all service categories
    const categoriesResponse = await axios.get(`${PAYLOAD_URL}/api/service-categories?limit=100`);
    const categories = categoriesResponse.data.docs;

    // Fetch all services
    const servicesResponse = await axios.get(`${PAYLOAD_URL}/api/service-items?limit=100`);
    const services = servicesResponse.data.docs;

    console.log(`✅ Found ${services.length} services\n`);

    let totalCreated = 0;
    
    for (const service of services) {
      console.log(`📝 Adding products for: ${service.name}`);
      
      const serviceCategory = categories.find(cat => cat.slug === service.category);
      
      if (!serviceCategory) {
        console.log(`⚠️  No category found for service: ${service.name}`);
        continue;
      }

      for (let i = 0; i < 5; i++) {
        const template = additionalTemplates[i];
        const productName = `${service.name} ${template.suffix}`;
        const slug = `${service.slug}-${template.suffix.toLowerCase().replace(/\s+/g, '-')}`;

        const productData = {
          name: productName,
          slug: slug,
          description: [
            {
              children: [
                {
                  text: template.description,
                },
              ],
            },
          ],
          serviceCategory: serviceCategory.id,
          service: service.id,
          price: template.price,
          image: getRandomImage(),
          gallery: [],
          isFeatured: false,
        };

        try {
          await axios.post(`${PAYLOAD_URL}/api/products`, productData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log(`  ✅ Created: ${productName}`);
          totalCreated++;
        } catch (error) {
          if (error.response?.data?.errors) {
            console.log(`  ⚠️  Skipped: ${productName} (already exists)`);
          } else {
            console.error(`  ❌ Error creating ${productName}:`, error.message);
          }
        }
      }
    }

    console.log(`\n✅ Completed!`);
    console.log(`📊 Total products created: ${totalCreated}`);
    console.log(`📊 Total services: ${services.length}`);
    console.log(`📊 Expected new products: ${services.length * 5}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

addMoreProducts();
