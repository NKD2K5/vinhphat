const CKEditorField = require('../../../components/CKEditorFieldSafe');
const ImageUploadField = require('../../../components/ImageUploadField');
const { buildCollectionHooks } = require('../../../../payload/hooks/logrocket');

exports.Products = {
  slug: 'products',
  labels: {
    singular: 'Sản phẩm',
    plural: 'Sản phẩm',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'serviceCategory', 'service', 'price', 'isFeatured'],
    group: 'Nội Dung',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: buildCollectionHooks('products'),
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
      admin: {
        description: 'URL-friendly version của tên sản phẩm',
      },
    },
    
    {
      name: 'description',
      type: 'richText',
      label: 'Mô tả',
      required: true,
      admin: {
        components: {
          Field: CKEditorField,
        },
      },
    },
    {
      name: 'serviceCategory',
      type: 'relationship',
      label: 'Danh Mục Dịch Vụ (Cha)',
      relationTo: 'service-categories',
      required: true,
      admin: {
        description: 'Chọn danh mục dịch vụ cha (VD: In Ấn Kỹ Thuật Số)',
      },
    },
    {
      name: 'service',
      type: 'relationship',
      label: 'Dịch Vụ',
      relationTo: 'service-items',
      required: true,
      admin: {
        description: 'Chọn dịch vụ cụ thể (VD: In Catalogue, In Brochure...)',
        condition: (data, siblingData) => {
          // Chỉ hiển thị khi đã chọn service category
          return !!siblingData.serviceCategory;
        },
      },
    },
    {
      name: 'price',
      type: 'text',
      label: 'Giá',
    },
    {
      name: 'image',
      type: 'text',
      label: 'Hình ảnh chính (URL)',
      admin: {
        components: {
          Field: ImageUploadField,
        },
        description: 'Upload ảnh qua C# API',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Thư viện ảnh',
      admin: {
        description: 'Thêm nhiều ảnh cho sản phẩm (hiển thị dưới dạng thumbnail)',
      },
      fields: [
        {
          name: 'image',
          type: 'text',
          label: 'Ảnh (URL)',
          admin: {
            components: {
              Field: ImageUploadField,
            },
            description: 'Upload ảnh qua C# API',
          },
        },
      ],
    },
    {
      name: 'specifications',
      type: 'group',
      label: 'Thông Số Cơ Bản',
      admin: {
        description: 'Thông tin hiển thị trong phần "THÔNG SỐ CƠ BẢN"',
      },
      fields: [
        {
          name: 'material',
          type: 'text',
          label: 'Chất liệu / Màu sắc',
          admin: {
            placeholder: 'VD: nhiều màu, giấy couche, giấy kraft...',
          },
        },
        {
          name: 'size',
          type: 'text',
          label: 'Kích thước / Loại giấy',
          admin: {
            placeholder: 'VD: Couche 150-250gsm, A4, A5...',
          },
        },
        {
          name: 'colors',
          type: 'text',
          label: 'Màu in',
          admin: {
            placeholder: 'VD: 4 màu, CMYK, đen trắng...',
          },
        },
        {
          name: 'printing',
          type: 'text',
          label: 'Phương pháp in',
          admin: {
            placeholder: 'VD: In offset, in kỹ thuật số...',
          },
        },
        {
          name: 'quantity',
          type: 'text',
          label: 'Số lượng',
          admin: {
            placeholder: 'VD: Từ 100 bản, tối thiểu 500...',
          },
        },
        {
          name: 'finishing',
          type: 'text',
          label: 'Gia công',
          admin: {
            placeholder: 'VD: Cán màng, bế, gấp...',
          },
        },
      ],
    },
    {
      name: 'detailedInfo',
      type: 'richText',
      label: 'Thông Tin Chi Tiết',
      admin: {
        components: {
          Field: CKEditorField,
        },
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Đặc Điểm Nổi Bật',
      admin: {
        description: 'Các điểm nổi bật của sản phẩm',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Đặc điểm',
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
};
