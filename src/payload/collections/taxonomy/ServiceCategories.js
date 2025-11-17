const ImageUploadField = require('../../../components/ImageUploadField');

const ServiceCategories = {
  slug: 'service-categories',
  labels: {
    singular: 'Danh Mục Dịch Vụ',
    plural: 'Danh Mục Dịch Vụ',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'isActive'],
    group: 'Danh Mục',
    listSearchableFields: ['name', 'slug'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên Danh Mục',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug (URL)',
      admin: {
        description: 'URL-friendly version (e.g., in-an-ky-thuat-so)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô Tả',
      admin: {
        description: 'Mô tả ngắn về danh mục dịch vụ',
      },
    },
    {
      name: 'image',
      type: 'text',
      label: 'Hình Ảnh',
      admin: {
        components: {
          Field: ImageUploadField,
        },
        description: 'Upload ảnh qua C# API (khuyến nghị: 400x300px)',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Class',
      admin: {
        description: 'CSS class cho icon (optional, fallback nếu không có ảnh)',
      },
    },
    {
      name: 'color',
      type: 'text',
      label: 'Màu Đại Diện',
      admin: {
        description: 'Mã màu hex (VD: #3B82F6)',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ Tự Hiển Thị',
      defaultValue: 0,
      required: true,
      admin: {
        description: 'Số thứ tự hiển thị (nhỏ hơn = hiển thị trước)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Kích Hoạt',
      defaultValue: true,
    },
  ],
};

module.exports = { ServiceCategories };
