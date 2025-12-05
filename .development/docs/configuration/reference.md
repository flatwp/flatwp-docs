---
sidebar_position: 2
title: Configuration Reference
description: Complete API reference for FlatWP configuration
---

# Configuration Reference

Complete reference for all FlatWP configuration options.

## Configuration Structure

```typescript
export default defineConfig({
  wordpress: { /* ... */ },
  rendering: { /* ... */ },
  features: { /* ... */ },
  site: { /* ... */ },
});
```

## WordPress Connection

Configure WordPress GraphQL endpoint and authentication.

### `wordpress.graphqlUrl`

**Type:** `string` (URL)
**Required:** Yes
**Example:** `https://cms.example.com/graphql`

WordPress GraphQL API endpoint. Must be a valid URL.

```typescript
wordpress: {
  graphqlUrl: 'https://cms.example.com/graphql',
}
```

:::tip
Use `validateEnv()` helper to ensure environment variables are set:
```typescript
graphqlUrl: validateEnv(
  'NEXT_PUBLIC_WORDPRESS_API_URL',
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL
),
```
:::

### `wordpress.domain`

**Type:** `string`
**Required:** No
**Default:** Auto-detected from `graphqlUrl`
**Example:** `cms.example.com`

WordPress domain for image optimization. If not provided, automatically extracted from `graphqlUrl`.

```typescript
wordpress: {
  domain: 'cms.example.com',
}
```

### `wordpress.revalidateSecret`

**Type:** `string` (min 16 characters)
**Required:** Yes
**Example:** `your-secure-random-secret`

Secret token for authenticating revalidation webhook requests from WordPress.

```typescript
wordpress: {
  revalidateSecret: validateEnv(
    'REVALIDATION_SECRET',
    process.env.REVALIDATION_SECRET
  ),
}
```

:::warning Security
Never commit secrets to version control. Always use environment variables.
:::

### `wordpress.previewSecret`

**Type:** `string` (min 16 characters)
**Required:** No
**Example:** `another-secure-secret`

Secret token for draft preview mode. Required if preview feature is enabled.

```typescript
wordpress: {
  previewSecret: process.env.PREVIEW_SECRET,
}
```

## Rendering Strategies

Configure how different content types are rendered and cached.

### Strategy Types

Each content type can use one of three strategies:

- **`static`** - Static Site Generation (SSG): Generated at build time, never revalidated
- **`isr`** - Incremental Static Regeneration: Static pages that can be revalidated
- **`ssr`** - Server-Side Rendering: Rendered on every request

### Common Properties

All rendering configurations support:

```typescript
{
  strategy: 'static' | 'isr' | 'ssr',
  revalidate?: number | boolean,
  generateStaticParams?: boolean,
}
```

#### `strategy`

**Type:** `'static' | 'isr' | 'ssr'`
**Default:** `'isr'`

Rendering strategy to use.

#### `revalidate`

**Type:** `number | boolean | undefined`

- **`false`** - On-demand revalidation only (no automatic revalidation)
- **`true`** - Default revalidation (60 seconds)
- **`number`** - Revalidation interval in seconds
- **`undefined`** - Use Next.js default

```typescript
revalidate: false,     // On-demand only
revalidate: true,      // Every 60 seconds
revalidate: 300,       // Every 5 minutes
revalidate: undefined, // Next.js default
```

#### `generateStaticParams`

**Type:** `boolean`
**Default:** `true`

Whether to generate static params at build time using `generateStaticParams()`.

### `rendering.posts`

**Default:**
```typescript
posts: {
  strategy: 'isr',
  revalidate: false, // On-demand only via webhook
  generateStaticParams: true,
}
```

Blog post rendering configuration.

**Typical configurations:**

```typescript
// On-demand revalidation (recommended)
posts: {
  strategy: 'isr',
  revalidate: false, // WordPress webhook triggers revalidation
  generateStaticParams: true,
}

// Time-based revalidation
posts: {
  strategy: 'isr',
  revalidate: 300, // Revalidate every 5 minutes
  generateStaticParams: true,
}

// Fully static (fastest, but requires rebuild for updates)
posts: {
  strategy: 'static',
  revalidate: false,
  generateStaticParams: true,
}
```

### `rendering.pages`

**Default:**
```typescript
pages: {
  strategy: 'static',
  revalidate: false,
  generateStaticParams: true,
}
```

Static page rendering configuration.

**Typical configurations:**

```typescript
// Fully static (recommended for pages)
pages: {
  strategy: 'static',
  revalidate: false,
  generateStaticParams: true,
}

// ISR with on-demand revalidation
pages: {
  strategy: 'isr',
  revalidate: false,
  generateStaticParams: true,
}
```

### `rendering.archives`

**Default:**
```typescript
archives: {
  strategy: 'isr',
  revalidate: 300, // 5 minutes
  generateStaticParams: true,
}
```

Archive page rendering (blog index, categories, tags).

**Typical configurations:**

```typescript
// Time-based ISR (recommended)
archives: {
  strategy: 'isr',
  revalidate: 300, // 5 minutes
  generateStaticParams: true,
}

// Shorter revalidation for active blogs
archives: {
  strategy: 'isr',
  revalidate: 60, // 1 minute
  generateStaticParams: true,
}

// Server-side rendering for real-time updates
archives: {
  strategy: 'ssr',
  generateStaticParams: false,
}
```

### `rendering.homepage`

**Default:**
```typescript
homepage: {
  strategy: 'isr',
  revalidate: 60, // 1 minute
  generateStaticParams: false,
}
```

Homepage rendering configuration.

**Typical configurations:**

```typescript
// Short ISR for fresh content
homepage: {
  strategy: 'isr',
  revalidate: 60,
  generateStaticParams: false,
}

// Static homepage
homepage: {
  strategy: 'static',
  revalidate: false,
  generateStaticParams: false,
}

// Real-time SSR
homepage: {
  strategy: 'ssr',
  generateStaticParams: false,
}
```

### `rendering.custom`

**Type:** `Record<string, RenderingStrategy>`
**Required:** No

Custom post type rendering configurations.

```typescript
rendering: {
  // ... standard types
  custom: {
    // WooCommerce products
    product: {
      strategy: 'isr',
      revalidate: 300,
      generateStaticParams: true,
    },

    // Team members
    team: {
      strategy: 'static',
      revalidate: false,
      generateStaticParams: true,
    },

    // Events (time-sensitive)
    event: {
      strategy: 'isr',
      revalidate: 60,
      generateStaticParams: true,
    },
  },
}
```

## Features

Feature flags and integrations.

### `features.preview`

**Type:** `boolean | PreviewConfig`
**Default:** `true`

Draft preview mode configuration.

**Simple (boolean):**
```typescript
features: {
  preview: true, // Enabled
  preview: false, // Disabled
}
```

**Advanced (object):**
```typescript
features: {
  preview: {
    enabled: true,
    secret: 'custom-preview-secret', // Override wordpress.previewSecret
  },
}
```

### `features.search`

**Type:** `SearchConfig`
**Default:**
```typescript
search: {
  enabled: true,
  provider: 'fuse',
}
```

Search functionality configuration.

**Client-side search (Fuse.js):**
```typescript
features: {
  search: {
    enabled: true,
    provider: 'fuse',
  },
}
```

**Server-side search (Algolia - Pro):**
```typescript
features: {
  search: {
    enabled: true,
    provider: 'algolia',
    algolia: {
      appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
      apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
      indexName: 'posts',
    },
  },
}
```

**Disable search:**
```typescript
features: {
  search: {
    enabled: false,
    provider: 'fuse',
  },
}
```

#### Search Properties

- **`enabled`** (`boolean`) - Enable/disable search functionality
- **`provider`** (`'fuse' | 'algolia'`) - Search provider
- **`algolia`** (`object`, optional) - Algolia configuration
  - **`appId`** (`string`) - Algolia application ID
  - **`apiKey`** (`string`) - Algolia search API key (public)
  - **`indexName`** (`string`) - Index name

### `features.seo`

**Type:** `SEOConfig`
**Default:**
```typescript
seo: {
  provider: 'auto',
}
```

SEO plugin integration.

**Auto-detect:**
```typescript
features: {
  seo: {
    provider: 'auto', // Detect Yoast or RankMath
  },
}
```

**Specific provider:**
```typescript
features: {
  seo: {
    provider: 'yoast', // Force Yoast SEO
    // OR
    provider: 'rankmath', // Force RankMath
    // OR
    provider: 'none', // Disable SEO plugin integration
  },
}
```

#### SEO Providers

- **`auto`** - Automatically detect Yoast or RankMath from GraphQL schema
- **`yoast`** - Force Yoast SEO integration
- **`rankmath`** - Force RankMath integration
- **`none`** - Disable SEO plugin integration (use custom implementation)

### `features.analytics`

**Type:** `AnalyticsConfig`
**Default:**
```typescript
analytics: {
  vercel: false,
}
```

Analytics and monitoring integrations.

```typescript
features: {
  analytics: {
    // Vercel Analytics
    vercel: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true',

    // Google Analytics
    google: process.env.NEXT_PUBLIC_GA_ID,

    // Sentry error tracking
    sentry: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
}
```

#### Analytics Properties

- **`vercel`** (`boolean`) - Enable Vercel Analytics
- **`google`** (`string`, optional) - Google Analytics measurement ID (e.g., `G-XXXXXXXXXX`)
- **`sentry`** (`string`, optional) - Sentry DSN for error tracking

## Site Metadata

Site-wide metadata configuration.

### `site.url`

**Type:** `string` (URL)
**Required:** No
**Example:** `https://example.com`

Public site URL. Used for SEO, sitemaps, and canonical URLs.

```typescript
site: {
  url: process.env.NEXT_PUBLIC_SITE_URL,
}
```

### `site.name`

**Type:** `string`
**Required:** No
**Default:** `'FlatWP'`

Site name for metadata and branding.

```typescript
site: {
  name: 'My Awesome Site',
}
```

### `site.description`

**Type:** `string`
**Required:** No
**Default:** `'A modern headless WordPress site built with Next.js'`

Site description for SEO metadata.

```typescript
site: {
  description: 'The best blog about web development',
}
```

## Type Definitions

### `FlatWPConfig`

Complete configuration object type.

```typescript
interface FlatWPConfig {
  wordpress: {
    graphqlUrl: string;
    domain?: string;
    revalidateSecret: string;
    previewSecret?: string;
  };
  rendering: {
    posts: RenderingStrategy;
    pages: RenderingStrategy;
    archives: RenderingStrategy;
    homepage: RenderingStrategy;
    custom?: Record<string, RenderingStrategy>;
  };
  features: {
    preview: boolean | PreviewConfig;
    search: SearchConfig;
    seo: SEOConfig;
    analytics: AnalyticsConfig;
  };
  site?: {
    url?: string;
    name?: string;
    description?: string;
  };
}
```

### `RenderingStrategy`

Rendering strategy configuration.

```typescript
interface RenderingStrategy {
  strategy: 'static' | 'isr' | 'ssr';
  revalidate?: number | boolean;
  generateStaticParams?: boolean;
}
```

### `PreviewConfig`

Preview mode configuration.

```typescript
type PreviewConfig = boolean | {
  enabled: boolean;
  secret?: string;
};
```

### `SearchConfig`

Search configuration.

```typescript
interface SearchConfig {
  enabled: boolean;
  provider: 'fuse' | 'algolia';
  algolia?: {
    appId: string;
    apiKey: string;
    indexName: string;
  };
}
```

### `SEOConfig`

SEO configuration.

```typescript
interface SEOConfig {
  provider: 'auto' | 'yoast' | 'rankmath' | 'none';
}
```

### `AnalyticsConfig`

Analytics configuration.

```typescript
interface AnalyticsConfig {
  vercel: boolean;
  google?: string;
  sentry?: string;
}
```

## API Functions

### `defineConfig(config)`

Define and validate FlatWP configuration.

**Signature:**
```typescript
function defineConfig(config: UserConfig): FlatWPConfig
```

**Parameters:**
- `config` - User configuration object (partial, only `wordpress` required)

**Returns:**
- Validated and type-safe `FlatWPConfig` with defaults applied

**Throws:**
- `Error` if configuration validation fails

**Example:**
```typescript
import { defineConfig } from '@flatwp/config';

export default defineConfig({
  wordpress: {
    graphqlUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL!,
    revalidateSecret: process.env.REVALIDATION_SECRET!,
  },
});
```

### `validateConfig(config)`

Validate configuration without throwing errors.

**Signature:**
```typescript
function validateConfig(config: UserConfig): {
  success: boolean;
  data?: FlatWPConfig;
  errors?: string[];
}
```

**Parameters:**
- `config` - User configuration object

**Returns:**
- Object with validation result

**Example:**
```typescript
import { validateConfig } from '@flatwp/config';

const result = validateConfig(myConfig);

if (result.success) {
  console.log('Config valid:', result.data);
} else {
  console.error('Config invalid:', result.errors);
}
```

### `validateEnv(name, value)`

Validate required environment variables.

**Signature:**
```typescript
function validateEnv(varName: string, value: string | undefined): string
```

**Parameters:**
- `varName` - Environment variable name
- `value` - Environment variable value

**Returns:**
- The validated value

**Throws:**
- `ConfigError` if value is missing or empty

**Example:**
```typescript
import { validateEnv } from '@flatwp/config';

const apiUrl = validateEnv(
  'NEXT_PUBLIC_WORDPRESS_API_URL',
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL
);
```

### `getISRConfig(config, contentType)`

Get ISR configuration for a content type.

**Signature:**
```typescript
function getISRConfig(
  config: FlatWPConfig,
  contentType: string
): {
  revalidate: number | false | undefined;
  generateStaticParams: boolean;
}
```

**Parameters:**
- `config` - FlatWP configuration object
- `contentType` - Content type key (e.g., `'posts'`, `'pages'`, `'product'`)

**Returns:**
- ISR configuration with Next.js-compatible values

**Example:**
```typescript
import { getISRConfig } from '@flatwp/config';
import config from './flatwp.config';

const postsISR = getISRConfig(config, 'posts');
export const revalidate = postsISR.revalidate;
```

### `getRevalidateValue(revalidate)`

Convert config revalidate value to Next.js format.

**Signature:**
```typescript
function getRevalidateValue(
  revalidate: number | boolean | undefined
): number | false | undefined
```

**Parameters:**
- `revalidate` - Config revalidate value

**Returns:**
- Next.js revalidate value

**Example:**
```typescript
import { getRevalidateValue } from '@flatwp/config';

getRevalidateValue(false);      // false (on-demand only)
getRevalidateValue(true);       // 60 (default)
getRevalidateValue(300);        // 300 (custom)
getRevalidateValue(undefined);  // undefined (Next.js default)
```

## See Also

- [Getting Started](/docs/configuration/getting-started) - Quick start guide
- [Rendering Strategies](/docs/configuration/rendering-strategies) - Deep dive into rendering
- [Environment Variables](/docs/configuration/environment-variables) - Full env var reference
- [Runtime Usage](/docs/configuration/runtime-usage) - Using config in your code
