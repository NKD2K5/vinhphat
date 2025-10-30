export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  publishedAt: string;
  category: string;
  author: string;
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  productId: string;
  date: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  isFeatured: boolean;
}

interface HomePageData {
  news: NewsItem[];
  reviews: ReviewItem[];
  featuredProducts: ProductItem[];
}

const homePageData: HomePageData = {
  "news": [
    {
      "id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      "title": "Công Nghệ In Ấn Mới Giúp Tiết Kiệm 30% Mực In",
      "summary": "Phương pháp in ấn tiên tiến mới giúp doanh nghiệp tiết kiệm đáng kể chi phí mực in mà vẫn đảm bảo chất lượng hình ảnh sắc nét.",
      "image": "https://picsum.photos/seed/printing1/600/400",
      "publishedAt": "2025-10-28T09:15:00+07:00",
      "category": "Công Nghệ In Ấn",
      "author": "Nguyễn Văn A, Chuyên gia in ấn"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-2345-6789abcdef01",
      "title": "Xu Hướng Thiết Kế Bao Bì Năm 2025",
      "summary": "Các xu hướng thiết kế bao bì mới nổi bật với phong cách tối giản và thân thiện môi trường đang được ưa chuộng.",
      "image": "https://picsum.photos/seed/printing2/600/400",
      "publishedAt": "2025-10-26T14:30:00+07:00",
      "category": "Thiết Kế",
      "author": "Trần Thị B, Chuyên viên thiết kế"
    },
    {
      "id": "c3d4e5f6-a7b8-9012-3456-789abcdef012",
      "title": "Giải Pháp In Ấn Cho Doanh Nghiệp Nhỏ",
      "summary": "Các giải pháp in ấn tiết kiệm chi phí dành riêng cho các doanh nghiệp vừa và nhỏ, giúp tối ưu ngân sách.",
      "image": "https://picsum.photos/seed/printing3/600/400",
      "publishedAt": "2025-10-25T16:45:00+07:00",
      "category": "Kinh Doanh",
      "author": "Lê Văn C, Tư vấn doanh nghiệp"
    }
  ],
  "reviews": [
    {
      "id": "f6a7b8c9-d0e1-2345-6789-abcdef012345",
      "userName": "Nguyễn Văn Dũng",
      "rating": 4.8,
      "reviewTitle": "Chất Lượng In Tuyệt Vời",
      "reviewText": "Tôi rất hài lòng với chất lượng in ấn. Màu sắc rõ nét, bền màu theo thời gian. Nhân viên tư vấn nhiệt tình.",
      "productId": "prod_1001",
      "date": "2025-10-27T08:30:00+07:00"
    },
    {
      "id": "a7b8c9d0-e1f2-3456-789a-bcdef0123456",
      "userName": "Trần Thị Hương",
      "rating": 4.5,
      "reviewTitle": "Giao Hàng Đúng Hẹn",
      "reviewText": "Sản phẩm được giao đúng hẹn, đóng gói cẩn thận. Chất lượng in ấn tốt, đúng như hình ảnh đã xem.",
      "productId": "prod_1002",
      "date": "2025-10-26T15:45:00+07:00"
    },
    {
      "id": "b8c9d0e1-f2a3-4567-89ab-cdef01234567",
      "userName": "Lê Minh Khôi",
      "rating": 5.0,
      "reviewTitle": "Hỗ Trợ Tuyệt Vời",
      "reviewText": "Đội ngũ hỗ trợ rất chuyên nghiệp, tư vấn tận tình. Sản phẩm in ấn đẹp, đúng yêu cầu.",
      "productId": "prod_1003",
      "date": "2025-10-25T11:20:00+07:00"
    }
  ],
  "featuredProducts": [
    {
      "id": "prod_1001",
      "name": "In Danh Thiếp Cao Cấp",
      "price": 500000,
      "image": "https://picsum.photos/seed/business-card/400/400",
      "category": "Danh Thiếp",
      "rating": 4.8,
      "description": "Danh thiếp in offset chất lượng cao, bề mặt bóng mịn, độ bền màu vượt trội. Phù hợp cho doanh nghiệp chuyên nghiệp.",
      "isFeatured": true
    },
    {
      "id": "prod_1002",
      "name": "In Tờ Rơi Khổ A4",
      "price": 1200000,
      "image": "https://picsum.photos/seed/flyer/400/400",
      "category": "Tờ Rơi",
      "rating": 4.6,
      "description": "Tờ rơi in offset 4 màu, chất liệu giấy couche bóng/mờ, phù hợp quảng cáo, khuyến mãi.",
      "isFeatured": true
    },
    {
      "id": "prod_1003",
      "name": "In Namecard Bằng Vân Tay",
      "price": 1200000,
      "image": "https://picsum.photos/seed/premium-card/400/400",
      "category": "Danh Thiếp",
      "rating": 4.9,
      "description": "Namecard cao cấp ép nhũ vàng, bề mặt vân tay sang trọng, tạo ấn tượng mạnh với đối tác.",
      "isFeatured": true
    },
    {
      "id": "prod_1004",
      "name": "In Túi Giấy Kraft",
      "price": 25000,
      "image": "https://picsum.photos/seed/paper-bag/400/400",
      "category": "Bao Bì",
      "rating": 4.7,
      "description": "Túi giấy kraft thân thiện môi trường, in ấn sắc nét, chịu lực tốt, phù hợp đựng quà tặng, mỹ phẩm.",
      "isFeatured": true
    },
    {
      "id": "prod_1005",
      "name": "In Menu Nhà Hàng",
      "price": 350000,
      "image": "https://picsum.photos/seed/menu/400/400",
      "category": "Menu",
      "rating": 4.5,
      "description": "Menu bìa cứng, bề mặt cán mờ, bắt mắt, dễ lau chùi, phù hợp cho nhà hàng, quán cafe cao cấp.",
      "isFeatured": true
    }
  ]
};

export default homePageData;
