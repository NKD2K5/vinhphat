const FloatingButtons = {
  slug: 'floating-buttons',
  label: 'Nút Liên Hệ Nổi',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user, // Chỉ admin mới sửa được
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Hiển thị nút liên hệ nổi',
      defaultValue: true,
      admin: {
        description: 'Bật/tắt hiển thị các nút liên hệ nổi trên website',
      },
    },
    {
      name: 'position',
      type: 'select',
      label: 'Vị trí hiển thị',
      options: [
        { label: 'Góc trái', value: 'left' },
        { label: 'Góc phải', value: 'right' },
      ],
      defaultValue: 'left',
      admin: {
        description: 'Chọn vị trí hiển thị các nút liên hệ',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Danh sách nút liên hệ',
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Cấu hình các nút liên hệ sẽ hiển thị',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Loại nút',
          options: [
            { label: '📞 Điện thoại', value: 'phone' },
            { label: '💬 Messenger', value: 'messenger' },
            { label: '🟦 Zalo', value: 'zalo' },
            { label: '📧 Gmail', value: 'gmail' },
            { label: '🌐 Website', value: 'website' },
            { label: '📱 WhatsApp', value: 'whatsapp' },
          ],
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Nhãn hiển thị',
          required: true,
          admin: {
            description: 'Văn bản hiển thị khi hover vào nút',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link/URL',
          required: true,
          admin: {
            description: 'VD: tel:0977344567, https://m.me/page, mailto:email@domain.com',
          },
        },
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Màu nền (Hex)',
          admin: {
            description: 'Mã màu hex (VD: #25D366 cho WhatsApp, #0084FF cho Messenger). Để trống sẽ dùng màu mặc định.',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Kích hoạt',
          defaultValue: true,
        },
      ],
      defaultValue: [
        {
          type: 'phone',
          label: 'Gọi ngay',
          url: 'tel:0977344567',
          backgroundColor: '#25D366',
          enabled: true,
        },
        {
          type: 'messenger',
          label: 'Messenger',
          url: 'https://m.me/vinhphatprinting',
          backgroundColor: '#0084FF',
          enabled: true,
        },
        {
          type: 'zalo',
          label: 'Zalo',
          url: 'https://zalo.me/0977344567',
          backgroundColor: '#0068FF',
          enabled: true,
        },
        {
          type: 'gmail',
          label: 'Email',
          url: 'mailto:invinhphat6868@gmail.com',
          backgroundColor: '#EA4335',
          enabled: true,
        },
      ],
    },
    {
      name: 'styling',
      type: 'group',
      label: 'Tùy chỉnh giao diện',
      fields: [
        {
          name: 'buttonSize',
          type: 'select',
          label: 'Kích thước nút',
          options: [
            { label: 'Nhỏ (40px)', value: 'small' },
            { label: 'Vừa (48px)', value: 'medium' },
            { label: 'Lớn (56px)', value: 'large' },
          ],
          defaultValue: 'medium',
        },
        {
          name: 'spacing',
          type: 'select',
          label: 'Khoảng cách giữa các nút',
          options: [
            { label: 'Gần (8px)', value: 'tight' },
            { label: 'Vừa (12px)', value: 'normal' },
            { label: 'Rộng (16px)', value: 'loose' },
          ],
          defaultValue: 'normal',
        },
        {
          name: 'showTooltip',
          type: 'checkbox',
          label: 'Hiển thị tooltip',
          defaultValue: true,
          admin: {
            description: 'Hiển thị nhãn khi hover vào nút',
          },
        },
      ],
    },
  ],
};

module.exports = { FloatingButtons };
