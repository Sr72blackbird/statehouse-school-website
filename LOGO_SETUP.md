# 🎓 Logo Setup Guide

Your school logo is essential for branding on search results and browser tabs. Here's how to set it up:

## Option 1: Quick Setup (Automated)

### Step 1: Prepare Your Logo
1. Download the school logo you uploaded
2. **Save it as `logo-source.png`** in the root folder: `statehouse-school-website/`
   - Must be PNG format with transparency (RGBA) for best results
   - Recommended size: 512×512px or larger

### Step 2: Run the Setup Script
```powershell
# From the project root folder
python setup-logo.py
```

This will automatically generate:
- ✅ `favicon.ico` - Browser tab icon
- ✅ `logo.png` - Main logo (for metadata)
- ✅ `logo-192x192.png` - PWA icon (small)
- ✅ `logo-256x256.png` - Social media preview
- ✅ `logo-512x512.png` - PWA icon (large)
- ✅ `logo.webp` - Web-optimized version

---

## Option 2: Manual Setup

If you prefer to do it manually or have specific image editing tools:

1. **Create favicon.ico** (32×32 pixels)
   - Use your logo editor or online tool: https://icoconvert.com/
   - Save to: `frontend/public/favicon.ico`

2. **Create logo.png** (up to 512×512 pixels)
   - Export your logo as PNG with transparent background
   - Save to: `frontend/public/logo.png`

3. **Create additional sizes** (optional but recommended)
   ```
   frontend/public/
   ├── logo-192x192.png
   ├── logo-256x256.png
   └── logo-512x512.png
   ```

---

## Verification

Once the files are in place, the logo will appear:

1. **Browser Tab** - When you open any page
2. **Google Search** - When someone searches your site
3. **Social Media** - When someone shares your site link
4. **Apple Devices** - When added to home screen (PWA)

### Test Locally
```bash
cd frontend
npm run dev
# Visit http://localhost:3000 and check the browser tab for the logo
```

### Test on Google
Use Google's Rich Results Tester:
https://search.google.com/test/rich-results

---

## Troubleshooting

**Logo not showing?**
- Ensure files are in `frontend/public/`
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server

**Favicon still shows Vercel logo?**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Wait 30+ minutes for github pages / Vercel to refresh CDN

---

## File Requirements

| File | Size | Format | Required |
|------|------|--------|----------|
| favicon.ico | 32×32 | ICO | ✅ Yes |
| logo.png | 256–512px | PNG | ✅ Yes |
| Other sizes | Various | PNG | ⚠️ Recommended |
| logo.webp | 512px | WebP | ⚠️ Optional |

---

**Ready?** Place your logo as `logo-source.png` and run the setup script!
