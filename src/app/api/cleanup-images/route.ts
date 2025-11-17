import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Disable SSL verification for localhost development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const MONGODB_URI = process.env.MONGODB_URI!;
const CSHARP_API_URL = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118';

const COLLECTIONS_WITH_IMAGES = [
  { name: 'news', fields: ['featuredImage', 'content'] },
  { name: 'products', fields: ['image', 'images', 'description', 'detailedInfo'] },
  { name: 'services', fields: ['icon', 'image', 'content'] },
  { name: 'about-pages', fields: ['companyStory.content', 'teamMembers.image'] },
  { name: 'home-pages', fields: ['heroSection.backgroundImage', 'aboutSection.image'] },
  { name: 'media', fields: ['url'] }
];

function extractPublicIdFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function extractImageUrls(obj: any, urls: Set<string> = new Set()): Set<string> {
  if (!obj) return urls;
  
  if (typeof obj === 'string') {
    if (obj.includes('cloudinary.com')) {
      urls.add(obj);
    }
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

async function getAllUsedImages(db: any): Promise<Set<string>> {
  const usedImages = new Set<string>();
  
  for (const collection of COLLECTIONS_WITH_IMAGES) {
    try {
      const coll = db.collection(collection.name);
      const documents = await coll.find({}).toArray();
      
      documents.forEach((doc: any) => {
        const urls = extractImageUrls(doc);
        urls.forEach(url => usedImages.add(url));
      });
    } catch (error) {
      console.error(`Error scanning ${collection.name}:`, error);
    }
  }
  
  return usedImages;
}

async function getAllCloudinaryImages() {
  const response = await fetch(`${CSHARP_API_URL}/api/Upload/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }
  
  const data = await response.json();
  return data.resources || [];
}

async function deleteImage(publicId: string) {
  // Encode publicId for URL
  const encodedPublicId = encodeURIComponent(publicId);
  
  const response = await fetch(`${CSHARP_API_URL}/api/Upload/${encodedPublicId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    return { success: data.success === true };
  } else {
    const error = await response.text();
    console.error(`Failed to delete ${publicId}:`, error);
    return { success: false, error };
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3001',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  try {
    console.log('🧹 Starting cleanup process...');
    const { liveMode } = await request.json();
    console.log('Mode:', liveMode ? 'LIVE DELETE' : 'DRY RUN');
    
    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();
    console.log('✅ MongoDB connected');
    
    // Get all used images from database
    const usedImages = await getAllUsedImages(db);
    const usedPublicIds = new Set(
      Array.from(usedImages)
        .map(url => extractPublicIdFromUrl(url))
        .filter((id): id is string => id !== null)
    );
    
    // Get all images from Cloudinary
    console.log('☁️ Fetching images from Cloudinary via C# API...');
    console.log('C# API URL:', CSHARP_API_URL);
    const cloudinaryImages = await getAllCloudinaryImages();
    console.log(`✅ Found ${cloudinaryImages.length} images in Cloudinary`);
    
    if (cloudinaryImages.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Không thể kết nối đến Cloudinary. Đảm bảo C# API đang chạy.'
      }, { headers: corsHeaders });
    }
    
    // Find unused images
    const unusedImages = cloudinaryImages.filter((img: any) => 
      !usedPublicIds.has(img.public_id)
    );
    
    const totalBytes = unusedImages.reduce((sum: number, img: any) => sum + (img.bytes || 0), 0);
    const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
    
    const unusedImagesList = unusedImages.map((img: any) => ({
      publicId: img.public_id,
      size: `${(img.bytes / 1024).toFixed(2)} KB`
    }));
    
    // If dry run, just return the list
    if (!liveMode) {
      return NextResponse.json({
        success: true,
        message: `Tìm thấy ${unusedImages.length} ảnh không sử dụng.\n\nTổng dung lượng có thể giải phóng: ${totalMB} MB\n\nNhấn "Xóa ngay" để xóa các ảnh này.`,
        details: {
          totalCloudinary: cloudinaryImages.length,
          totalUsed: usedPublicIds.size,
          totalUnused: unusedImages.length,
          unusedImages: unusedImagesList,
          totalSize: `${totalMB} MB`
        }
      }, { headers: corsHeaders });
    }
    
    // Live mode: delete images
    let successCount = 0;
    let failCount = 0;
    
    for (const img of unusedImages) {
      const result = await deleteImage(img.public_id);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return NextResponse.json({
      success: true,
      message: `Đã xóa thành công ${successCount} ảnh!\n\nDung lượng đã giải phóng: ${totalMB} MB`,
      details: {
        totalCloudinary: cloudinaryImages.length,
        totalUsed: usedPublicIds.size,
        totalUnused: unusedImages.length,
        unusedImages: unusedImagesList,
        totalSize: `${totalMB} MB`,
        deleted: successCount,
        failed: failCount
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      success: false,
      message: `Lỗi: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    }, { status: 500, headers: corsHeaders });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
