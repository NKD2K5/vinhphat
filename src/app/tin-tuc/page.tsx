'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Calendar, User, Clock, Eye, Heart, Search, TrendingUp } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const PhanDauTrang = dynamic(() => import('../components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer/Footer'), { ssr: false });

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: any;
  featuredImage: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: string;
  publishedAt: string;
  readTime?: string;
  views?: number;
  isFeatured?: boolean;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

function NewsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams?.get('category');
  const searchFromUrl = searchParams?.get('search');

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    setMounted(true);
    // Set page title
    document.title = 'Tin Tức - VinhPhat Printing';
  }, []);

  // Fetch categories
  useEffect(() => {
    if (!mounted) return;

    async function fetchCategories() {
      try {
        const response = await fetch('/api/news-categories?limit=100', {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          const cats = data.docs || [];
          
          // Count articles per category
          const categoriesWithCount = cats.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            count: 0, // Will be updated when articles are fetched
          }));

          setCategories(categoriesWithCount);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, [mounted]);

  // Set category from URL
  useEffect(() => {
    if (categoryFromUrl && categories.length > 0) {
      const matchingCategory = categories.find(cat => cat.slug === categoryFromUrl);
      if (matchingCategory) {
        setSelectedCategory(matchingCategory.id);
      }
    }
  }, [categoryFromUrl, categories]);

  // Set search from URL
  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchFromUrl]);

  // Fetch articles
  useEffect(() => {
    if (!mounted) return;

    async function fetchArticles() {
      try {
        setLoading(true);

        let url = `/api/news?depth=2&limit=${articlesPerPage}&page=${currentPage}&sort=-publishedAt`;

        // Add category filter
        if (selectedCategory && selectedCategory !== 'all') {
          url += `&where[category][equals]=${selectedCategory}`;
        }

        // Add search filter
        if (searchQuery) {
          url += `&where[title][contains]=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url, { cache: 'no-store' });

        if (response.ok) {
          const data = await response.json();
          const newsArticles = data.docs || [];
          
          setArticles(newsArticles);
          setTotalPages(data.totalPages || 1);

          // Set featured article (first featured or first article)
          const featured = newsArticles.find((article: NewsArticle) => article.isFeatured);
          setFeaturedArticle(featured || newsArticles[0] || null);

          // Update category counts
          if (categories.length > 0) {
            const allArticlesResponse = await fetch('/api/news?depth=2&limit=1000', { cache: 'no-store' });
            if (allArticlesResponse.ok) {
              const allData = await allArticlesResponse.json();
              const allArticles = allData.docs || [];
              
              const updatedCategories = categories.map(cat => ({
                ...cat,
                count: allArticles.filter((article: NewsArticle) => 
                  article.category && typeof article.category === 'object' && article.category.id === cat.id
                ).length,
              }));
              
              setCategories(updatedCategories);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [mounted, currentPage, selectedCategory, searchQuery, categories.length]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  if (loading) {
    return (
      <>
        <PhanDauTrang />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
          <LoadingSkeleton />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PhanDauTrang />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Hero Section with Featured Article */}
        {featuredArticle && (
          <section className="relative h-[500px] md:h-[600px] overflow-hidden -mt-20">
            <Image
              src={featuredArticle.featuredImage || 'https://placehold.co/1920x1080/e2e8f0/64748b?text=Featured+News'}
              alt={featuredArticle.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-12 md:pb-16">
                <div className="max-w-3xl">
                  {featuredArticle.category && (
                    <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full mb-4">
                      {featuredArticle.category.name}
                    </span>
                  )}
                  
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    {featuredArticle.title}
                  </h1>
                  
                  {featuredArticle.excerpt && (
                    <p className="text-lg md:text-xl text-gray-200 mb-6 line-clamp-2">
                      {featuredArticle.excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                    {featuredArticle.author && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{featuredArticle.author}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredArticle.publishedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {featuredArticle.readTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href={`/tin-tuc/${featuredArticle.slug}`}
                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Đọc ngay
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Search Box */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Tìm kiếm
                </h3>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm tin tức..."
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Danh mục
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Tất cả</span>
                      <span className={`text-sm ${
                        selectedCategory === 'all' ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {categories.reduce((sum, cat) => sum + cat.count, 0)}
                      </span>
                    </div>
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className={`text-sm ${
                          selectedCategory === category.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Tags phổ biến
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['in ấn', 'thiết kế', 'xu hướng', 'catalogue', 'brochure', 'name card', 'bao bì', 'flyer'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Articles Grid */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory === 'all' 
                    ? 'Tất cả tin tức' 
                    : categories.find(c => c.id === selectedCategory)?.name || 'Tin tức'}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Kết quả tìm kiếm cho: <span className="font-semibold">"{searchQuery}"</span>
                  </p>
                )}
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Không tìm thấy tin tức nào
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {articles.map((article) => (
                      <article
                        key={article.id}
                        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        <Link href={`/tin-tuc/${article.slug}`}>
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={article.featuredImage || 'https://placehold.co/600x400/e2e8f0/64748b?text=News'}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                          </div>
                        </Link>

                        <div className="p-6">
                          {article.category && (
                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-semibold rounded-full mb-3">
                              {article.category.name}
                            </span>
                          )}
                          
                          <Link href={`/tin-tuc/${article.slug}`}>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                          </Link>

                          {article.excerpt && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                            {article.readTime && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{article.readTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Trước
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Sau
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <NewsContent />
    </Suspense>
  );
}
