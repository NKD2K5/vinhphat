exports.NewsCategories = {
  slug: 'news-categories',
  labels: {
    singular: 'Danh Mục Tin Tức',
    plural: 'Danh Mục Tin Tức',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
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
      label: 'Tên Danh Mục',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version (VD: tin-tuc-in-an)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô Tả',
      admin: {
        description: 'Mô tả ngắn về danh mục',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ Tự Hiển Thị',
      defaultValue: 0,
      admin: {
        description: 'Số thứ tự hiển thị (nhỏ hơn = hiển thị trước)',
      },
    },
  ],
};
