# Step-by-Step Vercel Deployment Guide

Follow these detailed steps to deploy your Statehouse School website to Vercel.

## Prerequisites

Before starting, make sure you have:
- ✅ Your code pushed to GitHub
- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com) - it's free)
- ✅ Your Strapi backend deployed and accessible (or running locally for testing)
- ✅ Your Strapi API token ready

---

## Step 1: Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended - easiest way to connect your repo)

---

## Step 2: Import Your Project

1. After signing in, you'll see the Vercel dashboard
2. Click the **"Add New..."** button (top right)
3. Select **"Project"** from the dropdown
4. You'll see a list of your GitHub repositories
5. Find **"statehouse-school-website"** and click **"Import"**

---

## Step 3: Configure Project Settings

Vercel should auto-detect Next.js, but verify these settings:

### Framework Preset
- Should show: **"Next.js"** ✅
- If not, select it from the dropdown

### Root Directory
1. Click **"Edit"** next to "Root Directory"
2. Click **"Other"**
3. Type: `frontend`
4. Click **"Continue"**

### Build and Output Settings
These should auto-populate, but verify:
- **Build Command**: `npm run build` (or leave empty - Vercel will auto-detect)
- **Output Directory**: `.next` (or leave empty - Vercel will auto-detect)
- **Install Command**: `npm install` (or leave empty - Vercel will auto-detect)

---

## Step 4: Add Environment Variables

**This is critical!** Your site won't work without these.

1. Scroll down to the **"Environment Variables"** section
2. Click **"Add"** or the **"+"** button

### Add First Variable: NEXT_PUBLIC_STRAPI_URL

1. **Name**: `NEXT_PUBLIC_STRAPI_URL`
2. **Value**: Your Strapi URL
   - If Strapi is deployed: `https://your-strapi-domain.com`
   - If testing locally: `http://localhost:1337` (not recommended for production)
   - Example: `https://api.statehouseschool.com`
3. **Environment**: Select all three:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
4. Click **"Add"**

### Add Second Variable: STRAPI_API_TOKEN

1. **Name**: `STRAPI_API_TOKEN`
2. **Value**: Your Strapi API token
   - Get this from Strapi Admin → Settings → API Tokens
   - Create a new token if you don't have one
   - Select "Read-only" or "Full access" permissions
3. **Environment**: Select all three:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development
4. Click **"Add"**

### Verify Variables

You should see both variables listed:
```
NEXT_PUBLIC_STRAPI_URL = https://your-strapi-url.com
STRAPI_API_TOKEN = your_token_here
```

---

## Step 5: Deploy

1. Review all settings one more time
2. Click the big **"Deploy"** button at the bottom
3. Wait for the build to complete (usually 2-5 minutes)

You'll see a build log showing:
- Installing dependencies
- Building Next.js application
- Deploying to Vercel's edge network

---

## Step 6: Verify Deployment

Once deployment completes:

1. You'll see a **"Congratulations!"** message
2. Your site URL will be shown (e.g., `statehouse-school-website.vercel.app`)
3. Click **"Visit"** to open your live site

### Test Your Site

Check these:
- [ ] Home page loads correctly
- [ ] Navigation links work
- [ ] Images display (verify Strapi CORS settings)
- [ ] All pages load without errors
- [ ] Check browser console for any errors (F12 → Console)

---

## Step 7: Configure Custom Domain (Optional)

If you have a custom domain:

1. Go to your project dashboard
2. Click **"Settings"** tab
3. Click **"Domains"** in the sidebar
4. Enter your domain (e.g., `www.statehouseschool.com`)
5. Click **"Add"**
6. Follow the DNS configuration instructions
7. Wait for DNS propagation (can take up to 48 hours, usually much faster)

---

## Troubleshooting

### Build Fails

**Error: "Build failed"**
- Check the build logs for specific errors
- Verify environment variables are set correctly
- Ensure `rootDirectory` is set to `frontend`
- Check that all dependencies are in `package.json`

**Error: "Module not found"**
- Make sure `node_modules` is not committed to git
- Verify all dependencies are listed in `package.json`
- Check that `npm install` completes successfully

### Site Loads But Shows Errors

**Error: "Failed to fetch" or Network errors**
- Verify `NEXT_PUBLIC_STRAPI_URL` is correct
- Check that Strapi is accessible from the internet
- Verify Strapi CORS settings allow your Vercel domain
- Check `STRAPI_API_TOKEN` is valid

**Error: "400 Bad Request" or "401 Unauthorized"**
- Verify `STRAPI_API_TOKEN` is correct
- Check token has proper permissions in Strapi
- Ensure token hasn't expired

**Images Not Loading**
- Check Strapi CORS settings include your Vercel domain
- Verify image URLs in Strapi Media Library
- Ensure images are published in Strapi
- Check `next.config.ts` has correct image domain configuration

### Environment Variables Not Working

- Make sure variable names are exact (case-sensitive)
- Verify variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding/changing environment variables
- Check variable values don't have extra spaces

---

## Updating Your Site

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Open a Pull Request → Preview deployment

### Manual Redeploy

1. Go to your project dashboard
2. Click **"Deployments"** tab
3. Find the deployment you want to redeploy
4. Click **"..."** (three dots)
5. Select **"Redeploy"**

### Rollback to Previous Version

1. Go to **"Deployments"** tab
2. Find a previous successful deployment
3. Click **"..."** (three dots)
4. Select **"Promote to Production"**

---

## Vercel Dashboard Features

### Analytics
- View page views, visitors, and performance metrics
- Enable in Settings → Analytics

### Logs
- View real-time function logs
- Debug issues in production
- Access via Deployments → [Select Deployment] → Logs

### Speed Insights
- Monitor Core Web Vitals
- Get performance recommendations
- Enable in Settings → Speed Insights

---

## Next Steps After Deployment

1. **Set up monitoring**: Enable Vercel Analytics
2. **Configure CORS in Strapi**: Add your Vercel domain to allowed origins
3. **Test all pages**: Make sure everything works
4. **Set up custom domain**: If you have one
5. **Share your site**: Your site is now live! 🎉

---

## Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Check build logs**: Always check the detailed logs for specific errors

---

## Quick Checklist

Before deploying, make sure:
- [ ] Code is pushed to GitHub
- [ ] `vercel.json` is in the root directory
- [ ] `frontend/package.json` has all dependencies
- [ ] Strapi backend is deployed/accessible
- [ ] You have your Strapi API token
- [ ] You know your Strapi URL

After deploying:
- [ ] Site loads without errors
- [ ] All pages work
- [ ] Images display correctly
- [ ] No console errors
- [ ] Mobile responsive works
- [ ] Environment variables are set

---

**Need help?** Check the build logs first - they usually contain the exact error message and solution!
