const ImageCleanup = require('../views/ImageCleanup');

module.exports = {
  slug: 'image-cleanup',
  label: {
    singular: 'Quản lý Ảnh',
    plural: 'Quản lý Ảnh',
  },
  access: {
    read: () => true,
  },
  admin: {
    description: 'Công cụ quét và xóa ảnh không sử dụng trên Cloudinary',
    components: {
      views: {
        Edit: ImageCleanup,
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Image Cleanup Tool',
      admin: {
        hidden: true,
      },
    },
  ],
};
