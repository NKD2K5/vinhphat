'use client';

import React from 'react';

export function ProductsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-64 animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Search Skeleton */}
              <div className="mb-6">
                <div className="h-12 bg-gray-300/50 dark:bg-gray-700/50 rounded-xl animate-pulse"></div>
              </div>

              {/* Categories Title */}
              <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-3/4 mb-4 animate-pulse"></div>

              {/* Categories List */}
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <li key={i}>
                    <div className="h-12 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg animate-pulse"></div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid Skeleton */}
          <main className="lg:col-span-3">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-10 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-96 animate-pulse"></div>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  {/* Image Skeleton */}
                  <div className="h-64 bg-gray-300/50 dark:bg-gray-700/50"></div>
                  
                  {/* Content Skeleton */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-full"></div>
                    <div className="h-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-3/4"></div>
                    
                    {/* Price */}
                    <div className="h-8 bg-gray-300/40 dark:bg-gray-700/40 rounded-lg w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-10 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Đang tải sản phẩm...</span>
        </div>
      </div>
    </div>
  );
}
