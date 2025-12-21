require('dotenv').config({ path: '.env.local' });
const payload = require('payload');

// Tạo 20 sản phẩm demo cho collection `products`
function buildDemoProducts(serviceCategoryId, serviceId) {
  const baseDescriptions = [
    'Dịch vụ in ấn chất lượng cao, phù hợp cho doanh nghiệp vừa và nhỏ.',
    'Ứng dụng công nghệ in hiện đại, màu sắc chuẩn và sắc nét.',
    'Phù hợp cho chiến dịch marketing, sự kiện và truyền thông thương hiệu.',
  ];

  // Danh sách ảnh demo (Unsplash) dùng chung cho các sản phẩm
  const demoImages = [
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1000&q=80',
  ];

  const products = [];

  for (let i = 1; i <= 20; i++) {
    const name = `Sản phẩm in ấn demo #${i}`;
    const slug = `san-pham-in-an-demo-${i}`;
    const shortDesc = baseDescriptions[(i - 1) % baseDescriptions.length];
    const imageUrl = demoImages[(i - 1) % demoImages.length];

    products.push({
      name,
      slug,
      description: [
        {
          type: 'paragraph',
          children: [{ text: shortDesc }],
        },
      ],
      serviceCategory: serviceCategoryId,
      service: serviceId,
      price: 'Liên hệ để báo giá',
      image: imageUrl,
      gallery: [
        { image: imageUrl },
        { image: demoImages[(i) % demoImages.length] },
        { image: demoImages[(i + 1) % demoImages.length] },
        { image: demoImages[(i + 2) % demoImages.length] },
      ],
      specifications: {
        material: 'Giấy couche 150gsm',
        size: 'A4 / A5 tuỳ chọn',
        colors: 'In 4 màu CMYK',
        printing: 'In offset hoặc in kỹ thuật số',
        quantity: 'Từ 100 bản trở lên',
        finishing: 'Cán mờ / cán bóng, bế gấp theo yêu cầu',
      },
      detailedInfo: [
        {
          type: 'paragraph',
          children: [
            {
              text:
                'Sản phẩm in ấn demo được thiết kế để minh hoạ cách hiển thị dữ liệu trong website VinhPhat Printing.',
            },
          ],
        },
      ],
      features: [
        { feature: 'Màu sắc sắc nét, trung thực' },
        { feature: 'Thời gian sản xuất nhanh chóng' },
        { feature: 'Hỗ trợ thiết kế file in nếu cần' },
      ],
      isFeatured: i <= 6, // 6 sản phẩm đầu hiển thị trang chủ
    });
  }

  return products;
}

async function seedProductsDemo() {
  try {
    console.log('🌱 Khởi động seed 20 sản phẩm demo (products)...');

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGODB_URI,
      local: true,
    });

    console.log('✅ Payload đã khởi tạo, tìm service-category và service-item bất kỳ...');

    // Lấy 1 service-category bất kỳ (ưu tiên isActive=true)
    const categories = await payload.find({
      collection: 'service-categories',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 1,
    });

    if (!categories.docs || categories.docs.length === 0) {
      console.error('❌ Không tìm thấy danh mục dịch vụ (service-categories). Hãy tạo ít nhất 1 cái trong admin trước.');
      process.exit(1);
    }

    const serviceCategoryId = categories.docs[0].id;
    console.log('📂 Dùng serviceCategory ID:', serviceCategoryId, '–', categories.docs[0].name);

    // Lấy 1 service-item bất kỳ (service-items)
    const services = await payload.find({
      collection: 'service-items',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 1,
    });

    if (!services.docs || services.docs.length === 0) {
      console.error('❌ Không tìm thấy dịch vụ (service-items). Hãy tạo ít nhất 1 dịch vụ trong admin trước.');
      process.exit(1);
    }

    const serviceId = services.docs[0].id;
    console.log('🛠 Dùng service ID:', serviceId, '–', services.docs[0].name);

    const demoProducts = buildDemoProducts(serviceCategoryId, serviceId);

    console.log('📦 Bắt đầu tạo/cập nhật 20 sản phẩm demo...');

    for (const product of demoProducts) {
      // Kiểm tra trùng slug để tránh tạo lại nhiều lần
      const existing = await payload.find({
        collection: 'products',
        where: {
          slug: {
            equals: product.slug,
          },
        },
        limit: 1,
      });

      if (existing.docs && existing.docs.length > 0) {
        console.log(`🔁 Đã tồn tại: ${product.slug}, tiến hành update...`);
        await payload.update({
          collection: 'products',
          id: existing.docs[0].id,
          data: product,
        });
      } else {
        console.log(`➕ Tạo mới: ${product.slug}...`);
        await payload.create({
          collection: 'products',
          data: product,
        });
      }
    }

    console.log('✅ Seed 20 sản phẩm demo hoàn tất!');
    console.log('\n👉 Bạn có thể vào: http://localhost:3001/admin/collections/products để xem và chỉnh sửa.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khi seed sản phẩm demo:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedProductsDemo();
}
