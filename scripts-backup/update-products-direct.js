const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'vinhphat';

const sampleData = {
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
};

async function updateProducts() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Đã kết nối MongoDB\n');

    const db = client.db(dbName);
    const collection = db.collection('products');

    // Cập nhật TẤT CẢ sản phẩm
    const result = await collection.updateMany(
      {}, 
      { $set: sampleData }
    );

    console.log(`✅ Đã cập nhật ${result.modifiedCount} sản phẩm với:`);
    console.log(`   - Gallery: ${sampleData.gallery.length} ảnh`);
    console.log(`   - Specifications: ${Object.keys(sampleData.specifications).length} fields`);
    console.log(`   - Detailed Info: ${sampleData.detailedInfo.length} paragraphs`);
    console.log(`   - Features: ${sampleData.features.length} items\n`);

    // Hiển thị một vài sản phẩm đã cập nhật
    const products = await collection.find({}).limit(5).toArray();
    console.log('📦 Sản phẩm đã cập nhật:');
    products.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
    });

  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await client.close();
    console.log('\n✅ Đã đóng kết nối MongoDB');
  }
}

updateProducts();
