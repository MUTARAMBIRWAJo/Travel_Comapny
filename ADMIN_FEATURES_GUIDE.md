# Advanced Admin Dashboard Features Guide

## Overview

Your We-Of-You Travel Company platform now includes a comprehensive admin dashboard with advanced content management capabilities. Admins can control all public-facing content including packages, services, media, and more.

---

## New Admin Pages & Components

### 1. Content Management Dashboard
**Location**: `/dashboard/admin/content`

The central hub for managing all public website content.

#### Features:
- **Packages Tab**: Create, edit, and delete travel packages
- **Services Tab**: Manage service offerings and descriptions
- **Media Library**: Upload and organize images and videos
- **Pages Tab**: Configure settings for all public pages

#### Key Capabilities:
- Add new packages with images, pricing, and descriptions
- Edit existing package information
- Set package status (active/inactive)
- Upload high-quality package imagery
- Support multiple languages (English, Kinyarwanda, French)

---

### 2. Package Editor Modal
**Component**: `PackageEditor.tsx`

A sophisticated modal for creating and editing travel packages.

#### Fields:
```
- Package Image (drag-and-drop upload)
- Title (English, Kinyarwanda, French)
- Duration (e.g., "5 Days / 4 Nights")
- Price (USD and RWF)
- What's Included (detailed description)
- Status (Active/Inactive)
```

#### Features:
- Image preview and replace functionality
- Real-time form validation
- Multi-currency pricing support
- Automatic save on submit

#### Usage:
```typescript
// In your admin page
const [showPackageEditor, setShowPackageEditor] = useState(false)

<PackageEditor
  package={selectedPackage}
  onSave={(data) => console.log('Save:', data)}
  onClose={() => setShowPackageEditor(false)}
/>
```

---

### 3. Service Editor Modal
**Component**: `ServiceEditor.tsx`

A comprehensive tool for managing travel services.

#### Fields:
```
- Service Image (upload)
- Title (English, Kinyarwanda, French)
- URL Slug (auto-generated from title)
- Short Description (shown in cards)
- Full Description (service detail page)
- Status (Active/Inactive)
```

#### Features:
- Auto-slug generation from title
- Image upload with preview
- Short and long description support
- Service status management

#### Usage:
```typescript
<ServiceEditor
  service={selectedService}
  onSave={(data) => console.log('Save:', data)}
  onClose={() => setShowServiceEditor(false)}
/>
```

---

### 4. Media Uploader Component
**Component**: `MediaUploader.tsx`

Professional media management with drag-and-drop support.

#### Features:
- **Drag & Drop Upload**: Drop files directly onto the upload area
- **Multiple File Types**: Images, videos, documents
- **Upload Progress**: Real-time progress bar for each file
- **File Management**: Delete, organize, and manage media files
- **File Info**: See file size, type, and upload time
- **Copy Link**: Get shareable links to uploaded media

#### Supported Formats:
- Images: JPEG, PNG, WebP, GIF
- Videos: MP4, WebM
- Documents: PDF, DOC, DOCX

#### Usage:
```typescript
<MediaUploader />
```

---

## Public Pages with Enhanced Backgrounds

### 1. Home Page
**Location**: `/app/page.tsx`

#### New Features:
- **Hero Video Background**: Autoplay video with fallback image
- **Service Cards with Images**: Each service displays a relevant image
- **Gradient Backgrounds**: Professional gradient overlays
- **Responsive Design**: Works perfectly on all device sizes

#### Sections:
1. **Video Hero Section** (fullscreen background video)
2. **Services Section** (with background pattern and image cards)
3. **Featured Packages** (with wave gradient background)
4. **Testimonials** (professional layout)
5. **Currency Converter** (interactive tool)
6. **Trust Section** (Rwanda-centric messaging)
7. **Call-to-Action** (primary conversion point)

---

### 2. Packages Page
**Location**: `/app/packages/page.tsx`

#### New Features:
- **Background Hero Image**: Professional travel photography
- **Enhanced Package Cards**: Larger images with hover effects
- **Category Filters**: Filter by Adventure, Family, Cultural, Luxury, etc.
- **Price Display**: Shows both USD and local pricing
- **Duration Badges**: Clear trip duration information
- **Responsive Grid**: Adapts from 1-4 columns based on screen size

#### Card Features:
- Image with hover zoom effect
- Category badge overlay
- Destination with icon
- Full description
- Duration and pricing
- "Book Now" call-to-action

---

### 3. Services Page
**Location**: `/app/services/page.tsx`

Services page includes professional service cards with images and descriptions.

---

## Responsive Design

All new features are fully responsive:

- **Mobile** (320px+): Single column layout, large touch targets
- **Tablet** (768px+): 2-column grid
- **Desktop** (1024px+): 3-4 column grid with enhanced features
- **Large Screens** (1440px+): Full-width layouts with max-width containers

---

## Background Images & Videos

### Using Background Images
Public pages now feature professional background imagery:

```jsx
// Image background with overlay
<div className="relative">
  <div className="absolute inset-0 bg-black/40" />
  <img src="..." className="w-full h-full object-cover" />
</div>
```

### Using Background Videos
Hero sections feature autoplay videos:

```jsx
<video autoPlay muted loop className="w-full h-full object-cover">
  <source src="..." type="video/mp4" />
</video>
```

### Responsive Background Images
All backgrounds are optimized for responsive layouts:

- Images scale proportionally on all devices
- Overlay opacity adjusted for readability
- Text remains centered and readable
- Touch targets are generous on mobile

---

## Admin Workflow Examples

### Add a New Travel Package

1. Navigate to `/dashboard/admin/content`
2. Click the **Packages** tab
3. Click **+ Add Package**
4. Fill in package details:
   - Upload attractive destination image
   - Enter package title (in English)
   - Set duration (e.g., "5 Days / 4 Nights")
   - Set pricing in USD and RWF
   - Describe what's included
5. Click **Create Package**
6. Package appears on home page and packages page immediately

### Add a New Service

1. Go to `/dashboard/admin/content`
2. Click the **Services** tab
3. Click **+ Add Service**
4. Fill in:
   - Upload service image
   - Enter service name (auto-generates URL slug)
   - Write short description (shown in cards)
   - Optionally add full description
5. Click **Create Service**
6. Service appears on services page

### Upload Media Files

1. Go to `/dashboard/admin/content`
2. Click the **Media** tab
3. **Drag & drop** files or click to browse
4. Upload progress displays in real-time
5. Once complete, copy file link to use in content

---

## Image & Video Best Practices

### Image Requirements
- **Resolution**: 1920x1080 or higher for best quality
- **Format**: JPEG for photos, PNG for graphics
- **Size**: Optimize to <500KB for web
- **Aspect Ratios**:
  - Hero images: 16:9 (1920x1080)
  - Package cards: 4:3 (400x300)
  - Service cards: 1:1 (300x300)

### Video Requirements
- **Format**: MP4 (H.264 codec)
- **Duration**: 15-60 seconds for hero videos
- **Resolution**: 1920x1080 minimum
- **Size**: <10MB for optimal loading
- **Content**: Must loop seamlessly

---

## Multi-Language Support

All admin features support three languages:

1. **English** (en) - Primary language
2. **Kinyarwanda** (rw) - Local language
3. **French** (fr) - Regional language

When creating content, fill in all three languages for maximum reach:

```
Title (English): Visa Assistance
Title (Kinyarwanda): Gufasha mu Visa
Title (French): Assistance Visa
```

---

## Database Integration

The admin system is designed to work with Supabase:

### Tables Used:
- `cms_packages` - Travel package information
- `cms_services` - Service offerings
- `cms_media` - Media file references
- `cms_pages` - Static page content
- `cms_global_settings` - Site-wide configuration

### Data Flow:
```
Admin Dashboard → CMS Tables → Public Pages
```

Changes made in the admin dashboard are immediately reflected on public pages.

---

## Security & Permissions

### Admin Access
- Only users with `admin` role can access admin dashboard
- Protected by authentication middleware
- All changes are logged and auditable

### Media Handling
- Files are stored securely
- Public file links are generated for use in pages
- Original files can be deleted from library

---

## Tips & Tricks

1. **Use High-Quality Images**: Better visuals increase conversions
2. **Keep Descriptions Concise**: Mobile users see less text
3. **Test Responsiveness**: Check how packages look on mobile
4. **Update Regularly**: Fresh content keeps visitors engaged
5. **Use All Three Languages**: Reach more of your audience

---

## Troubleshooting

### Media Upload Not Working
- Check file size (<10MB for videos, <5MB for images)
- Ensure file format is supported
- Try different browser if issue persists

### Changes Not Showing on Public Pages
- Clear browser cache (Ctrl+Shift+Delete)
- Wait a few seconds for page to refresh
- Check that content status is "Active"

### Images Look Pixelated
- Upload higher resolution images (1920x1080+)
- Check that original file is high quality
- Ensure browser zoom is at 100%

---

## Future Enhancements

Planned features for upcoming releases:

- [ ] Advanced analytics dashboard
- [ ] Email newsletter management
- [ ] Blog/news content editor
- [ ] Customer feedback management
- [ ] Automated promotional tools
- [ ] Enhanced SEO controls
- [ ] A/B testing for page layouts
- [ ] Integration with booking system

---

## Support

For questions or issues with admin features:

1. Check this documentation first
2. Review component code comments
3. Contact support team
4. Check error logs for detailed messages

---

**Last Updated**: February 2026
**Admin Features Version**: 1.0
**Compatible with**: Next.js 16+, Supabase
