const { buildConfig } = require('payload/config');
const { webpackBundler } = require('@payloadcms/bundler-webpack');
const { mongooseAdapter } = require('@payloadcms/db-mongodb');
const { slateEditor } = require('@payloadcms/richtext-slate');
const path = require('path');

module.exports = buildConfig({
  serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001',
  admin: {
    user: 'users',
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority',
  }),
  collections: [
    {
      slug: 'users',
      auth: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    // Collection quản lý trang Home
    {
      slug: 'home-page',
      labels: {
        singular: 'Trang chủ',
        plural: 'Trang chủ',
      },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'updatedAt'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề trang',
          required: true,
          defaultValue: 'Trang chủ - Vĩnh Phát Printing',
        },
        // SEO Fields
        {
          name: 'seo',
          type: 'group',
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
              maxLength: 60,
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
              maxLength: 160,
            },
            {
              name: 'metaKeywords',
              type: 'text',
              label: 'Meta Keywords',
            },
            {
              name: 'ogImage',
              type: 'upload',
              label: 'OG Image',
              relationTo: 'media',
            },
          ],
        },
        // Hero Section
        {
          name: 'hero',
          type: 'group',
          label: 'Hero Section',
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Tiêu đề chính',
            },
            {
              name: 'subheading',
              type: 'textarea',
              label: 'Mô tả',
            },
            {
              name: 'ctaText',
              type: 'text',
              label: 'Text nút CTA',
            },
            {
              name: 'ctaLink',
              type: 'text',
              label: 'Link nút CTA',
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              label: 'Ảnh nền',
              relationTo: 'media',
            },
            // Hero Stats
            {
              name: 'stats',
              type: 'array',
              label: 'Thống kê',
              maxRows: 3,
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  label: 'Số (VD: 15+)',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Nhãn (VD: Năm Kinh Nghiệm)',
                  required: true,
                },
              ],
            },
          ],
        },
        // Contact Section
        {
          name: 'contact',
          type: 'group',
          label: 'Phần liên hệ',
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Tiêu đề',
              defaultValue: 'Đội ngũ chuyên nghiệp sẵn sàng hỗ trợ',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Mô tả',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Số điện thoại',
            },
            {
              name: 'image',
              type: 'upload',
              label: 'Hình ảnh',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    // Collection sản phẩm
    {
      slug: 'products',
      labels: {
        singular: 'Sản phẩm',
        plural: 'Sản phẩm',
      },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'category', 'price', 'isFeatured'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Tên sản phẩm',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Hình ảnh',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'price',
          type: 'text',
          label: 'Giá',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
          label: 'Danh mục',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Đánh giá',
          min: 0,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          label: 'Hiển thị trang chủ',
          defaultValue: false,
        },
        {
          name: 'features',
          type: 'array',
          label: 'Tính năng',
          fields: [
            {
              name: 'feature',
              type: 'text',
              label: 'Tính năng',
            },
          ],
        },
      ],
    },
    // Collection đánh giá
    {
      slug: 'reviews',
      labels: {
        singular: 'Đánh giá',
        plural: 'Đánh giá',
      },
      admin: {
        useAsTitle: 'userName',
        defaultColumns: ['userName', 'rating', 'date'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'userName',
          type: 'text',
          label: 'Tên khách hàng',
          required: true,
        },
        {
          name: 'reviewTitle',
          type: 'text',
          label: 'Tiêu đề',
          required: true,
        },
        {
          name: 'reviewText',
          type: 'textarea',
          label: 'Nội dung đánh giá',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          label: 'Số sao',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Avatar',
          relationTo: 'media',
        },
        {
          name: 'date',
          type: 'date',
          label: 'Ngày đánh giá',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
    // Collection tin tức
    {
      slug: 'news',
      labels: {
        singular: 'Tin tức',
        plural: 'Tin tức',
      },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'publishedAt'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          required: true,
        },
        {
          name: 'summary',
          type: 'textarea',
          label: 'Tóm tắt',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Nội dung',
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Hình ảnh',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
          label: 'Danh mục',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          label: 'Tác giả',
          required: true,
        },
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Ngày xuất bản',
          required: true,
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
    // Collection Services
    {
      slug: 'services',
      labels: {
        singular: 'Dịch vụ',
        plural: 'Dịch vụ',
      },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'order'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Tên dịch vụ',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji hoặc icon name)',
          defaultValue: '📄',
        },
        {
          name: 'order',
          type: 'number',
          label: 'Thứ tự hiển thị',
          defaultValue: 0,
        },
      ],
    },
    // Collection Process Steps
    {
      slug: 'process-steps',
      labels: {
        singular: 'Bước quy trình',
        plural: 'Quy trình làm việc',
      },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'step', 'order'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'step',
          type: 'number',
          label: 'Bước số',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          defaultValue: '✓',
        },
        {
          name: 'order',
          type: 'number',
          label: 'Thứ tự hiển thị',
          defaultValue: 0,
        },
      ],
    },
    // Collection Why Choose Us Features
    {
      slug: 'why-choose-us',
      labels: {
        singular: 'Lý do chọn chúng tôi',
        plural: 'Tại sao chọn chúng tôi',
      },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'order'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
          required: true,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          defaultValue: '✓',
        },
        {
          name: 'order',
          type: 'number',
          label: 'Thứ tự hiển thị',
          defaultValue: 0,
        },
      ],
    },
    // Collection media
    {
      slug: 'media',
      labels: {
        singular: 'Media',
        plural: 'Media',
      },
      upload: {
        staticURL: '/media',
        staticDir: 'media',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
        },
      ],
    },
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
