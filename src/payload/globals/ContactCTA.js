exports.ContactCTA = {
  slug: 'contact-cta',
  label: 'Liên Hệ CTA',
  admin: {
    description: 'Quản lý khung kêu gọi liên hệ hiển thị ở cuối các trang',
    group: 'Toàn thể (globals)',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Tiêu đề hiển thị',
      required: true,
      defaultValue: 'Bạn đã sẵn sàng bắt đầu dự án in ấn của mình?',
      admin: {
        description: 'Tiêu đề lớn, in đậm hiển thị trên website',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Nội dung mô tả',
      required: true,
      defaultValue: 'Hãy liên hệ với chúng tôi ngay hôm nay để tư vấn miễn phí và báo giá tốt nhất! Đội ngũ chuyên gia của VinhPhat Printing luôn sẵn sàng hỗ trợ bạn 24/7.',
      admin: {
        description: 'Nội dung mô tả, chữ nhỏ hơn, không in đậm',
      },
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Nút chính',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          defaultValue: 'Liên Hệ Ngay',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/lien-he',
          required: true,
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Nút phụ',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text',
          defaultValue: 'Xem Dịch Vụ',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/dich-vu',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Kích hoạt',
      defaultValue: true,
      admin: {
        description: 'Bật/tắt hiển thị khung này trên website',
      },
    },
  ],
};
