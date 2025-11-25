import React from 'react';

interface Testimonial {
  customerName: string;
  position: string;
  content: string;
  rating: number;
  image?: string;
  company?: string;
}

interface TestimonialsBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    testimonials?: Testimonial[];
  };
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ data }) => {
  if (!data.testimonials || data.testimonials.length === 0) return null;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Generate placeholder image based on name
  const getPlaceholderImage = (name: string) => {
    const initial = name.charAt(0).toUpperCase();
    const colors = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'];
    const colorIndex = name.length % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex]}&color=fff&size=200&bold=true&format=png`;
  };

  // Check if image URL is valid
  const isValidImageUrl = (url: string | undefined) => {
    if (!url) return false;
    // Skip Cloudinary URLs that might be broken
    if (url.includes('testimonials/customer-')) {
      return false;
    }
    
    // Check if it's a valid URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {data.subtitle && (
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
              {data.subtitle}
            </p>
          )}
          {data.title && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {data.title}
            </h2>
          )}
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonials.map((testimonial, index) => {
            const imageUrl = isValidImageUrl(testimonial.image) 
              ? testimonial.image! 
              : getPlaceholderImage(testimonial.customerName);

            return (
              <div 
                key={index} 
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-blue-100 dark:text-gray-700 opacity-50">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating || 5)}
                </div>

                {/* Content */}
                <div 
                  className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base relative z-10"
                  dangerouslySetInnerHTML={{ __html: `"${testimonial.content}"` }}
                />

                {/* Customer Info with Photo */}
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  {/* Customer Photo */}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-100 dark:ring-gray-700">
                    <img
                      src={imageUrl}
                      alt={testimonial.customerName}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>

                  {/* Customer Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white text-base truncate">
                      {testimonial.customerName}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {testimonial.position}
                      {testimonial.company && ` • ${testimonial.company}`}
                    </p>
                  </div>
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};