const FooterInfo = {
  slug: 'footer-info',
  label: 'Thông tin Footer',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user, // Chỉ admin mới sửa được
  },
  fields: [
    {
      name: 'companyInfo',
      type: 'group',
      label: 'Thông tin công ty',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Tên công ty',
          required: true,
          defaultValue: 'CÔNG TY TNHH IN ẤN VÀ THƯƠNG MẠI VĨNH PHÁT',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả ngắn',
          maxLength: 200,
          defaultValue: 'Chuyên cung cấp các dịch vụ in ấn chất lượng cao với hơn 15 năm kinh nghiệm trong ngành.',
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Địa chỉ',
          required: true,
          defaultValue: 'Khu Công Nghiệp Thạch Khôi, Phường Thạch Khôi, Thành Phố Hải Dương, Hải Dương, Việt Nam',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Số điện thoại',
          required: true,
          defaultValue: '0977 344 567',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          defaultValue: 'invinhphat2025@gmail.com',
        },
      ],
    },
    {
      name: 'quickLinks',
      type: 'group',
      label: 'Liên kết nhanh',
      fields: [
        {
          name: 'column1',
          type: 'group',
          label: 'Cột 1 - Thông tin liên hệ',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Tiêu đề',
              defaultValue: 'Thông tin liên hệ',
            },
            {
              name: 'links',
              type: 'array',
              label: 'Danh sách link',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
              ],
              defaultValue: [
                { text: 'Trang chủ', url: '/' },
                { text: 'Dịch vụ', url: '/dich-vu' },
                { text: 'Sản phẩm', url: '/san-pham' },
                { text: 'Giới thiệu', url: '/ve-chung-toi' },
                { text: 'Liên hệ', url: '/lien-he' },
              ],
            },
          ],
        },
        {
          name: 'column2',
          type: 'group',
          label: 'Cột 2 - Liên kết nhanh',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Tiêu đề',
              defaultValue: 'Liên kết nhanh',
            },
            {
              name: 'links',
              type: 'array',
              label: 'Danh sách link',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
              ],
              defaultValue: [
                { text: 'In offset', url: '/san-pham?category=in-offset' },
                { text: 'In kỹ thuật số', url: '/san-pham?category=in-ky-thuat-so' },
                { text: 'In bao bì giấy', url: '/san-pham?category=in-bao-bi-giay' },
                { text: 'In túi giấy', url: '/san-pham?category=in-tui-giay' },
                { text: 'In ấn khác', url: '/san-pham' },
              ],
            },
          ],
        },
        {
          name: 'column3',
          type: 'group',
          label: 'Cột 3 - Dịch vụ chính',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Tiêu đề',
              defaultValue: 'Dịch vụ chính',
            },
            {
              name: 'links',
              type: 'array',
              label: 'Danh sách link',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
              ],
              defaultValue: [
                { text: 'In offset', url: '/dich-vu/in-offset' },
                { text: 'In kỹ thuật số', url: '/dich-vu/in-ky-thuat-so' },
                { text: 'In bao bì giấy', url: '/dich-vu/in-bao-bi-giay' },
                { text: 'In túi giấy', url: '/dich-vu/in-tui-giay' },
                { text: 'In ấn khác: laser', url: '/dich-vu/in-an-khac' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Mạng xã hội',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
          defaultValue: 'https://facebook.com/vinhphatprinting',
        },
        {
          name: 'gmail',
          type: 'text',
          label: 'Gmail',
          defaultValue: 'invinhphat6868@gmail.com',
        },
        {
          name: 'zalo',
          type: 'text',
          label: 'Zalo URL',
          defaultValue: 'https://zalo.me/0977344567',
        },
      ],
    },
    {
      name: 'copyright',
      type: 'group',
      label: 'Bản quyền',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text bản quyền',
          defaultValue: '© 2025 VinhPhat Printing. Tất cả các quyền được bảo lưu.',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links bổ sung',
          maxRows: 3,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
          defaultValue: [
            { text: 'Chính sách bảo mật', url: '/chinh-sach-bao-mat' },
            { text: 'Điều khoản dịch vụ', url: '/dieu-khoan-dich-vu' },
          ],
        },
      ],
    },
  ],
};

module.exports = { FooterInfo };
