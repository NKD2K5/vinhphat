'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ExternalLink, RefreshCw } from 'lucide-react';

interface PreviewToolbarProps {
  isPreviewMode?: boolean;
  previewUrl?: string;
  showToggle?: boolean;
  showRefresh?: boolean;
}

export default function PreviewToolbar({ 
  isPreviewMode = false, 
  previewUrl,
  showToggle = true,
  showRefresh = true 
}: PreviewToolbarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTogglePreview = async () => {
    try {
      if (isPreviewMode) {
        await fetch('/api/exit-preview');
      } else {
        // This would need to be implemented based on current page context
        console.log('Toggle preview mode');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error toggling preview mode:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const openPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center gap-3">
        {/* Preview Mode Indicator */}
        <div className="flex items-center gap-2">
          {isPreviewMode ? (
            <Eye className="w-4 h-4 text-green-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isPreviewMode ? 'Preview ON' : 'Preview OFF'}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Toggle Preview Button */}
          {showToggle && (
            <button
              onClick={handleTogglePreview}
              className={`p-2 rounded-md text-sm font-medium transition-colors ${
                isPreviewMode
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
              }`}
              title={isPreviewMode ? 'Tắt xem trước' : 'Bật xem trước'}
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Open Preview Button */}
          {previewUrl && (
            <button
              onClick={openPreview}
              className="p-2 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
              title="Mở xem trước trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {/* Refresh Button */}
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
