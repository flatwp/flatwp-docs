---
sidebar_position: 2
---

# One-Click Deploy

Deploy FlatWP to production in seconds with one-click deployment options.

## Deployment Platforms

FlatWP supports instant deployment to:

- **Vercel** - Recommended for Next.js (zero configuration)
- **Netlify** - Great developer experience
- **Railway** - Full-stack deployment with Docker support

## Vercel (Recommended)

Vercel provides the best Next.js experience with zero configuration.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flatwp/FlatWP-Starter)

### What Happens

1. **Repository Cloning** - Vercel clones FlatWP to your GitHub account
2. **Project Creation** - Creates a new Vercel project
3. **Environment Variables** - Prompts for WordPress connection details
4. **Build & Deploy** - Automatically builds and deploys your site

### Required Environment Variables

During deployment, provide:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql
REVALIDATION_SECRET=your-random-secret
PREVIEW_SECRET=another-random-secret
```

### After Deployment

1. **Get Your URL** - Vercel provides `https://your-site.vercel.app`
2. **Update WordPress** - Configure FlatWP plugin with your Vercel URL
3. **Custom Domain** - Add your domain in Vercel settings (optional)

**Full Guide**: [Vercel Deployment](/docs/deployment/vercel)

## Netlify

Netlify offers excellent developer experience and powerful features.

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/flatwp/FlatWP-Starter)

### What Happens

1. **Connect GitHub** - Links FlatWP to your Netlify account
2. **Configure Build** - Automatically detects Next.js settings
3. **Environment Setup** - Prompts for WordPress credentials
4. **Deploy** - Builds and publishes your site

### Required Environment Variables

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql
REVALIDATION_SECRET=your-random-secret
PREVIEW_SECRET=another-random-secret
```

### Build Settings

Netlify automatically configures:

- **Build Command**: `pnpm build`
- **Publish Directory**: `.next`
- **Node Version**: 20.x

### After Deployment

1. **Get Your URL** - Netlify provides `https://your-site.netlify.app`
2. **Update WordPress** - Configure FlatWP plugin with your Netlify URL
3. **Custom Domain** - Add your domain in Netlify DNS settings

**Full Guide**: [Netlify Deployment](/docs/deployment/netlify)

## Railway

Railway provides full-stack deployment with Docker support.

### One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/flatwp)

### What Happens

1. **Project Creation** - Creates Railway project from template
2. **Service Configuration** - Sets up Next.js service
3. **Environment Variables** - Prompts for configuration
4. **Build & Deploy** - Uses NIXPACKS for automatic builds

### Required Environment Variables

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql
REVALIDATION_SECRET=your-random-secret
PREVIEW_SECRET=another-random-secret
NODE_ENV=production
```

### Railway Features

- **Automatic HTTPS** - SSL certificates included
- **Health Checks** - Monitors `/api/health` endpoint
- **Metrics** - Built-in performance monitoring
- **Scaling** - Easy horizontal scaling (Pro plan)

### After Deployment

1. **Get Your URL** - Railway provides `https://your-site.up.railway.app`
2. **Update WordPress** - Configure FlatWP plugin with Railway URL
3. **Custom Domain** - Add domain in Railway settings

**Full Guide**: [Railway Deployment](/docs/deployment/railway)

## Pre-Deployment Checklist

Before deploying to production:

### WordPress Requirements

- [ ] **WPGraphQL Plugin** installed and activated
- [ ] **FlatWP Companion Plugin** installed and activated
- [ ] **GraphQL Endpoint** accessible publicly
- [ ] **Permalinks** set to "Post name" or custom structure
- [ ] **HTTPS** enabled on WordPress site

### Next.js Requirements

- [ ] **Environment Variables** prepared
- [ ] **GraphQL Types** generated (`pnpm graphql:codegen`)
- [ ] **Build Test** successful locally (`pnpm build`)
- [ ] **Production Preview** tested (`pnpm start` after build)

### Secrets Generation

Generate secure random secrets:

```bash
# Revalidation Secret
openssl rand -base64 32

# Preview Secret
openssl rand -base64 32
```

Save these securely - you'll need them for both Next.js and WordPress.

## Post-Deployment Setup

After successful deployment:

### 1. Configure WordPress Plugin

Go to **WordPress Admin → Settings → FlatWP**:

- **Next.js Site URL**: Your deployment URL
- **Revalidation Secret**: Same as environment variable
- **Enable Webhooks**: ✅ Checked
- **Webhook Events**: Post publish, update, delete

Click **Test Connection** - should show ✅ Success.

### 2. Test Revalidation

1. Edit a WordPress post
2. Click **Update**
3. Visit your deployed site
4. Changes should appear within 5-10 seconds

### 3. Set Up Custom Domain (Optional)

Each platform has domain management:

**Vercel**:
1. Project Settings → Domains
2. Add your domain
3. Update DNS records at your registrar
4. Automatic SSL certificate

**Netlify**:
1. Site Settings → Domain Management
2. Add custom domain
3. Use Netlify DNS or configure CNAME
4. Automatic SSL certificate

**Railway**:
1. Project → Settings → Domains
2. Add custom domain
3. Add DNS records at registrar
4. Automatic SSL certificate

### 4. Update WordPress URLs

After adding custom domain:

1. Update **FlatWP Plugin** with new URL
2. Update **Environment Variables** (if using `NEXT_PUBLIC_SITE_URL`)
3. Redeploy if environment variables changed

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_WORDPRESS_API_URL` | WordPress GraphQL endpoint | `https://cms.example.com/graphql` |
| `REVALIDATION_SECRET` | Secret for webhook revalidation | `abc123...` (32+ characters) |
| `PREVIEW_SECRET` | Secret for draft preview mode | `xyz789...` (32+ characters) |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_NAME` | Site name for metadata | `FlatWP Site` |
| `NEXT_PUBLIC_SITE_URL` | Production site URL | Auto-detected |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Site description for SEO | `A modern headless WordPress site` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |

## Troubleshooting

### Build Failures

**Issue**: Build fails with module errors

**Solution**: 
1. Verify all dependencies in `package.json`
2. Regenerate GraphQL types locally
3. Test build locally: `pnpm build`
4. Check deployment logs for specific errors

### Environment Variable Issues

**Issue**: Site shows "WordPress connection failed"

**Solution**:
1. Verify `NEXT_PUBLIC_WORDPRESS_API_URL` is correct
2. Check WordPress GraphQL endpoint is public
3. Test endpoint: `curl https://your-wp.com/graphql`
4. Ensure no typos in environment variables

### Revalidation Not Working

**Issue**: Content updates don't appear on deployed site

**Solution**:
1. Check `REVALIDATION_SECRET` matches in both places
2. Verify webhooks enabled in FlatWP plugin
3. Check deployment logs for webhook errors
4. Test webhook manually:

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-secret", "action": "rebuild"}'
```

### SSL Certificate Issues

**Issue**: Custom domain shows SSL error

**Solution**:
1. Wait 24-48 hours for SSL provisioning
2. Verify DNS records are correct
3. Check platform status page
4. Contact platform support if persists

## Deployment Best Practices

### Development Workflow

1. **Local Development** - Test changes on `localhost:3010`
2. **Staging Environment** - Deploy to staging URL first
3. **Production Deploy** - Merge to main branch for production

### Environment Strategy

- **Development**: Use local WordPress (Docker Compose)
- **Staging**: Deploy from `staging` branch
- **Production**: Deploy from `main` branch

### Monitoring

Enable analytics and monitoring:

**Vercel Analytics**:
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

**Performance Monitoring**:
- Check Core Web Vitals in platform dashboard
- Monitor build times
- Track error rates

## Cost Estimation

### Vercel
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month (commercial projects)
- **Enterprise**: Custom pricing

### Netlify
- **Starter**: Free (100GB bandwidth)
- **Pro**: $19/month (400GB bandwidth)
- **Business**: $99/month (1TB bandwidth)

### Railway
- **Free Tier**: $5/month credits
- **Pro**: $20+/month (usage-based)
- **Team**: $25/user/month

Most FlatWP sites run well on free/hobby tiers.

## Next Steps

After deployment:

1. **[Custom Domain Setup](/docs/deployment/custom-domain)** - Use your own domain
2. **[Performance Optimization](/docs/features/performance)** - Improve speed further
3. **[SEO Configuration](/docs/guides/seo-optimization)** - Optimize for search engines
4. **[Monitoring Setup](/docs/deployment/monitoring)** - Track performance
