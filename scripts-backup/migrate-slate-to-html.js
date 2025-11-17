/**
 * Migration Script: Convert Slate Editor format to HTML (for CKEditor)
 * 
 * Chạy script này để convert tất cả richText content từ Slate format sang HTML
 * trước khi chuyển sang CKEditor 5
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Slate to HTML converter
function slateToHtml(slateNodes) {
  if (!Array.isArray(slateNodes)) {
    return '';
  }

  return slateNodes.map(node => nodeToHtml(node)).join('');
}

function nodeToHtml(node) {
  if (!node) return '';

  // Text node
  if (node.text !== undefined) {
    let text = escapeHtml(node.text);
    
    // Apply formatting
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.strikethrough) text = `<s>${text}</s>`;
    if (node.code) text = `<code>${text}</code>`;
    
    return text;
  }

  // Element nodes
  const children = node.children ? slateToHtml(node.children) : '';

  switch (node.type) {
    case 'h1':
      return `<h1>${children}</h1>`;
    case 'h2':
      return `<h2>${children}</h2>`;
    case 'h3':
      return `<h3>${children}</h3>`;
    case 'h4':
      return `<h4>${children}</h4>`;
    case 'h5':
      return `<h5>${children}</h5>`;
    case 'h6':
      return `<h6>${children}</h6>`;
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`;
    case 'ul':
      return `<ul>${children}</ul>`;
    case 'ol':
      return `<ol>${children}</ol>`;
    case 'li':
      return `<li>${children}</li>`;
    case 'link':
      const url = node.url || '#';
      const target = node.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${escapeHtml(url)}"${target}>${children}</a>`;
    case 'upload':
      if (node.value && node.value.url) {
        return `<img src="${escapeHtml(node.value.url)}" alt="${escapeHtml(node.value.alt || '')}" />`;
      }
      return '';
    case 'relationship':
      // Skip relationships in HTML
      return '';
    default:
      // Default paragraph
      return `<p>${children}</p>`;
  }
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function migrateCollection(collectionName, fieldName) {
  console.log(`\n📦 Migrating ${collectionName}.${fieldName}...`);
  
  const collection = mongoose.connection.collection(collectionName);
  const documents = await collection.find({}).toArray();
  
  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      const fieldValue = doc[fieldName];
      
      // Skip if already HTML string
      if (typeof fieldValue === 'string') {
        skippedCount++;
        continue;
      }

      // Skip if empty
      if (!fieldValue || !Array.isArray(fieldValue)) {
        skippedCount++;
        continue;
      }

      // Convert Slate to HTML
      const htmlContent = slateToHtml(fieldValue);
      
      // Update document
      await collection.updateOne(
        { _id: doc._id },
        { $set: { [fieldName]: htmlContent } }
      );

      migratedCount++;
      console.log(`  ✓ Migrated: ${doc._id} (${doc.title || doc.name || 'Untitled'})`);

    } catch (error) {
      errorCount++;
      console.error(`  ✗ Error migrating ${doc._id}:`, error.message);
    }
  }

  console.log(`\n  Summary for ${collectionName}.${fieldName}:`);
  console.log(`  - Migrated: ${migratedCount}`);
  console.log(`  - Skipped: ${skippedCount}`);
  console.log(`  - Errors: ${errorCount}`);
}

async function main() {
  try {
    console.log('🚀 Starting Slate to HTML migration...\n');
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Migrate all collections with richText fields
    await migrateCollection('news', 'content');
    await migrateCollection('about', 'description');
    await migrateCollection('service-items', 'content');
    await migrateCollection('products', 'description');
    await migrateCollection('products', 'detailedInfo');
    
    // AboutPage có nested field
    console.log(`\n📦 Migrating about-page.companyStory.content...`);
    const aboutPageCollection = mongoose.connection.collection('about-page');
    const aboutPages = await aboutPageCollection.find({}).toArray();
    
    let migratedCount = 0;
    for (const doc of aboutPages) {
      if (doc.companyStory && Array.isArray(doc.companyStory.content)) {
        const htmlContent = slateToHtml(doc.companyStory.content);
        await aboutPageCollection.updateOne(
          { _id: doc._id },
          { $set: { 'companyStory.content': htmlContent } }
        );
        migratedCount++;
        console.log(`  ✓ Migrated: ${doc._id}`);
      }
    }
    console.log(`\n  Summary: Migrated ${migratedCount} documents`);

    console.log('\n✅ Migration completed successfully!');
    console.log('\nBây giờ bạn có thể:');
    console.log('1. Restart Payload server: npm run dev:payload');
    console.log('2. Mở admin panel và kiểm tra nội dung');
    console.log('3. CKEditor sẽ hiển thị nội dung đã migrate\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main();
