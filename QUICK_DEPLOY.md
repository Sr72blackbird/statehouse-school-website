# Quick Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub repository connected
- Vercel account (free tier available)

### Steps

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url.com
   STRAPI_API_TOKEN=your_production_api_token
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `your-project.vercel.app`

### Custom Domain
- Go to Project Settings → Domains
- Add your domain and follow DNS instructions

---

## Render Deployment

### Prerequisites
- GitHub repository connected
- Render account (free tier available)

### Option A: Using Blueprint (Recommended)

1. **Create Blueprint**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect `render.yaml`

2. **Configure Environment Variables**
   - `NEXT_PUBLIC_STRAPI_URL`: Your production Strapi URL
   - `STRAPI_API_TOKEN`: Your production API token

3. **Deploy**
   - Click "Apply"
   - Wait for deployment to complete

### Option B: Manual Setup

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `statehouse-school-frontend`
   - Environment: `Node`
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm start`

3. **Add Environment Variables**
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_STRAPI_URL`: Your production Strapi URL
   - `STRAPI_API_TOKEN`: Your production API token

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Custom Domain
- Go to Settings → Custom Domains
- Add your domain and follow DNS instructions

---

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] Production Strapi URL (e.g., `https://api.yourschool.com`)
- [ ] Production Strapi API token
- [ ] Strapi CORS configured to allow your frontend domain

---

## Post-Deployment

1. Test your website:
   - [ ] Home page loads
   - [ ] All navigation links work
   - [ ] Images display correctly
   - [ ] Pages load without errors

2. Check browser console for any errors

3. Verify Strapi connection:
   - [ ] Content loads from Strapi
   - [ ] API calls succeed

---

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Verify Strapi URL is accessible
- Review build logs for specific errors

### Images Not Loading
- Check Strapi CORS settings include your domain
- Verify image URLs in Strapi
- Ensure images are published

### 400/401 Errors
- Verify API token is correct
- Check token has proper permissions
- Ensure Strapi is accessible

---

## Support

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
