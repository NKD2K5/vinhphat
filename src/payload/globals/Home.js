const ImageUploadField = require('../../components/ImageUploadField');
const CKEditorField = require('../../components/CKEditorFieldSafe');

exports.Home = {
  slug: 'home-page',
  label: 'Trang Chủ',
  admin: {
    group: 'Toàn thể (globals)',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề trang',
      required: true,
      defaultValue: 'Trang Chủ - VinhPhat Printing',
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
          type: 'text',
          label: 'OG Image (URL)',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API',
          },
        },
      ],
    },
    // Hero Section
    {
      name: 'heroSection',
      type: 'group',
      label: '🎯 Hero Section (Banner Chính)',
      fields: [
        {
          name: 'slides',
          type: 'array',
          label: 'Banner Slides',
          minRows: 1,
          maxRows: 5,
          fields: [
            {
              name: 'headline',
              type: 'text',
              label: 'Tiêu đề chính',
              required: true,
            },
            {
              name: 'subheadline',
              type: 'textarea',
              label: 'Mô tả ngắn',
            },
            {
              name: 'backgroundImage',
              type: 'text',
              label: 'Link ảnh nền',
              admin: {
                components: {
                  Field: ImageUploadField,
                },
              },
            },
            {
              name: 'backgroundColor',
              type: 'text',
              label: 'Màu nền (nếu không có ảnh)',
              defaultValue: '#1e40af',
            },
            {
              name: 'primaryButton',
              type: 'group',
              label: 'Nút chính',
              fields: [
                { name: 'text', type: 'text', label: 'Văn bản nút', defaultValue: 'Nhận Báo Giá Ngay' },
                { name: 'link', type: 'text', label: 'Đường dẫn', defaultValue: '/lien-he' },
              ],
            },
            {
              name: 'secondaryButton',
              type: 'group',
              label: 'Nút phụ',
              fields: [
                { name: 'text', type: 'text', label: 'Văn bản nút', defaultValue: 'Xem Sản Phẩm' },
                { name: 'link', type: 'text', label: 'Đường dẫn', defaultValue: '/san-pham' },
              ],
            },
          ],
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Thống kê nổi bật',
          minRows: 3,
          maxRows: 4,
          fields: [
            { name: 'value', type: 'text', label: 'Giá trị (VD: 15+)', required: true },
            { name: 'label', type: 'text', label: 'Nhãn (VD: Năm Kinh Nghiệm)', required: true },
            { name: 'icon', type: 'text', label: 'Icon (emoji)', defaultValue: '📊' },
          ],
        },
      ],
    },
    
    // About Section
    {
      name: 'aboutSection',
      type: 'group',
      label: '🏢 Giới Thiệu Công Ty',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          required: true,
          defaultValue: 'VinhPhat - Đối Tác In Ấn Đáng Tin Cậy',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả chi tiết',
          admin: {
            components: {
              Field: CKEditorField,
            },
            description: 'Sử dụng thanh công cụ đầy đủ để định dạng văn bản',
          },
        },
        {
          name: 'image',
          type: 'text',
          label: 'Hình ảnh',
          admin: {
            components: {
              Field: ImageUploadField,
            },
          },
        },
        {
          name: 'primaryButton',
          type: 'group',
          label: 'Nút chính',
          fields: [
            { name: 'text', type: 'text', label: 'Văn bản', defaultValue: 'Thông tin chi tiết' },
            { name: 'link', type: 'text', label: 'Đường dẫn', defaultValue: '/ve-chung-toi' },
          ],
        },
        {
          name: 'secondaryButton',
          type: 'group',
          label: 'Nút phụ',
          fields: [
            { name: 'text', type: 'text', label: 'Văn bản', defaultValue: 'Liên hệ ngay' },
            { name: 'link', type: 'text', label: 'Đường dẫn', defaultValue: '/lien-he' },
          ],
        },
      ],
    },
    
    // Services Section
    {
      name: 'servicesSection',
      type: 'group',
      label: '🛠️ Dịch Vụ Của Chúng Tôi',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Dịch Vụ Của Chúng Tôi',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả ngắn',
          admin: {
            components: {
              Field: CKEditorField,
            },
            description: 'Sử dụng thanh công cụ để định dạng văn bản',
          },
        },
        {
          name: 'categories',
          type: 'relationship',
          label: 'Chọn danh mục dịch vụ',
          relationTo: 'service-categories',
          hasMany: true,
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Nút xem thêm',
          fields: [
            { name: 'text', type: 'text', label: 'Văn bản', defaultValue: 'Xem Tất Cả Dịch Vụ' },
            { name: 'link', type: 'text', label: 'Đường dẫn', defaultValue: '/dich-vu' },
          ],
        },
      ],
    },
    
    // Why Choose Us Section
    {
      name: 'whyChooseUsSection',
      type: 'group',
      label: '🏆 Tại Sao Chọn Chúng Tôi',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Tại Sao Nên Lựa Chọn Chúng Tôi?',
        },
        {
          name: 'reasons',
          type: 'array',
          label: 'Các lý do',
          minRows: 4,
          maxRows: 10,
          fields: [
            { name: 'icon', type: 'text', label: 'Icon (emoji)', defaultValue: '🏆' },
            { name: 'title', type: 'text', label: 'Tiêu đề', required: true },
            { name: 'description', type: 'textarea', label: 'Mô tả chi tiết', required: true },
          ],
        },
      ],
    },
    
    // Workflow Section
    {
      name: 'workflowSection',
      type: 'group',
      label: '📋 Quy Trình Làm Việc',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Quy Trình Làm Việc',
        },
        {
          name: 'intro',
          type: 'text',
          label: 'Giới thiệu ngắn',
          admin: {
            components: {
              Field: CKEditorField,
            },
            description: 'Sử dụng thanh công cụ để định dạng văn bản',
          },
        },
        {
          name: 'steps',
          type: 'array',
          label: 'Các bước thực hiện',
          minRows: 3,
          maxRows: 8,
          fields: [
            { name: 'stepNumber', type: 'number', label: 'Số thứ tự', required: true },
            { name: 'title', type: 'text', label: 'Tiêu đề bước', required: true },
            { name: 'description', type: 'textarea', label: 'Mô tả chi tiết', required: true },
            { name: 'icon', type: 'text', label: 'Icon (emoji)', defaultValue: '📝' },
          ],
        },
      ],
    },
    
    // Featured Products Section
    {
      name: 'featuredProductsSection',
      type: 'group',
      label: '⭐ Sản Phẩm Nổi Bật',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Sản Phẩm Nổi Bật',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả ngắn',
          admin: {
            components: {
              Field: CKEditorField,
            },
            description: 'Sử dụng thanh công cụ để định dạng văn bản',
          },
        },
        {
          name: 'products',
          type: 'relationship',
          label: 'Chọn sản phẩm nổi bật',
          relationTo: 'products',
          hasMany: true,
          maxRows: 8,
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Nút xem thêm',
          fields: [
            { name: 'text', type: 'text', label: 'Văn bản', defaultValue: 'Xem Tất Cả Sản Phẩm' },
            { name: 'link', type: 'text', label: 'Đường dẫn', defaultValue: '/san-pham' },
          ],
        },
      ],
    },
    
    // Testimonials Section
    {
      name: 'testimonialsSection',
      type: 'group',
      label: '💬 Đánh Giá Khách Hàng',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Đánh Giá Của Khách Hàng',
        },
        {
          name: 'testimonials',
          type: 'array',
          label: 'Các đánh giá',
          minRows: 3,
          maxRows: 10,
          fields: [
            { name: 'customerName', type: 'text', label: 'Tên khách hàng', required: true },
            { name: 'position', type: 'text', label: 'Chức vụ/Công ty', required: true },
            { 
              name: 'content', 
              type: 'text', 
              label: 'Nội dung đánh giá', 
              required: true,
              admin: {
                components: {
                  Field: CKEditorField,
                },
              },
            },
            { 
              name: 'rating', 
              type: 'number', 
              label: 'Đánh giá sao (1-5)',
              min: 1,
              max: 5,
              defaultValue: 5,
            },
            {
              name: 'image',
              type: 'text',
              label: 'Ảnh đại diện khách hàng',
              admin: {
                components: {
                  Field: ImageUploadField,
                },
              },
            },
          ],
        },
      ],
    },
    
    // Latest News Section
    {
      name: 'latestNewsSection',
      type: 'group',
      label: '📰 Tin Tức Mới Nhất',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề',
          defaultValue: 'Tin Tức Mới Nhất',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả ngắn',
          admin: {
            components: {
              Field: CKEditorField,
            },
            description: 'Sử dụng thanh công cụ để định dạng văn bản',
          },
        },
        {
          name: 'posts',
          type: 'relationship',
          label: 'Chọn bài viết hiển thị',
          relationTo: 'news',
          hasMany: true,
          maxRows: 6,
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Nút xem thêm',
          fields: [
            { name: 'text', type: 'text', label: 'Văn bản', defaultValue: 'Xem Tất Cả Tin Tức' },
            { name: 'link', type: 'text', label: 'Đường dẫn', defaultValue: '/tin-tuc' },
          ],
        },
      ],
    },
  ],
};