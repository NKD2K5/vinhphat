const payload = require('payload');

const sampleProducts = [
  {
    slug: 'in-catalogue-premium',
    gallery: [
      { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80' },
    ],
    specifications: {
      material: 'Giấy couche cao cấp 150-250gsm',
      size: 'A4 (210x297mm), A5 (148x210mm)',
      colors: '4 màu CMYK, Pantone',
      printing: 'In offset chất lượng cao',
      quantity: 'Từ 100 bản trở lên',
      finishing: 'Cán màng bóng/mờ, đóng gáy xoắn/keo',
    },
    detailedInfo: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Catalogue là công cụ marketing quan trọng giúp doanh nghiệp giới thiệu sản phẩm, dịch vụ một cách chuyên nghiệp và ấn tượng. Với thiết kế đẹp mắt và nội dung hấp dẫn, catalogue không chỉ cung cấp thông tin mà còn tạo dấu ấn thương hiệu mạnh mẽ trong tâm trí khách hàng.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Chúng tôi cung cấp dịch vụ in catalogue với chất lượng cao nhất, sử dụng công nghệ in offset hiện đại, giấy couche cao cấp và mực in nhập khẩu. Đội ngũ thiết kế chuyên nghiệp sẽ hỗ trợ bạn tạo ra catalogue hoàn hảo, phù hợp với định hướng thương hiệu.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Quy trình in ấn được kiểm soát chặt chẽ từ khâu chuẩn bị file, hiệu chỉnh màu sắc, đến in ấn và gia công hoàn thiện. Mỗi catalogue được kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng.',
          },
        ],
      },
    ],
    features: [
      { feature: 'Chất lượng in ấn sắc nét, màu sắc chuẩn xác' },
      { feature: 'Giấy couche cao cấp, bền đẹp theo thời gian' },
      { feature: 'Đa dạng kích thước và kiểu đóng gáy' },
      { feature: 'Hỗ trợ thiết kế miễn phí cho đơn hàng lớn' },
      { feature: 'Giao hàng nhanh chóng trên toàn quốc' },
      { feature: 'Giá cả cạnh tranh, ưu đãi cho khách hàng thân thiết' },
    ],
  },
  {
    slug: 'in-brochure-gap-doi',
    gallery: [
      { image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1586281380614-7c1c7f9f0fcb?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&q=80' },
    ],
    specifications: {
      material: 'Giấy couche 150gsm, 200gsm',
      size: 'A4 gấp đôi (210x297mm)',
      colors: '4 màu CMYK',
      printing: 'In offset, in kỹ thuật số',
      quantity: 'Từ 50 bản',
      finishing: 'Cán màng, gấp đôi chuyên nghiệp',
    },
    detailedInfo: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Brochure gấp đôi là giải pháp quảng cáo hiệu quả, phù hợp cho các sự kiện, hội chợ, triển lãm. Với thiết kế gấp đôi độc đáo, brochure tạo không gian trình bày thông tin rộng rãi hơn, giúp khách hàng dễ dàng tiếp cận nội dung.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Sản phẩm được in trên giấy couche cao cấp với công nghệ in offset hoặc in kỹ thuật số, đảm bảo màu sắc sống động, hình ảnh sắc nét. Quy trình gấp chuyên nghiệp tạo nếp gấp thẳng, đẹp, tăng tính thẩm mỹ cho sản phẩm.',
          },
        ],
      },
    ],
    features: [
      { feature: 'Thiết kế gấp đôi độc đáo, thu hút' },
      { feature: 'In màu sắc sống động, hình ảnh sắc nét' },
      { feature: 'Giấy couche cao cấp, cán màng bóng/mờ' },
      { feature: 'Gấp chuyên nghiệp, nếp gấp thẳng đẹp' },
      { feature: 'Phù hợp cho sự kiện, hội chợ, triển lãm' },
    ],
  },
  {
    slug: 'in-name-card-cao-cap',
    gallery: [
      { image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80' },
    ],
    specifications: {
      material: 'Giấy couche 300gsm, giấy mỹ thuật',
      size: '9x5cm (90x54mm)',
      colors: '4 màu CMYK, Pantone',
      printing: 'In offset, in kỹ thuật số',
      quantity: 'Từ 100 cái',
      finishing: 'Cán màng, bo góc, ép kim, ép nhiệt',
    },
    detailedInfo: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Name card (danh thiếp) là công cụ networking không thể thiếu trong kinh doanh. Một tấm name card đẹp, chuyên nghiệp sẽ tạo ấn tượng tốt và giúp bạn ghi điểm trong mắt đối tác, khách hàng.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Chúng tôi cung cấp đa dạng loại giấy cao cấp: giấy couche, giấy mỹ thuật, giấy kraft, giấy nhũ... Kết hợp với các kỹ thuật gia công hiện đại như ép kim, ép nhiệt, cán màng, bo góc để tạo nên những tấm name card độc đáo, khẳng định đẳng cấp.',
          },
        ],
      },
    ],
    features: [
      { feature: 'Đa dạng chất liệu giấy cao cấp' },
      { feature: 'Kỹ thuật gia công hiện đại (ép kim, ép nhiệt)' },
      { feature: 'Thiết kế chuyên nghiệp, độc đáo' },
      { feature: 'In màu sắc chuẩn, sắc nét' },
      { feature: 'Giao hàng nhanh, số lượng linh hoạt' },
    ],
  },
  {
    slug: 'in-poster-quang-cao',
    gallery: [
      { image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b?w=800&q=80' },
    ],
    specifications: {
      material: 'Giấy couche, giấy ảnh, PP',
      size: 'A0, A1, A2, A3 hoặc theo yêu cầu',
      colors: '4 màu CMYK',
      printing: 'In kỹ thuật số, in UV',
      quantity: 'Từ 1 tờ',
      finishing: 'Cán màng, đóng khung, ép foam',
    },
    detailedInfo: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Poster quảng cáo là công cụ marketing trực quan, hiệu quả cao. Với kích thước lớn, màu sắc bắt mắt, poster giúp thông điệp của bạn tiếp cận đông đảo khách hàng tại các điểm bán hàng, sự kiện, hội chợ.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Chúng tôi sử dụng công nghệ in kỹ thuật số và in UV hiện đại, cho chất lượng hình ảnh sắc nét, màu sắc sống động. Đa dạng chất liệu: giấy couche, giấy ảnh, PP... phù hợp với mọi nhu cầu sử dụng trong nhà hoặc ngoài trời.',
          },
        ],
      },
    ],
    features: [
      { feature: 'In kích thước lớn, từ A3 đến A0' },
      { feature: 'Công nghệ in kỹ thuật số, màu sắc sống động' },
      { feature: 'Đa dạng chất liệu phù hợp mọi môi trường' },
      { feature: 'Hỗ trợ gia công: cán màng, đóng khung, ép foam' },
      { feature: 'Giao hàng nhanh, số lượng linh hoạt từ 1 tờ' },
    ],
  },
  {
    slug: 'in-hop-giay-cao-cap',
    gallery: [
      { image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80' },
    ],
    specifications: {
      material: 'Giấy duplex, giấy ivory, giấy kraft',
      size: 'Theo yêu cầu khách hàng',
      colors: '4 màu CMYK, Pantone',
      printing: 'In offset',
      quantity: 'Từ 500 hộp',
      finishing: 'Cán màng, ép kim, bế, dán hộp',
    },
    detailedInfo: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Hộp giấy cao cấp là giải pháp đóng gói chuyên nghiệp, nâng tầm giá trị sản phẩm. Với thiết kế đẹp mắt, chất liệu cao cấp, hộp giấy không chỉ bảo vệ sản phẩm mà còn tạo ấn tượng mạnh mẽ với khách hàng.',
          },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Chúng tôi chuyên sản xuất hộp giấy với đa dạng kiểu dáng: hộp nắp rời, hộp cứng, hộp gấp... Sử dụng giấy duplex, ivory, kraft cao cấp kết hợp kỹ thuật gia công hiện đại như ép kim, ép nhiệt, cán màng tạo nên sản phẩm hoàn hảo.',
          },
        ],
      },
    ],
    features: [
      { feature: 'Đa dạng kiểu dáng: hộp nắp rời, hộp cứng, hộp gấp' },
      { feature: 'Chất liệu cao cấp: duplex, ivory, kraft' },
      { feature: 'Kỹ thuật gia công hiện đại: ép kim, cán màng' },
      { feature: 'Thiết kế theo yêu cầu, tạo dấu ấn thương hiệu' },
      { feature: 'Sản xuất số lượng lớn, giá cạnh tranh' },
    ],
  },
];

async function updateProducts() {
  try {
    await payload.init({
      secret: 'your-secret-key-here',
      mongoURL: 'mongodb://localhost:27017/vinhphat',
      local: true,
    });

    console.log('🚀 Bắt đầu cập nhật sản phẩm với nội dung chi tiết...\n');

    for (const productData of sampleProducts) {
      try {
        // Tìm sản phẩm theo slug
        const existingProducts = await payload.find({
          collection: 'products',
          where: {
            slug: {
              equals: productData.slug,
            },
          },
        });

        if (existingProducts.docs.length > 0) {
          const product = existingProducts.docs[0];
          
          // Cập nhật sản phẩm
          await payload.update({
            collection: 'products',
            id: product.id,
            data: {
              gallery: productData.gallery,
              specifications: productData.specifications,
              detailedInfo: productData.detailedInfo,
              features: productData.features,
            },
          });

          console.log(`✅ Đã cập nhật: ${product.name}`);
          console.log(`   - Gallery: ${productData.gallery.length} ảnh`);
          console.log(`   - Specifications: ${Object.keys(productData.specifications).length} fields`);
          console.log(`   - Features: ${productData.features.length} items\n`);
        } else {
          console.log(`⚠️  Không tìm thấy sản phẩm: ${productData.slug}\n`);
        }
      } catch (error) {
        console.error(`❌ Lỗi khi cập nhật ${productData.slug}:`, error.message);
      }
    }

    console.log('\n✅ Hoàn thành cập nhật sản phẩm!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

updateProducts();
