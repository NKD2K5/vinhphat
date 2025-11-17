'use client';

import React, { useState, useRef } from 'react';
import { useCloudinaryUpload } from '@/cloudinary/useCloudinaryUpload';
import Image from 'next/image';

type CloudinaryFolder = 'products' | 'news' | 'banners' | 'users' | 'media' | 'general';

interface CloudinaryImageUploadProps {
  folder?: CloudinaryFolder;
  onUploadComplete?: (url: string, data: any) => void;
  onUploadError?: (error: string) => void;
  currentImageUrl?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

export default function CloudinaryImageUpload({
  folder = 'general',
  onUploadComplete,
  onUploadError,
  currentImageUrl,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = '',
}: CloudinaryImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, url, error, uploadFile, reset } = useCloudinaryUpload(folder);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      const errorMsg = `Chỉ chấp nhận các định dạng: ${acceptedFormats.join(', ')}`;
      onUploadError?.(errorMsg);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const errorMsg = `Kích thước file không được vượt quá ${maxSizeMB}MB`;
      onUploadError?.(errorMsg);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const result = await uploadFile(file);
    
    if (result?.success && result.data) {
      onUploadComplete?.(result.data.secureUrl, result.data);
    } else if (result?.error) {
      onUploadError?.(result.error);
      setPreview(currentImageUrl || null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`cloudinary-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview Area */}
      <div className="relative">
        {preview ? (
          <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={url || preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
            
            {/* Loading Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-2">
                    <svg className="animate-spin h-10 w-10 mx-auto" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Đang tải lên... {progress}%</p>
                </div>
              </div>
            )}

            {/* Remove Button */}
            {!uploading && (
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleClick}
            type="button"
            className="w-full aspect-video border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800/50"
          >
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click để chọn ảnh
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tối đa {maxSizeMB}MB
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {url && !uploading && (
        <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-600 dark:text-green-400">✓ Tải lên thành công!</p>
        </div>
      )}
    </div>
  );
}
