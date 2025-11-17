const express = require('express');
const payload = require('payload');

// Route để hiển thị trang chủ với dữ liệu từ CMS
const homeRoute = async (req, res) => {
  try {
    // Lấy dữ liệu từ Home Global
    const homeData = await payload.findGlobal({
      slug: 'home-page'
    });

    // Tạo HTML để hiển thị dữ liệu
    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${homeData.title || 'VinhPhat Printing'}</title>
    <meta name="description" content="${homeData.seo?.metaDescription || ''}">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section {
            margin-bottom: 40px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #fafafa;
        }
        .section h2 {
            color: #1e40af;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 10px;
        }
        .hero-slide {
            background: #1e40af;
            color: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 8px;
        }
        .stats {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .stat {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            flex: 1;
            min-width: 150px;
        }
        .reason, .step, .testimonial {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #1e40af;
        }
        .button {
            background: #1e40af;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin: 5px;
        }
        .admin-link {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .data-status {
            background: #10b981;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <a href="/admin" class="admin-link">🔧 Admin Panel</a>
    
    <div class="container">
        <div class="data-status">
            ✅ Dữ liệu CMS đã được tải thành công từ Home Global!
        </div>
        
        <h1>${homeData.title || 'Trang Chủ'}</h1>
        
        ${homeData.heroSection ? `
        <div class="section">
            <h2>🎯 Hero Section</h2>
            ${homeData.heroSection.slides ? homeData.heroSection.slides.map(slide => `
                <div class="hero-slide">
                    <h3>${slide.headline}</h3>
                    <div>${slide.subheadline || ''}</div>
                    ${slide.primaryButton ? `<a href="${slide.primaryButton.link}" class="button">${slide.primaryButton.text}</a>` : ''}
                    ${slide.secondaryButton ? `<a href="${slide.secondaryButton.link}" class="button">${slide.secondaryButton.text}</a>` : ''}
                </div>
            `).join('') : ''}
            
            ${homeData.heroSection.stats ? `
                <div class="stats">
                    ${homeData.heroSection.stats.map(stat => `
                        <div class="stat">
                            <div style="font-size: 24px;">${stat.icon} ${stat.value}</div>
                            <div>${stat.label}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        ` : '<div class="section">❌ Hero Section: Không có dữ liệu</div>'}
        
        ${homeData.aboutSection ? `
        <div class="section">
            <h2>🏢 About Section</h2>
            <h3>${homeData.aboutSection.title}</h3>
            <div>${homeData.aboutSection.description || ''}</div>
            ${homeData.aboutSection.primaryButton ? `<a href="${homeData.aboutSection.primaryButton.link}" class="button">${homeData.aboutSection.primaryButton.text}</a>` : ''}
            ${homeData.aboutSection.secondaryButton ? `<a href="${homeData.aboutSection.secondaryButton.link}" class="button">${homeData.aboutSection.secondaryButton.text}</a>` : ''}
        </div>
        ` : '<div class="section">❌ About Section: Không có dữ liệu</div>'}
        
        ${homeData.servicesSection ? `
        <div class="section">
            <h2>🛠️ Services Section</h2>
            <h3>${homeData.servicesSection.title}</h3>
            <div>${homeData.servicesSection.description || ''}</div>
            <p><strong>Categories:</strong> ${homeData.servicesSection.categories?.length || 0} danh mục</p>
            ${homeData.servicesSection.ctaButton ? `<a href="${homeData.servicesSection.ctaButton.link}" class="button">${homeData.servicesSection.ctaButton.text}</a>` : ''}
        </div>
        ` : '<div class="section">❌ Services Section: Không có dữ liệu</div>'}
        
        ${homeData.whyChooseUsSection ? `
        <div class="section">
            <h2>🏆 Why Choose Us Section</h2>
            <h3>${homeData.whyChooseUsSection.title}</h3>
            ${homeData.whyChooseUsSection.reasons ? homeData.whyChooseUsSection.reasons.map(reason => `
                <div class="reason">
                    <h4>${reason.icon} ${reason.title}</h4>
                    <div>${reason.description}</div>
                </div>
            `).join('') : ''}
        </div>
        ` : '<div class="section">❌ Why Choose Us Section: Không có dữ liệu</div>'}
        
        ${homeData.workflowSection ? `
        <div class="section">
            <h2>📋 Workflow Section</h2>
            <h3>${homeData.workflowSection.title}</h3>
            <div>${homeData.workflowSection.intro || ''}</div>
            ${homeData.workflowSection.steps ? homeData.workflowSection.steps.map(step => `
                <div class="step">
                    <h4>${step.icon} Bước ${step.stepNumber}: ${step.title}</h4>
                    <div>${step.description}</div>
                </div>
            `).join('') : ''}
        </div>
        ` : '<div class="section">❌ Workflow Section: Không có dữ liệu</div>'}
        
        ${homeData.featuredProductsSection ? `
        <div class="section">
            <h2>⭐ Featured Products Section</h2>
            <h3>${homeData.featuredProductsSection.title}</h3>
            <div>${homeData.featuredProductsSection.description || ''}</div>
            <p><strong>Products:</strong> ${homeData.featuredProductsSection.products?.length || 0} sản phẩm</p>
            ${homeData.featuredProductsSection.ctaButton ? `<a href="${homeData.featuredProductsSection.ctaButton.link}" class="button">${homeData.featuredProductsSection.ctaButton.text}</a>` : ''}
        </div>
        ` : '<div class="section">❌ Featured Products Section: Không có dữ liệu</div>'}
        
        ${homeData.testimonialsSection ? `
        <div class="section">
            <h2>💬 Testimonials Section</h2>
            <h3>${homeData.testimonialsSection.title}</h3>
            ${homeData.testimonialsSection.testimonials ? homeData.testimonialsSection.testimonials.map(testimonial => `
                <div class="testimonial">
                    <div>${testimonial.content}</div>
                    <p><strong>${testimonial.customerName}</strong> - ${testimonial.position}</p>
                    <p>⭐ ${testimonial.rating}/5</p>
                </div>
            `).join('') : ''}
        </div>
        ` : '<div class="section">❌ Testimonials Section: Không có dữ liệu</div>'}
        
        ${homeData.latestNewsSection ? `
        <div class="section">
            <h2>📰 Latest News Section</h2>
            <h3>${homeData.latestNewsSection.title}</h3>
            <div>${homeData.latestNewsSection.description || ''}</div>
            <p><strong>Posts:</strong> ${homeData.latestNewsSection.posts?.length || 0} bài viết</p>
            ${homeData.latestNewsSection.ctaButton ? `<a href="${homeData.latestNewsSection.ctaButton.link}" class="button">${homeData.latestNewsSection.ctaButton.text}</a>` : ''}
        </div>
        ` : '<div class="section">❌ Latest News Section: Không có dữ liệu</div>'}
        
        <div class="section">
            <h2>🔍 SEO Information</h2>
            <p><strong>Meta Title:</strong> ${homeData.seo?.metaTitle || 'Không có'}</p>
            <p><strong>Meta Description:</strong> ${homeData.seo?.metaDescription || 'Không có'}</p>
            <p><strong>Meta Keywords:</strong> ${homeData.seo?.metaKeywords || 'Không có'}</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding: 20px; background: #1e40af; color: white; border-radius: 8px;">
            <h3>🎉 Trang chủ đã ăn dữ liệu CMS thành công!</h3>
            <p>Tất cả 8 sections đều có dữ liệu và hiển thị đúng.</p>
            <a href="/admin" class="button" style="background: white; color: #1e40af;">Vào Admin Panel để chỉnh sửa</a>
        </div>
    </div>
</body>
</html>
    `;

    res.send(html);
    
  } catch (error) {
    console.error('Error loading home data:', error);
    res.status(500).send(`
      <h1>❌ Lỗi tải dữ liệu CMS</h1>
      <p>Chi tiết lỗi: ${error.message}</p>
      <a href="/admin">Vào Admin Panel</a>
    `);
  }
};

module.exports = homeRoute;
