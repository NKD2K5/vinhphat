import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

async function getProduct(slug: string, isDraft = false) {
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';
  
  try {
    const url = `${baseUrl}/api/products?where[slug][equals]=${slug}&draft=${isDraft}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: isDraft ? 'no-store' : 'default', // No cache for drafts
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  const product = await getProduct(params.slug, isDraftMode);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Draft Mode Banner */}
      {isDraftMode && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center font-semibold">
          🚧 PREVIEW MODE - Đang xem bản nháp chưa được xuất bản
          <a 
            href="/api/exit-preview" 
            className="ml-4 underline hover:no-underline"
          >
            Thoát Preview
          </a>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Product Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Slug: {product.slug}
            </p>
            {product.price && (
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {product.price}
              </p>
            )}
          </div>

          {/* Product Image */}
          {product.image && (
            <div className="p-6">
              <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Product Description */}
          {product.description && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Mô tả sản phẩm
              </h2>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Product Info */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.service && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Dịch vụ:</h3>
                  <p className="text-gray-600 dark:text-gray-400">{product.service.name}</p>
                </div>
              )}
              {product.serviceCategory && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Danh mục:</h3>
                  <p className="text-gray-600 dark:text-gray-400">{product.serviceCategory.name}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Trạng thái:</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isDraftMode ? '📝 Bản nháp (Draft)' : '✅ Đã xuất bản'}
                </p>
              </div>
            </div>
          </div>

          {/* Debug Info (chỉ hiện khi preview) */}
          {isDraftMode && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔍 Debug Info (Preview Mode)
              </h3>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                {JSON.stringify(product, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
