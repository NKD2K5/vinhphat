import React, { useState, useCallback } from 'react';
import { useField } from 'payload/components/forms';

const CSharpImageUploader: React.FC<any> = ({ path, label }) => {
  const { value, setValue } = useField<any>({ path });
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadToAPI = async (file: File) => {
    try {
      setUploading(true);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate placeholder URL based on file name
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const cleanName = fileName.replace(/[^a-zA-Z0-9]/g, '+'); // Replace special chars with +
      
      // Create placeholder URL with file name
      const placeholderUrl = `https://placehold.co/400x300/1e40af/ffffff?text=${cleanName}`;
      
      setValue({
        url: placeholderUrl,
        alt: value?.alt || fileName,
        filename: file.name,
        size: file.size,
      });

    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      uploadToAPI(files[0]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = () => {
    setValue(null);
  };

  const updateAlt = (alt: string) => {
    setValue({
      ...value,
      alt,
    });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        fontSize: '14px',
        color: '#333'
      }}>
        {label || 'Hình Ảnh'}
      </label>

      {value?.url ? (
        // Show uploaded image
        <div style={{ 
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ marginBottom: '12px' }}>
            <img 
              src={value.url} 
              alt={value.alt || 'Uploaded image'}
              style={{ 
                maxWidth: '200px', 
                maxHeight: '150px', 
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px',
              fontSize: '12px',
              color: '#666'
            }}>
              Alt Text:
            </label>
            <input
              type="text"
              value={value.alt || ''}
              onChange={(e) => updateAlt(e.target.value)}
              placeholder="Mô tả hình ảnh..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            marginBottom: '12px'
          }}>
            <div>📁 {value.filename}</div>
            {value.size && <div>📏 {Math.round(value.size / 1024)} KB</div>}
          </div>

          <button
            type="button"
            onClick={removeImage}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🗑️ Xóa ảnh
          </button>
        </div>
      ) : (
        // Show upload area
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? '#007cba' : '#ccc'}`,
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: dragOver ? '#f0f8ff' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {uploading ? (
            <div>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <div style={{ color: '#666' }}>Đang upload...</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📁</div>
              <div style={{ marginBottom: '8px', fontWeight: '500' }}>
                Kéo thả ảnh vào đây hoặc click để chọn
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
                Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                style={{ display: 'none' }}
                id={`file-input-${path}`}
              />
              <label
                htmlFor={`file-input-${path}`}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#007cba',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📤 Chọn ảnh
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CSharpImageUploader;
