exports.CoreValuesBlock = {
  slug: 'coreValues',
  labels: {
    singular: 'Giá Trị Cốt Lõi',
    plural: 'Giá Trị Cốt Lõi',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      defaultValue: 'Giá Trị Cốt Lõi',
    },
    {
      name: 'values',
      type: 'array',
      label: 'Danh sách giá trị',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          required: false,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả',
          required: false,
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: false,
          defaultValue: 'check',
          options: [
            { label: '✓ Check (Chất lượng)', value: 'check' },
            { label: '⚡ Lightning (Tốc độ)', value: 'lightning' },
            { label: '👥 Users (Tận tâm)', value: 'users' },
            { label: '💡 Lightbulb (Sáng tạo)', value: 'lightbulb' },
            { label: '⭐ Star (Xuất sắc)', value: 'star' },
            { label: '🛡️ Shield (Uy tín)', value: 'shield' },
            { label: '🎯 Target (Mục tiêu)', value: 'target' },
            { label: '🚀 Rocket (Đổi mới)', value: 'rocket' },
          ],
          defaultValue: 'check',
        },
      ],
    },
  ],
};
