# Strapi Deployment Guide

This guide will help you deploy your Strapi backend to production. We'll use **Render** (free tier available) as the recommended platform.

## Prerequisites

Before starting, make sure you have:
- ✅ GitHub account
- ✅ Code pushed to GitHub repository
- ✅ Render account (sign up at [render.com](https://render.com) - it's free)
- ✅ A way to store files (for uploads) - Render provides disk storage

---

## Option 1: Deploy Strapi to Render (Recommended)

Render offers a free tier that's perfect for getting started with Strapi.

### Step 1: Create PostgreSQL Database

Strapi needs a database. Render provides free PostgreSQL databases.

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `statehouse-strapi-db` (or any name)
   - **Database**: `strapi` (or any name)
   - **User**: `strapi` (or any name)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: Latest (14 or 15)
   - **Plan**: Free (512 MB RAM, 1 GB storage) or Starter ($7/month)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** and **External Database URL**
   - You'll use the **Internal URL** for Strapi (on Render)
   - The External URL is for external connections (optional)

### Step 2: Deploy Strapi Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

#### Basic Settings:
- **Name**: `statehouse-strapi` (or any name)
- **Region**: Same as database (recommended)
- **Branch**: `main` (or your main branch)
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (512 MB RAM, 0.5 GB disk) or Starter ($7/month)

#### Environment Variables:
Click **"Advanced"** → **"Add Environment Variable"** and add these:

**Required Variables:**
```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=<Your Internal Database URL from Step 1>
DATABASE_SSL=true
```

**Strapi App Keys** (Generate these - see below):
```
APP_KEYS=<your-app-keys>
API_TOKEN_SALT=<your-api-token-salt>
ADMIN_JWT_SECRET=<your-admin-jwt-secret>
JWT_SECRET=<your-jwt-secret>
TRANSFER_TOKEN_SALT=<your-transfer-token-salt>
```

**Optional but Recommended:**
```
WEBHOOKS_POPULATE_RELATIONS=false
```

#### How to Generate App Keys:

You need to generate secure random strings for Strapi keys. Use one of these methods:

**Option A: Online Generator**
- Go to https://generate-secret.vercel.app/32 (or similar)
- Generate 5 random strings (32 characters each)
- Use each for one key

**Option B: Command Line (if you have Node.js)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Run this 5 times to generate 5 keys.

**Option C: Use OpenSSL**
```bash
openssl rand -base64 32
```
Run this 5 times to generate 5 keys.

Assign one unique key to each:
- `APP_KEYS`: First key
- `API_TOKEN_SALT`: Second key
- `ADMIN_JWT_SECRET`: Third key
- `JWT_SECRET`: Fourth key
- `TRANSFER_TOKEN_SALT`: Fifth key

4. Click **"Create Web Service"**

### Step 3: Configure CORS

After Strapi deploys, you need to allow your frontend domain:

1. Go to your Strapi service in Render
2. Click **"Environment"** tab
3. Add these environment variables:
```
CORS_ORIGIN=https://your-frontend-domain.vercel.app,http://localhost:3000
```
(Replace `your-frontend-domain.vercel.app` with your actual Vercel domain)

OR update `backend/config/middlewares.js` (see Step 4 below).

4. Click **"Save Changes"**
5. Strapi will automatically redeploy

### Step 4: Update CORS in Code (Alternative)

Instead of environment variable, you can update the CORS configuration directly in code:

Edit `backend/config/middlewares.js` to allow your frontend domain.

### Step 5: Wait for First Deploy

The first deployment takes 5-10 minutes. Watch the logs:
- Installing dependencies
- Building Strapi admin panel
- Starting Strapi server

### Step 6: Access Strapi Admin

1. Once deployed, click your service URL (e.g., `https://statehouse-strapi.onrender.com`)
2. You'll see Strapi admin login page
3. **Create your first admin user:**
   - Enter email
   - Enter password (must be strong)
   - Click "Let's start"

### Step 7: Configure Content Types

1. In Strapi admin, go to **Settings** → **Users & Permissions plugin** → **Roles** → **Public**
2. Find each content type and check:
   - ✅ `find` (to allow public access)
   - ✅ `findOne` (to allow public access)
3. Click **"Save"** for each

**Content types to configure:**
- `about-the-school`
- `announcement`
- `academic-department`
- `admission-requirement`
- `admissions-page`
- `cbc-pathway`
- `gallery-album`
- `gallery-item`
- `learning-areas-subject`
- `staff-category`
- `staff-member`

### Step 8: Create API Token

1. In Strapi admin, go to **Settings** → **API Tokens**
2. Click **"Create new API Token"**
3. Configure:
   - **Name**: `Production Website`
   - **Token type**: `Read-only` (recommended) or `Full access`
   - **Token duration**: `Unlimited`
4. Click **"Save"**
5. **COPY THE TOKEN** - you'll only see it once!
6. Save it securely - you'll need it for Vercel environment variables

### Step 9: Test Your Strapi API

1. Your Strapi URL: `https://your-strapi-service.onrender.com`
2. Test endpoint: `https://your-strapi-service.onrender.com/api/about-the-school`
3. Should return JSON data (or empty array if no content yet)

---

## Option 2: Deploy to Railway

Railway is another great option with a free tier.

### Step 1: Deploy Database

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Provision PostgreSQL"**
3. Railway automatically creates the database
4. Copy the database connection URL from the Variables tab

### Step 2: Deploy Strapi

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository
3. Add environment variables (similar to Render)
4. Set **Root Directory** to `backend`
5. Deploy!

---

## Option 3: Deploy to Render Using Blueprint

We can create a `render.yaml` that includes both Strapi and database. This is the easiest way!

Let me know if you'd like me to set this up for you.

---

## Environment Variables Summary

### Required for Production:

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Database
DATABASE_CLIENT=postgres
DATABASE_URL=<your-postgres-connection-string>
DATABASE_SSL=true

# Strapi Security (Generate unique values for each)
APP_KEYS=<generate-32-char-string>
API_TOKEN_SALT=<generate-32-char-string>
ADMIN_JWT_SECRET=<generate-32-char-string>
JWT_SECRET=<generate-32-char-string>
TRANSFER_TOKEN_SALT=<generate-32-char-string>

# Optional
WEBHOOKS_POPULATE_RELATIONS=false
```

### CORS (Optional - can use code instead):

```env
CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
```

---

## Troubleshooting

### Build Fails

**Error: "Database connection failed"**
- Check `DATABASE_URL` is correct
- Verify database is running
- Check if using Internal URL (for Render)

**Error: "Module not found"**
- Verify `Root Directory` is set to `backend`
- Check `package.json` exists in backend folder

### Site Won't Start

**Error: "APP_KEYS required"**
- Make sure all Strapi keys are set
- Check keys don't have extra spaces

**Error: "Port already in use"**
- Verify `PORT=1337` is set (or let Render assign it)

### Can't Access Admin

**404 or Connection Refused**
- Wait for deployment to complete
- Check service is "Live" in Render dashboard
- Verify URL is correct

### API Returns 403 Forbidden

- Make sure you configured Public role permissions (Step 7)
- Check API token is valid
- Verify token is included in requests

### Images Not Loading

- Check uploads folder permissions
- Verify file paths in Strapi
- Check CORS settings allow image domains

---

## Next Steps

After Strapi is deployed:

1. ✅ Copy your Strapi URL (e.g., `https://statehouse-strapi.onrender.com`)
2. ✅ Create an API token in Strapi admin
3. ✅ Copy the API token
4. ✅ Configure Vercel environment variables:
   - `NEXT_PUBLIC_STRAPI_URL`: Your Strapi URL
   - `STRAPI_API_TOKEN`: Your API token
5. ✅ Redeploy your frontend on Vercel

---

## Free Tier Limitations

### Render Free Tier:
- **Web Service**: Spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)
- **Database**: Persistent (doesn't spin down)
- **Disk Space**: 0.5 GB (enough for small to medium sites)

**Upgrade to Starter ($7/month)** for:
- Always-on service (no spin-down)
- More resources
- Better performance

### Railway Free Tier:
- $5 credit per month
- Automatic scaling
- Pay-as-you-go

---

## Security Notes

- ⚠️ **Never commit** `.env` files or secrets to Git
- ✅ Environment variables in Render are encrypted
- ✅ Use strong, unique keys for all Strapi secrets
- ✅ Use Read-only API tokens when possible
- ✅ Keep your database connection string secret

---

## Need Help?

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Strapi Deployment Docs**: [docs.strapi.io/dev-docs/deployment](https://docs.strapi.io/dev-docs/deployment)
- **Check service logs**: Always check logs for specific errors

---

## Quick Checklist

Before deploying:
- [ ] Code is pushed to GitHub
- [ ] Render account created
- [ ] PostgreSQL database created
- [ ] Database URL copied
- [ ] Strapi app keys generated
- [ ] All environment variables ready

After deploying:
- [ ] Strapi service is "Live"
- [ ] Can access Strapi admin panel
- [ ] Admin user created
- [ ] Public role permissions configured
- [ ] API token created
- [ ] API token copied and saved
- [ ] Can access API endpoints
- [ ] CORS configured for frontend domain

---

**Ready to deploy?** Follow Step 1 above to create your database!
