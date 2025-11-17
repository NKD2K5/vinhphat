require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority";

async function addMoreImages() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('VinhPhat');
    const productsCollection = db.collection('products');

    // Find first product to test
    const product = await productsCollection.findOne({ name: /In Tờ Rơi Số Lượng Lớn chào/i });

    if (!product) {
      console.log('❌ Product not found');
      return;
    }

    console.log(`\n📦 Found product: ${product.name}`);
    console.log(`   Current gallery: ${product.gallery?.length || 0} images`);

    // Add 4 more images to gallery (total will be 7 with main image)
    const newGalleryImages = [
      { image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80' },
      { image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80' },
      { image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80' },
    ];

    const updatedGallery = [...(product.gallery || []), ...newGalleryImages];

    await productsCollection.updateOne(
      { _id: product._id },
      { $set: { gallery: updatedGallery } }
    );

    console.log(`✅ Updated gallery to ${updatedGallery.length} images`);
    console.log(`   Total images (with main): ${updatedGallery.length + 1}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

addMoreImages();
