'use client';

import React, { useState } from 'react';
import ProductModal, { ProductData } from './ProductModal';

// Example usage component
const ProductModalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample product data
  const sampleProduct: ProductData = {
    id: 1,
    name: 'Hộp quà 2',
    price: 150000,
    currency: '₫',
    rating: 4.5,
    reviewCount: 12,
    sku: 'HQ-002-2024',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    ],
    hotline: '0977 344 567',
    email: 'invinhphat2025@gmail.com',
    description: 'Hộp quà cao cấp với thiết kế sang trọng, phù hợp cho mọi dịp lễ tết. In ấn chất lượng cao, màu sắc sống động.',
  };

  const handleViewDetails = () => {
    console.log('View details clicked for product:', sampleProduct.id);
    // Navigate to product detail page
    // router.push(`/san-pham/${sampleProduct.id}`);
  };

  const handleRequestQuote = () => {
    console.log('Request quote clicked for product:', sampleProduct.id);
    // Open contact form or WhatsApp
    // window.open(`https://wa.me/0977344567?text=Xin báo giá cho ${sampleProduct.name}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Product Modal Example</h1>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Open Product Modal
      </button>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={sampleProduct}
        onViewDetails={handleViewDetails}
        onRequestQuote={handleRequestQuote}
      />
    </div>
  );
};

export default ProductModalExample;
