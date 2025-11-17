require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority";

async function checkProductsGallery() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('VinhPhat');
    const productsCollection = db.collection('products');

    // Get all products
    const products = await productsCollection.find({}).toArray();

    console.log(`\n📦 Total products: ${products.length}\n`);

    products.forEach((product, index) => {
      const galleryCount = product.gallery ? product.gallery.length : 0;
      const hasMainImage = !!product.image;
      const totalImages = (hasMainImage ? 1 : 0) + galleryCount;

      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Main Image: ${hasMainImage ? '✅' : '❌'}`);
      console.log(`   Gallery: ${galleryCount} images`);
      console.log(`   Total: ${totalImages} images`);
      
      if (totalImages < 4) {
        console.log(`   ⚠️  NEEDS MORE IMAGES (${4 - totalImages} more needed)`);
      }
      
      console.log('');
    });

    // Summary
    const productsNeedingImages = products.filter(p => {
      const galleryCount = p.gallery ? p.gallery.length : 0;
      const hasMainImage = !!p.image;
      const totalImages = (hasMainImage ? 1 : 0) + galleryCount;
      return totalImages < 4;
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Total products: ${products.length}`);
    console.log(`   Products needing more images: ${productsNeedingImages.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkProductsGallery();
