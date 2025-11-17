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
    meta: {
      titleSuffix: '- VinhPhat Printing',
      favicon: '/favicon.ico',
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb+srv://duytoan20052011:Maiyeu9a3@duy.01c086q.mongodb.net/VinhPhat?retryWrites=true&w=majority',
  }),
  collections: [
    // Users Collection
    {
      slug: 'users',
      auth: true,
      labels: {
        singular: 'Người dùng',
        plural: 'Người dùng',
      },
      admin: {
        useAsTitle: 'email',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Tên',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          label: 'Vai trò',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          defaultValue: 'editor',
          required: true,
        },
      ],
    },
    
    // Home Page Collection (Singleton with Blocks)
    {
      slug: 'home-page',
      labels: {
        singular: 'Trang Chủ',
        plural: 'Trang Chủ',
      },
      admin: {
        useAsTitle: 'title',
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
          defaultValue: 'Trang Chủ - VinhPhat Printing',
        },
        // SEO
        {
          name: 'seo',
          type: 'group',
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
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
        // Layout Blocks
        {
          name: 'layout',
          type: 'blocks',
          label: 'Nội dung trang',
          blocks: [
            // Hero Block
            {
              slug: 'hero',
              labels: {
                singular: 'Hero Section',
                plural: 'Hero Sections',
              },
              fields: [
                {
                  name: 'headline',
                  type: 'richText',
                  label: 'Tiêu đề chính',
                  required: true,
                },
                {
                  name: 'subheadline',
                  type: 'richText',
                  label: 'Tiêu đề phụ',
                },
                {
                  name: 'primaryCTA',
                  type: 'group',
                  label: 'Nút CTA chính',
                  fields: [
                    { name: 'text', type: 'text', label: 'Text', defaultValue: 'Nhận Báo Giá Ngay' },
                    { name: 'link', type: 'text', label: 'Link', defaultValue: '/lien-he' },
                  ],
                },
                {
                  name: 'secondaryCTA',
                  type: 'group',
                  label: 'Nút CTA phụ',
                  fields: [
                    { name: 'text', type: 'text', label: 'Text', defaultValue: 'Dịch Vụ Của Chúng Tôi' },
                    { name: 'link', type: 'text', label: 'Link', defaultValue: '/dich-vu' },
                  ],
                },
                {
                  name: 'backgroundImages',
                  type: 'array',
                  label: 'Ảnh nền / Slider',
                  fields: [
                    { name: 'image', type: 'upload', relationTo: 'media', required: true },
                  ],
                },
                {
                  name: 'stats',
                  type: 'array',
                  label: 'Thống kê',
                  maxRows: 3,
                  fields: [
                    { name: 'value', type: 'text', label: 'Giá trị (VD: 15+)', required: true },
                    { name: 'label', type: 'text', label: 'Nhãn', required: true },
                    { name: 'icon', type: 'text', label: 'Icon (emoji)', defaultValue: '📊' },
                  ],
                },
              ],
            },
            
            // About Block
            {
              slug: 'about',
              labels: { singular: 'Giới Thiệu', plural: 'Giới Thiệu' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
                { name: 'description', type: 'richText', label: 'Mô tả', required: true },
                { name: 'image', type: 'upload', label: 'Hình ảnh', relationTo: 'media' },
                {
                  name: 'infoCards',
                  type: 'array',
                  label: 'Thẻ thông tin',
                  fields: [
                    { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
                    { name: 'value', type: 'text', label: 'Giá trị', required: true },
                    { name: 'icon', type: 'text', label: 'Icon', defaultValue: '✓' },
                  ],
                },
              ],
            },
            
            // Services Block
            {
              slug: 'services',
              labels: { singular: 'Dịch Vụ', plural: 'Dịch Vụ' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', defaultValue: 'Dịch Vụ In Ấn' },
                { name: 'description', type: 'textarea', label: 'Mô tả' },
                {
                  name: 'services',
                  type: 'array',
                  label: 'Danh sách dịch vụ',
                  fields: [
                    { name: 'icon', type: 'text', label: 'Icon', defaultValue: '📄' },
                    { name: 'title', type: 'text', label: 'Tên dịch vụ', required: true },
                    { name: 'description', type: 'textarea', label: 'Mô tả', required: true },
                    { name: 'link', type: 'text', label: 'Link' },
                  ],
                },
                { name: 'ctaText', type: 'text', label: 'Text CTA', defaultValue: 'Xem Tất Cả' },
                { name: 'ctaLink', type: 'text', label: 'Link CTA', defaultValue: '/dich-vu' },
              ],
            },
            
            // Featured Products Block
            {
              slug: 'featuredProducts',
              labels: { singular: 'Sản Phẩm Nổi Bật', plural: 'Sản Phẩm Nổi Bật' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', defaultValue: 'Sản Phẩm Nổi Bật' },
                { name: 'description', type: 'textarea', label: 'Mô tả' },
                { name: 'products', type: 'relationship', label: 'Sản phẩm', relationTo: 'products', hasMany: true },
                { name: 'ctaText', type: 'text', label: 'Text CTA', defaultValue: 'Xem Tất Cả' },
                { name: 'ctaLink', type: 'text', label: 'Link CTA', defaultValue: '/san-pham' },
              ],
            },
            
            // Workflow Block
            {
              slug: 'workflow',
              labels: { singular: 'Quy Trình', plural: 'Quy Trình' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', defaultValue: 'Quy Trình Làm Việc' },
                { name: 'intro', type: 'textarea', label: 'Giới thiệu' },
                {
                  name: 'steps',
                  type: 'array',
                  label: 'Các bước',
                  fields: [
                    { name: 'stepNumber', type: 'number', label: 'Số thứ tự', required: true },
                    { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
                    { name: 'description', type: 'textarea', label: 'Mô tả', required: true },
                    { name: 'icon', type: 'text', label: 'Icon', defaultValue: '✓' },
                  ],
                },
              ],
            },
            
            // Testimonials Block
            {
              slug: 'testimonials',
              labels: { singular: 'Đánh Giá', plural: 'Đánh Giá' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', defaultValue: 'Khách Hàng Nói Gì' },
                {
                  name: 'testimonials',
                  type: 'array',
                  label: 'Danh sách',
                  fields: [
                    { name: 'customerName', type: 'text', label: 'Tên khách hàng', required: true },
                    { name: 'position', type: 'text', label: 'Chức vụ' },
                    { name: 'content', type: 'textarea', label: 'Nội dung', required: true },
                    { name: 'rating', type: 'number', label: 'Số sao', min: 1, max: 5, defaultValue: 5 },
                    { name: 'image', type: 'upload', label: 'Ảnh', relationTo: 'media' },
                  ],
                },
              ],
            },
            
            // Latest News Block
            {
              slug: 'latestNews',
              labels: { singular: 'Tin Tức', plural: 'Tin Tức' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', defaultValue: 'Tin Tức Mới Nhất' },
                { name: 'posts', type: 'relationship', label: 'Bài viết', relationTo: 'news', hasMany: true },
                { name: 'ctaText', type: 'text', label: 'Text CTA', defaultValue: 'Xem Tất Cả' },
                { name: 'ctaLink', type: 'text', label: 'Link CTA', defaultValue: '/tin-tuc' },
              ],
            },
            
            // Why Choose Us Block
            {
              slug: 'whyChooseUs',
              labels: { singular: 'Tại Sao Chọn', plural: 'Tại Sao Chọn' },
              fields: [
                { name: 'title', type: 'text', label: 'Tiêu đề', defaultValue: 'Tại Sao Chọn Chúng Tôi' },
                {
                  name: 'reasons',
                  type: 'array',
                  label: 'Lý do',
                  fields: [
                    { name: 'icon', type: 'text', label: 'Icon', defaultValue: '✓' },
                    { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
                    { name: 'description', type: 'textarea', label: 'Mô tả', required: true },
                  ],
                },
              ],
            },
            
            // CTA Block
            {
              slug: 'cta',
              labels: { singular: 'CTA', plural: 'CTA' },
              fields: [
                { name: 'text', type: 'richText', label: 'Nội dung', required: true },
                {
                  name: 'primaryButton',
                  type: 'group',
                  label: 'Nút chính',
                  fields: [
                    { name: 'text', type: 'text', label: 'Text', defaultValue: 'Liên Hệ Ngay' },
                    { name: 'link', type: 'text', label: 'Link', defaultValue: '/lien-he' },
                  ],
                },
                {
                  name: 'secondaryButton',
                  type: 'group',
                  label: 'Nút phụ',
                  fields: [
                    { name: 'text', type: 'text', label: 'Text', defaultValue: 'Nhận Báo Giá' },
                    { name: 'link', type: 'text', label: 'Link', defaultValue: '/bao-gia' },
                  ],
                },
                { name: 'backgroundImage', type: 'upload', label: 'Ảnh nền', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
    
    // Products Collection
    {
      slug: 'products',
      labels: {
        singular: 'Sản phẩm',
        plural: 'Sản phẩm',
      },
      admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'category', 'isFeatured'],
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
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Mô tả',
        },
        {
          name: 'category',
          type: 'text',
          label: 'Danh mục',
        },
        {
          name: 'price',
          type: 'text',
          label: 'Giá',
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Hình ảnh',
          relationTo: 'media',
        },
        {
          name: 'gallery',
          type: 'array',
          label: 'Thư viện ảnh',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          label: 'Hiển thị trang chủ',
          defaultValue: false,
        },
      ],
    },
    
    // News Collection
    {
      slug: 'news',
      labels: {
        singular: 'Tin tức',
        plural: 'Tin tức',
      },
      admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'publishedAt'],
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
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: true,
          unique: true,
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Tóm tắt',
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Nội dung',
          required: true,
        },
        {
          name: 'featuredImage',
          type: 'upload',
          label: 'Ảnh đại diện',
          relationTo: 'media',
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
    
    // Reviews Collection
    {
      slug: 'reviews',
      labels: {
        singular: 'Đánh giá',
        plural: 'Đánh giá',
      },
      admin: {
        useAsTitle: 'customerName',
        defaultColumns: ['customerName', 'rating', 'date'],
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'customerName',
          type: 'text',
          label: 'Tên khách hàng',
          required: true,
        },
        {
          name: 'position',
          type: 'text',
          label: 'Chức vụ / Công ty',
        },
        {
          name: 'content',
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
          label: 'Ảnh khách hàng',
          relationTo: 'media',
        },
        {
          name: 'date',
          type: 'date',
          label: 'Ngày đánh giá',
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },
    
    // Media Collection
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
