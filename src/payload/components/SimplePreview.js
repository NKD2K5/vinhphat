// Simple HTML-based preview component for Payload CMS
const SimplePreview = ({ collection = 'about-page', path = '/gioi-thieu' }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
  const slug = path.replace('/', '');
  const previewUrl = `${baseUrl}/api/preview?secret=${previewSecret}&collection=${collection}&slug=${slug}`;

  // Return simple HTML string instead of React elements
  return `
    <div style="
      background: #f8f9fa; 
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <!-- Header -->
      <div style="
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e1e5e9;
      ">
        <h3 style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">
          📱 Live Preview - ${collection}
        </h3>
        
        <div style="display: flex; gap: 10px; align-items: center;">
          <a 
            href="${previewUrl}" 
            target="_blank" 
            rel="noopener noreferrer"
            style="
              padding: 8px 16px;
              border: 1px solid #007cba;
              border-radius: 4px;
              background: #007cba;
              color: white;
              text-decoration: none;
              font-size: 14px;
              font-weight: 500;
            "
          >
            🔗 Open Preview
          </a>
        </div>
      </div>

      <!-- Preview iframe -->
      <div style="
        display: flex; 
        justify-content: center;
        align-items: flex-start;
        min-height: 600px;
        background: linear-gradient(145deg, #f0f0f0, #ffffff);
        border: 8px solid #333;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        padding: 20px;
      ">
        <iframe
          src="${previewUrl}"
          style="
            width: 90%;
            height: 600px;
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          "
          title="Live Preview"
        ></iframe>
      </div>

      <!-- Info -->
      <div style="
        margin-top: 15px;
        padding: 10px;
        background: #e9ecef;
        border-radius: 4px;
        font-size: 12px;
        color: #6c757d;
      ">
        <strong>Preview URL:</strong> ${previewUrl}<br>
        <em>💡 Nhấn "Open Preview" để mở trong tab mới. Thay đổi nội dung và lưu để cập nhật preview.</em>
      </div>
    </div>
  `;
};

module.exports = SimplePreview;
