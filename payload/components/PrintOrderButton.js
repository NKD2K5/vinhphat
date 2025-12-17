const React = require('react');

function buildInvoiceHTML(order) {
  const {
    code,
    customerName,
    customerPhone,
    customerEmail,
    shippingAddress,
    note,
    totalAmountText,
    items = [],
    createdAt,
  } = order || {};

  const createdAtText = createdAt
    ? new Date(createdAt).toLocaleString('vi-VN')
    : '';

  const itemsRows = items.length
    ? items
        .map((item, index) => {
          return `
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: center;">${
                index + 1
              }</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">
                <div style="font-weight: 600; color: #111827;">${
                  item.productName || ''
                }</div>
                ${item.productSlug
                  ? `<div style="font-size: 12px; color: #6b7280;">Mã: ${
                      item.productSlug
                    }</div>`
                  : ''}
              </td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: center;">${
                item.quantity || ''
              }</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right;">${
                item.unitPriceText || ''
              }</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${
                item.lineTotalText || ''
              }</td>
            </tr>
          `;
        })
        .join('')
    : `
      <tr>
        <td colspan="5" style="padding: 16px 12px; border: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          Không có sản phẩm nào trong đơn hàng này.
        </td>
      </tr>
    `;

  const totalRow = totalAmountText
    ? `
      <tr>
        <td colspan="4" style="padding: 10px 12px; text-align: right; font-weight: 600; border-top: 1px solid #e5e7eb;">Tổng cộng:</td>
        <td style="padding: 10px 12px; text-align: right; font-weight: 700; color: #16a34a; border-top: 1px solid #e5e7eb;">${
          totalAmountText || ''
        }</td>
      </tr>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <title>Hoá đơn ${code || ''} - VinhPhat Printing</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f3f4f6;
            color: #111827;
          }
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 24px 32px 40px;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
          }
          .brand {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: .03em;
            color: #2563eb;
          }
          .brand-sub {
            font-size: 13px;
            color: #6b7280;
            margin-top: 4px;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title h1 {
            margin: 0;
            font-size: 22px;
            text-transform: uppercase;
            letter-spacing: .06em;
          }
          .muted { color: #6b7280; }
          .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: #4b5563;
            margin-bottom: 6px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1.7fr 1.3fr;
            gap: 24px;
            margin-bottom: 24px;
          }
          .field-label { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
          .field-value { font-size: 14px; font-weight: 500; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
          th { background: #f3f4f6; font-weight: 600; color: #374151; padding: 8px 12px; border: 1px solid #e5e7eb; }
          td { padding: 8px 12px; }
          .note {
            margin-top: 16px;
            padding: 10px 12px;
            border-radius: 8px;
            background: #fefce8;
            border: 1px solid #facc15;
            font-size: 13px;
          }
          .footer {
            margin-top: 32px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 32px;
            font-size: 13px;
          }
          .sign-block { text-align: center; width: 45%; }
          .sign-label { font-weight: 600; margin-bottom: 60px; }

          @media print {
            body { background: #ffffff; }
            .page { box-shadow: none; margin: 0; padding-top: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div>
              <div class="brand">VinhPhat Printing</div>
              <div class="brand-sub">Dịch vụ in ấn chuyên nghiệp</div>
              <div style="margin-top: 8px; font-size: 12px;" class="muted">
                Địa chỉ: Khu công nghiệp Thạch Khôi, Hải Dương, Việt Nam<br />
                Hotline: 0977 344 567 &bull; Email: invinhphat6868@gmail.com
              </div>
            </div>
            <div class="invoice-title">
              <h1>HOÁ ĐƠN ĐẶT HÀNG</h1>
              <div style="margin-top: 6px; font-size: 13px;" class="muted">
                Mã đơn: <strong>${code || order.id || ''}</strong><br />
                Ngày tạo: ${createdAtText}
              </div>
            </div>
          </div>

          <div class="grid">
            <div>
              <div class="section-title">Thông tin khách hàng</div>
              <div class="field-label">Họ và tên</div>
              <div class="field-value">${customerName || ''}</div>

              <div style="margin-top: 8px;" class="field-label">Số điện thoại</div>
              <div class="field-value">${customerPhone || ''}</div>

              ${customerEmail
                ? `<div style="margin-top: 8px;" class="field-label">Email</div>
                   <div class="field-value">${customerEmail}</div>`
                : ''}
            </div>

            <div>
              <div class="section-title">Thông tin giao hàng</div>
              <div class="field-label">Địa chỉ giao hàng</div>
              <div class="field-value">${shippingAddress || ''}</div>

              ${note
                ? `<div style="margin-top: 8px;" class="field-label">Ghi chú của khách</div>
                   <div class="field-value">${note}</div>`
                : ''}
            </div>
          </div>

          <div>
            <div class="section-title">Danh sách sản phẩm</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 40px;">STT</th>
                  <th>Sản phẩm</th>
                  <th style="width: 70px;">SL</th>
                  <th style="width: 120px;">Đơn giá</th>
                  <th style="width: 140px;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
                ${totalRow}
              </tbody>
            </table>

            <div class="note">
              <strong>Lưu ý:</strong> Giá trên là giá dự kiến dựa trên thông tin khách hàng cung cấp.
              Đơn giá có thể thay đổi tuỳ theo số lượng, chất liệu, kỹ thuật in và các yêu cầu gia công
              cụ thể. Nhân viên VinhPhat Printing sẽ liên hệ xác nhận và gửi báo giá chính thức.
            </div>
          </div>

          <div class="signatures">
            <div class="sign-block">
              <div class="sign-label">Đại diện VinhPhat Printing</div>
              <div class="muted">(Ký và ghi rõ họ tên)</div>
            </div>
            <div class="sign-block">
              <div class="sign-label">Khách hàng</div>
              <div class="muted">(Ký và ghi rõ họ tên)</div>
            </div>
          </div>

          <div class="footer">
            Hoá đơn được tạo tự động từ hệ thống VinhPhat Printing. Vui lòng liên hệ chúng tôi nếu cần chỉnh sửa thông tin.<br />
            © ${new Date().getFullYear()} VinhPhat Printing
          </div>
        </div>
      </body>
    </html>
  `;
}

function PrintOrderButton() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handlePrint = async () => {
    if (typeof window === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const last = pathParts[pathParts.length - 1] || '';
      const maybeId = last === 'edit' ? pathParts[pathParts.length - 2] : last;

      if (!maybeId) {
        throw new Error('Không xác định được ID đơn hàng từ URL.');
      }

      const baseUrl = window.location.origin; // vd: http://localhost:3001
      const res = await fetch(`${baseUrl}/api/orders/${maybeId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Không thể tải dữ liệu đơn hàng.');
      }

      const html = buildInvoiceHTML(data);
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Trình duyệt chặn cửa sổ in. Vui lòng cho phép popup.');
      }

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();

      // Đợi 1 chút cho trình duyệt render xong rồi mới in
      setTimeout(() => {
        printWindow.print();
      }, 300);
    } catch (err) {
      setError(err && err.message ? err.message : 'Lỗi không xác định khi in hoá đơn.');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    'div',
    {
      style: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          fontSize: '13px',
          color: '#4b5563',
          marginBottom: '8px',
        },
      },
      'In hoá đơn chi tiết cho đơn hàng hiện tại (dành cho lưu trữ hoặc ký xác nhận).',
    ),
    error
      ? React.createElement(
          'div',
          {
            style: {
              fontSize: '12px',
              color: '#b91c1c',
              backgroundColor: '#fef2f2',
              borderRadius: '6px',
              padding: '6px 8px',
              marginBottom: '8px',
            },
          },
          error,
        )
      : null,
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: handlePrint,
        disabled: loading,
        style: {
          padding: '8px 12px',
          borderRadius: '6px',
          backgroundColor: loading ? '#9ca3af' : '#2563eb',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 600,
          border: 'none',
          cursor: loading ? 'default' : 'pointer',
        },
      },
      loading ? 'Đang tạo hoá đơn...' : 'In hoá đơn',
    ),
  );
}

module.exports = PrintOrderButton;
