// Script to clean up unused images from Cloudinary
// This script finds images in Cloudinary that are not referenced in any database documents

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const CSHARP_API_URL = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118';

// Collections that may contain images
const COLLECTIONS_WITH_IMAGES = [
  { name: 'news', fields: ['featuredImage', 'content'] },
  { name: 'products', fields: ['image', 'images', 'description', 'detailedInfo'] },
  { name: 'services', fields: ['icon', 'image', 'content'] },
  { name: 'about-pages', fields: ['companyStory.content', 'teamMembers.image'] },
  { name: 'home-pages', fields: ['heroSection.backgroundImage', 'aboutSection.image'] },
  { name: 'media', fields: ['url'] }
];

// Extract Cloudinary public IDs from URL
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Extract all image URLs from a document (including nested fields and HTML content)
function extractImageUrls(obj, urls = new Set()) {
  if (!obj) return urls;
  
  if (typeof obj === 'string') {
    // Check if it's a Cloudinary URL
    if (obj.includes('cloudinary.com')) {
      urls.add(obj);
    }
    // Extract URLs from HTML content
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(obj)) !== null) {
      if (match[1].includes('cloudinary.com')) {
        urls.add(match[1]);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractImageUrls(item, urls));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(value => extractImageUrls(value, urls));
  }
  
  return urls;
}

// Get all images used in database
async function getAllUsedImages(db) {
  const usedImages = new Set();
  
  console.log('🔍 Scanning database for used images...\n');
  
  for (const collection of COLLECTIONS_WITH_IMAGES) {
    try {
      const coll = db.collection(collection.name);
      const count = await coll.countDocuments();
      
      if (count === 0) {
        console.log(`  ⊘ ${collection.name}: No documents`);
        continue;
      }
      
      const documents = await coll.find({}).toArray();
      let imageCount = 0;
      
      documents.forEach(doc => {
        const urls = extractImageUrls(doc);
        urls.forEach(url => {
          usedImages.add(url);
          imageCount++;
        });
      });
      
      console.log(`  ✓ ${collection.name}: ${count} documents, ${imageCount} images found`);
    } catch (error) {
      console.error(`  ✗ Error scanning ${collection.name}:`, error.message);
    }
  }
  
  console.log(`\n📊 Total unique images in database: ${usedImages.size}\n`);
  return usedImages;
}

// Get all images from Cloudinary via C# API
async function getAllCloudinaryImages() {
  try {
    console.log('☁️  Fetching images from Cloudinary...\n');
    
    const response = await fetch(`${CSHARP_API_URL}/api/Upload/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`  ✓ Found ${data.resources?.length || 0} images in Cloudinary\n`);
    
    return data.resources || [];
  } catch (error) {
    console.error('  ✗ Error fetching from Cloudinary:', error.message);
    console.log('  ℹ️  Make sure C# API is running at:', CSHARP_API_URL);
    return [];
  }
}

// Delete unused image from Cloudinary
async function deleteImage(publicId) {
  try {
    const response = await fetch(`${CSHARP_API_URL}/api/Upload/Delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main cleanup function
async function cleanupUnusedImages(dryRun = true) {
  console.log('🧹 Cloudinary Image Cleanup Script\n');
  console.log('═══════════════════════════════════════\n');
  
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No images will be deleted\n');
  } else {
    console.log('🔴 LIVE MODE - Images will be permanently deleted!\n');
  }
  
  let client;
  
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    console.log('  ✓ Connected\n');
    
    // Get all used images from database
    const usedImages = await getAllUsedImages(db);
    const usedPublicIds = new Set(
      Array.from(usedImages)
        .map(url => extractPublicIdFromUrl(url))
        .filter(id => id !== null)
    );
    
    // Get all images from Cloudinary
    const cloudinaryImages = await getAllCloudinaryImages();
    
    if (cloudinaryImages.length === 0) {
      console.log('⚠️  No images found in Cloudinary or API error\n');
      return;
    }
    
    // Find unused images
    const unusedImages = cloudinaryImages.filter(img => 
      !usedPublicIds.has(img.public_id)
    );
    
    console.log('📋 Analysis Results:\n');
    console.log(`  • Total images in Cloudinary: ${cloudinaryImages.length}`);
    console.log(`  • Images used in database: ${usedPublicIds.size}`);
    console.log(`  • Unused images: ${unusedImages.length}\n`);
    
    if (unusedImages.length === 0) {
      console.log('✨ All images are being used! Nothing to clean up.\n');
      return;
    }
    
    // Display unused images
    console.log('🗑️  Unused images:\n');
    unusedImages.forEach((img, index) => {
      const sizeKB = (img.bytes / 1024).toFixed(2);
      console.log(`  ${index + 1}. ${img.public_id} (${sizeKB} KB)`);
    });
    console.log();
    
    // Calculate total size
    const totalBytes = unusedImages.reduce((sum, img) => sum + (img.bytes || 0), 0);
    const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
    console.log(`💾 Total space to free: ${totalMB} MB\n`);
    
    // Delete images if not dry run
    if (!dryRun) {
      console.log('🗑️  Deleting unused images...\n');
      
      let successCount = 0;
      let failCount = 0;
      
      for (const img of unusedImages) {
        const result = await deleteImage(img.public_id);
        
        if (result.success) {
          console.log(`  ✓ Deleted: ${img.public_id}`);
          successCount++;
        } else {
          console.log(`  ✗ Failed: ${img.public_id} - ${result.error}`);
          failCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`\n✅ Cleanup complete!`);
      console.log(`  • Successfully deleted: ${successCount}`);
      console.log(`  • Failed: ${failCount}\n`);
    } else {
      console.log('ℹ️  Run with --live flag to actually delete these images\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed\n');
    }
  }
}

// Run the script
const args = process.argv.slice(2);
const isLiveMode = args.includes('--live');

cleanupUnusedImages(!isLiveMode)
  .then(() => {
    console.log('✨ Script finished\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
