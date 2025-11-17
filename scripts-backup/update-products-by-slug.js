const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority';
const dbName = 'VinhPhat';

// Dữ liệu chi tiết cho TỪNG sản phẩm dựa trên slug
const productDataBySlug = {
  // IN CATALOGUE
  'in-catalogue-premium': {
    specifications: {
      material: 'Giấy couche cao cấp 250-300gsm',
      size: 'A4 (210x297mm), A5 (148x210mm)',
      colors: '4 màu CMYK + Pantone spot color',
      printing: 'In offset 8 màu chất lượng cao',
      quantity: 'Từ 200 bản',
      finishing: 'Cán màng bóng UV, đóng gáy xoắn cao cấp',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Catalogue Premium là giải pháp cao cấp nhất cho doanh nghiệp muốn tạo ấn tượng mạnh mẽ. Sử dụng giấy couche 250-300gsm dày dặn, in offset 8 màu cho độ chi tiết tuyệt đối, kết hợp Pantone spot color để màu sắc thương hiệu chuẩn xác 100%.' }] },
      { type: 'paragraph', children: [{ text: 'Cán màng bóng UV tạo hiệu ứng sang trọng, bảo vệ bề mặt khỏi trầy xước. Đóng gáy xoắn cao cấp cho phép catalogue mở phẳng 180 độ, dễ dàng xem và trình bày. Phù hợp cho catalogue sản phẩm cao cấp, hồ sơ năng lực doanh nghiệp lớn.' }] },
    ],
    features: [
      { feature: 'Giấy couche 250-300gsm siêu dày, cảm giác sang trọng' },
      { feature: 'In offset 8 màu + Pantone, màu sắc chuẩn xác tuyệt đối' },
      { feature: 'Cán màng bóng UV cao cấp, chống trầy xước' },
      { feature: 'Đóng gáy xoắn, mở phẳng 180 độ' },
      { feature: 'Thiết kế miễn phí, tư vấn chuyên nghiệp' },
      { feature: 'Bảo hành chất lượng in ấn 12 tháng' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80' },
    ],
  },

  'in-catalogue-tiet-kiem': {
    specifications: {
      material: 'Giấy couche 150gsm',
      size: 'A4 (210x297mm), A5 (148x210mm)',
      colors: '4 màu CMYK',
      printing: 'In offset tiêu chuẩn',
      quantity: 'Từ 100 bản',
      finishing: 'Cán màng mờ, đóng gáy keo',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Catalogue Tiết Kiệm là lựa chọn tối ưu cho doanh nghiệp với ngân sách hợp lý nhưng vẫn đảm bảo chất lượng. Sử dụng giấy couche 150gsm tiêu chuẩn, in offset 4 màu CMYK cho màu sắc sống động, rõ nét.' }] },
      { type: 'paragraph', children: [{ text: 'Cán màng mờ tạo cảm giác mềm mại, sang trọng. Đóng gáy keo chắc chắn, bền đẹp. Phù hợp cho catalogue giới thiệu sản phẩm, menu nhà hàng, brochure sự kiện với số lượng vừa phải.' }] },
    ],
    features: [
      { feature: 'Giá cả phải chăng, tiết kiệm chi phí' },
      { feature: 'Chất lượng in ấn đảm bảo, màu sắc rõ nét' },
      { feature: 'Cán màng mờ sang trọng' },
      { feature: 'Giao hàng nhanh trong 3-5 ngày' },
      { feature: 'Số lượng linh hoạt từ 100 bản' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80' },
    ],
  },

  'in-catalogue-nhanh': {
    specifications: {
      material: 'Giấy couche 150gsm',
      size: 'A4 (210x297mm)',
      colors: '4 màu CMYK',
      printing: 'In kỹ thuật số nhanh',
      quantity: 'Từ 50 bản',
      finishing: 'Cắt, đóng gáy keo nhanh',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Catalogue In Nhanh là giải pháp cấp tốc cho doanh nghiệp cần catalogue gấp trong 24-48 giờ. Sử dụng công nghệ in kỹ thuật số hiện đại HP Indigo, cho chất lượng tương đương in offset nhưng thời gian nhanh gấp 5 lần.' }] },
      { type: 'paragraph', children: [{ text: 'Số lượng linh hoạt từ 50 bản, phù hợp cho sự kiện, hội chợ, triển lãm cần chuẩn bị gấp. Đóng gáy keo nhanh trong ngày, giao hàng tận nơi trong nội thành.' }] },
    ],
    features: [
      { feature: 'In nhanh trong 24-48 giờ' },
      { feature: 'Công nghệ in kỹ thuật số HP Indigo' },
      { feature: 'Số lượng linh hoạt từ 50 bản' },
      { feature: 'Giao hàng tận nơi nội thành' },
      { feature: 'Phù hợp cho sự kiện gấp' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80' },
    ],
  },

  // IN TỜ RƠI
  'in-to-roi-nhanh': {
    specifications: {
      material: 'Giấy couche 150gsm',
      size: 'A5 (148x210mm)',
      colors: '4 màu CMYK',
      printing: 'In kỹ thuật số nhanh',
      quantity: 'Từ 50 tờ',
      finishing: 'Cắt thành phẩm',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Tờ Rơi In Nhanh là giải pháp marketing tức thời cho các chiến dịch cần triển khai gấp. In kỹ thuật số HP Indigo cho phép hoàn thành trong vài giờ, phù hợp cho khuyến mãi flash sale, sự kiện đột xuất.' }] },
      { type: 'paragraph', children: [{ text: 'Chất lượng in ấn đảm bảo với màu sắc sống động, hình ảnh sắc nét. Số lượng linh hoạt từ 50 tờ, không lo tồn kho. Giao hàng nhanh trong nội thành trong ngày.' }] },
    ],
    features: [
      { feature: 'In nhanh trong vài giờ' },
      { feature: 'Số lượng linh hoạt từ 50 tờ' },
      { feature: 'Chất lượng in ấn cao' },
      { feature: 'Giá cả phải chăng' },
      { feature: 'Giao hàng nhanh trong ngày' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80' },
    ],
  },

  'in-to-roi-so-luong-lon': {
    specifications: {
      material: 'Giấy couche 150gsm, 200gsm',
      size: 'A5 (148x210mm), A4 (210x297mm)',
      colors: '4 màu CMYK',
      printing: 'In offset số lượng lớn',
      quantity: 'Từ 1000 tờ',
      finishing: 'Cắt thành phẩm, đóng gói',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Tờ Rơi Số Lượng Lớn với công nghệ in offset mang lại chất lượng cao nhất với chi phí tối ưu cho số lượng lớn. Phù hợp cho các chiến dịch marketing quy mô lớn, phát tờ rơi hàng loạt, sự kiện hội chợ.' }] },
      { type: 'paragraph', children: [{ text: 'In offset đảm bảo màu sắc chuẩn xác, đồng đều trên toàn bộ số lượng. Giấy couche cao cấp tạo cảm giác sang trọng, chuyên nghiệp. Giá càng giảm khi số lượng càng lớn, tiết kiệm tối đa chi phí marketing.' }] },
    ],
    features: [
      { feature: 'In offset chất lượng cao, màu sắc đồng đều' },
      { feature: 'Số lượng lớn từ 1000 tờ, giá cực ưu đãi' },
      { feature: 'Giấy couche 150-200gsm cao cấp' },
      { feature: 'Phù hợp cho chiến dịch quy mô lớn' },
      { feature: 'Đóng gói chuyên nghiệp, giao hàng toàn quốc' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80' },
    ],
  },

  // IN BROCHURE
  'in-brochure-premium': {
    specifications: {
      material: 'Giấy couche 200gsm, 250gsm',
      size: 'A4 gấp đôi (210x297mm)',
      colors: '4 màu CMYK + Pantone',
      printing: 'In offset 6 màu',
      quantity: 'Từ 200 bản',
      finishing: 'Cán màng bóng, gấp chuyên nghiệp',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Brochure Premium với giấy couche dày 200-250gsm tạo cảm giác cao cấp, sang trọng. In offset 6 màu kết hợp Pantone spot color cho màu sắc thương hiệu chuẩn xác tuyệt đối, hình ảnh sắc nét đến từng chi tiết.' }] },
      { type: 'paragraph', children: [{ text: 'Gấp chuyên nghiệp bằng máy tự động, nếp gấp thẳng, đẹp, bền. Cán màng bóng tạo hiệu ứng bắt sáng, thu hút ánh nhìn. Phù hợp cho brochure giới thiệu dự án bất động sản, resort, khách sạn 5 sao.' }] },
    ],
    features: [
      { feature: 'Giấy couche 200-250gsm siêu dày, cảm giác cao cấp' },
      { feature: 'In offset 6 màu + Pantone, màu sắc chuẩn xác' },
      { feature: 'Gấp chuyên nghiệp, nếp gấp thẳng đẹp' },
      { feature: 'Cán màng bóng sang trọng' },
      { feature: 'Thiết kế miễn phí, tư vấn chuyên sâu' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1586281380614-7c1c7f9f0fcb?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800&q=80' },
    ],
  },

  // IN POSTER
  'in-poster-premium': {
    specifications: {
      material: 'Giấy ảnh cao cấp, PP synthetic',
      size: 'A0 (841x1189mm), A1, A2',
      colors: '4 màu CMYK',
      printing: 'In kỹ thuật số độ phân giải cao',
      quantity: 'Từ 1 tờ',
      finishing: 'Cán màng, đóng khung gỗ cao cấp, ép foam',
    },
    detailedInfo: [
      { type: 'paragraph', children: [{ text: 'Poster Premium sử dụng giấy ảnh cao cấp hoặc PP synthetic chống nước, in kỹ thuật số độ phân giải 1440dpi cho hình ảnh siêu sắc nét, màu sắc sống động như ảnh thật. Phù hợp cho poster nghệ thuật, triển lãm, quảng cáo cao cấp.' }] },
      { type: 'paragraph', children: [{ text: 'Đóng khung gỗ cao cấp hoặc ép foam 5mm tạo độ cứng cáp, sang trọng. Cán màng bảo vệ bề mặt, chống nước, chống phai màu. Có thể treo trong nhà hoặc ngoài trời có mái che.' }] },
    ],
    features: [
      { feature: 'Giấy ảnh cao cấp hoặc PP synthetic chống nước' },
      { feature: 'In độ phân giải 1440dpi, hình ảnh siêu sắc nét' },
      { feature: 'Đóng khung gỗ cao cấp hoặc ép foam 5mm' },
      { feature: 'Cán màng chống nước, chống phai màu' },
      { feature: 'Phù hợp treo trong nhà và ngoài trời có mái' },
    ],
    gallery: [
      { image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80' },
      { image: 'https://images.unsplash.com/photo-1611162618479-ee3d24aaef0b?w=800&q=80' },
    ],
  },
};

async function updateProductsBySlug() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Đã kết nối MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection('products');

    let updated = 0;
    let notFound = 0;

    console.log('='.repeat(80));
    console.log('🔄 Đang cập nhật sản phẩm theo slug...\n');

    for (const [slug, data] of Object.entries(productDataBySlug)) {
      try {
        const result = await collection.updateOne(
          { slug: slug },
          { $set: data }
        );

        if (result.matchedCount > 0) {
          const product = await collection.findOne({ slug: slug });
          console.log(`✅ ${product.name}`);
          console.log(`   → Slug: ${slug}`);
          console.log(`   → Specifications: ${Object.keys(data.specifications).length} fields`);
          console.log(`   → Gallery: ${data.gallery.length} ảnh`);
          console.log(`   → Features: ${data.features.length} items`);
          console.log(`   → Detailed Info: ${data.detailedInfo.length} paragraphs\n`);
          updated++;
        } else {
          console.log(`⚠️  Không tìm thấy slug: ${slug}\n`);
          notFound++;
        }
      } catch (error) {
        console.error(`❌ Lỗi khi cập nhật slug ${slug}:`, error.message);
      }
    }

    console.log('='.repeat(80));
    console.log(`✅ Đã cập nhật: ${updated} sản phẩm`);
    console.log(`⚠️  Không tìm thấy: ${notFound} slug`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await client.close();
    console.log('\n✅ Đã đóng kết nối MongoDB');
  }
}

updateProductsBySlug();
