'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { Calendar, User, Clock, Eye, Heart, Share2, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import './article-content.css';

const PhanDauTrang = dynamic(() => import('../../components/PhanDauTrang/PhanDauTrang'), { ssr: false });
const Footer = dynamic(() => import('../../components/Footer/Footer'), { ssr: false });

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: any;
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
  tags?: Array<{ tag: string }>;
  relatedPosts?: NewsArticle[] | string[]; // Can be populated or just IDs
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

// Helper function to render rich text content (HTML from CKEditor)
const renderRichText = (content: any): React.ReactNode => {
  // Nếu content là HTML string (từ CKEditor)
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Fallback: Nếu vẫn còn Slate format (array) - legacy data
  if (!content || !Array.isArray(content)) return null;

  return content.map((node: any, index: number) => {
    if (!node.children) return null;

    const text = node.children.map((child: any) => child.text).join('');

    if (node.type === 'h1') {
      return <h1 key={index}>{text}</h1>;
    }
    if (node.type === 'h2') {
      return <h2 key={index}>{text}</h2>;
    }
    if (node.type === 'h3') {
      return <h3 key={index}>{text}</h3>;
    }
    if (node.type === 'h4') {
      return <h4 key={index}>{text}</h4>;
    }
    if (node.type === 'ul') {
      return (
        <ul key={index}>
          {node.children.map((li: any, liIndex: number) => (
            <li key={liIndex}>{li.children?.map((c: any) => c.text).join('')}</li>
          ))}
        </ul>
      );
    }
    if (node.type === 'ol') {
      return (
        <ol key={index}>
          {node.children.map((li: any, liIndex: number) => (
            <li key={liIndex}>{li.children?.map((c: any) => c.text).join('')}</li>
          ))}
        </ol>
      );
    }

    return <p key={index}>{text}</p>;
  });
};

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set page title dynamically
    if (article) {
      document.title = article.seo?.title || `${article.title} | VinhPhat Printing`;
    }
  }, [article]);

  useEffect(() => {
    if (!mounted || !slug) return;

    async function fetchArticle() {
      try {
        setLoading(true);

        const response = await fetch(`/api/news?depth=3&where[slug][equals]=${slug}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const data = await response.json();
        const articles = data.docs || [];

        if (articles.length === 0) {
          setNotFound(true);
          return;
        }

        const articleData = articles[0];
        setArticle(articleData);

        // Fetch related articles
        // Priority 1: Use manually selected relatedPosts if available
        if (articleData.relatedPosts && Array.isArray(articleData.relatedPosts) && articleData.relatedPosts.length > 0) {
          // Check if relatedPosts are populated objects or just IDs
          const firstItem = articleData.relatedPosts[0];
          if (typeof firstItem === 'object' && firstItem.title) {
            // Already populated
            setRelatedArticles(articleData.relatedPosts as NewsArticle[]);
          } else {
            // Just IDs, need to fetch
            const ids = (articleData.relatedPosts as string[]).join(',');
            const relatedResponse = await fetch(
              `/api/news?depth=1&where[id][in]=${ids}&limit=6`,
              { cache: 'no-store' }
            );
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              setRelatedArticles(relatedData.docs || []);
            }
          }
        } 
        // Priority 2: Auto-fetch by category if no manual selection
        else if (articleData.category?.id) {
          const relatedResponse = await fetch(
            `/api/news?depth=1&where[category][equals]=${articleData.category.id}&where[slug][not_equals]=${slug}&limit=3`,
            { cache: 'no-store' }
          );

          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedArticles(relatedData.docs || []);
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [mounted, slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';

    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (!mounted || loading) {
    return <LoadingSkeleton />;
  }

  if (notFound || !article) {
    return (
      <>
        <PhanDauTrang />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Không tìm thấy bài viết</p>
            <Link
              href="/tin-tuc"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại tin tức
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PhanDauTrang />

      {/* Breadcrumb */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/tin-tuc" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Tin tức
            </Link>
            {article.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-500">{article.category.name}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium truncate">{article.title}</span>
          </div>
        </div>
      </div>

      <article className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-[1fr_350px] gap-8 max-w-7xl mx-auto">
            {/* Main Content */}
            <div>
              {/* Article Header */}
              <header className="mb-8">
                {article.category && (
                  <Link
                    href={`/tin-tuc?category=${article.category.slug}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full mb-4 hover:bg-blue-700 transition-colors"
                  >
                    {article.category.name}
                  </Link>
                )}

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  {article.title}
                </h1>

                {article.excerpt && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {article.readTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                  {article.views && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span>{article.views.toLocaleString()} lượt xem</span>
                    </div>
                  )}
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Chia sẻ:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Featured Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-12">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Article Content */}
              <div className="article-content mb-12">
                {renderRichText(article.content)}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Tags:</span>
                  {article.tags.map((tagObj, index) => {
                    const tagText = typeof tagObj === 'object' && tagObj.tag ? tagObj.tag : String(tagObj);
                    return (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        #{tagText}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar - Related Articles */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              {relatedArticles.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                    Bài viết liên quan
                  </h2>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/tin-tuc/${related.slug}`}
                        className="group flex gap-3 p-3 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={related.featuredImage || 'https://placehold.co/600x400/e2e8f0/64748b?text=News'}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {related.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(related.publishedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
