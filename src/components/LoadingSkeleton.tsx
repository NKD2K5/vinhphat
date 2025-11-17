'use client';

import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Skeleton */}
      <div className="relative h-[600px] bg-gradient-to-br from-blue-600/20 to-purple-600/20 dark:from-blue-900/20 dark:to-purple-900/20 animate-pulse">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full flex items-center">
          <div className="max-w-3xl space-y-6">
            {/* Title skeleton */}
            <div className="h-16 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-3/4 animate-pulse"></div>
            <div className="h-16 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-2/3 animate-pulse"></div>
            
            {/* Subtitle skeleton */}
            <div className="h-8 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-1/2 animate-pulse"></div>
            
            {/* Buttons skeleton */}
            <div className="flex gap-4 pt-4">
              <div className="h-14 w-40 bg-gray-300/40 dark:bg-gray-700/40 rounded-xl animate-pulse"></div>
              <div className="h-14 w-40 bg-gray-300/40 dark:bg-gray-700/40 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-20">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
              {/* Image skeleton */}
              <div className="h-48 bg-gray-300/50 dark:bg-gray-700/50 rounded-xl mb-4"></div>
              
              {/* Title skeleton */}
              <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-3/4 mb-3"></div>
              
              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-5/6"></div>
                <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Text */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Đang tải...</span>
        </div>
      </div>
    </div>
  );
}
