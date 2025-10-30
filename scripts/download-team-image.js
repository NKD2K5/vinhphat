const fs = require('fs');
const path = require('path');
const https = require('https');

// Create team directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images/team');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('Created team images directory');
}

// High-quality office team image
const imageUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
const filename = 'office-team-contact.jpg';
const filePath = path.join(imagesDir, filename);

// Download function
const downloadImage = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve(filePath);
      });
      
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
};

// Download the image
downloadImage(imageUrl, filePath)
  .then(() => console.log('Team image downloaded successfully!'))
  .catch(error => console.error('Error downloading team image:', error));
