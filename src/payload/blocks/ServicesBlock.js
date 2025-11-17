

exports.ServicesBlock = {
  slug: 'services',
  labels: {
    singular: 'Dịch Vụ',
    plural: 'Dịch Vụ',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      required: true,
      defaultValue: 'Dịch Vụ In Ấn Của Chúng Tôi',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      defaultValue: 'Chúng tôi cung cấp đa dạng các dịch vụ in ấn chất lượng cao đáp ứng mọi nhu cầu kinh doanh của bạn.',
    },
    {
      name: 'categories',
      type: 'relationship',
      label: 'Chọn Danh Mục Dịch Vụ Hiển Thị',
      relationTo: 'service-categories',
      hasMany: true,
      admin: {
        description: 'Chọn các danh mục dịch vụ để hiển thị trên trang chủ (khuyến nghị: 5-6 danh mục)',
      },
    },
    {
      name: 'services',
      type: 'array',
      label: 'Danh sách dịch vụ (thay thế categories)',
      admin: {
        description: 'Sử dụng nếu muốn nhập dịch vụ trực tiếp thay vì chọn từ categories',
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          defaultValue: '🖨️',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề dịch vụ',
          required: false,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
          required: false,
        },
      ],
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Text nút CTA',
      defaultValue: 'Xem Tất Cả Dịch Vụ',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link nút CTA',
      defaultValue: '/dich-vu',
    },
  ],
};
