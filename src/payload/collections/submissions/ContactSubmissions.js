const ReadStatusBadge = require('../../../../payload/components/ReadStatusBadge');
const ContactReadStatusBadge = require('../../../../payload/components/ContactReadStatusBadge');
const MarkContactAsReadOnView = require('../../../../payload/components/MarkContactAsReadOnView');

const ContactSubmissions = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Liên Hệ',
    plural: 'Danh Sách Liên Hệ',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'createdAt', 'isRead'],
    group: 'Biểu Mẫu',
    description: 'Quản lý các yêu cầu liên hệ từ khách hàng',
  },
  access: {
    create: () => true, // Cho phép public gửi form
    read: ({ req: { user } }) => !!user, // Chỉ admin mới xem được
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  hooks: {
    afterChange: [
      async ({ operation, doc, req }) => {
        // Chỉ gửi email khi tạo mới (không gửi khi update)
        if (operation === 'create') {
          try {
            const adminEmail = process.env.ADMIN_EMAIL || 'invinhphat6868@gmail.com';
            console.log('📧 Sending notification email to admin:', adminEmail);
            
            // Gửi email thông báo cho admin
            await req.payload.sendEmail({
              to: adminEmail,
              from: `VinhPhat Printing <${process.env.EMAIL_FROM || 'duytoan20052011@gmail.com'}>`,
              subject: `🔔 Liên hệ mới từ ${doc.name}`,
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                    .field { margin-bottom: 20px; }
                    .label { font-weight: bold; color: #1f2937; margin-bottom: 5px; }
                    .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb; }
                    .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
                    .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h2>📧 Yêu Cầu Liên Hệ Mới</h2>
                    </div>
                    <div class="content">
                      <div class="field">
                        <div class="label">👤 Họ và Tên:</div>
                        <div class="value">${doc.name}</div>
                      </div>
                      
                      <div class="field">
                        <div class="label">📧 Email:</div>
                        <div class="value"><a href="mailto:${doc.email}">${doc.email}</a></div>
                      </div>
                      
                      ${doc.phone ? `
                      <div class="field">
                        <div class="label">📱 Số Điện Thoại:</div>
                        <div class="value"><a href="tel:${doc.phone}">${doc.phone}</a></div>
                      </div>
                      ` : ''}
                      
                      ${doc.company ? `
                      <div class="field">
                        <div class="label">🏢 Công Ty:</div>
                        <div class="value">${doc.company}</div>
                      </div>
                      ` : ''}
                      
                      ${doc.subject ? `
                      <div class="field">
                        <div class="label">📋 Chủ Đề:</div>
                        <div class="value">${doc.subject}</div>
                      </div>
                      ` : ''}
                      
                      <div class="field">
                        <div class="label">💬 Nội Dung:</div>
                        <div class="value">${doc.message.replace(/\n/g, '<br>')}</div>
                      </div>
                      
                      <div class="field">
                        <div class="label">🕐 Thời Gian:</div>
                        <div class="value">${new Date(doc.createdAt).toLocaleString('vi-VN')}</div>
                      </div>
                      
                      ${doc.attachment ? `
                      <div class="field">
                        <div class="label">📎 File Đính Kèm:</div>
                        <div class="value">
                          ${doc.attachmentType === 'image' ? `
                            <div style="margin-top: 10px;">
                              <img src="${doc.attachment}" alt="${doc.attachmentName || 'Ảnh đính kèm'}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e5e7eb;" />
                              <p style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                                <a href="${doc.attachment}" target="_blank" style="color: #3b82f6; text-decoration: none;">Xem ảnh gốc</a>
                              </p>
                            </div>
                          ` : `
                            <a href="${doc.attachment}" target="_blank" style="color: #3b82f6; text-decoration: none; display: inline-flex; align-items: center; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; margin-top: 8px;">
                              📄 ${doc.attachmentName || 'Tải xuống file'}
                            </a>
                          `}
                        </div>
                      </div>
                      ` : ''}
                    </div>
                    <div class="footer">
                      <p>Email này được gửi tự động từ hệ thống VinhPhat Printing</p>
                      <p>© ${new Date().getFullYear()} VinhPhat Printing. All rights reserved.</p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            });
            
            console.log('✅ Admin notification email sent successfully to:', adminEmail);

            // Gửi email xác nhận cho khách hàng
            console.log('📧 Sending confirmation email to customer:', doc.email);
            await req.payload.sendEmail({
              to: doc.email,
              from: `VinhPhat Printing <${process.env.EMAIL_FROM || 'duytoan20052011@gmail.com'}>`,
              subject: '✅ Đã nhận được yêu cầu liên hệ của bạn - VinhPhat Printing',
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                    .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
                    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h2>✅ Cảm ơn bạn đã liên hệ!</h2>
                    </div>
                    <div class="content">
                      <p>Xin chào <strong>${doc.name}</strong>,</p>
                      
                      <p>Chúng tôi đã nhận được yêu cầu liên hệ của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                      
                      <div class="info-box">
                        <h3>📝 Thông tin bạn đã gửi:</h3>
                        <p><strong>Nội dung:</strong><br>${doc.message.replace(/\n/g, '<br>')}</p>
                        <p><strong>Thời gian:</strong> ${new Date(doc.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      
                      <p>Nếu bạn cần hỗ trợ gấp, vui lòng liên hệ:</p>
                      <ul>
                        <li>📞 Hotline: <a href="tel:0977344567">0977 344 567</a></li>
                        <li>📧 Email: <a href="mailto:invinhphat6868@gmail.com">invinhphat6868@gmail.com</a></li>
                      </ul>
                      
                      <p>Trân trọng,<br><strong>Đội ngũ VinhPhat Printing</strong></p>
                    </div>
                    <div class="footer">
                      <p>© ${new Date().getFullYear()} VinhPhat Printing. All rights reserved.</p>
                      <p>Khu công nghiệp Thạch Khôi, Hải Dương, Việt Nam</p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            });

            console.log('✅ Customer confirmation email sent successfully to:', doc.email);
            console.log(`✅ All emails sent for contact submission: ${doc.name} (${doc.email})`);
          } catch (error) {
            console.error('❌ Error sending email:', error);
            console.error('Error details:', error.message);
            // Không throw error để không làm gián đoạn quá trình tạo document
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'markContactAsReadOnView',
      type: 'ui',
      admin: {
        components: {
          Field: MarkContactAsReadOnView,
        },
      },
    },
    {
      name: 'name',
      type: 'text',
      label: 'Họ và Tên',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số Điện Thoại',
      admin: {
        placeholder: '0977 344 567',
      },
    },
    {
      name: 'company',
      type: 'text',
      label: 'Công Ty',
      admin: {
        placeholder: 'Tên công ty (nếu có)',
      },
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Chủ Đề',
      admin: {
        placeholder: 'Yêu cầu báo giá, tư vấn dịch vụ...',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Nội Dung',
      required: true,
      admin: {
        placeholder: 'Nhập nội dung yêu cầu của bạn...',
      },
    },
    {
      name: 'attachment',
      type: 'text',
      label: 'File Đính Kèm (URL)',
      admin: {
        description: 'URL của file được upload lên Cloudinary',
      },
    },
    {
      name: 'attachmentType',
      type: 'select',
      label: 'Loại File',
      options: [
        { label: 'Ảnh', value: 'image' },
        { label: 'PDF', value: 'pdf' },
        { label: 'Document', value: 'document' },
        { label: 'Khác', value: 'other' },
      ],
      admin: {
        description: 'Loại file đính kèm',
      },
    },
    {
      name: 'attachmentName',
      type: 'text',
      label: 'Tên File',
      admin: {
        description: 'Tên gốc của file',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng Thái',
      defaultValue: 'new',
      options: [
        {
          label: '🆕 Mới',
          value: 'new',
        },
        {
          label: '👀 Đã Xem',
          value: 'viewed',
        },
        {
          label: '💬 Đang Xử Lý',
          value: 'processing',
        },
        {
          label: '✅ Đã Hoàn Thành',
          value: 'completed',
        },
        {
          label: '❌ Đã Hủy',
          value: 'cancelled',
        },
      ],
      admin: {
        description: 'Trạng thái xử lý yêu cầu',
        hidden: true,
      },
    },
    {
      name: 'isRead',
      type: 'checkbox',
      label: 'Trạng thái đọc',
      defaultValue: false,
      admin: {
        disableBulkEdit: true,
        components: {
          Cell: ContactReadStatusBadge,
        },
      },
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Thời gian đọc',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'readBy',
      type: 'text',
      label: 'Người đọc',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Ghi Chú Nội Bộ',
      admin: {
        description: 'Ghi chú cho admin, khách hàng không thấy',
      },
    },
  ],
  timestamps: true,
};

module.exports = { ContactSubmissions };
