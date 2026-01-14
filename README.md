# Statehouse School Website

A modern, responsive website for Statehouse School built with Next.js 16 and Strapi CMS.

## Features

- 🎓 **Academic Information**: Comprehensive academic programs, departments, and CBC pathways
- 📢 **Announcements**: News, notices, and events management
- 👥 **Staff Directory**: Meet our dedicated educators and staff
- 📸 **Gallery**: Photo albums showcasing school life and events
- 🔍 **Search**: Full-text search across announcements and content
- 📱 **Responsive Design**: Mobile-first, works on all devices
- ♿ **Accessible**: WCAG compliant with ARIA labels and semantic HTML
- 🚀 **Performance**: Optimized images, caching, and code splitting
- 🔐 **SEO**: Meta tags, Open Graph, and structured data

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Strapi CMS
- **Deployment**: Vercel (recommended) or Netlify

## Prerequisites

- Node.js 20+ and npm
- Strapi instance (local or hosted)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd statehouse-school-website
```

### 2. Backend Setup (Strapi)

```bash
cd backend
npm install
npm run develop
```

Strapi will be available at `http://localhost:1337`

**Important**: Create an API token in Strapi Admin Panel:
1. Go to Settings → API Tokens
2. Create a new token with "Read-only" permissions
3. Copy the token for use in frontend `.env.local`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

### 4. Run Development Server

```bash
npm run dev
```

The website will be available at `http://localhost:3000`

## Project Structure

```
statehouse-school-website/
├── backend/                 # Strapi CMS
│   ├── src/
│   │   └── api/            # Content types and API endpoints
│   └── config/             # Strapi configuration
├── frontend/                # Next.js application
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and helpers
│   └── public/             # Static assets
└── README.md
```

## Environment Variables

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi instance URL | Yes |
| `STRAPI_API_TOKEN` | API token for authenticated requests | Yes |

### Production

For production deployment, set these in your hosting platform's environment variables:

- `NEXT_PUBLIC_STRAPI_URL`: Your production Strapi URL
- `STRAPI_API_TOKEN`: Production API token

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend

- `npm run develop` - Start Strapi development server
- `npm run build` - Build Strapi for production
- `npm run start` - Start Strapi production server

## Content Management

See [STRAPI_GUIDE.md](./STRAPI_GUIDE.md) for detailed instructions on managing content in Strapi.

## Deployment

### Step 1: Deploy Strapi Backend

**Before deploying the frontend, you must deploy Strapi first!**

- **Quick Guide**: See [STRAPI_QUICK_DEPLOY.md](./STRAPI_QUICK_DEPLOY.md) (10 minutes)
- **Detailed Guide**: See [STRAPI_DEPLOY_GUIDE.md](./STRAPI_DEPLOY_GUIDE.md) (comprehensive)

After deploying Strapi, you'll need:
- Your Strapi URL (e.g., `https://your-strapi.onrender.com`)
- An API token from Strapi admin panel

### Step 2: Deploy Frontend

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed frontend deployment instructions.

### Quick Deploy to Vercel

1. **Deploy Strapi first** (see guides above)
2. Push your code to GitHub
3. Import project in Vercel
4. Set environment variables:
   - `NEXT_PUBLIC_STRAPI_URL`: Your deployed Strapi URL
   - `STRAPI_API_TOKEN`: Your API token from Strapi
5. Deploy!

## Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: ISR (Incremental Static Regeneration) with 60s revalidation
- **Code Splitting**: Automatic route-based code splitting
- **Compression**: Gzip/Brotli compression enabled

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please contact [your contact information].
