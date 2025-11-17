

exports.FeaturedProductsBlock = {
  slug: 'featuredProducts',
  labels: {
    singular: 'Sản Phẩm Nổi Bật',
    plural: 'Sản Phẩm Nổi Bật',
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
        description: 'Ví dụ: san-pham-moi, san-pham-ban-chay, san-pham-khuyen-mai',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề section',
      required: true,
      defaultValue: 'Sản Phẩm Nổi Bật',
      admin: {
        description: 'Ví dụ: Sản Phẩm Mới Nhất, Sản Phẩm Bán Chạy, Sản Phẩm Khuyến Mãi',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      defaultValue: 'Khám phá các sản phẩm in ấn chất lượng cao được khách hàng tin dùng.',
    },
    {
      name: 'products',
      type: 'relationship',
      label: 'Chọn sản phẩm',
      relationTo: 'products',
      hasMany: true,
      minRows: 3,
      maxRows: 8,
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Text nút CTA',
      defaultValue: 'Xem Tất Cả Sản Phẩm',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Link nút CTA',
      defaultValue: '/san-pham',
    },
  ],
};
