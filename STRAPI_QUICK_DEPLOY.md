# Quick Strapi Deployment Guide

Follow these simple steps to deploy Strapi to Render in under 10 minutes.

## Step 1: Create PostgreSQL Database (2 minutes)

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `statehouse-strapi-db`
   - **Database**: `strapi`
   - **Region**: Choose closest to you
   - **Plan**: Free (for testing) or Starter ($7/month for production)
4. Click **"Create Database"**
5. ✅ Copy the **Internal Database URL** (starts with `postgresql://`)

## Step 2: Deploy Strapi (5 minutes)

1. In Render, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `statehouse-strapi`
   - **Root Directory**: `backend` ⚠️ **IMPORTANT!**
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

4. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=<paste-internal-database-url-from-step-1>
DATABASE_SSL=true
WEBHOOKS_POPULATE_RELATIONS=false
```

5. **Generate and Add Strapi Keys**:

Go to https://generate-secret.vercel.app/32 and generate 5 random strings. Add them as:

```
APP_KEYS=<first-generated-string>
API_TOKEN_SALT=<second-generated-string>
ADMIN_JWT_SECRET=<third-generated-string>
JWT_SECRET=<fourth-generated-string>
TRANSFER_TOKEN_SALT=<fifth-generated-string>
```

6. Click **"Create Web Service"**

## Step 3: Wait and Access (3 minutes)

1. Wait for deployment (5-10 minutes)
2. Click your service URL (e.g., `https://statehouse-strapi.onrender.com`)
3. **Create admin user**:
   - Enter email and password
   - Click "Let's start"

## Step 4: Configure Permissions

1. In Strapi admin, go to **Settings** → **Users & Permissions plugin** → **Roles** → **Public**
2. For each content type, enable:
   - ✅ `find`
   - ✅ `findOne`
3. Click **"Save"** for each

**Content types:**
- about-the-school
- announcement
- academic-department
- admission-requirement
- admissions-page
- cbc-pathway
- gallery-album
- gallery-item
- learning-areas-subject
- staff-category
- staff-member

## Step 5: Create API Token

1. Go to **Settings** → **API Tokens**
2. Click **"Create new API Token"**
3. Configure:
   - **Name**: `Production Website`
   - **Token type**: `Read-only`
   - **Token duration**: `Unlimited`
4. Click **"Save"**
5. ✅ **COPY THE TOKEN** (you'll only see it once!)

## Step 6: Configure CORS for Frontend

After your frontend is deployed on Vercel:

1. In Render, go to your Strapi service → **Environment** tab
2. Add:
```
CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:3000
```
(Replace with your actual Vercel domain)

3. Click **"Save Changes"**

## Done! ✅

You now have:
- ✅ Strapi URL: `https://statehouse-strapi.onrender.com`
- ✅ API Token: `<your-copied-token>`

**Next:** Use these in Vercel environment variables!

---

## Troubleshooting

**Can't access admin?**
- Wait 1-2 more minutes for deployment to complete
- Check service status is "Live"

**Build fails?**
- Verify Root Directory is set to `backend`
- Check all environment variables are set
- Review build logs for specific errors

**Database connection fails?**
- Make sure you used the **Internal Database URL** (not External)
- Verify DATABASE_SSL=true is set

---

Need detailed help? See [STRAPI_DEPLOY_GUIDE.md](./STRAPI_DEPLOY_GUIDE.md)
