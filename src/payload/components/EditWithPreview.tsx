'use client';

import React, { useState, useEffect } from 'react';

interface EditWithPreviewProps {
  collection?: string;
  data?: any;
  path?: string;
}

const EditWithPreview: React.FC<EditWithPreviewProps> = ({ 
  collection = 'about-page',
  data,
  path
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
  
  // Get slug from data or path
  const slug = data?.slug || data?.name || path?.replace('/', '') || 'demo';
  const previewUrl = `${baseUrl}/api/preview?secret=${previewSecret}&collection=${collection}&slug=${slug}&inline=true`;

  const deviceSizes = {
    desktop: { width: '100%', height: '600px' },
    tablet: { width: '768px', height: '600px' },
    mobile: { width: '375px', height: '600px' }
  };

  const refreshPreview = () => {
    setIsLoading(true);
    setPreviewKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Auto-refresh when data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshPreview();
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div style={{
      width: '100%',
      background: '#f8f9fa',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '20px'
    }}>
      {/* Header Controls */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e1e5e9',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: '600',
          color: '#333'
        }}>
          📱 Live Preview
        </h4>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Device Toggle */}
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
                fontSize: '11px',
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
              padding: '4px 8px',
              border: '1px solid #28a745',
              borderRadius: '4px',
              background: '#28a745',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '11px'
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
              padding: '4px 8px',
              border: '1px solid #007cba',
              borderRadius: '4px',
              background: '#007cba',
              color: 'white',
              textDecoration: 'none',
              fontSize: '11px'
            }}
          >
            🔗
          </a>
        </div>
      </div>

      {/* Preview Area */}
      <div style={{
        padding: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#f8f9fa'
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
              : '#ffffff',
            borderRadius: device === 'mobile' ? '20px' : device === 'tablet' ? '15px' : '8px',
            padding: device === 'mobile' ? '12px' : device === 'tablet' ? '10px' : '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <iframe
              key={previewKey}
              src={previewUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: device === 'mobile' ? '16px' : device === 'tablet' ? '12px' : '4px',
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
              borderRadius: device === 'mobile' ? '20px' : device === 'tablet' ? '15px' : '8px'
            }}>
              <div style={{ fontSize: '14px' }}>🔄 Đang tải...</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #e1e5e9',
        background: '#f8f9fa',
        fontSize: '11px',
        color: '#6c757d'
      }}>
        <strong>Collection:</strong> {collection} | <strong>Slug:</strong> {slug}
      </div>
    </div>
  );
};

export default EditWithPreview;
