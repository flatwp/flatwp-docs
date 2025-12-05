---
sidebar_position: 4
title: Runtime Configuration
description: How to access and use configuration in your app code
---

# Runtime Configuration

Learn how to access FlatWP configuration in your Next.js application with type safety and convenience utilities.

## Overview

FlatWP configuration is defined in `flatwp.config.ts` and accessed at runtime through `lib/config.ts`. This provides:

- **Type Safety**: Full TypeScript support
- **Centralized Access**: Single import for all config
- **Utility Functions**: Helpers for common tasks
- **Environment Validation**: Guaranteed valid values

## Setup

### 1. Define Configuration

```typescript title="flatwp.config.ts"
import { defineConfig, validateEnv } from '@flatwp/config';

export default defineConfig({
  wordpress: {
    graphqlUrl: validateEnv(
      'NEXT_PUBLIC_WORDPRESS_API_URL',
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    ),
    revalidateSecret: validateEnv(
      'REVALIDATION_SECRET',
      process.env.REVALIDATION_SECRET
    ),
  },
  // ... other config
});
```

### 2. Create Runtime Helper

```typescript title="lib/config.ts"
import flatwpConfig from '../flatwp.config';
import { getISRConfig, getRevalidateValue } from '@flatwp/config';

// Export validated config
export const config = flatwpConfig;

// Convenience exports
export const wordpress = config.wordpress;
export const features = config.features;
export const site = config.site;

// Utility functions
export function getContentISR(contentType: string) {
  return getISRConfig(config, contentType);
}

export function getRevalidate(contentType: string) {
  const { revalidate } = getContentISR(contentType);
  return revalidate;
}

export function isFeatureEnabled(
  feature: 'preview' | 'search' | 'vercel-analytics'
): boolean {
  switch (feature) {
    case 'preview':
      return typeof config.features.preview === 'boolean'
        ? config.features.preview
        : config.features.preview.enabled;
    case 'search':
      return config.features.search.enabled;
    case 'vercel-analytics':
      return config.features.analytics.vercel;
    default:
      return false;
  }
}
```

## Common Usage Patterns

### Accessing WordPress Settings

```typescript
import { wordpress } from '@/lib/config';

// GraphQL client setup
const apolloClient = new ApolloClient({
  uri: wordpress.graphqlUrl,
  cache: new InMemoryCache(),
});

// Image optimization
const wordpressDomain = wordpress.domain;
```

### Setting ISR Revalidation

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

// Apply revalidation from config
export const revalidate = getContentISR('posts').revalidate;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return <PostContent post={post} />;
}
```

### Conditional Features

```typescript title="components/Header.tsx"
import { isFeatureEnabled } from '@/lib/config';

export function Header() {
  const showSearch = isFeatureEnabled('search');

  return (
    <header>
      <Logo />
      <Navigation />
      {showSearch && <SearchButton />}
    </header>
  );
}
```

### Site Metadata

```typescript title="app/layout.tsx"
import { site } from '@/lib/config';

export const metadata = {
  title: site.name,
  description: site.description,
  metadataBase: site.url ? new URL(site.url) : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Using ISR Configuration

### Basic Usage

```typescript title="app/blog/page.tsx"
import { getContentISR } from '@/lib/config';

// Get full ISR config
const { revalidate, generateStaticParams } = getContentISR('archives');

// Apply revalidation
export { revalidate };

export default async function BlogArchive() {
  const posts = await getAllPosts();
  return <ArchiveLayout posts={posts} />;
}
```

### Dynamic Content Types

```typescript title="app/[contentType]/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

export async function generateStaticParams({ params }: { params: { contentType: string } }) {
  const { generateStaticParams: shouldGenerate } = getContentISR(params.contentType);

  if (!shouldGenerate) {
    return [];
  }

  const items = await getItemsByType(params.contentType);
  return items.map((item) => ({ slug: item.slug }));
}

export default async function ContentPage({
  params,
}: {
  params: { contentType: string; slug: string };
}) {
  const { revalidate } = getContentISR(params.contentType);
  const item = await getItemBySlug(params.contentType, params.slug);

  return <ItemContent item={item} />;
}

// Apply revalidation based on content type
export async function generateMetadata({ params }: { params: { contentType: string } }) {
  const { revalidate } = getContentISR(params.contentType);
  // Use revalidate value as needed
}
```

### Custom Post Types

```typescript title="app/products/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

// Custom post type 'product' configured in flatwp.config.ts
export const revalidate = getContentISR('product').revalidate;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return <ProductDetails product={product} />;
}
```

## Feature Flag Patterns

### Search Feature

```typescript title="components/SearchDialog.tsx"
import { isFeatureEnabled, features } from '@/lib/config';

export function SearchDialog() {
  if (!isFeatureEnabled('search')) {
    return null;
  }

  const provider = features.search.provider;

  if (provider === 'algolia' && features.search.algolia) {
    return <AlgoliaSearch config={features.search.algolia} />;
  }

  return <FuseSearch />;
}
```

### Preview Mode

```typescript title="app/api/preview/route.ts"
import { getPreviewSecret, isFeatureEnabled } from '@/lib/config';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  // Check if preview is enabled
  if (!isFeatureEnabled('preview')) {
    return new Response('Preview mode is disabled', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Verify secret
  if (secret !== getPreviewSecret()) {
    return new Response('Invalid secret', { status: 401 });
  }

  // Enable draft mode
  draftMode().enable();

  // Redirect to preview page
  redirect(`/blog/${slug}`);
}
```

### Analytics Integration

```typescript title="app/layout.tsx"
import { isFeatureEnabled, features } from '@/lib/config';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hasVercelAnalytics = isFeatureEnabled('vercel-analytics');
  const hasGoogleAnalytics = isFeatureEnabled('google-analytics');

  return (
    <html lang="en">
      <body>
        {children}

        {/* Vercel Analytics */}
        {hasVercelAnalytics && <VercelAnalytics />}

        {/* Google Analytics */}
        {hasGoogleAnalytics && features.analytics.google && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${features.analytics.google}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${features.analytics.google}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
```

## WordPress Client Configuration

### Apollo Client

```typescript title="lib/wordpress/client/apollo.ts"
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { wordpress } from '@/lib/config';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: wordpress.graphqlUrl,
    fetchOptions: {
      next: {
        // Default revalidation - can be overridden per query
        revalidate: 60,
      },
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
  },
});
```

### URQL Client

```typescript title="lib/wordpress/client/urql.ts"
import { cacheExchange, createClient, fetchExchange } from 'urql';
import { wordpress } from '@/lib/config';

export const urqlClient = createClient({
  url: wordpress.graphqlUrl,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    next: {
      revalidate: 60,
    },
  },
});
```

## API Routes

### Revalidation Endpoint

```typescript title="app/api/revalidate/route.ts"
import { wordpress } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { secret, paths } = await request.json();

  // Verify secret from config
  if (secret !== wordpress.revalidateSecret) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  // Revalidate all requested paths
  const revalidated: string[] = [];
  for (const path of paths) {
    try {
      await revalidatePath(path);
      revalidated.push(path);
    } catch (error) {
      console.error(`Failed to revalidate ${path}:`, error);
    }
  }

  return Response.json({
    revalidated: true,
    paths: revalidated,
    timestamp: Date.now(),
  });
}
```

### Preview Endpoint

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
  const id = searchParams.get('id');
  const postType = searchParams.get('postType') || 'post';

  // Verify preview secret
  if (secret !== wordpress.previewSecret) {
    return new Response('Invalid secret', { status: 401 });
  }

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  // Fetch post to get slug
  const post = await getPostById(id, postType);

  if (!post) {
    return new Response('Post not found', { status: 404 });
  }

  // Enable draft mode
  draftMode().enable();

  // Redirect to post preview
  const previewUrl = postType === 'page' ? `/${post.slug}` : `/blog/${post.slug}`;
  redirect(previewUrl);
}
```

## SEO Configuration

### Auto-Detect SEO Plugin

```typescript title="lib/wordpress/seo.ts"
import { features } from '@/lib/config';
import { getSeoByUri } from './queries/seo';

export async function getPageSeo(uri: string) {
  const provider = features.seo.provider;

  // Auto-detect from GraphQL schema
  if (provider === 'auto') {
    const seo = await getSeoByUri(uri);

    // Check which SEO data is available
    if (seo?.yoast) {
      return formatYoastSeo(seo.yoast);
    }
    if (seo?.rankMath) {
      return formatRankMathSeo(seo.rankMath);
    }

    return getDefaultSeo();
  }

  // Force specific provider
  if (provider === 'yoast') {
    const seo = await getSeoByUri(uri);
    return seo?.yoast ? formatYoastSeo(seo.yoast) : getDefaultSeo();
  }

  if (provider === 'rankmath') {
    const seo = await getSeoByUri(uri);
    return seo?.rankMath ? formatRankMathSeo(seo.rankMath) : getDefaultSeo();
  }

  // No SEO plugin
  return getDefaultSeo();
}

function getDefaultSeo() {
  return {
    title: site.name,
    description: site.description,
  };
}
```

## Image Optimization

```typescript title="next.config.js"
const { wordpress } = require('./lib/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: wordpress.domain || new URL(wordpress.graphqlUrl).hostname,
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

```typescript title="components/Image.tsx"
import NextImage from 'next/image';
import { wordpress } from '@/lib/config';

interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function Image({ src, alt, width, height }: ImageProps) {
  // Ensure WordPress images use correct domain
  const imageSrc = src.includes(wordpress.domain!)
    ? src
    : src.replace(/^https?:\/\/[^/]+/, `https://${wordpress.domain}`);

  return (
    <NextImage
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
```

## Type-Safe Access

The configuration system provides full TypeScript support:

```typescript
import { config, features } from '@/lib/config';
import type { FlatWPConfig, SearchConfig } from '@flatwp/config';

// Full config type
const fullConfig: FlatWPConfig = config;

// Feature config type
const searchConfig: SearchConfig = features.search;

// Type-safe access
if (features.search.provider === 'algolia') {
  // TypeScript knows algolia config exists
  const { appId, apiKey, indexName } = features.search.algolia!;
}
```

## Error Handling

### Missing Configuration

```typescript
import { wordpress } from '@/lib/config';

export async function getWordPressData() {
  try {
    const response = await fetch(wordpress.graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ posts { nodes { id } } }' }),
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch WordPress data:', error);
    throw error;
  }
}
```

### Feature Validation

```typescript
import { isFeatureEnabled, features } from '@/lib/config';

export function initializeSearch() {
  if (!isFeatureEnabled('search')) {
    console.warn('Search feature is disabled');
    return null;
  }

  const { provider } = features.search;

  if (provider === 'algolia') {
    if (!features.search.algolia) {
      throw new Error('Algolia provider selected but not configured');
    }

    const { appId, apiKey, indexName } = features.search.algolia;

    if (!appId || !apiKey || !indexName) {
      throw new Error('Incomplete Algolia configuration');
    }

    return initializeAlgolia({ appId, apiKey, indexName });
  }

  return initializeFuse();
}
```

## Testing

### Mock Configuration

```typescript title="__tests__/config.test.ts"
import { defineConfig } from '@flatwp/config';

const mockConfig = defineConfig({
  wordpress: {
    graphqlUrl: 'https://test-wordpress.com/graphql',
    revalidateSecret: 'test-secret-1234567890',
  },
  features: {
    preview: false,
    search: {
      enabled: true,
      provider: 'fuse',
    },
  },
});

describe('Configuration', () => {
  it('should have valid WordPress URL', () => {
    expect(mockConfig.wordpress.graphqlUrl).toMatch(/^https?:\/\//);
  });

  it('should have valid revalidation secret', () => {
    expect(mockConfig.wordpress.revalidateSecret.length).toBeGreaterThanOrEqual(16);
  });
});
```

## Best Practices

1. **Centralize Access**: Always import from `lib/config.ts`, not `flatwp.config.ts`
2. **Type Safety**: Use TypeScript types for configuration objects
3. **Feature Checks**: Always check if features are enabled before using them
4. **Environment Validation**: Use `validateEnv()` for required variables
5. **Error Handling**: Handle missing or invalid configuration gracefully
6. **Testing**: Mock configuration in tests for reliability
7. **Documentation**: Document custom configuration patterns

## See Also

- [Configuration Reference](/docs/configuration/reference) - Complete API documentation
- [Environment Variables](/docs/configuration/environment-variables) - Required env vars
- [Rendering Strategies](/docs/configuration/rendering-strategies) - ISR configuration details
- [Getting Started](/docs/configuration/getting-started) - Initial setup guide
