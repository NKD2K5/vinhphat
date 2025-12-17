const PrintOrderButton = require('../../../../payload/components/PrintOrderButton');
const ReadStatusCell = require('../../../../payload/components/ReadStatusCell');
const MarkAsReadOnView = require('../../../../payload/components/MarkAsReadOnView');
const ReadStatusBadge = require('../../../../payload/components/ReadStatusBadge');

const Orders = {
  slug: 'orders',
  labels: {
    singular: 'Đơn Hàng',
    plural: 'Đơn Hàng',
  },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['customerName', 'customerPhone', 'createdAt', 'isRead'],
    group: 'Biểu Mẫu',
    description: 'Quản lý các đơn hàng từ website',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      // Cho phép admin update
      if (user) return true;
      return false;
    },
    delete: () => false,
  },
  fields: [
    {
      name: 'markAsReadOnView',
      type: 'ui',
      admin: {
        components: {
          Field: MarkAsReadOnView,
        },
      },
    },
    {
      name: 'code',
      type: 'text',
      label: 'Mã Đơn Hàng',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customerName',
      type: 'text',
      label: 'Tên Khách Hàng',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customerPhone',
      type: 'text',
      label: 'Số Điện Thoại',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      label: 'Email',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'shippingAddress',
      type: 'textarea',
      label: 'Địa Chỉ Giao Hàng',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Ghi Chú Của Khách',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'cartCreatedAt',
      type: 'date',
      label: 'Thời Gian Tạo Giỏ Hàng',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'printInvoice',
      type: 'ui',
      admin: {
        components: {
          Field: PrintOrderButton,
        },
      },
    },
    {
      name: 'isRead',
      type: 'checkbox',
      label: 'Trạng thái đọc',
      defaultValue: false,
      admin: {
        disableBulkEdit: true, // Không cho phép sửa hàng loạt
        components: {
          Cell: ReadStatusBadge, // dùng chấm xanh trong list view
        },
      },
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Thời gian đọc',
      admin: {
        hidden: true, // ẩn vì chỉ dùng để theo dõi nội bộ
      },
    },
    {
      name: 'readBy',
      type: 'text',
      label: 'Người đọc',
      admin: {
        hidden: true, // ẩn vì chỉ dùng để theo dõi nội bộ
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: 'Tổng Tiền (số)',
      admin: {
        description: 'Dùng cho thống kê, có thể bằng 0 nếu giá liên hệ',
        readOnly: true,
      },
    },
    {
      name: 'totalAmountText',
      type: 'text',
      label: 'Tổng Tiền (hiển thị)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Sản Phẩm',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'productId',
          type: 'text',
          label: 'ID Sản Phẩm',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'productSlug',
          type: 'text',
          label: 'Slug Sản Phẩm',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'productName',
          type: 'text',
          label: 'Tên Sản Phẩm',
          required: true,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'productImage',
          type: 'text',
          label: 'Ảnh Sản Phẩm',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'unitPriceText',
          type: 'text',
          label: 'Giá / Đơn Vị (hiển thị)',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Số Lượng',
          required: true,
          min: 1,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'lineTotalText',
          type: 'text',
          label: 'Thành Tiền (hiển thị)',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ operation, doc, req }) => {
        if (operation !== 'create') return;

        try {
          const adminEmail = process.env.ADMIN_EMAIL || 'invinhphat6868@gmail.com';

          const itemsHtml = (doc.items || [])
            .map((item) => {
              return `
                <tr>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.productName}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.unitPriceText || ''}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.lineTotalText || ''}</td>
                </tr>
              `;
            })
            .join('');

          const totalText = doc.totalAmountText || '';
          const createdAt = doc.createdAt ? new Date(doc.createdAt).toLocaleString('vi-VN') : '';

          await req.payload.sendEmail({
            to: adminEmail,
            from: `Hệ thống thông báo <${process.env.EMAIL_FROM || 'duytoan20052011@gmail.com'}>`,
            subject: `📦 Đơn hàng mới #${doc.code || doc.id} - ${doc.customerName}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charSet="utf-8" />
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
                    .container { max-width: 700px; margin: 0 auto; padding: 24px; background: #f9fafb; }
                    .card { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
                    .header { background: #2563eb; color: white; padding: 20px 24px; }
                    .section { padding: 20px 24px; border-top: 1px solid #e5e7eb; }
                    .label { font-weight: 600; color: #374151; margin-bottom: 4px; }
                    .value { color: #111827; }
                    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
                    .badge-pending { background: #fef3c7; color: #92400e; }
                    .badge-processing { background: #dbeafe; color: #1d4ed8; }
                    .badge-delivered { background: #dcfce7; color: #166534; }
                    .badge-cancelled { background: #fee2e2; color: #b91c1c; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="card">
                      <div class="header">
                        <h2>📦 Đơn Hàng Mới Từ Website</h2>
                        <p style="margin-top: 4px; opacity: .9;">Mã đơn: <strong>${doc.code || doc.id}</strong></p>
                      </div>

                      <div class="section">
                        <h3 style="margin: 0 0 12px; font-size: 16px;">👤 Thông Tin Khách Hàng</h3>
                        <p><span class="label">Họ tên:</span> <span class="value">${doc.customerName}</span></p>
                        <p><span class="label">Số điện thoại:</span> <span class="value">${doc.customerPhone}</span></p>
                        ${doc.customerEmail ? `<p><span class="label">Email:</span> <span class="value">${doc.customerEmail}</span></p>` : ''}
                        <p><span class="label">Địa chỉ giao hàng:</span> <span class="value">${doc.shippingAddress}</span></p>
                        ${doc.note ? `<p><span class="label">Ghi chú của khách:</span> <span class="value">${doc.note}</span></p>` : ''}
                      </div>

                      <div class="section">
                        <h3 style="margin: 0 0 12px; font-size: 16px;">🧾 Thông Tin Đơn Hàng</h3>
                        <p><span class="label">Thời gian đặt:</span> <span class="value">${createdAt}</span></p>
                        <p>
                          <span class="label">Trạng thái:</span>
                          <span class="value">
                            <span class="badge ${doc.status === 'pending' ? 'badge-pending' : doc.status === 'processing' ? 'badge-processing' : doc.status === 'delivered' ? 'badge-delivered' : 'badge-cancelled'}">
                              ${doc.status}
                            </span>
                          </span>
                        </p>
                        ${doc.cartCreatedAt ? `<p><span class="label">Thời gian tạo giỏ hàng:</span> <span class="value">${new Date(doc.cartCreatedAt).toLocaleString('vi-VN')}</span></p>` : ''}
                      </div>

                      <div class="section">
                        <h3 style="margin: 0 0 12px; font-size: 16px;">📋 Danh Sách Sản Phẩm</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                          <thead>
                            <tr>
                              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Sản phẩm</th>
                              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">SL</th>
                              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Đơn giá</th>
                              <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${itemsHtml || '<tr><td colspan="4" style="padding: 12px; text-align: center;">Không có sản phẩm</td></tr>'}
                          </tbody>
                        </table>

                        ${totalText ? `<p style="margin-top: 12px;"><span class="label">Tổng tiền:</span> <span class="value" style="font-weight: 700;">${totalText}</span></p>` : ''}
                      </div>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });
        } catch (error) {
          console.error('Error sending order notification email:', error && error.message ? error.message : error);
        }
      },
    ],
  },
  timestamps: true,
};

module.exports = { Orders };
