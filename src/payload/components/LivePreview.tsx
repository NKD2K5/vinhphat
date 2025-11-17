'use client';

import React, { useState, useEffect } from 'react';

interface LivePreviewProps {
  collection?: string;
  path?: string;
  slug?: string;
  title?: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ 
  collection = 'about-page',
  path = '/gioi-thieu',
  slug: propSlug,
  title: propTitle
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showMockup, setShowMockup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
  
  // Construct preview URL
  const slug = propSlug || path.replace('/', '');
  const previewUrl = `${baseUrl}/api/preview?secret=${previewSecret}&collection=${collection}&slug=${slug}`;

  const deviceSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '600px' },
    mobile: { width: '375px', height: '600px' }
  };

  // CSS-based mockups (fallback if images not available)
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

  const refreshPreview = () => {
    setIsLoading(true);
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src; // Force reload
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="live-preview-container" style={{ 
      background: '#f8f9fa', 
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0'
    }}>
      {/* Header Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px 0',
        borderBottom: '1px solid #e1e5e9'
      }}>
        <h3 style={{ margin: 0, color: '#333', fontSize: '16px', fontWeight: '600' }}>
          📱 Live Preview
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Device Toggle */}
          <div style={{ display: 'flex', gap: '5px' }}>
            {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
              <button
                key={device}
                onClick={() => setPreviewMode(device)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: previewMode === device ? '#007cba' : 'white',
                  color: previewMode === device ? 'white' : '#333',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {device === 'desktop' && '🖥️'}
                {device === 'tablet' && '📱'}
                {device === 'mobile' && '📱'}
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </button>
            ))}
          </div>

          {/* Mockup Toggle */}
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

          {/* Refresh Button */}
          <button
            onClick={refreshPreview}
            disabled={isLoading}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#6c757d',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            {isLoading ? '🔄' : '↻'} Refresh
          </button>

          {/* Open in New Tab */}
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
            🔗 Open Preview
          </a>
        </div>
      </div>

      {/* Preview Content */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '600px',
        position: 'relative'
      }}>
        {showMockup ? (
          /* Mockup Mode */
          <div style={{ 
            position: 'relative',
            width: deviceSizes[previewMode].width,
            maxWidth: '100%'
          }}>
            {/* CSS Mockup Background */}
            <div style={{
              ...mockupStyles[previewMode],
              width: '100%',
              height: '700px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* Iframe inside mockup */}
              <iframe
                id="preview-iframe"
                src={previewUrl}
                style={{
                  width: previewMode === 'desktop' ? '80%' : '70%',
                  height: previewMode === 'desktop' ? '75%' : '80%',
                  border: 'none',
                  borderRadius: previewMode === 'mobile' ? '20px' : '8px',
                  marginTop: previewMode === 'desktop' ? '40px' : '60px'
                }}
                title="Live Preview"
              />
            </div>
          </div>
        ) : (
          /* Direct Iframe Mode */
          <div style={{ 
            width: deviceSizes[previewMode].width,
            height: deviceSizes[previewMode].height,
            maxWidth: '100%',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <iframe
              id="preview-iframe"
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

        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px'
          }}>
            🔄 Đang tải preview...
          </div>
        )}
      </div>

      {/* Info Panel */}
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
        <strong>Collection:</strong> {collection} | <strong>Slug:</strong> {slug || 'auto-generated'}
        <br />
        <em>💡 Preview tự động cập nhật khi bạn thay đổi nội dung. Nhấn Refresh nếu cần.</em>
      </div>
    </div>
  );
};

export default LivePreview;
