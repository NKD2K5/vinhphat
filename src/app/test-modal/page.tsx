'use client';

import React from 'react';
import ProductModalExample from '@/components/ProductModal/ProductModalExample';

export default function TestModalPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <ProductModalExample />
      </div>
    </div>
  );
}
