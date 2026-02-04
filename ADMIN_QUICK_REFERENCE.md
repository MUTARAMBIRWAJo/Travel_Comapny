# Admin Dashboard - Quick Reference Card

## 🎯 Main Access Points

| Feature | URL | Purpose |
|---------|-----|---------|
| **Admin Dashboard** | `/dashboard/admin` | Main admin hub |
| **Content Manager** | `/dashboard/admin/content` | Manage packages, services, media |
| **Analytics** | `/dashboard/admin/analytics` | View site analytics |
| **Users** | `/dashboard/admin/users` | Manage user accounts |

---

## 📋 Content Management Quick Links

### Packages Management
```
Location: /dashboard/admin/content → Packages Tab
├── View packages list
├── + Add Package (new modal)
├── Edit button (on each package)
└── Delete button (remove packages)
```

**What You Can Do:**
- ✅ Upload package image
- ✅ Set title, duration, price (USD & RWF)
- ✅ Write what's included
- ✅ Toggle active/inactive status
- ✅ Edit in English, Kinyarwanda, French

### Services Management
```
Location: /dashboard/admin/content → Services Tab
├── View services list
├── + Add Service (new modal)
├── Edit button (on each service)
└── Delete button (remove services)
```

**What You Can Do:**
- ✅ Upload service image
- ✅ Set service name
- ✅ Auto-generate URL slug
- ✅ Write short description
- ✅ Write full description (optional)
- ✅ Toggle active/inactive

### Media Library
```
Location: /dashboard/admin/content → Media Tab
├── Drag-and-drop upload zone
├── Click to browse files
└── View uploaded media grid
```

**What You Can Upload:**
- ✅ Images: JPEG, PNG, WebP, GIF
- ✅ Videos: MP4, WebM
- ✅ Documents: PDF, DOC, DOCX

---

## ⚙️ How To...

### Add a Travel Package

**Step 1:** Navigate to Admin Dashboard
```
/dashboard/admin/content → Packages Tab
```

**Step 2:** Click "+ Add Package" button

**Step 3:** Fill the form
```
- Package Image: Drag image or click to browse
- Title (English): "Dubai Holiday"
- Duration: "5 Days / 4 Nights"
- Price USD: "2500"
- Price RWF: "2,625,000"
- What's Included: "Desert safari, shopping, beach..."
- Status: Select "Active"
```

**Step 4:** Click "Create Package"

**Result:** Package appears on:
- Homepage (Featured Packages section)
- `/packages` page (all packages list)

---

### Add a Travel Service

**Step 1:** Navigate to Admin Dashboard
```
/dashboard/admin/content → Services Tab
```

**Step 2:** Click "+ Add Service" button

**Step 3:** Fill the form
```
- Service Image: Upload or drag
- Title (English): "Visa Assistance"
- Slug: "visa-assistance" (auto-generated)
- Short Description: Brief 1-2 sentence description
- Full Description: Detailed service info (optional)
- Status: Select "Active"
```

**Step 4:** Click "Create Service"

**Result:** Service appears on:
- Homepage (Services section)
- `/services` page (services list)

---

### Upload Media Files

**Step 1:** Navigate to Admin Dashboard
```
/dashboard/admin/content → Media Tab
```

**Step 2:** Upload files by:
- **Dragging** files into the upload zone, OR
- **Clicking** to browse and select files

**Step 3:** Wait for upload to complete
- Progress bar shows upload status
- File appears in the media grid when done

**Step 4:** Copy file link when done
- Click "Copy Link" button
- Use link in your content

---

## 📸 Image Best Practices

### Recommended Image Sizes

| Usage | Resolution | Format | File Size |
|-------|------------|--------|-----------|
| **Hero Background** | 1920x1080 | JPEG | <500KB |
| **Package Card** | 400x300 | JPEG | <200KB |
| **Service Card** | 300x300 | PNG | <150KB |
| **Thumbnail** | 200x200 | JPEG | <100KB |

### Tips for Best Results
- ✅ Use high-quality, professional images
- ✅ Keep file sizes under 500KB
- ✅ Use consistent aspect ratios
- ✅ Optimize images before uploading
- ✅ Use descriptive file names
- ✅ Avoid generic or watermarked images

---

## 🎬 Video Best Practices

### Video Specifications

| Aspect | Requirement |
|--------|-------------|
| **Format** | MP4 (H.264 codec) |
| **Resolution** | 1920x1080 minimum |
| **Duration** | 15-60 seconds |
| **File Size** | <10MB |
| **Codec** | H.264 (AVC) |
| **Audio** | Muted or background music |

### Tips
- ✅ Videos must loop seamlessly
- ✅ Always use muted for autoplay
- ✅ Provide good fallback image
- ✅ Compress video before upload
- ✅ Test on mobile devices

---

## 🌍 Multi-Language Content

### When to Translate

**Translate These:**
- ✅ Package titles & descriptions
- ✅ Service names & descriptions
- ✅ Page titles & content
- ✅ Button labels
- ✅ Form placeholders

### Language Codes
```
EN = English (Default)
RW = Kinyarwanda (Local)
FR = French (Regional)
```

### Translation Fields
```
Examples:
Title (English): "Visa Assistance"
Title (Kinyarwanda): "Gufasha mu Visa"
Title (French): "Assistance Visa"

Description (English): "Professional visa support..."
Description (Kinyarwanda): "Gufasha n'ubwenge mu visa..."
Description (French): "Support professionnel de visa..."
```

---

## 📊 Page Configuration

### Available Pages to Configure

Located in: `/dashboard/admin/content → Pages Tab`

```
□ Home Page
  ├── Hero section text
  ├── Services section
  ├── Packages section
  └── Testimonials

□ Packages Page
  ├── Hero title
  ├── Category filters
  └── Package listings

□ Services Page
  ├── Service cards
  ├── Service descriptions
  └── Call-to-action

□ Destinations Page
  ├── Featured destinations
  ├── Description
  └── Images/videos

□ About Page
  ├── Company story
  ├── Mission & values
  └── Team info

□ Contact Page
  ├── Contact info
  ├── Contact form
  └── Map location
```

---

## ⏰ Common Tasks & Time Estimates

| Task | Complexity | Time |
|------|-----------|------|
| Add new package | Easy | 5 min |
| Add new service | Easy | 5 min |
| Upload media | Very Easy | 2 min |
| Edit package | Easy | 3 min |
| Update service | Easy | 3 min |
| Configure page | Medium | 10 min |
| Bulk upload images | Medium | 15 min |

---

## 🔒 Access Control

### Who Can Access Admin?

- ✅ Users with **admin** role
- ❌ Regular users cannot access
- ❌ Employees cannot access
- ❌ Guests cannot access

### To Grant Admin Access
1. Contact site administrator
2. Request admin role assignment
3. Admin creates new admin account
4. You receive login credentials

---

## ⚠️ Important Notes

### Things to Remember
- ✅ Save your work frequently
- ✅ Use high-quality images
- ✅ Test changes before publishing
- ✅ Keep descriptions concise
- ✅ Update content regularly

### Avoid These
- ❌ Very large images (>1MB)
- ❌ Duplicate content
- ❌ Outdated information
- ❌ Poor quality photos
- ❌ Misspelled text

### Best Practices
- ✅ Use consistent branding
- ✅ Write for mobile users
- ✅ Include clear call-to-actions
- ✅ Update prices regularly
- ✅ Monitor user feedback

---

## 🛠️ Troubleshooting Quick Fixes

### Image Not Uploading?
- Check file size (<5MB)
- Verify file format (JPEG/PNG)
- Try different browser
- Clear browser cache

### Content Not Showing?
- Check if status is "Active"
- Clear browser cache (Ctrl+Shift+Del)
- Wait 30 seconds for refresh
- Check page settings

### Form Not Submitting?
- Fill all required fields (*)
- Check file size limits
- Review error messages
- Try refreshing page

### Video Not Playing?
- Use H.264 codec
- Check file format is MP4
- Verify file size <10MB
- Test in different browser

---

## 📞 Getting Help

### When You Need Support
1. **Check Documentation** → Read ADMIN_FEATURES_GUIDE.md
2. **Review Examples** → Look at existing content
3. **Contact Admin** → Reach out to site administrator
4. **Report Bug** → Use feedback form

### Quick Contact
- Admin Email: admin@weofyou.com
- Support Line: +250-XXXX-XXXX
- Business Hours: Mon-Fri 9AM-5PM RWT

---

## 📱 Mobile Admin Access

### Responsive Design
- ✅ Admin dashboard works on tablets
- ✅ Media upload works on mobile
- ✅ Forms are touch-friendly
- ⚠️ Best experience on desktop for editing

### Tips for Mobile
- ✅ Use landscape mode for forms
- ✅ Use tablet for media upload
- ✅ Test content on mobile devices
- ✅ Keep forms short

---

## 🚀 Going Live

### Pre-Launch Checklist
- [ ] All packages added
- [ ] All services configured
- [ ] Images uploaded and optimized
- [ ] Content proofread
- [ ] Links tested
- [ ] Mobile design verified
- [ ] Performance checked
- [ ] Analytics configured

### Post-Launch
- [ ] Monitor site performance
- [ ] Check user feedback
- [ ] Update content regularly
- [ ] Review analytics weekly
- [ ] Add new packages monthly

---

**Last Updated:** February 3, 2026
**Admin Portal Version:** 1.0
**Status:** Production Ready ✅
