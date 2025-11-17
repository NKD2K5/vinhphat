'use client';

import React, { useState } from 'react';

export const ImageUploadFieldComponent: React.FC<any> = ({ value: initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Tắt SSL verification cho development
      const response = await fetch(process.env.NEXT_PUBLIC_CSHARP_API_URL + '/api/Upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setValue(result.url);
      if (onChange) onChange(result.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
          }}
        />
      </div>

      {uploading && (
        <div style={{ color: '#3b82f6', fontSize: '0.875rem' }}>
          Đang upload...
        </div>
      )}

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {value && !uploading && (
        <div style={{ marginTop: '0.5rem' }}>
          <img
            src={value}
            alt="Preview"
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          />
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>
              Xem ảnh gốc
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
