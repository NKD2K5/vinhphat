const { slateEditor } = require('@payloadcms/richtext-slate');

/**
 * Cấu hình Rich Text Editor với đầy đủ tính năng
 * Toolbar sẽ hiển thị tất cả các công cụ sau khi restart server
 */
const richTextConfig = slateEditor({
  admin: {
    // ELEMENTS - Các phần tử block level
    elements: [
      'h1',        // Heading 1
      'h2',        // Heading 2
      'h3',        // Heading 3
      'h4',        // Heading 4
      'h5',        // Heading 5
      'h6',        // Heading 6
      'blockquote', // Trích dẫn
      'ul',        // Danh sách không thứ tự
      'ol',        // Danh sách có thứ tự
      'link',      // Liên kết
      'relationship', // Liên kết đến collection khác
      'upload',    // Upload ảnh/file
      'indent',    // Thụt lề
    ],
    
    // LEAVES - Các định dạng inline
    leaves: [
      'bold',          // In đậm
      'italic',        // In nghiêng
      'underline',     // Gạch chân
      'strikethrough', // Gạch ngang
      'code',          // Code inline
    ],
    
    // Cấu hình chi tiết cho Link
    link: {
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Mở trong tab mới',
          defaultValue: false,
        },
        {
          name: 'rel',
          type: 'select',
          label: 'Rel Attribute',
          hasMany: true,
          options: [
            { label: 'No Opener', value: 'noopener' },
            { label: 'No Referrer', value: 'noreferrer' },
            { label: 'No Follow', value: 'nofollow' },
          ],
          admin: {
            description: 'Thuộc tính SEO cho link',
          },
        },
      ],
    },
    
    // Cấu hình Upload (nếu có Media collection)
    upload: {
      collections: {
        // Uncomment nếu bạn có Media collection
        // media: {
        //   fields: [
        //     {
        //       name: 'alt',
        //       type: 'text',
        //       label: 'Alt Text',
        //       required: true,
        //     },
        //   ],
        // },
      },
    },
  },
});

module.exports = richTextConfig;
