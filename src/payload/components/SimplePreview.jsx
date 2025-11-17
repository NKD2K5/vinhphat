import React, { useState } from 'react';

const SimplePreview = ({ collection = 'about-page', path = '/gioi-thieu' }) => {
  const [device, setDevice] = useState('desktop');
  const [showMockup, setShowMockup] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
  const slug = path.replace('/', '');
  const previewUrl = `${baseUrl}/api/preview?secret=${previewSecret}&collection=${collection}&slug=${slug}`;

  const deviceSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '600px' },
    mobile: { width: '375px', height: '600px' }
  };

  const mockupStyles = {
    desktop: {
      background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
      border: '8px solid #333',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      padding: '20px'
    },
    tablet: {
      background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
      border: '12px solid #444',
      borderRadius: '20px',
      boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
      padding: '15px'
    },
    mobile: {
      background: 'linear-gradient(145deg, #fafafa, #ffffff)',
      border: '6px solid #222',
      borderRadius: '25px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      padding: '10px'
    }
  };

  return (
    <div style={{ 
      background: '#f8f9fa', 
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e1e5e9'
      }}>
        <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: '600' }}>
          📱 Live Preview - {collection}
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Device buttons */}
          {['desktop', 'tablet', 'mobile'].map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              style={{
                padding: '6px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: device === d ? '#007cba' : 'white',
                color: device === d ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {d === 'desktop' && '🖥️'} 
              {d === 'tablet' && '📱'} 
              {d === 'mobile' && '📱'}
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}

          {/* Mockup toggle */}
          <button
            onClick={() => setShowMockup(!showMockup)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: showMockup ? '#28a745' : 'white',
              color: showMockup ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showMockup ? '🖼️ Mockup ON' : '🖼️ Mockup OFF'}
          </button>

          {/* Open preview */}
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 12px',
              border: '1px solid #007cba',
              borderRadius: '4px',
              background: '#007cba',
              color: 'white',
              textDecoration: 'none',
              fontSize: '12px'
            }}
          >
            🔗 Open
          </a>
        </div>
      </div>

      {/* Preview area */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '600px'
      }}>
        {showMockup ? (
          <div style={{ 
            ...mockupStyles[device],
            width: deviceSizes[device].width,
            height: '700px',
            maxWidth: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <iframe
              src={previewUrl}
              style={{
                width: device === 'desktop' ? '90%' : '85%',
                height: device === 'desktop' ? '85%' : '90%',
                border: 'none',
                borderRadius: device === 'mobile' ? '15px' : '8px'
              }}
              title="Live Preview"
            />
          </div>
        ) : (
          <div style={{ 
            width: deviceSizes[device].width,
            height: deviceSizes[device].height,
            maxWidth: '100%',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <iframe
              src={previewUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="Live Preview"
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ 
        marginTop: '15px',
        padding: '10px',
        background: '#e9ecef',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        <strong>Preview URL:</strong> {previewUrl}
        <br />
        <em>💡 Nhấn "Open" để mở preview trong tab mới. Thay đổi nội dung và lưu để cập nhật preview.</em>
      </div>
    </div>
  );
};

export default SimplePreview;
