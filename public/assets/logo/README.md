# Logo Management System

## Overview

This system provides comprehensive logo management capabilities through a user-friendly CMS interface with the following features:

## Features

### 🎨 Logo Display
- **Responsive Design**: Automatically adjusts size (200px desktop, 150px mobile)
- **SEO Optimized**: Alt text support for accessibility
- **Multiple Display Modes**: Auto, fixed-width, fixed-height, or fixed dimensions
- **High Quality**: Optimized image loading with Next.js Image component

### 📤 Logo Upload
- **SVG Only**: Strict validation for SVG file format
- **File Size Limit**: Maximum 2MB file size
- **Real-time Preview**: See logo before uploading
- **Error Handling**: Clear error messages for validation failures

### 🔄 Logo Management
- **Replace Logo**: Upload new logo with confirmation dialog
- **Restore Default**: One-click restore to original logo
- **Settings Update**: Modify alt text and display settings
- **Auto Update**: Changes reflect immediately across the website

### 📊 History Tracking
- **Complete Audit Trail**: Track all logo changes
- **User Attribution**: See who made each change
- **Timestamp Records**: Exact time of each modification
- **Action Types**: Upload, update, and restore actions

## Technical Implementation

### Backend API Endpoints

#### `/api/logo` (Main Logo Management)
- **GET**: Fetch current logo configuration
- **POST**: Upload new logo (SVG only, max 2MB)
- **PATCH**: Update logo settings (alt text, dimensions)
- **DELETE**: Restore default logo

#### `/api/logo/history` (History Tracking)
- **GET**: Fetch logo change history with user details

### Database Schema

#### LogoHistory Collection
```javascript
{
  action: 'upload' | 'update' | 'restore',
  logoUrl: String,
  alt: String,
  filename: String,
  fileSize: Number,
  dimensions: {
    width: Number,
    height: Number,
    displayMode: String
  },
  changedBy: ObjectId (ref: 'users'),
  timestamp: Date,
  ipAddress: String,
  userAgent: String,
  notes: String
}
```

### File Storage
- **Location**: `/public/assets/logo/`
- **Naming**: `{name}_{timestamp}_{random}.svg`
- **Cleanup**: Automatic cleanup on failed uploads

### Validation Rules
- **File Type**: SVG only (validated by MIME type and content)
- **File Size**: Maximum 2MB (2,097,152 bytes)
- **Content Validation**: Checks for valid SVG structure

## Usage

### For Administrators

1. **Access Logo Management**: Navigate to `/admin/logo-management`
2. **View Current Logo**: See the active logo with settings
3. **Upload New Logo**:
   - Click "Chọn file SVG"
   - Select SVG file (max 2MB)
   - Preview the logo
   - Set alt text for SEO
   - Click "Tải lên"
4. **Update Settings**: Modify alt text and display options
5. **Restore Default**: Revert to original logo if needed
6. **View History**: Track all changes with timestamps and user details

### For Developers

#### Logo Component Usage
```tsx
import Logo from '@/components/Logo/Logo';

// Basic usage
<Logo />

// With responsive behavior
<Logo isMobile={isMobile} isScrolled={scrolled} />

// Custom className
<Logo className="custom-logo-styles" />
```

#### API Integration
```typescript
// Fetch current logo
const response = await fetch('/api/logo');
const { data } = await response.json();

// Upload new logo
const formData = new FormData();
formData.append('file', svgFile);
formData.append('alt', 'Logo Alt Text');

const uploadResponse = await fetch('/api/logo', {
  method: 'POST',
  body: formData,
});
```

## Security Features

- **File Validation**: Server-side SVG content validation
- **Size Limits**: Strict 2MB file size enforcement
- **User Authentication**: Admin-only access to management interface
- **Audit Trail**: Complete history tracking with user attribution
- **Safe Storage**: Files stored in public directory with unique names

## Error Handling

The system provides comprehensive error handling:

- **File Type Errors**: "Chỉ chấp nhận file định dạng SVG"
- **Size Errors**: "File vượt quá 2MB"
- **Upload Errors**: "Có lỗi xảy ra, vui lòng thử lại"
- **Network Errors**: Graceful fallback to default logo

## Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Appropriate cache strategies for API responses
- **Responsive Images**: Proper sizing for different devices
- **Minimal Bundle**: Tree-shaken dependencies

## Browser Support

- **Modern Browsers**: Full support for all modern browsers
- **SVG Support**: Requires SVG support (all modern browsers)
- **File API**: Requires File API support
- **Fetch API**: Requires fetch API support

## Future Enhancements

Potential future improvements:
- **Multiple Logo Support**: Different logos for different pages/sections
- **Logo Variations**: Support for dark/light mode variants
- **Advanced Analytics**: Logo view tracking and analytics
- **Batch Operations**: Bulk logo management
- **Cloud Storage**: Integration with cloud storage services

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check file format (must be SVG) and size (max 2MB)
2. **Logo Not Updating**: Clear browser cache and check API response
3. **History Not Showing**: Verify user permissions and API connectivity
4. **Display Issues**: Check responsive settings and CSS conflicts

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=logo:*
```

This will provide detailed logging for all logo operations.

---

**Last Updated**: January 28, 2026
**Version**: 1.0.0
**Compatibility**: Next.js 14+, Payload CMS 2.0+
