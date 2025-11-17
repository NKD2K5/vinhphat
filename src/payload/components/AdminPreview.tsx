'use client';

import React, { useState, useEffect } from 'react';

interface AdminPreviewProps {
  collection?: string;
  path?: string;
  data?: any;
}

const AdminPreview: React.FC<AdminPreviewProps> = ({ 
  collection = 'about-page', 
  path = '/gioi-thieu',
  data 
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
  
  // Get slug from data or path
  const slug = data?.slug || data?.name || path.replace('/', '');
  const previewUrl = `${baseUrl}/api/preview?secret=${previewSecret}&collection=${collection}&slug=${slug}`;

  const deviceSizes = {
    desktop: { width: '100%', height: '800px' },
    tablet: { width: '768px', height: '800px' },
    mobile: { width: '375px', height: '800px' }
  };

  const refreshPreview = () => {
    setIsLoading(true);
    const iframe = document.getElementById('admin-preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      right: '0',
      width: '50%',
      height: '100vh',
      background: '#f8f9fa',
      borderLeft: '1px solid #e1e5e9',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Controls */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid #e1e5e9',
        background: 'white',
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
          📱 Live Preview
        </h3>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Device Toggle */}
          {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
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
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {d === 'desktop' && '🖥️'}
              {d === 'tablet' && '📱'}
              {d === 'mobile' && '📱'}
            </button>
          ))}

          {/* Refresh */}
          <button
            onClick={refreshPreview}
            disabled={isLoading}
            style={{
              padding: '6px 12px',
              border: '1px solid #28a745',
              borderRadius: '4px',
              background: '#28a745',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            {isLoading ? '🔄' : '↻'}
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
            🔗
          </a>
        </div>
      </div>

      {/* Preview Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
        overflow: 'auto'
      }}>
        <div style={{
          width: deviceSizes[device].width,
          height: deviceSizes[device].height,
          maxWidth: '100%',
          position: 'relative'
        }}>
          {/* Device Frame */}
          <div style={{
            width: '100%',
            height: '100%',
            background: device === 'mobile' 
              ? 'linear-gradient(145deg, #333, #444)' 
              : device === 'tablet'
              ? 'linear-gradient(145deg, #555, #666)'
              : 'linear-gradient(145deg, #222, #333)',
            borderRadius: device === 'mobile' ? '25px' : device === 'tablet' ? '20px' : '12px',
            padding: device === 'mobile' ? '15px' : device === 'tablet' ? '12px' : '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <iframe
              id="admin-preview-iframe"
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
              borderRadius: device === 'mobile' ? '25px' : device === 'tablet' ? '20px' : '12px'
            }}>
              <div style={{ fontSize: '18px' }}>🔄 Đang tải...</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '10px 20px',
        borderTop: '1px solid #e1e5e9',
        background: '#f8f9fa',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        <strong>URL:</strong> {previewUrl}
        <br />
        <strong>Collection:</strong> {collection} | <strong>Slug:</strong> {slug}
      </div>
    </div>
  );
};

export default AdminPreview;
