import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { draftMode } from 'next/headers';
import { Calendar, User, Clock, Eye } from 'lucide-react';
import PreviewBanner from '../../components/PreviewBanner';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
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
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

// Helper to get image URL
function getImageUrl(image: any): string {
  if (!image) return '';
  if (typeof image === 'object' && image.filename) {
    return `${PAYLOAD_URL}/media/${image.filename}`;
  }
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${PAYLOAD_URL}/media/${image}`;
  }
  return '';
}

// Fetch news article from Payload CMS
async function getNewsArticle(slug: string, isDraft = false) {
  try {
    const draftParam = isDraft ? '&draft=true' : '';
    const response = await fetch(`${PAYLOAD_URL}/api/news?where[slug][equals]=${slug}${draftParam}`, {
      next: { revalidate: isDraft ? 0 : 60 },
      cache: isDraft ? 'no-store' : 'default',
    });

    if (!response.ok) {
      console.error('Failed to fetch news article');
      return null;
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { isEnabled: isDraftMode } = await draftMode();
  const article = await getNewsArticle(params.slug, isDraftMode);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Quay lại tin tức
          </Link>
        </div>
      </div>
    );
  }

  const featuredImageUrl = getImageUrl(article.featuredImage);
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {isDraftMode && <PreviewBanner />}
      
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/tin-tuc" className="hover:text-blue-600 dark:hover:text-blue-400">
            Tin tức
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{article.title}</span>
        </nav>

        {/* Article Title */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>
            {article.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            )}
            {article.views !== undefined && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views} lượt xem</span>
              </div>
            )}
          </div>

          {/* Category */}
          {article.category && (
            <div className="mt-4">
              <Link
                href={`/tin-tuc/danh-muc/${article.category.slug}`}
                className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {article.category.name}
              </Link>
            </div>
          )}
        </header>

        {/* Featured Image */}
        {featuredImageUrl && (
          <div className="relative h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl mb-8">
            <Image
              src={featuredImageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Excerpt */}
        {article.excerpt && (
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-600">
            {article.excerpt}
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }} 
            className="article-content"
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tagObj, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                >
                  #{tagObj.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back to News */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            ← Quay lại tin tức
          </Link>
        </div>
      </article>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getNewsArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Không tìm thấy bài viết - VinhPhat Printing',
      description: 'Bài viết bạn đang tìm kiếm không tồn tại.',
    };
  }

  return {
    title: article.seo?.title || `${article.title} - VinhPhat Printing`,
    description: article.seo?.description || article.excerpt || 'Tin tức từ VinhPhat Printing',
    keywords: article.seo?.keywords || article.tags?.map(t => t.tag).join(', '),
  };
}
