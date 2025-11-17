const path = require('path');

const ImageUploadField = ({ name = 'image', label = 'Hình Ảnh', description = 'Upload hình ảnh', required = false }) => ({
  name,
  type: 'text',
  label,
  required,
  admin: {
    description,
    components: {
      Field: path.resolve(__dirname, '../components/ImageUploadFieldComponent.tsx'),
    },
  },
});

module.exports = { ImageUploadField };
