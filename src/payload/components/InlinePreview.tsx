'use client';

import React, { useState, useEffect } from 'react';

interface InlinePreviewProps {
  collection?: string;
  path?: string;
}

const InlinePreview: React.FC<InlinePreviewProps> = ({ 
  collection = 'about-page', 
  path = '/gioi-thieu'
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isVisible, setIsVisible] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
  const slug = path.replace('/', '');
  const previewUrl = `${baseUrl}/api/preview?secret=${previewSecret}&collection=${collection}&slug=${slug}`;

  const deviceSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '600px' },
    mobile: { width: '375px', height: '600px' }
  };

  // Auto-position preview to the right of form
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .payload-admin-bar { position: relative !important; }
      .template-default .app { display: flex !important; }
      .template-default .app > div:first-child { width: 50% !important; }
      .inline-preview-container { 
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        width: 50% !important;
        height: 100vh !important;
        z-index: 999 !important;
        background: white !important;
        border-left: 1px solid #e1e5e9 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="inline-preview-container">
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid #e1e5e9',
        background: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#333'
        }}>
          📱 Live Preview - {collection}
        </h3>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Device buttons */}
          {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              style={{
                padding: '4px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: device === d ? '#007cba' : 'white',
                color: device === d ? 'white' : '#333',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              {d === 'desktop' && '🖥️'}
              {d === 'tablet' && '📱'}
              {d === 'mobile' && '📱'}
            </button>
          ))}

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            style={{
              padding: '4px 8px',
              border: '1px solid #dc3545',
              borderRadius: '4px',
              background: '#dc3545',
              color: 'white',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div style={{
        padding: '20px',
        height: 'calc(100vh - 80px)',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <div style={{
          width: deviceSizes[device].width,
          height: deviceSizes[device].height,
          maxWidth: '100%',
          background: device === 'mobile' 
            ? 'linear-gradient(145deg, #333, #444)' 
            : device === 'tablet'
            ? 'linear-gradient(145deg, #555, #666)'
            : 'linear-gradient(145deg, #f0f0f0, #ffffff)',
          borderRadius: device === 'mobile' ? '25px' : device === 'tablet' ? '20px' : '12px',
          padding: device === 'mobile' ? '15px' : device === 'tablet' ? '12px' : '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
          <iframe
            src={previewUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: device === 'mobile' ? '20px' : device === 'tablet' ? '15px' : '8px',
              background: 'white'
            }}
            title="Live Preview"
          />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px 20px',
        borderTop: '1px solid #e1e5e9',
        background: '#f8f9fa',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        <strong>Preview URL:</strong> {previewUrl}
        <br />
        <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007cba' }}>
          🔗 Open in new tab
        </a>
      </div>
    </div>
  );
};

export default InlinePreview;
