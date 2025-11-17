// Test script để kiểm tra Payload CMS collections
// Chạy: node scripts/test-cms-collections.js

const path = require('path');

console.log('=== Testing Payload CMS Collections ===\n');

// Test 1: Load payload.config.js
console.log('Test 1: Loading payload.config.js...');
try {
  const payloadConfig = require('../payload.config.js');
  console.log('✓ payload.config.js loaded successfully');
  console.log('  Collections:', payloadConfig.collections?.length || 0);
  console.log('  Globals:', payloadConfig.globals?.length || 0);
} catch (err) {
  console.error('✗ Failed to load payload.config.js:', err.message);
}

console.log('\n');

// Test 2: Load individual collections
console.log('Test 2: Loading individual collections...');
const collections = [
  'Products',
  'News',
  'AboutPage',
  'Home',
  'About'
];

collections.forEach(collectionName => {
  try {
    const collection = require(`../src/payload/collections/${collectionName}.js`);
    console.log(`✓ ${collectionName} loaded successfully`);
    console.log(`  Slug: ${collection[collectionName]?.slug || 'N/A'}`);
    console.log(`  Fields: ${collection[collectionName]?.fields?.length || 0}`);
  } catch (err) {
    console.error(`✗ Failed to load ${collectionName}:`, err.message);
  }
});

console.log('\n');

// Test 3: Check CKEditorField
console.log('Test 3: Checking CKEditorField...');
try {
  const CKEditorField = require('../src/components/CKEditorField.js');
  console.log('✓ CKEditorField loaded successfully');
  console.log('  Type:', typeof CKEditorField);
} catch (err) {
  console.error('✗ Failed to load CKEditorField:', err.message);
}

console.log('\n');

// Test 4: Check CKEditorFieldSafe
console.log('Test 4: Checking CKEditorFieldSafe...');
try {
  const CKEditorFieldSafe = require('../src/components/CKEditorFieldSafe.js');
  console.log('✓ CKEditorFieldSafe loaded successfully');
  console.log('  Type:', typeof CKEditorFieldSafe);
} catch (err) {
  console.error('✗ Failed to load CKEditorFieldSafe:', err.message);
}

console.log('\n');

// Test 5: Check Error Boundary
console.log('Test 5: Checking CKEditorErrorBoundary...');
try {
  const ErrorBoundary = require('../src/components/CKEditorErrorBoundary.js');
  console.log('✓ CKEditorErrorBoundary loaded successfully');
  console.log('  Type:', typeof ErrorBoundary);
} catch (err) {
  console.error('✗ Failed to load CKEditorErrorBoundary:', err.message);
}

console.log('\n=== Test Complete ===\n');

// Recommendations
console.log('Recommendations:');
console.log('1. Nếu tất cả test pass, vấn đề có thể ở client-side rendering');
console.log('2. Kiểm tra browser console khi mở trang chi tiết trong CMS');
console.log('3. Thử sử dụng CKEditorFieldSafe thay vì CKEditorField');
console.log('4. Kiểm tra Network tab để xem có request nào fail không');
console.log('\nĐể test trong browser:');
console.log('1. Mở http://localhost:3002/admin');
console.log('2. Đăng nhập');
console.log('3. Vào Collections > Sản phẩm > Click vào một sản phẩm');
console.log('4. Mở DevTools (F12) và xem Console tab');
