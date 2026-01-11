# Deployment Guide

This guide covers deploying the Statehouse School website to production.

## Prerequisites

- Strapi instance deployed and accessible
- GitHub repository with your code
- Account on hosting platform (Vercel, Netlify, etc.)

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications and offers excellent Next.js integration.

#### Step 1: Prepare Strapi

1. Deploy Strapi to a hosting service (e.g., Railway, Render, DigitalOcean)
2. Update CORS settings in Strapi to allow your frontend domain
3. Create a production API token in Strapi

#### Step 2: Deploy Frontend

**Via Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add environment variables:
   ```
   NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url.com
   STRAPI_API_TOKEN=your_production_api_token
   ```
6. Click "Deploy"

**Via Vercel CLI:**

```bash
npm i -g vercel
cd frontend
vercel
```

Follow the prompts and add environment variables when asked.

#### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Option 2: Render

Render is a great alternative that supports both frontend and backend deployment.

#### Step 1: Prepare for Render

The repository includes a `render.yaml` file for easy deployment.

#### Step 2: Deploy via Render Dashboard

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Configure environment variables:
   - `NEXT_PUBLIC_STRAPI_URL`: Your production Strapi URL
   - `STRAPI_API_TOKEN`: Your production API token
6. Click "Apply" to deploy

#### Step 3: Manual Configuration (Alternative)

If not using the Blueprint:

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `statehouse-school-frontend`
   - **Environment**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Root Directory**: Leave empty (or set to `frontend` if needed)
5. Add environment variables:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_STRAPI_URL`: Your production Strapi URL
   - `STRAPI_API_TOKEN`: Your production API token
6. Click "Create Web Service"

#### Step 4: Configure Custom Domain (Optional)

1. In Render dashboard, go to Settings → Custom Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**Note**: Render's free tier includes:
- 750 hours/month of build time
- Automatic SSL certificates
- Custom domains
- Auto-deploy from Git

### Option 3: Netlify

#### Step 1: Prepare for Netlify

Create `netlify.toml` in the `frontend` directory:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variables in Site settings → Environment variables
6. Deploy

### Option 4: Self-Hosted (VPS/Server)

#### Step 1: Build the Application

```bash
cd frontend
npm install
npm run build
```

#### Step 2: Set Environment Variables

Create `.env.production`:

```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-url.com
STRAPI_API_TOKEN=your_production_api_token
NODE_ENV=production
```

#### Step 3: Run with PM2

```bash
npm install -g pm2
pm2 start npm --name "school-website" -- start
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Production Strapi URL | `https://api.yourschool.com` |
| `STRAPI_API_TOKEN` | Production API token | `your_token_here` |
| `NODE_ENV` | Environment | `production` |

### Setting in Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select environment (Production, Preview, Development)
4. Save

### Setting in Render

1. Go to Service Settings → Environment
2. Add each variable
3. Click "Save Changes"
4. Service will automatically redeploy

### Setting in Netlify

1. Go to Site Settings → Environment Variables
2. Add each variable
3. Set scope (Production, Deploy previews, Branch deploys)
4. Save

## Strapi Configuration

### CORS Settings

Update `backend/config/middlewares.js`:

```javascript
module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'https://your-production-domain.com',
      ],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Database Configuration

For production, use a managed database (PostgreSQL recommended):

1. Set up PostgreSQL database (e.g., Railway, Supabase, AWS RDS)
2. Update `backend/config/database.js`:

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', true),
    },
  },
});
```

## CI/CD Setup

### GitHub Actions

The repository includes a `.github/workflows/deploy.yml` file for automated deployments.

**Setup:**

1. Add secrets to GitHub repository:
   - `VERCEL_TOKEN`: Get from Vercel → Settings → Tokens
   - `VERCEL_ORG`: Your Vercel organization/username
   - `VERCEL_PROJECT_ID`: Found in Vercel project settings
   - `NEXT_PUBLIC_STRAPI_URL`: Production Strapi URL
   - `STRAPI_API_TOKEN`: Production API token

2. Push to `main` branch to trigger deployment

### Manual Deployment

```bash
# Build
cd frontend
npm run build

# Deploy (Vercel)
vercel --prod

# Or deploy via platform dashboard
```

## Post-Deployment Checklist

- [ ] Verify website loads correctly
- [ ] Test all pages and navigation
- [ ] Check images load properly
- [ ] Verify search functionality
- [ ] Test contact forms (if implemented)
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test with different browsers
- [ ] Monitor error logs
- [ ] Set up monitoring (e.g., Vercel Analytics)

## Monitoring and Maintenance

### Performance Monitoring

- **Vercel Analytics**: Built-in analytics in Vercel dashboard
- **Google Analytics**: Add tracking code to `app/layout.tsx`
- **Sentry**: Error tracking (optional)

### Regular Maintenance

1. **Update Dependencies**: Monthly security updates
   ```bash
   npm audit
   npm update
   ```

2. **Backup Strapi**: Regular database backups
3. **Monitor Logs**: Check for errors regularly
4. **Update Content**: Keep content fresh and current

## Troubleshooting

### Build Failures

- Check environment variables are set correctly
- Verify Strapi URL is accessible
- Check build logs for specific errors

### Images Not Loading

- Verify Strapi CORS settings include your domain
- Check image URLs in Strapi Media Library
- Ensure images are published

### API Errors

- Verify API token is valid and has correct permissions
- Check Strapi server is running and accessible
- Review Strapi logs for errors

### Performance Issues

- Enable Vercel Edge Caching
- Optimize images before uploading to Strapi
- Review Next.js build output for warnings

## Rollback

### Vercel

1. Go to Deployments in Vercel dashboard
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Render

1. Go to Deploys in Render dashboard
2. Find previous deployment
3. Click "Manual Deploy" → Select the commit

### Netlify

1. Go to Deploys
2. Find previous deployment
3. Click "Publish deploy"

## Support

For deployment issues:
- Check platform-specific documentation
- Review build logs
- Contact platform support if needed
