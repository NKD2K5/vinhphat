exports.AchievementsBlock = {
  slug: 'achievements',
  labels: {
    singular: 'Thành Tựu',
    plural: 'Thành Tựu',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      defaultValue: 'Thành Tựu Của Chúng Tôi',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Danh sách thành tựu',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Số liệu',
          required: false,
          admin: {
            description: 'Ví dụ: 15+, 5000+',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Nhãn',
          required: false,
          admin: {
            description: 'Ví dụ: Năm Kinh Nghiệm',
          },
        },
      ],
    },
  ],
};
