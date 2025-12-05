# FlatWP Configuration - Quick Reference

Quick reference card for FlatWP configuration system.

## Setup (3 Steps)

### 1. Create Config File

```typescript title="flatwp.config.ts"
import { defineConfig, validateEnv } from '@flatwp/config';

export default defineConfig({
  wordpress: {
    graphqlUrl: validateEnv('NEXT_PUBLIC_WORDPRESS_API_URL', process.env.NEXT_PUBLIC_WORDPRESS_API_URL),
    revalidateSecret: validateEnv('REVALIDATION_SECRET', process.env.REVALIDATION_SECRET),
  },
});
```

### 2. Set Environment Variables

```bash title=".env.local"
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.example.com/graphql
REVALIDATION_SECRET=your-secure-random-secret-min-16-chars
```

### 3. Use in Your App

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

export const revalidate = getContentISR('posts').revalidate;
```

## Configuration Options

### WordPress

```typescript
wordpress: {
  graphqlUrl: string;        // Required: GraphQL endpoint
  domain?: string;           // Optional: Auto-detected from graphqlUrl
  revalidateSecret: string;  // Required: Min 16 chars
  previewSecret?: string;    // Optional: For preview mode
}
```

### Rendering Strategies

```typescript
rendering: {
  posts: {
    strategy: 'static' | 'isr' | 'ssr',  // Default: 'isr'
    revalidate: false | true | number,    // Default: false
    generateStaticParams: boolean,        // Default: true
  },
  pages: { /* same */ },
  archives: { /* same */ },
  homepage: { /* same */ },
  custom: {
    [postType: string]: { /* same */ }
  }
}
```

### Features

```typescript
features: {
  preview: boolean | { enabled: boolean; secret?: string },
  search: {
    enabled: boolean,
    provider: 'fuse' | 'algolia',
    algolia?: { appId, apiKey, indexName }
  },
  seo: {
    provider: 'auto' | 'yoast' | 'rankmath' | 'none'
  },
  analytics: {
    vercel: boolean,
    google?: string,
    sentry?: string
  }
}
```

### Site Metadata

```typescript
site: {
  url?: string,
  name?: string,
  description?: string
}
```

## Revalidation Options

| Value | Behavior | Use Case |
|-------|----------|----------|
| `false` | On-demand only | WordPress webhooks |
| `true` | Every 60 seconds | Default revalidation |
| `60` | Every 60 seconds | Custom interval |
| `300` | Every 5 minutes | Archive pages |

## Rendering Strategies

| Strategy | Generated | Fresh | Speed | Use Case |
|----------|-----------|-------|-------|----------|
| `static` | Build time | No | Fastest | Rarely changes |
| `isr` | Build + revalidate | Yes | Fast | Most content |
| `ssr` | Every request | Always | Slower | Real-time data |

## API Functions

```typescript
// Define configuration
defineConfig(config: UserConfig): FlatWPConfig

// Validate configuration
validateConfig(config: UserConfig): { success, data?, errors? }

// Validate environment variable
validateEnv(name: string, value?: string): string

// Get ISR config
getISRConfig(config: FlatWPConfig, type: string): { revalidate, generateStaticParams }

// Get revalidate value
getRevalidateValue(revalidate: number | boolean | undefined): number | false | undefined
```

## Runtime Access

```typescript title="lib/config.ts"
import flatwpConfig from '../flatwp.config';
import { getISRConfig } from '@flatwp/config';

export const config = flatwpConfig;
export const wordpress = config.wordpress;
export const features = config.features;
export const site = config.site;

export function getContentISR(contentType: string) {
  return getISRConfig(config, contentType);
}

export function isFeatureEnabled(feature: string): boolean {
  // Implementation
}
```

## Common Patterns

### Blog Posts (ISR + On-Demand)

```typescript title="flatwp.config.ts"
rendering: {
  posts: {
    strategy: 'isr',
    revalidate: false, // WordPress webhook triggers revalidation
    generateStaticParams: true,
  }
}
```

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

export const revalidate = getContentISR('posts').revalidate;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```

### Static Pages

```typescript title="flatwp.config.ts"
rendering: {
  pages: {
    strategy: 'static',
    revalidate: false,
    generateStaticParams: true,
  }
}
```

### Archives (ISR + Time-Based)

```typescript title="flatwp.config.ts"
rendering: {
  archives: {
    strategy: 'isr',
    revalidate: 300, // 5 minutes
    generateStaticParams: true,
  }
}
```

### Custom Post Types

```typescript title="flatwp.config.ts"
rendering: {
  custom: {
    product: {
      strategy: 'isr',
      revalidate: 300,
      generateStaticParams: true,
    },
    event: {
      strategy: 'isr',
      revalidate: 60,
      generateStaticParams: true,
    }
  }
}
```

## Environment Variables

### Required

```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.example.com/graphql
REVALIDATION_SECRET=min-16-character-random-secret
```

### Optional

```bash
# WordPress
NEXT_PUBLIC_WORDPRESS_DOMAIN=cms.example.com
PREVIEW_SECRET=min-16-character-random-secret

# Site
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_SITE_NAME=My Site
NEXT_PUBLIC_SITE_DESCRIPTION=Site description

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Search (Algolia)
NEXT_PUBLIC_ALGOLIA_APP_ID=ABC123
NEXT_PUBLIC_ALGOLIA_API_KEY=search-only-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=posts
```

## Feature Checks

```typescript
import { isFeatureEnabled, features } from '@/lib/config';

// Check if enabled
const hasPreview = isFeatureEnabled('preview');
const hasSearch = isFeatureEnabled('search');

// Get feature config
const searchProvider = features.search.provider; // 'fuse' | 'algolia'
const seoProvider = features.seo.provider; // 'auto' | 'yoast' | 'rankmath'
```

## API Routes

### Revalidation Webhook

```typescript title="app/api/revalidate/route.ts"
import { wordpress } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { secret, paths } = await request.json();

  if (secret !== wordpress.revalidateSecret) {
    return Response.json({ error: 'Invalid' }, { status: 401 });
  }

  for (const path of paths) {
    await revalidatePath(path);
  }

  return Response.json({ revalidated: true, paths });
}
```

### Preview Mode

```typescript title="app/api/preview/route.ts"
import { wordpress, isFeatureEnabled } from '@/lib/config';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  if (!isFeatureEnabled('preview')) {
    return new Response('Preview disabled', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== wordpress.previewSecret) {
    return new Response('Invalid secret', { status: 401 });
  }

  draftMode().enable();
  redirect(`/blog/${searchParams.get('slug')}`);
}
```

## Type Safety

```typescript
import type { FlatWPConfig, RenderingStrategy } from '@flatwp/config';

// Full config type
const config: FlatWPConfig = { /* ... */ };

// Strategy type
const postStrategy: RenderingStrategy = {
  strategy: 'isr',
  revalidate: false,
  generateStaticParams: true,
};
```

## Validation Errors

### Missing Variable

```
ConfigError: Missing required environment variable: NEXT_PUBLIC_WORDPRESS_API_URL
Hint: Set NEXT_PUBLIC_WORDPRESS_API_URL in your .env.local file
```

**Fix:** Add to `.env.local`

### Invalid URL

```
wordpress.graphqlUrl: Must be a valid URL (e.g., https://example.com)
```

**Fix:** Include protocol: `https://cms.example.com/graphql`

### Short Secret

```
wordpress.revalidateSecret: Must be at least 16 characters (currently 8)
```

**Fix:** Generate secure secret:
```bash
openssl rand -base64 32
```

## Troubleshooting

### Config not loading

1. Restart dev server after changing `.env.local`
2. Check import path: `@/lib/config`, not `../flatwp.config`
3. Verify config file location (app root)

### Revalidation not working

1. Check `REVALIDATION_SECRET` matches between WordPress and Next.js
2. Verify webhook URL is correct
3. Test endpoint manually: `POST /api/revalidate`

### Features not enabled

1. Check feature flag: `isFeatureEnabled('feature-name')`
2. Verify environment variables are set
3. Restart dev server after changing config

## Performance Tips

1. **Use ISR** for most content (balance speed + freshness)
2. **On-demand revalidation** for controlled updates
3. **Static pages** for rarely-changing content
4. **Limit generateStaticParams** for large sites
5. **Set dynamicParams = true** for on-demand generation

## Security Best Practices

1. **Never commit** `.env.local` to git
2. **Min 16 chars** for all secrets
3. **Use validateEnv()** for required variables
4. **Different secrets** for dev/staging/production
5. **Rotate secrets** periodically

## Quick Links

- [Full Documentation](/docs-flatwp/docs/configuration/)
- [Getting Started](/docs-flatwp/docs/configuration/getting-started.md)
- [API Reference](/docs-flatwp/docs/configuration/reference.md)
- [Rendering Strategies](/docs-flatwp/docs/configuration/rendering-strategies.md)
- [Environment Variables](/docs-flatwp/docs/configuration/environment-variables.md)

---

**Last Updated**: 2025-12-05
**Version**: 1.0
