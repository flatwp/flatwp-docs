---
sidebar_position: 1
---

# Welcome to FlatWP

Build blazingly fast, SEO-optimized WordPress sites with Next.js 15, React 19, and TypeScript.

## What is FlatWP?

FlatWP is a production-ready starter kit that combines WordPress's powerful content management with Next.js's modern rendering capabilities. It leverages **Incremental Static Regeneration (ISR)** with on-demand revalidation to deliver exceptional performance while maintaining content freshness.

### Key Features

- ⚡ **95+ Lighthouse Score** - Exceptional performance across all metrics
- 🔄 **ISR + On-Demand Revalidation** - Fresh content without constant rebuilds
- 🎯 **Fully Type-Safe** - GraphQL Code Generator for complete type safety
- 🚀 **One-Click Deploy** - Vercel, Netlify, Railway support
- 🐳 **Docker Development** - Complete local environment included
- 📱 **Image Optimization** - Automatic WebP/AVIF conversion
- 🔧 **Modern Stack** - Next.js 15.5.6 + React 19 + TypeScript
- 📦 **Open Source** - MIT licensed, free forever

## Why FlatWP?

### Performance First
- **95+ Lighthouse Score** across all metrics
- **Sub-2-second LCP** on 3G connections
- **Optimized Core Web Vitals** (LCP, FID, CLS, TTFB)
- **Intelligent rendering strategies** per content type

### Developer Experience
- **Fully Type-Safe** with GraphQL Code Generator
- **Modern Stack**: Next.js 15.5.6 + React 19
- **One-Click Deploy** to Vercel, Netlify, or Railway
- **Docker Development** environment included
- **Automatic type generation** from WordPress schema

### Production Ready
- **ISR with on-demand revalidation** - content updates without rebuilds
- **Preview mode** for draft content
- **Image optimization** with automatic WebP/AVIF conversion
- **SEO optimized** with structured data and meta tags
- **No Sentry** - cleaner codebase, better performance

## Requirements

- **Node.js 20+** - Required for Next.js 15
- **pnpm 8+** - Package manager (recommended)
- **WordPress 6.4+** - With WPGraphQL plugin
- **MySQL 8.0+** - For WordPress (if self-hosting)

:::tip Quick Version Check
```bash
node --version  # Should show v20.0.0 or higher
pnpm --version  # Should show 8.0.0 or higher
```
:::



## Quick Start

Get started in under 5 minutes:

```bash
# Using pnpm (recommended)
pnpm create flatwp my-site

# Using npm
npx create-flatwp my-site

# Using yarn
yarn create flatwp my-site
```

Then start developing:

```bash
cd my-site
pnpm dev
```

Visit http://localhost:3010 to see your site!

## One-Click Deploy

Deploy FlatWP instantly to your favorite platform:

<div style={{display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '2rem'}}>
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/flatwp/FlatWP-Starter">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://app.netlify.com/start/deploy?repository=https://github.com/flatwp/FlatWP-Starter">
    <img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />
  </a>
  <a href="https://railway.app/template/flatwp">
    <img src="https://railway.app/button.svg" alt="Deploy on Railway" />
  </a>
</div>

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│ WordPress CMS (Content Management)              │
│ - WPGraphQL Plugin                              │
│ - FlatWP Companion Plugin                       │
│ - ACF (Optional)                                │
└────────────────┬────────────────────────────────┘
                 │ GraphQL API
                 ▼
┌─────────────────────────────────────────────────┐
│ FlatWP (Next.js Application)                    │
│ - Static Generation + ISR                       │
│ - On-Demand Revalidation                        │
│ - Server Components                             │
│ - Image Optimization                            │
└────────────────┬────────────────────────────────┘
                 │ Deployment
                 ▼
┌─────────────────────────────────────────────────┐
│ Vercel / Netlify / Railway                      │
│ - Automatic deployments                         │
│ - Edge network                                  │
│ - Analytics                                     │
└─────────────────────────────────────────────────┘
```

## What's Included

FlatWP comes with everything you need:

- ✅ **Production-ready Next.js app** with optimal configuration
- ✅ **WordPress plugin** for revalidation and webhooks
- ✅ **Type-safe GraphQL** queries with code generation
- ✅ **Docker Compose** environment for local development
- ✅ **Image optimization** with automatic format conversion
- ✅ **Preview mode** for draft content
- ✅ **SEO optimization** with meta tags and structured data
- ✅ **Performance monitoring** setup ready
- ✅ **Comprehensive documentation** and examples

## Tech Stack

### Frontend
- **Next.js 15.5.6** - App Router with Server Components
- **React 19** - Latest React features
- **TypeScript** - Strict mode enabled
- **TailwindCSS v4** - Utility-first styling
- **Shadcn/ui** - Accessible component library

### WordPress
- **WordPress 6.4+** - Modern WordPress features
- **WPGraphQL** - GraphQL API for WordPress
- **FlatWP Companion** - Custom plugin for revalidation
- **ACF Pro** - Optional for flexible content

### Development
- **pnpm** - Fast, disk space efficient package manager
- **GraphQL Code Generator** - Type-safe queries
- **Docker Compose** - Local WordPress development
- **Turborepo** - Monorepo build system

## Use Cases

FlatWP is perfect for:

- **Marketing websites** - Fast, SEO-friendly, easy to manage
- **Blogs & publications** - Content-focused with great performance
- **Portfolio sites** - Beautiful, performant, type-safe
- **Small business sites** - Professional without complexity
- **Agency projects** - Repeatable, scalable architecture

## Learning Path

1. **[Quick Start](/docs/getting-started/quick-start)** - Get up and running in 5 minutes
2. **[One-Click Deploy](/docs/getting-started/one-click-deploy)** - Deploy to production instantly
3. **[WordPress Setup](/docs/wordpress/plugin-setup)** - Configure your WordPress backend
4. **[Development Guide](/docs/development/project-structure)** - Learn the codebase
5. **[Deployment](/docs/deployment/vercel)** - Deploy to production

## Community & Support

- **Documentation**: [flatwp.com/docs](https://flatwp.com/docs)
- **GitHub**: [github.com/flatwp](https://github.com/flatwp)
- **Issues**: [Report bugs](https://github.com/flatwp/FlatWP-Starter/issues)
- **Discussions**: [Ask questions](https://github.com/flatwp/FlatWP-Starter/discussions)

## License

FlatWP is open source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

Free to use for personal and commercial projects.

---

**Let's build something amazing together!** 🚀
