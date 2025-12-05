---
sidebar_position: 1
title: Getting Started
description: Quick start guide for FlatWP configuration
---

# Getting Started with FlatWP Configuration

FlatWP uses a centralized, type-safe configuration system that makes it easy to configure WordPress connection, rendering strategies, features, and site metadata.

## Overview

The configuration system provides:

- **Type Safety**: Full TypeScript support with Zod validation
- **Centralized Settings**: Single source of truth in `flatwp.config.ts`
- **Environment Variables**: Automatic validation of required env vars
- **Runtime Access**: Type-safe configuration access throughout your app
- **Helpful Errors**: Clear validation messages when configuration is invalid

## Quick Start

### 1. Create Configuration File

Create `flatwp.config.ts` in your app root:

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
});
```

### 2. Set Environment Variables

Create `.env.local` with your WordPress credentials:

```bash title=".env.local"
# WordPress GraphQL endpoint
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql

# Secret for revalidation webhooks (min 16 characters)
REVALIDATION_SECRET=your-secure-random-secret-here

# Optional: Preview mode secret
PREVIEW_SECRET=another-secure-random-secret

# Optional: Site metadata
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
```

:::tip
Generate secure secrets using:
```bash
openssl rand -base64 32
```
:::

### 3. Create Runtime Config Helper

Create `lib/config.ts` to access configuration in your app:

```typescript title="lib/config.ts"
import flatwpConfig from '../flatwp.config';
import { getISRConfig } from '@flatwp/config';

// Export validated config
export const config = flatwpConfig;

// Convenience exports
export const wordpress = config.wordpress;
export const features = config.features;
export const site = config.site;

// Get ISR configuration for content types
export function getContentISR(contentType: string) {
  return getISRConfig(config, contentType);
}

// Check if features are enabled
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

### 4. Use in Your Pages

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

// Apply ISR settings from config
export const revalidate = getContentISR('posts').revalidate;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Your page implementation
}
```

## Minimal Configuration

The absolute minimum configuration requires only WordPress connection settings:

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
});
```

All other settings will use sensible defaults:
- Posts: ISR with on-demand revalidation
- Pages: Static generation
- Archives: ISR with 5-minute revalidation
- Homepage: ISR with 1-minute revalidation
- Preview: Enabled if `PREVIEW_SECRET` is set
- Search: Client-side with Fuse.js
- SEO: Auto-detect Yoast/RankMath

## Typical Configuration

A more complete configuration for a production site:

```typescript title="flatwp.config.ts"
import { defineConfig, validateEnv } from '@flatwp/config';

export default defineConfig({
  // WordPress Connection
  wordpress: {
    graphqlUrl: validateEnv(
      'NEXT_PUBLIC_WORDPRESS_API_URL',
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    ),
    domain: process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN,
    revalidateSecret: validateEnv(
      'REVALIDATION_SECRET',
      process.env.REVALIDATION_SECRET
    ),
    previewSecret: process.env.PREVIEW_SECRET,
  },

  // Rendering Strategies
  rendering: {
    posts: {
      strategy: 'isr',
      revalidate: false, // On-demand revalidation via webhook
      generateStaticParams: true,
    },
    pages: {
      strategy: 'static',
      revalidate: false,
      generateStaticParams: true,
    },
    archives: {
      strategy: 'isr',
      revalidate: 300, // 5 minutes
      generateStaticParams: true,
    },
    homepage: {
      strategy: 'isr',
      revalidate: 60, // 1 minute
      generateStaticParams: false,
    },
  },

  // Features
  features: {
    preview: {
      enabled: !!process.env.PREVIEW_SECRET,
    },
    search: {
      enabled: true,
      provider: 'fuse',
    },
    seo: {
      provider: 'auto', // Auto-detect from WordPress
    },
    analytics: {
      vercel: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true',
      google: process.env.NEXT_PUBLIC_GA_ID,
    },
  },

  // Site Metadata
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'My Site',
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      'A modern headless WordPress site',
  },
});
```

## Validation

The configuration is validated when your app starts. If there are errors, you'll see helpful messages:

```
❌ FlatWP Configuration Error:

Your flatwp.config.ts has validation errors:

  ➤ wordpress.graphqlUrl:
    Must be a valid URL (e.g., https://example.com)

  ➤ wordpress.revalidateSecret:
    Must be at least 16 characters (currently 8)

💡 Tips:
  • Check your environment variables are set correctly
  • Ensure all required fields have values
  • Verify URLs are valid and secrets are at least 16 characters

📖 Documentation: https://flatwp.com/docs/configuration
```

## Next Steps

- [Configuration Reference](/docs/configuration/reference) - Complete API documentation
- [Rendering Strategies](/docs/configuration/rendering-strategies) - Deep dive into SSG, ISR, and SSR
- [Environment Variables](/docs/configuration/environment-variables) - Full list of supported variables
- [Runtime Usage](/docs/configuration/runtime-usage) - Using config in your app code
