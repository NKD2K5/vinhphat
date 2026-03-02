// Enable custom components for image upload and rich text
const ImageUploadField = require('../../components/ImageUploadField');
const CKEditorField = require('../../components/CKEditorFieldSafe');

module.exports = {
  slug: 'contact-cta',
  label: 'Liên Hệ CTA',
  admin: {
    group: 'Toàn thể (globals)',
    description: 'Quản lý section Liên Hệ CTA với tiêu đề và 2 nút hành động',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Kích hoạt',
      defaultValue: true,
      admin: {
        description: 'Bật/tắt section Liên Hệ CTA',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề chính',
      defaultValue: 'Bạn Cần Tư Vấn Về Dịch Vụ?',
      required: true,
      admin: {
        components: {
          Field: CKEditorField,
        },
        description: '📝 Tiêu đề lớn của section CTA (hỗ trợ định dạng văn bản)',
        placeholder: '📝 Nhập tiêu đề chính...',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Mô tả ngắn',
      defaultValue: 'Hãy liên hệ để được tư vấn miễn phí',
      admin: {
        components: {
          Field: CKEditorField,
        },
        description: '📄 MÔ TẢ NGẮN: Mô tả ngắn của Contact CTA (hỗ trợ định dạng văn bản)',
        placeholder: '📄 Nhập MÔ TẢ NGẮN của Contact CTA ở đây...'
      },
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Nút chính (Gọi Ngay)',
      admin: {
        description: 'Cấu hình nút hành động chính - màu trắng với text xanh',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Văn bản nút',
          defaultValue: 'Gọi Ngay',
          required: true,
          admin: {
            placeholder: 'Gọi Ngay',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Đường dẫn',
          defaultValue: 'tel:0912345678',
          required: true,
          admin: {
            description: 'Số điện thoại với tel: hoặc URL khác',
            placeholder: 'tel:0912345678',
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          defaultValue: '📞',
          admin: {
            description: 'Icon emoji cho nút',
            placeholder: '📞',
          },
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Nút phụ (Email Liên Hệ)',
      admin: {
        description: 'Cấu hình nút hành động phụ - màu xanh nhạt với text trắng',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Văn bản nút',
          defaultValue: 'Email Liên Hệ',
          required: true,
          admin: {
            placeholder: 'Email Liên Hệ',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Đường dẫn',
          defaultValue: 'mailto:info@vinhphatprinting.com',
          required: true,
          admin: {
            description: 'Email với mailto: hoặc URL khác',
            placeholder: 'mailto:info@vinhphatprinting.com',
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          defaultValue: '✉️',
          admin: {
            description: 'Icon emoji cho nút',
            placeholder: '✉️',
          },
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'text',
      label: 'Ảnh nền (tùy chọn)',
      admin: {
        components: {
          Field: ImageUploadField,
        },
        description: 'Upload ảnh nền qua C# API hoặc dán URL trực tiếp',
        placeholder: 'https://res.cloudinary.com/your-account/background.jpg',
      },
    },
  ],
};
