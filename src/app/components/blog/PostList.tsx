'use client';

import { useEffect, useState } from 'react';
import { getPosts, getMedia } from '@/app/lib/api';
// Define types locally since we can't import from @/types
interface Media {
  id: string;
  url: string;
  filename: string;
  // Add other media fields as needed
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content?: any;
  image?: string | Media;
  updatedAt: string;
  createdAt: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-8">Không có bài viết nào.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {posts.map((post) => (
        <div key={post.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          {typeof post.image === 'object' && post.image && (
            <img 
              src={post.image.url} 
              alt={post.title} 
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <div className="text-gray-600 line-clamp-3">
              {/* Render rich text content safely */}
              {post.content?.root?.children?.map((child: any, i: number) => (
                <p key={i}>{child.children?.[0]?.text || ''}</p>
              ))}
            </div>
            <a 
              href={`/bai-viet/${post.slug}`} 
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Xem thêm
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
