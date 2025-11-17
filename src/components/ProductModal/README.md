# ProductModal Component

A production-ready, fully-featured product detail modal component built with React, TypeScript, and Tailwind CSS.

## Features

✅ **Image Gallery**
- Main image display with smooth transitions
- Previous/Next navigation arrows
- Thumbnail strip with active state
- Keyboard navigation (Arrow keys)
- Image counter display

✅ **Product Information**
- Product title and description
- Star rating with review count
- Price display with currency formatting
- SKU/Product code
- Responsive layout

✅ **Call-to-Action Buttons**
- "Xem chi tiết" (View Details) - Blue button
- "Liên hệ báo giá" (Request Quote) - Orange button
- Customizable click handlers

✅ **Contact Section**
- Hotline with phone icon (clickable tel: link)
- Email with mail icon (clickable mailto: link)
- Hover effects and transitions

✅ **User Experience**
- Click outside modal to close
- ESC key to close
- Smooth animations (fade in, slide up)
- Prevents body scroll when open
- Fully responsive (mobile-first)
- Dark mode support

## Installation

The component uses the following dependencies:
```bash
npm install lucide-react
# or
yarn add lucide-react
```

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import ProductModal, { ProductData } from '@/components/ProductModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const product: ProductData = {
    id: 1,
    name: 'Hộp quà 2',
    price: 150000,
    currency: '₫',
    rating: 4.5,
    reviewCount: 12,
    sku: 'HQ-002-2024',
    images: [
      '/images/product1.jpg',
      '/images/product2.jpg',
      '/images/product3.jpg',
    ],
    hotline: '0977 344 567',
    email: 'invinhphat2025@gmail.com',
    description: 'Product description here...',
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Product
      </button>

      <ProductModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={product}
        onViewDetails={() => console.log('View details')}
        onRequestQuote={() => console.log('Request quote')}
      />
    </>
  );
}
```

### With Router Navigation

```tsx
import { useRouter } from 'next/navigation';

function ProductCard({ product }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsModalOpen(false);
    router.push(`/san-pham/${product.slug}`);
  };

  const handleRequestQuote = () => {
    setIsModalOpen(false);
    router.push(`/lien-he?product=${product.id}`);
  };

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>
        {/* Product card content */}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onViewDetails={handleViewDetails}
        onRequestQuote={handleRequestQuote}
      />
    </>
  );
}
```

## Props

### ProductModalProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | ✅ | Controls modal visibility |
| `onClose` | `() => void` | ✅ | Callback when modal closes |
| `product` | `ProductData` | ✅ | Product data object |
| `onViewDetails` | `() => void` | ❌ | Callback for "View Details" button |
| `onRequestQuote` | `() => void` | ❌ | Callback for "Request Quote" button |

### ProductData

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string \| number` | ✅ | Unique product identifier |
| `name` | `string` | ✅ | Product name |
| `price` | `number` | ✅ | Product price |
| `images` | `ProductImage[] \| string[]` | ✅ | Array of image URLs or objects |
| `currency` | `string` | ❌ | Currency symbol (default: '₫') |
| `rating` | `number` | ❌ | Product rating (0-5) |
| `reviewCount` | `number` | ❌ | Number of reviews |
| `sku` | `string` | ❌ | Product SKU/code |
| `hotline` | `string` | ❌ | Contact phone number |
| `email` | `string` | ❌ | Contact email |
| `description` | `string` | ❌ | Product description |

## Keyboard Shortcuts

- **ESC** - Close modal
- **Arrow Left** - Previous image
- **Arrow Right** - Next image

## Customization

### Styling

The component uses Tailwind CSS classes. You can customize colors by modifying the classes:

```tsx
// Change button colors
<button className="bg-blue-600 hover:bg-blue-700"> // View Details
<button className="bg-orange-500 hover:bg-orange-600"> // Request Quote
```

### Animations

Animations are defined in the component's style tag. You can adjust timing:

```css
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out; /* Change duration */
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out; /* Change duration */
}
```

## Accessibility

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Semantic HTML structure
- ✅ Alt text for images

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance

- Uses Next.js `Image` component for optimized images
- Lazy loading for images
- Smooth transitions with CSS animations
- Prevents unnecessary re-renders

## License

MIT
