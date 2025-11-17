'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useField } from 'payload/components/forms';
import './CustomImageField.scss';

interface CustomImageFieldProps {
  path: string;
  label?: string;
  folder?: string;
  required?: boolean;
}

const CSHARP_API_URL = process.env.NEXT_PUBLIC_CSHARP_API_URL || 'https://localhost:7118/api';

// Helper function to extract publicId from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export const CustomImageField: React.FC<CustomImageFieldProps> = ({
  path,
  label = 'Hình ảnh',
  folder = 'general',
  required = false,
}) => {
  const { value, setValue } = useField<string>({ path });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      // Gửi publicId của ảnh cũ để C# API xóa nó
      if (value) {
        // Extract publicId from Cloudinary URL
        const oldPublicId = extractPublicIdFromUrl(value);
        if (oldPublicId) {
          formData.append('oldPublicId', oldPublicId);
        }
      }

      console.log(`📤 Uploading to C# API: ${CSHARP_API_URL}/Upload`);

      const response = await fetch(`${CSHARP_API_URL}/Upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Upload failed');
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);

      const imageUrl = result.secureUrl || result.url;
      setValue(imageUrl);
      setPreview(imageUrl);
    } catch (err: any) {
      console.error('❌ Upload error:', err);
      setError(err.message || 'Upload failed');
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    // If there's an existing image, delete it from cloud
    if (value) {
      const oldPublicId = extractPublicIdFromUrl(value);
      if (oldPublicId) {
        try {
          console.log(`🗑️ Deleting image from cloud: ${oldPublicId}`);
          
          const response = await fetch(`${CSHARP_API_URL}/Delete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ publicId: oldPublicId }),
          });

          if (response.ok) {
            console.log('✅ Image deleted from cloud successfully');
          } else {
            console.warn('⚠️ Failed to delete image from cloud, but continuing...');
          }
        } catch (err) {
          console.error('❌ Error deleting image from cloud:', err);
          // Continue anyway to clear the field
        }
      }
    }

    setValue('');
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="custom-image-field">
      <div className="field-type upload">
        <label className="field-label">
          {label}
          {required && <span className="required">*</span>}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="file-input"
        />

        <div className="upload-field">
          {preview ? (
            <div className="file-preview">
              <div className="file-preview__thumbnail">
                <img src={preview} alt="Preview" />
                {uploading && (
                  <div className="file-preview__loading">
                    <div className="spinner" />
                    <span>Đang tải lên...</span>
                  </div>
                )}
              </div>
              
              {!uploading && (
                <div className="file-preview__actions">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="btn btn--style-secondary btn--size-small"
                  >
                    Thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="btn btn--style-secondary btn--size-small btn--icon-style-without-border"
                  >
                    Xóa
                  </button>
                </div>
              )}

              {value && (
                <div className="file-preview__meta">
                  <div className="file-meta__url">
                    <input
                      type="text"
                      value={value}
                      readOnly
                      className="file-meta__url-input"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="upload-placeholder">
              <button
                type="button"
                onClick={handleClick}
                disabled={uploading}
                className="btn btn--style-secondary btn--size-medium upload-placeholder__button"
              >
                <svg className="icon" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 3.5v18M3.5 12.5h18" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <span>{uploading ? 'Đang tải lên...' : 'Tải ảnh lên'}</span>
              </button>
              <p className="upload-placeholder__hint">
                hoặc kéo thả file vào đây
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="field-error">
            <span>{error}</span>
          </div>
        )}

        {value && !uploading && !error && (
          <div className="field-success">
            <span>✓ Đã tải lên thành công</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Default export for easier importing
export default CustomImageField;
