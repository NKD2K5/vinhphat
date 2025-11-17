import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001'}/api/products?depth=2&where[slug][equals]=${params.slug}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return {
        title: 'Sản phẩm không tìm thấy | Vĩnh Phát',
        description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
      };
    }

    const data = await response.json();
    const products = data.docs || [];

    if (products.length === 0) {
      return {
        title: 'Sản phẩm không tìm thấy | Vĩnh Phát',
        description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
      };
    }

    const product = products[0];
    const description = product.description?.[0]?.children?.[0]?.text || 'Sản phẩm in ấn chất lượng cao';

    return {
      title: `${product.name} | Vĩnh Phát`,
      description: description.substring(0, 160),
      openGraph: {
        title: product.name,
        description: description.substring(0, 160),
        images: [product.image],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: description.substring(0, 160),
        images: [product.image],
      },
    };
  } catch (error) {
    return {
      title: 'Sản phẩm | Vĩnh Phát',
      description: 'Khám phá sản phẩm in ấn chất lượng cao',
    };
  }
}
