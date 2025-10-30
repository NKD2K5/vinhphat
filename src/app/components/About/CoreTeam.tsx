'use client';

import TeamMemberCard from './TeamMemberCard';

export default function CoreTeam() {
  const teamMembers = [
    {
      name: "Nguyễn Văn A",
      position: "Giám Đốc Điều Hành",
      bio: "Với hơn 15 năm kinh nghiệm trong ngành in ấn, anh đã dẫn dắt công ty phát triển vượt bậc trong những năm qua.",
      image: "ceo.jpg",
      linkedin: "#"
    },
    {
      name: "Trần Thị B",
      position: "Trưởng Phòng Kỹ Thuật",
      bio: "Chuyên gia về công nghệ in ấn hiện đại, đảm bảo mọi sản phẩm đều đạt chất lượng cao nhất.",
      image: "cto.jpg",
      linkedin: "#",
      email: "tranthib@example.com"
    },
    {
      name: "Lê Văn C",
      position: "Trưởng Phòng Kinh Doanh",
      bio: "Với mạng lưới đối tác rộng khắp, anh luôn mang đến những cơ hội kinh doanh mới cho công ty.",
      image: "sales.jpg",
      linkedin: "#"
    },
    {
      name: "Phạm Thị D",
      position: "Trưởng Phòng Thiết Kế",
      bio: "Với con mắt thẩm mỹ tinh tế, chị luôn tạo ra những mẫu thiết kế ấn tượng và sáng tạo.",
      image: "design.jpg",
      email: "phamthid@example.com"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            Gặp gỡ đội ngũ chuyên gia tận tâm đứng sau sự thành công của chúng tôi
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="h-full">
              <TeamMemberCard {...member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
