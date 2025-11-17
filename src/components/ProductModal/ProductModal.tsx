'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Phone, Mail, Star } from 'lucide-react';

// Types
interface ProductImage {
  url: string;
  alt?: string;
}

interface ProductData {
  id: string | number;
  name: string;
  price: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  images: ProductImage[] | string[];
  hotline?: string;
  email?: string;
  description?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData;
  onViewDetails?: () => void;
  onRequestQuote?: () => void;
}

// ImageGallery Component
const ImageGallery: React.FC<{
  images: ProductImage[] | string[];
  productName: string;
}> = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const normalizedImages = images.map((img) =>
    typeof img === 'string' ? { url: img, alt: productName } : img
  );

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === normalizedImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden aspect-square flex items-center justify-center p-4">
        <div className="relative w-full h-full">
          <Image
            src={normalizedImages[currentImageIndex].url}
            alt={normalizedImages[currentImageIndex].alt || productName}
            fill
            className="object-contain transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        {normalizedImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {normalizedImages.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {normalizedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {normalizedImages.slice(0, 6).map((image, index) => {
            const isLast = index === 5 && normalizedImages.length > 6;
            const remainingCount = normalizedImages.length - 6;
            
            return (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">+{remainingCount}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// StarRating Component
const StarRating: React.FC<{
  rating: number;
  reviewCount?: number;
}> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
        {reviewCount && ` (${reviewCount} đánh giá)`}
      </span>
    </div>
  );
};

// ProductInfo Component
const ProductInfo: React.FC<{
  product: ProductData;
  onViewDetails?: () => void;
  onRequestQuote?: () => void;
}> = ({ product, onViewDetails, onRequestQuote }) => {
  const formatPrice = (price: number, currency: string = '₫') => {
    return `${price.toLocaleString('vi-VN')}${currency}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Product Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {product.name}
      </h2>

      {/* Rating */}
      {product.rating !== undefined && (
        <div className="mb-4">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      )}

      {/* Price */}
      <div className="mb-6">
        <div className="text-3xl md:text-4xl font-bold text-red-600">
          {formatPrice(product.price, product.currency)}
        </div>
      </div>

      {/* SKU */}
      {product.sku && (
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Mã sản phẩm:</span> {product.sku}
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={onViewDetails}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Xem chi tiết
        </button>
        <button
          onClick={onRequestQuote}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Liên hệ báo giá
        </button>
      </div>

      {/* Contact Section */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Thông tin liên hệ
        </h3>
        <div className="space-y-3">
          {product.hotline && (
            <a
              href={`tel:${product.hotline.replace(/\s/g, '')}`}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Hotline</div>
                <div className="font-semibold">{product.hotline}</div>
              </div>
            </a>
          )}
          {product.email && (
            <a
              href={`mailto:${product.email}`}
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                <div className="font-semibold">{product.email}</div>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Main ProductModal Component
const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onViewDetails,
  onRequestQuote,
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Image Gallery */}
            <div>
              <ImageGallery images={product.images} productName={product.name} />
            </div>

            {/* Right Side - Product Info */}
            <div>
              <ProductInfo
                product={product}
                onViewDetails={onViewDetails}
                onRequestQuote={onRequestQuote}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
export type { ProductData, ProductModalProps };
