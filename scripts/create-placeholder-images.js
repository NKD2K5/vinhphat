const fs = require('fs');
const path = require('path');

const images = [
  { name: 'printing-hero.jpg', width: 1920, height: 1080, color: '4F46E5' },
  { name: 'grid-pattern.svg', width: 100, height: 100, color: 'E5E7EB' },
  { name: 'about-printing.jpg', width: 800, height: 600, color: '6B7280' },
];

// Create public/images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create placeholder images
images.forEach(({ name, width, height, color }) => {
  const filePath = path.join(imagesDir, name);
  
  if (name.endsWith('.svg')) {
    // Create SVG placeholder
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#${color}" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#000000" font-family="Arial" font-size="12">
        ${name}
      </text>
    </svg>`;
    
    fs.writeFileSync(filePath, svg);
  } else {
    // Create JPG placeholder using a simple data URL
    const canvas = require('canvas').createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Fill with color
    ctx.fillStyle = `#${color}`;
    ctx.fillRect(0, 0, width, height);
    
    // Add text
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, width / 2, height / 2);
    
    // Save as JPG
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(filePath, buffer);
  }
  
  console.log(`Created placeholder image: ${filePath}`);
});

console.log('All placeholder images created successfully!');
