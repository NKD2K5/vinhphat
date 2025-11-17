const Navigation = {
  slug: 'navigation',
  label: 'Điều Hướng',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user, // Only admins can update
  },
  fields: [
    {
      name: 'mainNav',
      type: 'array',
      label: 'Menu Chính',
      labels: {
        singular: 'Mục Menu',
        plural: 'Các Mục Menu',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Nhãn Hiển Thị',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Đường Dẫn',
          required: true,
          admin: {
            description: 'Đường dẫn tương đối (ví dụ: /dich-vu) hoặc URL đầy đủ',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Mở Trang Mới',
          defaultValue: false,
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: ({ data, index }) => {
            return data?.label || `Mục ${String(index).padStart(2, '0')}`;
          },
        },
      },
    },
  ],
};

module.exports = { Navigation };
