// Custom Image Upload Field for Payload CMS
// Uploads images to C# API and returns URL

const React = require('react');
const { useState, useCallback } = React;

const ImageUploadField = (props) => {
  // Load useField hook from Payload
  let useFieldHook;
  let field = null;
  try {
    useFieldHook = require('payload/components/forms').useField;
    field = useFieldHook({ path: props.path });
  } catch (err) {
    console.error('Failed to load useField:', err);
  }

  const value = field?.value || '';
  const setValue = field?.setValue;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118';
      
      console.log('🖼️ Uploading image to C# API:', `${apiUrl}/api/Upload`);

      const response = await fetch(`${apiUrl}/api/Upload`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.url) {
        console.log('✅ Upload successful:', result.url);
        if (setValue) {
          setValue(result.url);
        }
      } else {
        throw new Error('No URL in response');
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError('Lỗi upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  }, [setValue]);

  const handleUrlChange = useCallback((e) => {
    if (setValue) {
      setValue(e.target.value);
    }
  }, [setValue]);

  return React.createElement(
    'div',
    { style: { marginBottom: '20px' } },
    
    // Label
    React.createElement(
      'label',
      { 
        style: { 
          display: 'block',
          marginBottom: '8px',
          fontWeight: '600',
          fontSize: '13px',
          color: '#333'
        }
      },
      props.label || 'Hình ảnh'
    ),

    // URL Input
    React.createElement('input', {
      type: 'text',
      value: value,
      onChange: handleUrlChange,
      placeholder: 'https://example.com/image.jpg',
      style: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        marginBottom: '10px',
        fontFamily: 'monospace'
      }
    }),

    // Upload Button Container
    React.createElement(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' } },
      
      // Upload Button
      React.createElement(
        'label',
        {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            backgroundColor: uploading ? '#ccc' : '#0070f3',
            color: 'white',
            borderRadius: '6px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            transition: 'background-color 0.2s'
          }
        },
        React.createElement('span', null, uploading ? '⏳' : '📤'),
        React.createElement('span', null, uploading ? 'Đang tải...' : 'Upload ảnh qua C# API'),
        React.createElement('input', {
          type: 'file',
          accept: 'image/*',
          onChange: handleFileChange,
          disabled: uploading,
          style: { display: 'none' }
        })
      ),

      // Help text
      React.createElement(
        'span',
        { style: { fontSize: '12px', color: '#666' } },
        'JPG, PNG, GIF, WebP (max 5MB)'
      )
    ),

    // Error message
    error && React.createElement(
      'div',
      {
        style: {
          padding: '10px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c00',
          fontSize: '13px',
          marginBottom: '10px'
        }
      },
      '⚠️ ' + error
    ),

    // Preview
    value && React.createElement(
      'div',
      { style: { marginTop: '10px' } },
      React.createElement(
        'div',
        { style: { fontSize: '12px', color: '#666', marginBottom: '8px' } },
        'Preview:'
      ),
      React.createElement('img', {
        src: value,
        alt: 'Preview',
        style: {
          maxWidth: '300px',
          maxHeight: '200px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          objectFit: 'contain'
        },
        onError: (e) => {
          e.target.style.display = 'none';
        }
      })
    )
  );
};

module.exports = ImageUploadField;
