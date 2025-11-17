'use client';

import React, { useState } from 'react';
import { useField } from 'payload/components/forms';

interface CloudinaryUploadFieldProps {
  path: string;
  label?: string;
  folder?: string;
}

export const CloudinaryUploadField: React.FC<CloudinaryUploadFieldProps> = ({
  path,
  label = 'Upload to Cloudinary',
  folder = 'general',
}) => {
  const { value, setValue } = useField<string>({ path });
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
      formData.append('folder', folder);

      const response = await fetch('/api/cloudinary-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setValue(result.data.secureUrl);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        {label}
      </label>
      
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        accept="image/*"
        style={{
          display: 'block',
          marginBottom: '10px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      {uploading && (
        <div style={{ color: '#0066cc', marginBottom: '10px' }}>
          ⏳ Uploading to Cloudinary...
        </div>
      )}

      {error && (
        <div style={{ color: '#cc0000', marginBottom: '10px' }}>
          ❌ Error: {error}
        </div>
      )}

      {value && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '8px', color: '#00aa00' }}>
            ✅ Uploaded successfully!
          </div>
          <img
            src={value}
            alt="Uploaded"
            style={{
              maxWidth: '300px',
              maxHeight: '200px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              display: 'block',
              marginBottom: '8px',
            }}
          />
          <input
            type="text"
            value={value}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
              fontSize: '12px',
            }}
          />
        </div>
      )}
    </div>
  );
};
