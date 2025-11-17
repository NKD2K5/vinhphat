'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ProductsLoadingSkeleton } from '@/components/ProductsLoadingSkeleton';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { FaSearch, FaChevronRight } from 'react-icons/fa';
import { Eye } from 'lucide-react';
import ProductModal, { ProductData } from '@/components/ProductModal';

const PhanDauTrang = dynamic(() => import('../components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer/Footer'), { ssr: false });
const RecentlyViewed = dynamic(() => import('@/components/RecentlyViewed/RecentlyViewed'), { ssr: false });

interface Product {
  id: string;
  name: string;
  slug: string;
  description: any;
  image: string;
  price: string;
  gallery?: Array<{
    image: string;
    alt?: string;
  } | string>;
  serviceCategory: {
    id: string;
    name: string;
    slug: string;
  };
  service: {
    id: string;
    name: string;
    slug: string;
    category: string;
  };
  isFeatured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Component that uses useSearchParams
function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceIdFromUrl = searchParams?.get('service');
  const searchFromUrl = searchParams?.get('search');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [mounted, setMounted] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modal handlers
  const handleOpenModal = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewDetails = () => {
    if (selectedProduct) {
      handleCloseModal();
      router.push(`/san-pham/${selectedProduct.slug}`);
    }
  };

  const handleRequestQuote = () => {
    if (selectedProduct) {
      handleCloseModal();
      router.push(`/lien-he?product=${selectedProduct.id}`);
    }
  };
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [allProductsCount, setAllProductsCount] = useState(0); // Total count for "All Products"
  const productsPerPage = 12;

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Set selected category from URL on mount - WAIT for categories to load
  useEffect(() => {
    if (!mounted || !serviceIdFromUrl) return;
    
    // Wait for categories to be loaded
    if (categories.length === 0) {
      console.log('⏳ Waiting for categories to load...');
      return;
    }
    
    console.log('🔍 Looking for service ID:', serviceIdFromUrl);
    console.log('📋 Available categories:', categories.map(c => ({ id: c.id, name: c.name })));
    
    const matchingCategory = categories.find(cat => cat.id === serviceIdFromUrl);
    if (matchingCategory) {
      console.log('✅ Found matching category:', matchingCategory.name);
      setSelectedCategory(serviceIdFromUrl);
      setCurrentPage(1); // Reset to page 1 when changing category
    } else {
      console.warn('⚠️ No matching category found for service ID:', serviceIdFromUrl);
      console.warn('💡 Available IDs:', categories.map(c => c.id));
    }
  }, [mounted, serviceIdFromUrl, categories]);

  // Set search query from URL
  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setCurrentPage(1);
    }
  }, [searchFromUrl]);

  // Fetch services and counts ONCE on mount (cached)
  useEffect(() => {
    if (!mounted) return;
    
    async function fetchServicesAndCounts() {
      try {
        console.log('🔧 Fetching services and counts (once)...');
        
        const [servicesResponse, countsResponse] = await Promise.all([
          fetch('/api/service-items?limit=100&where[isActive][equals]=true', { 
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' }
          }),
          fetch('/api/product-counts', {
            cache: 'no-store', // No cache to get fresh counts
            headers: { 'Content-Type': 'application/json' }
          }),
        ]);
        
        if (!servicesResponse.ok) {
          console.error('❌ Failed to fetch services');
          return;
        }
        
        const servicesData = await servicesResponse.json();
        const countsData = await countsResponse.json();
        
        const services = servicesData.docs || [];
        const counts = countsData.counts || {};
        
        console.log('✅ Services loaded:', services.length);
        console.log('✅ Product counts loaded:', Object.keys(counts).length);
        
        // Map services to categories with real counts
        const categoriesArray = services
          .filter((service: any) => service.isActive !== false)
          .map((service: any) => ({
            id: service.id,
            name: service.name,
            slug: service.slug,
            count: counts[service.id] || 0,
          }))
          .sort((a: any, b: any) => (b.count || 0) - (a.count || 0)); // Sort by count
        
        setCategories(categoriesArray);
        setAllProductsCount(countsData.total || 0); // Set total count for "All Products"
      } catch (error) {
        console.error('❌ Error fetching services:', error);
      }
    }
    
    fetchServicesAndCounts();
  }, [mounted]);

  // Fetch products when page/category/search changes
  useEffect(() => {
    if (!mounted || categories.length === 0) return;
    
    async function fetchProducts() {
      try {
        setLoading(true);
        
        console.log('📦 Fetching products...');
        
        // Build query string for products with pagination and filters
        let productsQuery = `/api/products?depth=2&limit=${productsPerPage}&page=${currentPage}`;
        if (selectedCategory !== 'all') {
          productsQuery += `&where[service][equals]=${selectedCategory}`;
        }
        if (searchQuery) {
          productsQuery += `&where[name][contains]=${encodeURIComponent(searchQuery)}`;
        }
        
        const response = await fetch(productsQuery, { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          console.error('❌ Failed to fetch products:', response.status);
          throw new Error('Failed to fetch products');
        }
        
        const productsData = await response.json();
        const products = productsData.docs || [];
        
        console.log('✅ Products loaded:', products.length);
        console.log('📄 Page:', productsData.page, '/', productsData.totalPages);
        
        setProducts(products);
        setTotalPages(productsData.totalPages || 1);
        setTotalDocs(productsData.totalDocs || 0);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [mounted, currentPage, selectedCategory, searchQuery, categories.length]);

  // Show loader on initial load
  if (!mounted || loading) {
    return <LoadingSkeleton />;
  }

  // Products are already filtered by server
  const filteredProducts = products;

  // Dynamic meta description based on category
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'Tất cả';
  const metaTitle = searchQuery 
    ? `Tìm kiếm "${searchQuery}" - Sản phẩm In Ấn | VinhPhat Printing`
    : `${selectedCategoryName} - Sản phẩm In Ấn | VinhPhat Printing`;
  const metaDescription = searchQuery
    ? `Kết quả tìm kiếm cho "${searchQuery}". Khám phá các sản phẩm in ấn chất lượng cao tại VinhPhat Printing - In Offset, In Decal, In Tem Nhãn, In Bao Bì.`
    : `Khám phá ${selectedCategoryName.toLowerCase()} chất lượng cao tại VinhPhat Printing. In Offset, In Decal, In Tem Nhãn, In Bao Bì với giá cạnh tranh. Liên hệ: 0977 344 567`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content="in ấn, in offset, in decal, in tem nhãn, in bao bì, in tờ rơi, in catalogue, in brochure, in card visit, VinhPhat Printing, Hải Dương" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vinhphat.com/san-pham" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Head>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <PhanDauTrang />

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 pt-24">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Danh Mục Sản Phẩm
                </h3>
                
                <ul className="space-y-2">
                  {/* All Products */}
                  <li>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setCurrentPage(1);
                        setSearchQuery(''); // Clear search
                        router.push('/san-pham'); // Clear URL params
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        selectedCategory === 'all'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="font-medium">Tất cả sản phẩm</span>
                      {allProductsCount > 0 && (
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          selectedCategory === 'all'
                            ? 'bg-white/20'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}>
                          {allProductsCount}
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Category List */}
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setCurrentPage(1);
                          setSearchQuery(''); // Clear search
                          router.push(`/san-pham?service=${category.id}`); // Update URL with service only
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                          selectedCategory === category.id
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        {category.count > 0 && (
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            selectedCategory === category.id
                              ? 'bg-white/20'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}>
                            {category.count}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedCategory === 'all' 
                  ? 'Tất Cả Sản Phẩm' 
                  : categories.find(c => c.id === selectedCategory)?.name || 'Sản Phẩm'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Hiển thị {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, totalDocs)} trong tổng số {totalDocs} sản phẩm
              </p>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/san-pham/${product.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <Image
                        src={product.image || 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Featured Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                          Nổi bật
                        </div>
                      )}
                      
                      {/* Quick View Button */}
                      <button
                        onClick={(e) => handleOpenModal(product, e)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110 z-10"
                        aria-label="Xem nhanh"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>

                      {/* Category Badge */}
                      {product.service && typeof product.service === 'object' && (
                        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          {product.service.name}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 uppercase line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {product.price || 'Liên hệ'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white shadow-md'
                  }`}
                >
                  ← Trước
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-lg scale-110'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white shadow-md'
                  }`}
                >
                  Sau →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Recently Viewed Products - Fixed Sidebar */}
      <RecentlyViewed />

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={{
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: (() => {
              // Extract number from price string like "Từ 20.000đ"
              const priceMatch = selectedProduct.price?.match(/[\d.,]+/);
              if (priceMatch) {
                const numStr = priceMatch[0].replace(/\./g, '').replace(/,/g, '');
                return parseFloat(numStr) || 0;
              }
              return 0;
            })(),
            currency: '₫',
            rating: 4.5,
            reviewCount: 10,
            sku: selectedProduct.id,
            images: (() => {
              // Build images array - main image FIRST, then gallery
              const imageList: string[] = [];
              
              // Add main image FIRST (this is the primary product image)
              if (selectedProduct.image) {
                imageList.push(selectedProduct.image);
              }
              
              // Then add gallery images
              if (selectedProduct.gallery && Array.isArray(selectedProduct.gallery)) {
                selectedProduct.gallery.forEach((img: any) => {
                  if (typeof img === 'string') {
                    imageList.push(img);
                  } else if (typeof img === 'object' && img.image) {
                    imageList.push(img.image);
                  }
                });
              }
              
              // Fallback to placeholder if still empty
              if (imageList.length === 0) {
                imageList.push('https://placehold.co/400x300/e2e8f0/64748b?text=No+Image');
              }
              
              return imageList;
            })(),
            hotline: '0977 344 567',
            email: 'invinhphat2025@gmail.com',
            description: typeof selectedProduct.description === 'string' 
              ? selectedProduct.description 
              : 'Sản phẩm chất lượng cao từ VinhPhat Printing',
          }}
          onViewDetails={handleViewDetails}
          onRequestQuote={handleRequestQuote}
        />
      )}
      </div>
    </>
  );
}

// Main component with Suspense wrapper
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
