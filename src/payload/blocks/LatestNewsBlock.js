

exports.LatestNewsBlock = {
  slug: 'latestNews',
  labels: {
    singular: 'Tin Tức Mới Nhất',
    plural: 'Tin Tức Mới Nhất',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'sectionId',
      type: 'text',
      label: 'ID Section (để phân biệt)',
      admin: {
        description: 'Ví dụ: tin-tuc-cong-nghe, tin-tuc-khuyen-mai, tin-tuc-su-kien, latest-news',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      required: true,
      defaultValue: 'Tin Tức Mới Nhất',
      admin: {
        description: 'Ví dụ: Tin Công Nghệ, Tin Khuyến Mãi, Sự Kiện Nổi Bật',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả section',
      admin: {
        description: 'Mô tả ngắn về section tin tức này',
      },
    },
    {
      name: 'posts',
      type: 'relationship',
      label: 'Chọn bài viết',
      relationTo: 'news',
      hasMany: true,
      minRows: 3,
      maxRows: 6,
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Text nút CTA',
      defaultValue: 'Xem Tất Cả Tin Tức',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link nút CTA',
      defaultValue: '/tin-tuc',
    },
  ],
};
