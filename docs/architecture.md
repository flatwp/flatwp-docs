---
sidebar_position: 3
---

# Architecture

Understanding FlatWP's hybrid mono-as-poly architecture and design decisions.

## Repository Strategy

FlatWP uses a **hybrid mono-as-poly** architecture—development happens in a single private monorepo, but distribution occurs through separate public repositories.

### Why This Approach?

**Single Source of Truth**
- All development in one place (`thinmintdev/flatwp-dev`)
- Simplified dependency management
- Shared code reuse via packages
- Consistent tooling and processes

**Clean Public Distribution**
- Focused product repositories
- Independent versioning
- Better GitHub discoverability
- Professional presentation

**Cost Optimization**
- Vercel hobby plan compatibility
- No infrastructure costs during MVP
- Development on personal account
- Distribution on organization account

## System Overview

```
┌─────────────────────────────────────────────────┐
│  Private Development Monorepo                   │
│  thinmintdev/flatwp-dev                        │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │apps/web/ │  │apps/     │  │apps/     │     │
│  │Production│  │starter/  │  │plugin/   │     │
│  │Site      │  │Template  │  │WordPress │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                  │
│  ┌─────────────────────────────────┐           │
│  │ packages/                        │           │
│  │ - types/ (Shared TypeScript)    │           │
│  │ - typescript-config/ (TS Config)│           │
│  └─────────────────────────────────┘           │
└─────────────────────────────────────────────────┘
                    │
                    │ GitHub Actions
                    │ (splitsh-lite)
                    ▼
    ┌───────────────────────────────────┐
    │  Public Distribution Repos        │
    │                                   │
    │  flatwp/FlatWP-Starter  (MIT)    │
    │  flatwp/FlatWP-Plugin   (GPL v2) │
    └───────────────────────────────────┘
```

## Core Components

### Production Site (apps/web)

The marketing website deployed to Vercel.

**Purpose**:
- Marketing pages (homepage, about, pricing)
- Demo blog powered by WordPress
- Documentation links

**Deployment**: Automatic from main branch to flatwp.com

### Starter Template (apps/starter)

Next.js 15 headless WordPress template.

**Purpose**:
- Distributed as GitHub template
- Users clone to start projects
- Complete working example

**Distribution**: Split to `flatwp/FlatWP-Starter`

### WordPress Plugin (apps/plugin)

FlatWP Companion WordPress plugin.

**Purpose**:
- Cache revalidation webhooks
- Preview mode integration
- Image blur placeholder generation
- SEO metadata sync
- GraphQL extensions

**Distribution**: Split to `flatwp/FlatWP-Plugin`

## Rendering Strategies

FlatWP implements intelligent rendering based on content type:

### Static Pages
```typescript
// /about, /contact
export const revalidate = false; // Never revalidate
```
Fully static at build time for maximum performance.

### Blog Posts
```typescript
// /blog/[slug]
export const revalidate = false; // On-demand only
```
ISR with on-demand revalidation via WordPress webhooks.

### Archive Pages
```typescript
// /blog
export const revalidate = 300; // 5 minutes
```
Time-based ISR for fresh content without constant rebuilds.

### Homepage
```typescript
// /
export const revalidate = 60; // 1 minute
```
Short ISR for latest content updates.

## Data Flow

### Content Publishing Flow

```
1. Editor publishes post in WordPress
   ↓
2. FlatWP Plugin detects change
   ↓
3. Plugin sends webhook to Next.js
   POST /api/revalidate
   ↓
4. Next.js revalidates specific paths
   revalidatePath('/blog/[slug]')
   ↓
5. Next request fetches fresh data
   GraphQL query → WordPress
   ↓
6. Updated page served to users
```

### Preview Mode Flow

```
1. Editor clicks "Preview" in WordPress
   ↓
2. Plugin generates time-limited token
   ↓
3. Redirects to Next.js preview URL
   /api/preview?secret=...&id=123
   ↓
4. Next.js validates token
   ↓
5. Enables draft mode
   draftMode().enable()
   ↓
6. Renders draft content from WordPress
```

## GraphQL Type Safety

All WordPress data is strongly typed through automatic code generation:

```
1. Define GraphQL queries in graphql/
   queries/get-post.graphql
   ↓
2. Run code generator
   npm run graphql:codegen
   ↓
3. Types generated in graphql/generated/
   ↓
4. Use in components with full IntelliSense
```

## Image Optimization

FlatWP handles WordPress images efficiently:

### Blur Placeholder Generation
- WordPress plugin generates base64 blur data
- Stored in image metadata
- Exposed via GraphQL
- Used by next/image for progressive loading

### Image Delivery
- Automatic WebP/AVIF conversion via next/image
- Responsive srcsets based on viewport
- Lazy loading by default
- CDN optimization through Vercel

## Shared Code Strategy

### packages/types
Common TypeScript interfaces used across apps:
- API data structures
- Configuration types
- Shared utilities

### packages/typescript-config
Shared TypeScript configuration:
- Strict mode settings
- Path aliases
- Compiler options

### packages/ui (Planned)
Shared React components for code reuse between production site and starter template.

## Build System

### Turborepo
Efficient monorepo builds with:
- Parallel builds across apps
- Smart caching (only rebuild changed apps)
- Task dependencies
- Remote caching (planned)

### Commands
```bash
npm run dev              # All apps in dev mode
npm run dev:web          # Production site
npm run dev:starter      # Starter template
npm run build            # Build all apps
npm run build:web        # Build production site
```

## Security

### Secrets Management
- Development: `.env.local` files (gitignored)
- Production: Vercel environment variables
- CI/CD: GitHub Secrets

### API Security
- Revalidation: Secret token validation
- Preview: Time-limited tokens
- GraphQL: WordPress ACF/user permissions respected

## Performance Targets

FlatWP aims for:
- **Lighthouse Score**: 95+ across all metrics
- **LCP**: &lt;2.5s on 3G
- **CLS**: &lt;0.1
- **FID**: &lt;100ms
- **Bundle Size**: &lt;200KB initial JS (pre-gzip)

## Scaling Considerations

### When to Add Apps
Add to `apps/` when:
- Standalone deployable service
- Different technology stack
- Independent versioning needed

### When to Add Packages
Add to `packages/` when:
- Code shared by 2+ apps
- Pure utility functions
- Common configuration

## Future Evolution

### Planned Pro Version
- `apps/saas/` - Customer dashboard
- `apps/billing/` - Subscription management
- `packages/auth/` - Shared authentication
- `packages/analytics/` - Analytics SDK

### Migration Path
As the project scales:
1. Nx for advanced monorepo features
2. pnpm for performance gains
3. Remote caching for faster builds
4. Changesets for automated versioning

## Learn More

- [Deployment Guide](/docs/deployment) - Deploy FlatWP to production
- [Configuration](/docs/configuration) - Configure your setup
- [WordPress Plugin](/docs/wordpress-plugin) - Plugin features and setup
