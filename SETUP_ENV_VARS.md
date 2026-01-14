# Environment Variables Setup Guide

This guide helps you set up environment variables in Vercel for your Statehouse School website.

## Required Environment Variables

You need to set these two environment variables in Vercel:

### 1. NEXT_PUBLIC_STRAPI_URL

**What it is:** The URL where your Strapi backend is running.

**Where to get it:**
- If Strapi is deployed: Your production Strapi URL (e.g., `https://api.yourschool.com` or `https://your-strapi-app.onrender.com`)
- If testing locally: `http://localhost:1337` (NOT for production!)

**Examples:**
- Production: `https://statehouse-strapi.onrender.com`
- Production: `https://api.statehouseschool.com`
- Development (local): `http://localhost:1337`

### 2. STRAPI_API_TOKEN

**What it is:** An API token from Strapi that allows the frontend to access your Strapi data.

**Where to get it:**
1. Log into your Strapi Admin panel
2. Go to **Settings** → **API Tokens**
3. Click **"Create new API Token"**
4. Fill in:
   - **Name:** `Production Website` (or any name)
   - **Token type:** `Read-only` (recommended) or `Full access`
   - **Token duration:** `Unlimited` (or set expiration)
5. Click **"Save"**
6. **Copy the token** - you'll only see it once!

**Example format:**
```
abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

## How to Set in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project: **statehouse-school-website**
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar
5. Click **"Add New"** button

#### Add NEXT_PUBLIC_STRAPI_URL:
- **Name:** `NEXT_PUBLIC_STRAPI_URL`
- **Value:** Your Strapi URL (e.g., `https://your-strapi-app.onrender.com`)
- **Environment:** 
  - ☑️ Production
  - ☑️ Preview (optional, can use same or different URL)
  - ☑️ Development (optional, usually `http://localhost:1337`)
- Click **"Save"**

#### Add STRAPI_API_TOKEN:
- **Name:** `STRAPI_API_TOKEN`
- **Value:** Your API token from Strapi
- **Environment:**
  - ☑️ Production
  - ☑️ Preview (optional)
  - ☑️ Development (optional)
- Click **"Save"**

6. **Important:** After adding/changing variables, you need to redeploy:
   - Go to **Deployments** tab
   - Find the latest deployment
   - Click **"..."** (three dots)
   - Click **"Redeploy"**
   - Or just push a new commit to trigger automatic deployment

### Option 2: Via Vercel CLI

If you have Vercel CLI installed:

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
cd frontend
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_STRAPI_URL production
# Enter your Strapi URL when prompted

vercel env add STRAPI_API_TOKEN production
# Enter your API token when prompted

# Redeploy
vercel --prod
```

---

## Verify Your Setup

After setting environment variables and redeploying:

1. Go to your live site on Vercel
2. Check if pages load correctly
3. Verify content is coming from Strapi
4. Check browser console (F12) for any errors

If you see errors like:
- `Unable to connect to Strapi at http://localhost:1337` → `NEXT_PUBLIC_STRAPI_URL` is not set or incorrect
- `401 Unauthorized` or `403 Forbidden` → `STRAPI_API_TOKEN` is missing or invalid
- `Network error` → Strapi URL is incorrect or Strapi is not accessible

---

## Strapi Deployment (If Not Yet Deployed)

**🚨 IMPORTANT: You must deploy Strapi first before setting up Vercel environment variables!**

If you haven't deployed Strapi yet, follow these guides:
- **Quick Guide**: See [STRAPI_QUICK_DEPLOY.md](./STRAPI_QUICK_DEPLOY.md) (10 minutes)
- **Detailed Guide**: See [STRAPI_DEPLOY_GUIDE.md](./STRAPI_DEPLOY_GUIDE.md) (comprehensive)

You'll need to:

1. **Deploy Strapi** to a hosting service:
   - [Render](https://render.com) - Free tier available
   - [Railway](https://railway.app) - Free tier available
   - [DigitalOcean](https://digitalocean.com) - Paid
   - [AWS](https://aws.amazon.com) - Paid

2. **Configure Database:**
   - Use PostgreSQL (recommended for production)
   - Update `backend/config/database.js`

3. **Update CORS settings:**
   - In `backend/config/middlewares.js`, add your Vercel domain to allowed origins

4. **Get your Strapi URL:**
   - Once deployed, copy the URL (e.g., `https://your-app.onrender.com`)

5. **Create API Token:**
   - Log into Strapi admin panel
   - Settings → API Tokens → Create new token

6. **Set in Vercel:**
   - Add `NEXT_PUBLIC_STRAPI_URL` with your deployed Strapi URL
   - Add `STRAPI_API_TOKEN` with your token

---

## Quick Checklist

Before deploying:
- [ ] Strapi is deployed and accessible
- [ ] You have your Strapi URL (production)
- [ ] You have created an API token in Strapi
- [ ] You have copied the API token
- [ ] Environment variables are set in Vercel
- [ ] Variables are set for Production environment
- [ ] Deployment has been triggered/redeployed after setting variables

After deploying:
- [ ] Site loads without errors
- [ ] Content displays from Strapi
- [ ] Images load correctly
- [ ] No console errors related to Strapi connection

---

## Need Help?

If you're having trouble:

1. **Check Vercel logs:**
   - Go to Deployments → Select deployment → Logs
   - Look for errors related to Strapi connection

2. **Verify environment variables:**
   - Settings → Environment Variables
   - Make sure variables are set for the correct environment

3. **Test Strapi URL:**
   - Try accessing `https://your-strapi-url.com/api/about-the-school` in browser
   - Should return JSON (or error, but should be accessible)

4. **Check Strapi CORS:**
   - Make sure your Vercel domain is in Strapi's allowed origins

---

## Security Notes

- ⚠️ **Never commit** `.env` files with secrets to Git
- ✅ Environment variables in Vercel are encrypted and secure
- ✅ API tokens are only visible in Vercel dashboard (never exposed in client code)
- ✅ `NEXT_PUBLIC_` prefix means it's available in browser (safe for URLs)
- ✅ `STRAPI_API_TOKEN` is server-side only (not exposed to browser)
