---
sidebar_position: 5
---

# Deployment

Deploy your FlatWP site to production with Vercel or other hosting providers.

## Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic builds, previews, and edge optimization.

### Prerequisites

- GitHub account with your FlatWP repository
- Vercel account (free hobby plan works)
- WordPress site with public GraphQL endpoint

### Step 1: Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your FlatWP repository
4. Vercel will auto-detect Next.js

### Step 2: Configure Project

**Framework Preset**: Next.js
**Root Directory**: `./` (or leave empty if using starter as standalone)
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install`
**Node Version**: 20.x

### Step 3: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```env
# Required
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
REVALIDATION_SECRET=your-random-secret
PREVIEW_SECRET=another-random-secret

# Optional
RESEND_API_KEY=re_your_key (if using email)
DEBUG=false
```

:::warning
Make sure to add variables to **all environments**: Production, Preview, and Development.
:::

### Step 4: Deploy

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build your Next.js application
3. Deploy to global edge network
4. Provide a production URL

### Step 5: Configure Custom Domain

#### Add Domain in Vercel

1. Go to Settings → Domains
2. Add your domain (e.g., `yoursite.com`)
3. Vercel provides DNS configuration instructions

#### Configure DNS

At your domain registrar, add:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Wait for DNS propagation (up to 48 hours). HTTPS is automatic via Vercel.

### Step 6: Configure WordPress

In WordPress admin, navigate to **Settings → FlatWP**:

```
Next.js Site URL: https://yoursite.com
Revalidation Secret: [Same as Vercel env var]
Enable Webhooks: ✓ Checked
```

### Automatic Deployments

**Production**: Every push to `main` branch triggers deployment
**Preview**: Every push to other branches creates preview deployment

```bash
git push origin main          # → Production
git push origin feature-xyz   # → Preview at yoursite-git-feature-xyz.vercel.app
```

## Netlify Deployment

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select repository

### Step 2: Build Settings

```
Build command: npm run build
Publish directory: .next
Node version: 20
```

### Step 3: Environment Variables

Add in Site settings → Environment variables:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql
NEXT_PUBLIC_SITE_URL=https://yoursite.netlify.app
REVALIDATION_SECRET=your-secret
PREVIEW_SECRET=your-secret
```

### Step 4: Deploy

Click "Deploy site". Netlify will build and deploy your application.

### Enable Next.js Features

Install the Netlify Next.js plugin:

```bash
npm install -D @netlify/plugin-nextjs
```

Add `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/next"
  status = 200
```

## Manual Deployment

For custom hosting or VPS deployment:

### Prerequisites

- Node.js 20+ installed
- Process manager (PM2 recommended)
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt)

### Build Application

```bash
# Clone repository
git clone https://github.com/your-username/your-flatwp-site.git
cd your-flatwp-site

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Build for production
npm run build
```

### Run with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "flatwp" -- start

# Save PM2 configuration
pm2 save

# Enable startup on boot
pm2 startup
```

### Configure Nginx

Create `/etc/nginx/sites-available/flatwp`:

```nginx
server {
    listen 80;
    server_name yoursite.com www.yoursite.com;

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

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/flatwp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL with Let's Encrypt

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yoursite.com -d www.yoursite.com
```

## Docker Deployment

### Dockerfile

```text
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  flatwp:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

### Deploy

```bash
docker-compose up -d
```

## Environment-Specific Configuration

### Production

```env
NODE_ENV=production
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.yoursite.com/graphql
NEXT_PUBLIC_SITE_URL=https://yoursite.com
REVALIDATION_SECRET=production-secret
PREVIEW_SECRET=production-preview-secret
```

### Staging

```env
NODE_ENV=production
NEXT_PUBLIC_WORDPRESS_API_URL=https://staging-cms.yoursite.com/graphql
NEXT_PUBLIC_SITE_URL=https://staging.yoursite.com
REVALIDATION_SECRET=staging-secret
PREVIEW_SECRET=staging-preview-secret
```

### Development

```env
NODE_ENV=development
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATION_SECRET=dev-secret
PREVIEW_SECRET=dev-preview-secret
```

## Post-Deployment Checklist

### Verify Core Features

- [ ] Homepage loads correctly
- [ ] Blog posts are accessible
- [ ] Images load and are optimized
- [ ] Navigation works
- [ ] Search functionality works

### Test WordPress Integration

- [ ] Publish a new post in WordPress
- [ ] Verify post appears on Next.js site
- [ ] Test preview mode with draft post
- [ ] Verify cache revalidation works

### Performance Check

- [ ] Run Lighthouse audit (target 95+ score)
- [ ] Check Core Web Vitals
- [ ] Test page load times
- [ ] Verify image optimization

### Security Check

- [ ] HTTPS enabled and working
- [ ] Environment variables secured
- [ ] WordPress admin not publicly accessible via Next.js
- [ ] Webhook secrets properly configured

## Monitoring and Maintenance

### Vercel Analytics

Enable in Vercel Dashboard → Analytics to track:
- Page views
- Web Vitals
- Top pages
- Visitor locations

### Error Monitoring

Integrate Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- Better Uptime

### Regular Maintenance

**Weekly**:
- Check deployment logs
- Monitor performance metrics
- Review error reports

**Monthly**:
- Update dependencies
- Review and optimize images
- Check WordPress plugin updates

## Troubleshooting

### Build Failures

**Error**: "Module not found"

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

**Error**: "GraphQL endpoint not accessible"

- Verify WordPress site is publicly accessible
- Check firewall settings
- Confirm WPGraphQL plugin is active

### Runtime Errors

**Issue**: Pages show 404

- Check `generateStaticParams()` is returning correct slugs
- Verify fallback configuration
- Check WordPress content is published

**Issue**: Images not loading

- Verify `remotePatterns` in `next.config.ts`
- Check WordPress media URLs
- Confirm image optimization settings

### Performance Issues

**Slow page loads**:
- Enable Vercel Analytics to identify bottlenecks
- Check WordPress GraphQL query efficiency
- Review image sizes and optimization
- Consider Redis caching for WordPress

## Rollback Strategy

### Vercel

Use instant rollback:

```bash
# Via dashboard
Deployments → Select previous deployment → Promote to Production

# Via CLI
vercel rollback
```

### Manual Hosting

```bash
# Using PM2
pm2 stop flatwp
git checkout previous-commit
npm install
npm run build
pm2 restart flatwp
```

## Next Steps

- [Configuration](/docs/configuration) - Fine-tune your setup
- [WordPress Plugin](/docs/wordpress-plugin) - Plugin features
- [Architecture](/docs/architecture) - Understand the system
