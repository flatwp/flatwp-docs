---
sidebar_position: 1
slug: /configuration
title: Configuration
description: FlatWP configuration system overview
---

# Configuration System

FlatWP provides a centralized, type-safe configuration system for managing WordPress connections, rendering strategies, features, and site metadata.

## Key Features

- **Type Safety**: Full TypeScript support with Zod schema validation
- **Centralized**: Single source of truth in `flatwp.config.ts`
- **Validated**: Automatic validation with helpful error messages
- **Runtime Access**: Convenient utility functions throughout your app
- **Environment Variables**: Automatic validation and parsing

## Quick Start

### 1. Create Configuration

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

```bash title=".env.local"
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.example.com/graphql
REVALIDATION_SECRET=your-secure-random-secret
```

### 3. Use in Your App

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

export const revalidate = getContentISR('posts').revalidate;

export default async function BlogPost({ params }: { params: { slug: string } }) {
  // Your page implementation
}
```

## What You Can Configure

### WordPress Connection

- GraphQL API endpoint
- WordPress domain for images
- Revalidation webhook secret
- Preview mode secret

### Rendering Strategies

Configure how different content types are rendered:

- **Posts**: ISR with on-demand revalidation
- **Pages**: Static generation
- **Archives**: ISR with time-based revalidation
- **Homepage**: ISR with short revalidation
- **Custom Types**: Your own post types

### Features

Enable/disable and configure features:

- **Preview Mode**: Draft content preview
- **Search**: Client-side (Fuse.js) or server-side (Algolia)
- **SEO**: Auto-detect Yoast/RankMath
- **Analytics**: Vercel, Google Analytics, Sentry

### Site Metadata

- Site URL for canonical URLs and SEO
- Site name for branding
- Site description for metadata

## Configuration Options

### Rendering Strategies

Three strategies available for content:

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **static** | Generated at build time | Rarely-changing content |
| **isr** | Static with revalidation | Most WordPress content |
| **ssr** | Server-rendered per request | Real-time data |

### Revalidation Options

Control when content updates:

- **`false`** - On-demand only (via WordPress webhook)
- **`true`** - Default (60 seconds)
- **`number`** - Custom interval in seconds

### Feature Flags

```typescript
features: {
  preview: true,              // Enable preview mode
  search: {
    enabled: true,
    provider: 'fuse',          // or 'algolia'
  },
  seo: {
    provider: 'auto',          // or 'yoast', 'rankmath', 'none'
  },
  analytics: {
    vercel: true,
    google: 'G-XXXXXXXXXX',
    sentry: 'https://...',
  },
}
```

## Documentation

### Getting Started
Learn the basics of FlatWP configuration.

[Get Started →](/docs/configuration/getting-started)

### Configuration Reference
Complete API reference for all configuration options.

[View Reference →](/docs/configuration/reference)

### Rendering Strategies
Deep dive into static, ISR, and SSR rendering.

[Learn More →](/docs/configuration/rendering-strategies)

### Runtime Usage
How to access and use configuration in your app.

[See Examples →](/docs/configuration/runtime-usage)

### Environment Variables
Complete reference for environment variables.

[View Variables →](/docs/configuration/environment-variables)

### Migration Guide
Migrate from older configuration approaches.

[Migration Guide →](/docs/configuration/migration)

## Examples

### Basic Configuration

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

### Advanced Configuration

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
    previewSecret: process.env.PREVIEW_SECRET,
  },

  rendering: {
    posts: {
      strategy: 'isr',
      revalidate: false, // On-demand via webhook
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
    custom: {
      product: {
        strategy: 'isr',
        revalidate: 300,
        generateStaticParams: true,
      },
    },
  },

  features: {
    preview: {
      enabled: !!process.env.PREVIEW_SECRET,
    },
    search: {
      enabled: true,
      provider: 'algolia',
      algolia: {
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
        indexName: 'posts',
      },
    },
    seo: {
      provider: 'auto',
    },
    analytics: {
      vercel: true,
      google: process.env.NEXT_PUBLIC_GA_ID,
      sentry: process.env.NEXT_PUBLIC_SENTRY_DSN,
    },
  },

  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: 'My Awesome Site',
    description: 'The best blog about web development',
  },
});
```

### Runtime Usage

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
  switch (feature) {
    case 'preview':
      return typeof config.features.preview === 'boolean'
        ? config.features.preview
        : config.features.preview.enabled;
    case 'search':
      return config.features.search.enabled;
    default:
      return false;
  }
}
```

## Benefits

### Type Safety

Full TypeScript support with auto-completion:

```typescript
import { config } from '@/lib/config';

// TypeScript knows all available properties
const url = config.wordpress.graphqlUrl; // ✓ string
const provider = config.features.search.provider; // ✓ 'fuse' | 'algolia'
```

### Validation

Automatic validation with helpful errors:

```typescript
// Missing required variable
❌ Missing required environment variable: NEXT_PUBLIC_WORDPRESS_API_URL
Hint: Set NEXT_PUBLIC_WORDPRESS_API_URL in your .env.local file

// Invalid URL
❌ wordpress.graphqlUrl: Must be a valid URL (e.g., https://example.com)

// Short secret
❌ wordpress.revalidateSecret: Must be at least 16 characters (currently 8)
```

### Centralization

Single source of truth:

```typescript
// Before: scattered configuration
const url = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const revalidate = 60; // Hard-coded in multiple files

// After: centralized
import { wordpress, getContentISR } from '@/lib/config';
const url = wordpress.graphqlUrl;
const revalidate = getContentISR('posts').revalidate;
```

## Best Practices

1. **Use `validateEnv()`** for required environment variables
2. **Centralize all config** in `flatwp.config.ts`
3. **Access via utilities** in `lib/config.ts`
4. **Type everything** - leverage TypeScript support
5. **Validate early** - configuration errors fail fast at startup
6. **Document custom types** - add comments for custom post types
7. **Test configuration** - verify in staging before production

## Troubleshooting

### Configuration Errors

If you see validation errors:

1. Read the error message carefully - they're designed to be helpful
2. Check environment variables are set correctly
3. Verify URLs include protocol (`https://`)
4. Ensure secrets are at least 16 characters
5. Review the configuration reference for correct syntax

### Missing Features

If features aren't working:

1. Check feature is enabled in config
2. Verify required environment variables are set
3. Check `isFeatureEnabled()` returns true
4. Review feature-specific documentation

### Runtime Access

If configuration values are undefined:

1. Import from `lib/config.ts`, not `flatwp.config.ts`
2. Check TypeScript types match expected values
3. Verify configuration is valid (no startup errors)
4. Use utility functions instead of direct access

## Next Steps

- [Getting Started](/docs/configuration/getting-started) - Set up configuration
- [Configuration Reference](/docs/configuration/reference) - Explore all options
- [Rendering Strategies](/docs/configuration/rendering-strategies) - Optimize performance
- [Environment Variables](/docs/configuration/environment-variables) - Configure env vars
