---
sidebar_position: 3
title: Rendering Strategies
description: Deep dive into static, ISR, and SSR rendering strategies
---

# Rendering Strategies

FlatWP supports three rendering strategies for your WordPress content: Static Site Generation (SSG), Incremental Static Regeneration (ISR), and Server-Side Rendering (SSR). Understanding when to use each strategy is crucial for optimal performance.

## Strategy Overview

| Strategy | When to Use | Performance | Freshness | Build Time |
|----------|-------------|-------------|-----------|------------|
| **Static** | Content rarely changes | Fastest | Stale until rebuild | Longest |
| **ISR** | Balance speed and freshness | Fast | Configurable | Medium |
| **SSR** | Real-time data required | Slower | Always fresh | None |

## Static Site Generation (SSG)

### Overview

Static pages are generated once at build time and served from CDN. This is the **fastest** option but requires rebuilding to update content.

### Configuration

```typescript
{
  strategy: 'static',
  revalidate: false,
  generateStaticParams: true,
}
```

### When to Use

Use static generation for:
- **Marketing pages** (`/about`, `/contact`, `/services`)
- **Documentation** that changes infrequently
- **Landing pages** optimized for speed
- **Legal pages** (`/privacy`, `/terms`)
- **Portfolio projects** with stable content

### Example: Static Pages

```typescript title="flatwp.config.ts"
export default defineConfig({
  rendering: {
    pages: {
      strategy: 'static',
      revalidate: false,
      generateStaticParams: true,
    },
  },
});
```

```typescript title="app/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

// No revalidation - fully static
export const revalidate = getContentISR('pages').revalidate;

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  return <PageContent page={page} />;
}
```

### Pros & Cons

**Advantages:**
- Fastest possible delivery
- Lowest server load
- Best for SEO (pre-rendered HTML)
- Predictable costs

**Disadvantages:**
- Requires full rebuild for updates
- Not suitable for frequently changing content
- Build time increases with content volume

## Incremental Static Regeneration (ISR)

### Overview

ISR combines static generation with automatic or on-demand revalidation. Pages are generated statically but can be refreshed without rebuilding the entire site.

### Configuration

```typescript
{
  strategy: 'isr',
  revalidate: number | boolean,
  generateStaticParams: true,
}
```

### Revalidation Options

#### On-Demand Revalidation (Recommended)

Revalidate only when WordPress content changes via webhook.

```typescript
{
  strategy: 'isr',
  revalidate: false, // On-demand only
  generateStaticParams: true,
}
```

**How it works:**
1. WordPress content is saved
2. FlatWP plugin sends webhook to Next.js
3. Next.js revalidates specific paths
4. Next request gets fresh content

**Setup:**
```typescript title="app/api/revalidate/route.ts"
import { revalidatePath } from 'next/cache';
import { wordpress } from '@/lib/config';

export async function POST(request: Request) {
  const { secret, paths } = await request.json();

  // Verify webhook secret
  if (secret !== wordpress.revalidateSecret) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  // Revalidate all requested paths
  for (const path of paths) {
    await revalidatePath(path);
  }

  return Response.json({ revalidated: true, paths });
}
```

#### Time-Based Revalidation

Automatically revalidate pages after a time interval.

```typescript
{
  strategy: 'isr',
  revalidate: 300, // 5 minutes
  generateStaticParams: true,
}
```

**Common intervals:**
- `60` - 1 minute (homepage, high-traffic pages)
- `300` - 5 minutes (archives, category pages)
- `900` - 15 minutes (less critical content)
- `3600` - 1 hour (rarely updated content)

#### Hybrid Approach

Combine time-based and on-demand revalidation:

```typescript
{
  strategy: 'isr',
  revalidate: 300, // Fallback: revalidate every 5 minutes
  // PLUS on-demand via webhook
}
```

### When to Use

Use ISR for:
- **Blog posts** (on-demand revalidation)
- **Archive pages** (time-based, 5 minutes)
- **Homepage** (time-based, 1 minute)
- **Product pages** (on-demand or time-based)
- **News articles** (time-based, short interval)

### Example: Blog Posts with On-Demand ISR

```typescript title="flatwp.config.ts"
export default defineConfig({
  rendering: {
    posts: {
      strategy: 'isr',
      revalidate: false, // WordPress webhook triggers revalidation
      generateStaticParams: true,
    },
  },
});
```

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

// On-demand revalidation
export const revalidate = getContentISR('posts').revalidate;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return <PostContent post={post} />;
}
```

### Example: Archives with Time-Based ISR

```typescript title="flatwp.config.ts"
export default defineConfig({
  rendering: {
    archives: {
      strategy: 'isr',
      revalidate: 300, // Revalidate every 5 minutes
      generateStaticParams: true,
    },
  },
});
```

```typescript title="app/blog/page.tsx"
import { getContentISR } from '@/lib/config';

// Time-based revalidation
export const revalidate = getContentISR('archives').revalidate;

export default async function BlogArchive() {
  const posts = await getAllPosts({ limit: 10 });
  return <ArchiveLayout posts={posts} />;
}
```

### Pros & Cons

**Advantages:**
- Fast like static, fresh like SSR
- On-demand updates without rebuilds
- Lower server load than SSR
- SEO-friendly (pre-rendered HTML)

**Disadvantages:**
- First visitor after revalidation sees stale content
- Requires webhook setup for on-demand
- More complex than pure static

## Server-Side Rendering (SSR)

### Overview

Pages are rendered on every request. Use this only when real-time data is absolutely necessary.

### Configuration

```typescript
{
  strategy: 'ssr',
  generateStaticParams: false,
}
```

### When to Use

Use SSR sparingly for:
- **User dashboards** (personalized content)
- **Real-time data** (stock prices, live scores)
- **A/B testing** requiring server logic
- **Geo-targeted content** based on request location

:::warning Performance Impact
SSR is significantly slower than static or ISR. Use it only when absolutely necessary.
:::

### Example: Real-Time Dashboard

```typescript title="app/dashboard/page.tsx"
// Force SSR - no caching
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Fetched on every request
  const userData = await getCurrentUserData();
  const liveStats = await getLiveStatistics();

  return <DashboardContent user={userData} stats={liveStats} />;
}
```

### Pros & Cons

**Advantages:**
- Always shows latest data
- No build or revalidation needed
- Personalized per request

**Disadvantages:**
- Slowest rendering strategy
- Highest server load
- Higher costs
- Not ideal for SEO (TTFB)

## Choosing the Right Strategy

### Decision Tree

```
Is content user-specific or real-time?
├─ Yes → SSR
└─ No → Does content change frequently?
    ├─ No (rarely/never) → Static
    └─ Yes → ISR
        ├─ Controlled updates (WordPress saves) → ISR (on-demand)
        └─ Unpredictable updates → ISR (time-based)
```

### Recommendations by Content Type

#### Blog Posts
```typescript
posts: {
  strategy: 'isr',
  revalidate: false, // On-demand via WordPress webhook
  generateStaticParams: true,
}
```

**Reasoning:** Blog posts change only when edited in WordPress. On-demand revalidation provides instant updates without constant polling.

#### Static Pages
```typescript
pages: {
  strategy: 'static',
  revalidate: false,
  generateStaticParams: true,
}
```

**Reasoning:** Pages like About, Contact, Services rarely change. Fully static is fastest.

#### Archive Pages
```typescript
archives: {
  strategy: 'isr',
  revalidate: 300, // 5 minutes
  generateStaticParams: true,
}
```

**Reasoning:** Archives change when new posts are published. Time-based ISR ensures freshness without individual revalidation.

#### Homepage
```typescript
homepage: {
  strategy: 'isr',
  revalidate: 60, // 1 minute
  generateStaticParams: false,
}
```

**Reasoning:** Homepage should feel fresh. Short revalidation interval keeps it updated.

#### WooCommerce Products
```typescript
custom: {
  product: {
    strategy: 'isr',
    revalidate: false, // On-demand when product updated
    generateStaticParams: true,
  },
}
```

**Reasoning:** Products change when stock, price, or details update. On-demand keeps inventory accurate.

#### Events
```typescript
custom: {
  event: {
    strategy: 'isr',
    revalidate: 60, // 1 minute for time-sensitive content
    generateStaticParams: true,
  },
}
```

**Reasoning:** Events are time-sensitive. Short revalidation ensures accurate status.

## Advanced Patterns

### Hybrid Content Strategy

Different parts of a page can use different strategies:

```typescript title="app/page.tsx"
import { getContentISR } from '@/lib/config';

// Homepage: ISR with 1-minute revalidation
export const revalidate = getContentISR('homepage').revalidate;

export default async function HomePage() {
  // Static component (cached)
  const heroData = await getHeroContent();

  // Dynamic component (not cached)
  const latestPosts = await getLatestPosts({ limit: 3 });

  return (
    <>
      <Hero data={heroData} />
      <LatestPosts posts={latestPosts} />
    </>
  );
}
```

### Conditional Revalidation

Revalidate based on content characteristics:

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

// Base revalidation from config
export const revalidate = getContentISR('posts').revalidate;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  // Could implement custom logic:
  // - Shorter revalidation for popular posts
  // - Longer for old posts
  // - Different for different categories

  return { title: post.title };
}
```

### Fallback Generation

Generate popular pages at build time, render others on-demand:

```typescript title="app/blog/[slug]/page.tsx"
export async function generateStaticParams() {
  // Only generate top 100 posts at build time
  const popularPosts = await getPopularPosts({ limit: 100 });
  return popularPosts.map((post) => ({ slug: post.slug }));
}

// Other posts generated on first request (ISR)
export const dynamicParams = true;
```

## Performance Optimization

### Build Time Optimization

For sites with thousands of pages:

```typescript
posts: {
  strategy: 'isr',
  revalidate: false,
  generateStaticParams: true, // But limit in generateStaticParams()
}
```

```typescript title="app/blog/[slug]/page.tsx"
export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    // Only 10 posts in dev
    const posts = await getAllPosts({ limit: 10 });
    return posts.map((post) => ({ slug: post.slug }));
  }

  // All posts in production
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Generate others on-demand
export const dynamicParams = true;
```

### Cache Warming

Pre-warm cache for critical pages:

```typescript title="scripts/warm-cache.ts"
const criticalPaths = [
  '/',
  '/blog',
  '/about',
  '/contact',
];

for (const path of criticalPaths) {
  await fetch(`https://your-site.com${path}`);
}
```

### Stale-While-Revalidate Pattern

ISR implements stale-while-revalidate automatically:

1. Visitor requests page
2. Serve cached version immediately (fast!)
3. Regenerate in background (if stale)
4. Next visitor gets fresh version

## Monitoring and Debugging

### Check ISR Status

```typescript title="app/blog/[slug]/page.tsx"
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (process.env.NODE_ENV === 'development') {
    console.log('Rendering post:', post.slug, 'at', new Date().toISOString());
  }

  return { title: post.title };
}
```

### Monitor Revalidation

```typescript title="app/api/revalidate/route.ts"
export async function POST(request: Request) {
  const { paths } = await request.json();

  console.log('Revalidating paths:', paths, 'at', new Date().toISOString());

  for (const path of paths) {
    await revalidatePath(path);
  }

  return Response.json({ revalidated: true, paths, timestamp: Date.now() });
}
```

### Response Headers

ISR responses include cache headers:

```
Cache-Control: s-maxage=300, stale-while-revalidate
X-Vercel-Cache: HIT (or MISS, STALE)
```

## Best Practices

1. **Start with ISR**: Use ISR as default, optimize to static or SSR as needed
2. **On-Demand for Content**: Use on-demand revalidation for WordPress content
3. **Time-Based for Aggregates**: Use time-based for archives, categories, searches
4. **Static for Stability**: Use static for rarely-changing pages
5. **Avoid SSR**: Only use SSR when absolutely necessary
6. **Monitor Performance**: Track cache hit rates and page load times
7. **Test Revalidation**: Verify webhook revalidation works correctly
8. **Consider Build Time**: Balance generateStaticParams with deployment speed

## Troubleshooting

### ISR Not Updating

**Problem:** Pages not revalidating after WordPress updates.

**Solutions:**
1. Check webhook is configured correctly in WordPress
2. Verify `REVALIDATION_SECRET` matches between WordPress and Next.js
3. Test revalidation endpoint manually: `POST /api/revalidate`
4. Check Next.js logs for revalidation events

### Build Timeouts

**Problem:** Build fails due to too many pages.

**Solutions:**
1. Limit `generateStaticParams()` to critical pages
2. Set `dynamicParams = true` for on-demand generation
3. Use incremental builds if available
4. Consider build time limits in your deployment platform

### Stale Content

**Problem:** Content appears stale even with ISR.

**Solutions:**
1. Check `revalidate` value isn't too high
2. Verify time-based revalidation is working
3. Implement on-demand revalidation via webhook
4. Clear CDN cache if applicable

## See Also

- [Configuration Reference](/docs/configuration/reference) - Full rendering config options
- [Environment Variables](/docs/configuration/environment-variables) - Required env vars
- [Runtime Usage](/docs/configuration/runtime-usage) - Using rendering config in code
