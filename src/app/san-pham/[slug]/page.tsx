'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { addToRecentlyViewed } from '@/utils/recentlyViewed';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const PhanDauTrang = dynamic(() => import('../../components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('../../components/Footer/Footer'), { ssr: false });

interface Product {
  id: string;
  slug: string;
  name: string;
  description: any;
  image: string;
  gallery?: Array<{ image: string }>;
  price: string;
  service: {
    id: string;
    name: string;
    slug: string;
  };
  serviceCategory: {
    id: string;
    name: string;
    slug: string;
  };
  specifications?: {
    material?: string;
    size?: string;
    colors?: string;
    printing?: string;
    quantity?: string;
    finishing?: string;
  };
  detailedInfo?: any;
  features?: Array<{ feature: string }>;
  isFeatured: boolean;
}

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [latestNews, setLatestNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState(false);

  // Calculate all images array
  const allImages = product ? [
    product.image, 
    ...(product.gallery?.map(g => g.image) || [])
  ].filter(Boolean) : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation for images
  useEffect(() => {
    if (!product || allImages.length <= 1) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentIndex = allImages.indexOf(selectedImage || product.image);
      
      if (e.key === 'ArrowLeft') {
        const prevIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
        setSelectedImage(allImages[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const nextIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
        setSelectedImage(allImages[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [product, selectedImage, allImages]);

  // Fetch product data
  useEffect(() => {
    if (!mounted || !slug) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        
        // Fetch product by slug
        const response = await fetch(`/api/products?depth=2&where[slug][equals]=${slug}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const data = await response.json();
        const products = data.docs || [];

        if (products.length === 0) {
          setNotFound(true);
          return;
        }

        const productData = products[0];
        setProduct(productData);
        setSelectedImage(productData.image);
        
        // Add to recently viewed
        addToRecentlyViewed({
          id: productData.id,
          slug: productData.slug,
          name: productData.name,
          image: productData.image,
          price: productData.price || 'Liên hệ',
        });

        // Fetch related products (same service)
        if (productData.service?.id) {
          const relatedResponse = await fetch(
            `/api/products?depth=2&where[service][equals]=${productData.service.id}&where[slug][not_equals]=${slug}&limit=4`,
            { cache: 'no-store' }
          );
          
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedProducts(relatedData.docs || []);
          }
        }

        // TODO: Fetch latest news from API when available
        // setLatestNews([...]);

      } catch (error) {
        console.error('Error fetching product:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [mounted, slug]);

  if (!mounted || loading) {
    return <LoadingSkeleton />;
  }

  if (notFound || !product) {
    return (
      <>
        <PhanDauTrang />
        <NotFoundProduct />
        <Footer />
      </>
    );
  }

  // SEO meta tags
  const metaTitle = `${product.name} | VinhPhat Printing`;
  const metaDescription = typeof product.description === 'string' 
    ? product.description.substring(0, 160) 
    : `${product.name} - Sản phẩm in ấn chất lượng cao tại VinhPhat Printing. Giá: ${product.price}. Liên hệ: 0977 344 567`;
  const productUrl = `https://vinhphat.com/san-pham/${product.slug}`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${product.name}, in ấn, ${product.service?.name || 'in ấn'}, VinhPhat Printing, Hải Dương`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        <meta property="og:image" content={product.image} />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="VND" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={product.image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={productUrl} />
      </Head>
      
      <PhanDauTrang />
      
      {/* Breadcrumb */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Trang chủ
            </Link>
            <FaChevronRight className="text-xs" />
            <Link href="/san-pham" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sản phẩm
            </Link>
            <FaChevronRight className="text-xs" />
            {product.serviceCategory && (
              <>
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {product.serviceCategory.name}
                </span>
                <FaChevronRight className="text-xs" />
              </>
            )}
            <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Product Gallery - Left Side */}
            <div>
              {/* Main Image */}
              <div className="relative bg-gray-100 dark:bg-gray-800 mb-4 overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={selectedImage || product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                  {product.isFeatured && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-bold">
                      HOT
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          const currentIndex = allImages.indexOf(selectedImage || product.image);
                          const prevIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
                          setSelectedImage(allImages[prevIndex]);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <FaChevronLeft className="w-5 h-5 text-gray-800" />
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = allImages.indexOf(selectedImage || product.image);
                          const nextIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
                          setSelectedImage(allImages[nextIndex]);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <FaChevronRight className="w-5 h-5 text-gray-800" />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {allImages.indexOf(selectedImage || product.image) + 1} / {allImages.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery - Horizontal Scroll */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.slice(0, 6).map((img, index) => {
                    const isLast = index === 5 && allImages.length > 6;
                    const remainingCount = allImages.length - 6;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`relative flex-shrink-0 w-24 h-24 border-2 transition-all ${
                          selectedImage === img
                            ? 'border-blue-600'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
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

            {/* Product Info - Right Side */}
            <div>
              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                {product.price || 'Liên hệ'}
              </div>

              {/* THÔNG SỐ CƠ BẢN */}
              {product.specifications && (
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 uppercase text-sm">
                    Thông Số Cơ Bản
                  </h3>
                  <div className="space-y-2 text-sm">
                    {product.specifications.material && (
                      <div className="flex">
                        <span className="text-gray-600 dark:text-gray-400 w-32">- Chất liệu:</span>
                        <span className="text-gray-900 dark:text-white">{product.specifications.material}</span>
                      </div>
                    )}
                    {product.specifications.size && (
                      <div className="flex">
                        <span className="text-gray-600 dark:text-gray-400 w-32">- Kích thước:</span>
                        <span className="text-gray-900 dark:text-white">{product.specifications.size}</span>
                      </div>
                    )}
                    {product.specifications.colors && (
                      <div className="flex">
                        <span className="text-gray-600 dark:text-gray-400 w-32">- Màu in:</span>
                        <span className="text-gray-900 dark:text-white">{product.specifications.colors}</span>
                      </div>
                    )}
                    {product.specifications.printing && (
                      <div className="flex">
                        <span className="text-gray-600 dark:text-gray-400 w-32">- Phương pháp:</span>
                        <span className="text-gray-900 dark:text-white">{product.specifications.printing}</span>
                      </div>
                    )}
                    {product.specifications.quantity && (
                      <div className="flex">
                        <span className="text-gray-600 dark:text-gray-400 w-32">- Số lượng:</span>
                        <span className="text-gray-900 dark:text-white">{product.specifications.quantity}</span>
                      </div>
                    )}
                    {product.specifications.finishing && (
                      <div className="flex">
                        <span className="text-gray-600 dark:text-gray-400 w-32">- Gia công:</span>
                        <span className="text-gray-900 dark:text-white">{product.specifications.finishing}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Short Description */}
              {product.description && (
                <div className="text-gray-700 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                  {typeof product.description === 'string' ? (
                    // HTML string from CKEditor
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : Array.isArray(product.description) ? (
                    // Slate format (legacy)
                    product.description.map((block: any, index: number) => (
                      <p key={index} className="mb-2">
                        {block.children?.map((child: any, childIndex: number) => (
                          <span key={childIndex}>{child.text}</span>
                        ))}
                      </p>
                    ))
                  ) : null}
                </div>
              )}

              {/* Category & Tags */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Danh mục:</span>{' '}
                  <Link href="/san-pham" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {product.service?.name || 'Catalogue'}
                  </Link>
                </div>
                {product.serviceCategory && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="font-medium">Thẻ:</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400">
                      {product.service?.name}, catalogue hài dương
                    </span>
                  </div>
                )}
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FaFacebook className="text-blue-600 text-sm" />
                </button>
                <button className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FaTwitter className="text-sky-500 text-sm" />
                </button>
                <button className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FaEnvelope className="text-gray-600 text-sm" />
                </button>
                <button className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FaLinkedin className="text-blue-700 text-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* THÔNG TIN CHI TIẾT Tab */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <button className="px-6 py-3 font-bold text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 uppercase text-sm">
                Thông Tin Chi Tiết
              </button>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* Detailed Info (Rich Text) */}
              {product.detailedInfo ? (
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {typeof product.detailedInfo === 'string' ? (
                    // HTML string from CKEditor
                    <div dangerouslySetInnerHTML={{ __html: product.detailedInfo }} />
                  ) : Array.isArray(product.detailedInfo) && product.detailedInfo.length > 0 ? (
                    // Slate format (legacy)
                    product.detailedInfo.map((block: any, index: number) => (
                      <p key={index} className="mb-4">
                        {block.children?.map((child: any, childIndex: number) => (
                          <span key={childIndex}>{child.text}</span>
                        ))}
                      </p>
                    ))
                  ) : null}
                </div>
              ) : product.description ? (
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {typeof product.description === 'string' ? (
                    // HTML string from CKEditor
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : Array.isArray(product.description) && product.description.length > 0 ? (
                    // Slate format (legacy)
                    product.description.map((block: any, index: number) => (
                      <p key={index} className="mb-4">
                        {block.children?.map((child: any, childIndex: number) => (
                          <span key={childIndex}>{child.text}</span>
                        ))}
                      </p>
                    ))
                  ) : null}
                </div>
              ) : null}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Đặc Điểm Nổi Bật
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {product.features.map((item, index) => (
                      <li key={index}>{item.feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Specifications Table */}
              {product.specifications && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Thông Số Kỹ Thuật
                  </h3>
                  <table className="w-full border border-gray-200 dark:border-gray-700">
                    <tbody>
                      {product.specifications.material && (
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300 w-1/3">
                            Chất liệu
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {product.specifications.material}
                          </td>
                        </tr>
                      )}
                      {product.specifications.size && (
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">
                            Kích thước
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {product.specifications.size}
                          </td>
                        </tr>
                      )}
                      {product.specifications.colors && (
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">
                            Màu sắc
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {product.specifications.colors}
                          </td>
                        </tr>
                      )}
                      {product.specifications.printing && (
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-3 px-4 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">
                            Phương pháp in
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {product.specifications.printing}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Sản Phẩm Liên Quan
                </h2>
                <Link
                  href="/san-pham"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Xem tất cả →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/san-pham/${relatedProduct.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-bold">
                        {relatedProduct.price || 'Liên hệ'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Latest News */}
          {latestNews.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Tin Tức Mới Nhất
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {latestNews.map((news) => (
                  <div
                    key={news.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(news.date).toLocaleDateString('vi-VN')}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      <span className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Đọc thêm →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

// Loading Skeleton Component
function ProductDetailSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-300/50 dark:bg-gray-700/50 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-300/50 dark:bg-gray-700/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-3/4 animate-pulse"></div>
            <div className="h-10 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg w-1/2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-300/30 dark:bg-gray-700/30 rounded-lg w-4/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 404 Component
function NotFoundProduct() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-8xl mb-4">😕</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Không Tìm Thấy Sản Phẩm
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          href="/san-pham"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          Quay Lại Trang Sản Phẩm
        </Link>
      </div>
    </div>
  );
}
