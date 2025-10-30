const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create public/images directory if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to create a placeholder image
function createPlaceholderImage(filename, width, height, text) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  
  // Add text
  ctx.fillStyle = '#9ca3af';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text || filename, width / 2, height / 2);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(imagesDir, filename), buffer);
  console.log(`Created placeholder: ${filename}`);
}

// Create placeholder images
createPlaceholderImage('printing-hero.jpg', 1920, 1080, 'Hero Image');
createPlaceholderImage('about-printing.jpg', 800, 600, 'About Us');

// Create a simple SVG pattern
const svgContent = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <path d="M0 0h100v100H0z" fill="none"/>
  <path d="M0 0h2v100H0z" fill="#e5e7eb"/>
  <path d="M0 0h100v2H0z" fill="#e5e7eb"/>
  <path d="M0 0l100 100M0 100L100 0" stroke="#e5e7eb" stroke-width="1"/>
</svg>`;

// Save the SVG pattern
fs.writeFileSync(path.join(imagesDir, 'grid-pattern.svg'), svgContent);
console.log('Created placeholder: grid-pattern.svg');

console.log('\nAll placeholder images have been generated in the public/images directory.');
