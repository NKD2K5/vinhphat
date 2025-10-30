import PostList from '@/app/components/blog/PostList';

export const metadata = {
  title: 'Tin tức & Sự kiện',
  description: 'Cập nhật những tin tức và sự kiện mới nhất từ Vĩnh Phát Printing',
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Tin tức & Sự kiện
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Cập nhật những tin tức và sự kiện mới nhất từ Vĩnh Phát Printing
          </p>
        </div>
        
        <div className="mt-12">
          <PostList />
        </div>
      </div>
    </main>
  );
}
