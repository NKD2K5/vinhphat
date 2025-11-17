const React = require('react');

// Simple inline preview component for Payload admin
const InlinePreview = (props) => {
  const { collection = 'about-page', path = '/gioi-thieu' } = props || {};
  
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const previewSecret = process.env.PAYLOAD_PREVIEW_SECRET || 'preview-secret';
  const slug = path.replace('/', '');
  const previewUrl = `${baseUrl}/api/preview?secret=${previewSecret}&collection=${collection}&slug=${slug}`;

  // Return simple preview info instead of complex floating panel
  return React.createElement('div', {
    style: {
      background: '#f8f9fa',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0'
    }
  }, [
    // Header
    React.createElement('h3', {
      key: 'title',
      style: { 
        margin: '0 0 15px 0', 
        fontSize: '16px', 
        fontWeight: '600',
        color: '#333'
      }
    }, '📱 Live Preview'),
    
    // Preview iframe
    React.createElement('div', {
      key: 'preview-area',
      style: {
        background: 'linear-gradient(145deg, #f0f0f0, #ffffff)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '15px'
      }
    }, 
      React.createElement('iframe', {
        src: previewUrl,
        style: {
          width: '100%',
          height: '500px',
          border: 'none',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        title: 'Live Preview'
      })
    ),

    // Footer info
    React.createElement('div', {
      key: 'footer',
      style: {
        padding: '10px',
        background: '#e9ecef',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#6c757d'
      }
    }, [
      React.createElement('strong', { key: 'url-label' }, 'Preview URL: '),
      React.createElement('a', { 
        key: 'url-link',
        href: previewUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        style: { color: '#007cba' }
      }, previewUrl),
      React.createElement('br', { key: 'br' }),
      React.createElement('em', { key: 'tip' }, '💡 Nhấn link để mở preview trong tab mới.')
    ])
  ]);
};

module.exports = InlinePreview;
