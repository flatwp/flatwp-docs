---
sidebar_position: 6
title: Migration Guide
description: Migrating to the new FlatWP configuration system
---

# Migration Guide

Guide to migrating from older FlatWP configurations to the new centralized configuration system.

## Overview

The new configuration system (`@flatwp/config`) provides:

- **Type Safety**: Zod schema validation with TypeScript types
- **Centralization**: Single source of truth in `flatwp.config.ts`
- **Validation**: Helpful error messages for invalid config
- **Runtime Access**: Convenient utility functions

## Migration Path

### Step 1: Install Package

The `@flatwp/config` package is already included in FlatWP monorepo workspaces. No installation needed.

For standalone projects:

```bash
npm install @flatwp/config
# or
pnpm add @flatwp/config
# or
yarn add @flatwp/config
```

### Step 2: Create Configuration File

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

### Step 3: Update Runtime Config Helper

Create or update `lib/config.ts`:

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
```

### Step 4: Update Page Files

**Before:**
```typescript title="app/blog/[slug]/page.tsx"
// Hard-coded or scattered config
export const revalidate = 60;
```

**After:**
```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

// Centralized, type-safe configuration
export const revalidate = getContentISR('posts').revalidate;
```

### Step 5: Update API Routes

**Before:**
```typescript title="app/api/revalidate/route.ts"
export async function POST(request: Request) {
  const { secret } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid' }, { status: 401 });
  }
  // ...
}
```

**After:**
```typescript title="app/api/revalidate/route.ts"
import { wordpress } from '@/lib/config';

export async function POST(request: Request) {
  const { secret } = await request.json();

  // Type-safe, validated configuration
  if (secret !== wordpress.revalidateSecret) {
    return Response.json({ error: 'Invalid' }, { status: 401 });
  }
  // ...
}
```

## Breaking Changes

### Configuration Structure

**Before (scattered):**
```typescript
// Multiple files with hard-coded values
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const revalidate = 60; // Hard-coded
```

**After (centralized):**
```typescript title="flatwp.config.ts"
export default defineConfig({
  wordpress: {
    graphqlUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL!,
  },
  rendering: {
    posts: {
      revalidate: 60, // Centralized
    },
  },
});
```

### Rendering Configuration

**Before:**
```typescript
// In each page file
export const revalidate = 60;
export const dynamic = 'force-static';
```

**After:**
```typescript title="flatwp.config.ts"
export default defineConfig({
  rendering: {
    posts: {
      strategy: 'isr',
      revalidate: 60,
      generateStaticParams: true,
    },
  },
});
```

```typescript title="app/blog/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

export const revalidate = getContentISR('posts').revalidate;
```

### Environment Variable Validation

**Before (no validation):**
```typescript
const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
// Runtime error if undefined
```

**After (validated):**
```typescript
import { validateEnv } from '@flatwp/config';

const apiUrl = validateEnv(
  'NEXT_PUBLIC_WORDPRESS_API_URL',
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL
);
// Fails fast with helpful error message
```

### Feature Flags

**Before:**
```typescript
const hasPreview = !!process.env.PREVIEW_SECRET;
const hasSearch = true; // Hard-coded
```

**After:**
```typescript title="flatwp.config.ts"
export default defineConfig({
  features: {
    preview: {
      enabled: !!process.env.PREVIEW_SECRET,
    },
    search: {
      enabled: true,
      provider: 'fuse',
    },
  },
});
```

```typescript
import { isFeatureEnabled } from '@/lib/config';

const hasPreview = isFeatureEnabled('preview');
const hasSearch = isFeatureEnabled('search');
```

## Common Migration Scenarios

### Scenario 1: Hard-Coded Revalidation

**Before:**
```typescript title="app/blog/page.tsx"
export const revalidate = 300;

export default async function BlogArchive() {
  // ...
}
```

**After:**

1. Add to configuration:
```typescript title="flatwp.config.ts"
export default defineConfig({
  rendering: {
    archives: {
      strategy: 'isr',
      revalidate: 300,
    },
  },
});
```

2. Update page:
```typescript title="app/blog/page.tsx"
import { getContentISR } from '@/lib/config';

export const revalidate = getContentISR('archives').revalidate;
```

### Scenario 2: Multiple Environment Variables

**Before:**
```typescript title="lib/wordpress.ts"
export const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;
export const WORDPRESS_DOMAIN = process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN!;
export const PREVIEW_SECRET = process.env.PREVIEW_SECRET;
```

**After:**

1. Centralize in config:
```typescript title="flatwp.config.ts"
export default defineConfig({
  wordpress: {
    graphqlUrl: validateEnv(
      'NEXT_PUBLIC_WORDPRESS_API_URL',
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    ),
    domain: process.env.NEXT_PUBLIC_WORDPRESS_DOMAIN,
    previewSecret: process.env.PREVIEW_SECRET,
  },
});
```

2. Update imports:
```typescript title="lib/wordpress.ts"
import { wordpress } from './config';

export const WORDPRESS_URL = wordpress.graphqlUrl;
export const WORDPRESS_DOMAIN = wordpress.domain;
export const PREVIEW_SECRET = wordpress.previewSecret;
```

### Scenario 3: Custom Post Types

**Before:**
```typescript title="app/products/[slug]/page.tsx"
export const revalidate = 300;
export const dynamic = 'force-static';
```

**After:**

1. Add custom type to config:
```typescript title="flatwp.config.ts"
export default defineConfig({
  rendering: {
    custom: {
      product: {
        strategy: 'isr',
        revalidate: 300,
        generateStaticParams: true,
      },
    },
  },
});
```

2. Update page:
```typescript title="app/products/[slug]/page.tsx"
import { getContentISR } from '@/lib/config';

export const revalidate = getContentISR('product').revalidate;
```

### Scenario 4: Feature Toggles

**Before:**
```typescript title="components/Search.tsx"
const SEARCH_ENABLED = process.env.NEXT_PUBLIC_SEARCH_ENABLED === 'true';

export function Search() {
  if (!SEARCH_ENABLED) return null;
  // ...
}
```

**After:**

1. Configure feature:
```typescript title="flatwp.config.ts"
export default defineConfig({
  features: {
    search: {
      enabled: process.env.NEXT_PUBLIC_SEARCH_ENABLED === 'true',
      provider: 'fuse',
    },
  },
});
```

2. Update component:
```typescript title="components/Search.tsx"
import { isFeatureEnabled } from '@/lib/config';

export function Search() {
  if (!isFeatureEnabled('search')) return null;
  // ...
}
```

## Validation Errors

### Common Errors and Fixes

#### Missing Required Variable

**Error:**
```
ConfigError: Missing required environment variable: NEXT_PUBLIC_WORDPRESS_API_URL
Hint: Set NEXT_PUBLIC_WORDPRESS_API_URL in your .env.local file
```

**Fix:**
Add the variable to `.env.local`:
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql
```

#### Invalid URL

**Error:**
```
wordpress.graphqlUrl: Must be a valid URL (e.g., https://example.com)
```

**Fix:**
Ensure URL includes protocol:
```bash
# Wrong
NEXT_PUBLIC_WORDPRESS_API_URL=wordpress.com/graphql

# Right
NEXT_PUBLIC_WORDPRESS_API_URL=https://wordpress.com/graphql
```

#### Short Secret

**Error:**
```
wordpress.revalidateSecret: Must be at least 16 characters (currently 8)
```

**Fix:**
Generate a secure secret:
```bash
openssl rand -base64 32
```

Then add to `.env.local`:
```bash
REVALIDATION_SECRET=your-32-character-secret-here
```

## Testing Migration

### Verify Configuration

```typescript title="scripts/verify-config.ts"
import { validateConfig } from '@flatwp/config';
import config from './flatwp.config';

const result = validateConfig(config);

if (result.success) {
  console.log('✅ Configuration valid');
  console.log('WordPress URL:', result.data?.wordpress.graphqlUrl);
} else {
  console.error('❌ Configuration invalid:');
  result.errors?.forEach((error) => console.error('  -', error));
  process.exit(1);
}
```

Run verification:
```bash
npx tsx scripts/verify-config.ts
```

### Test Runtime Access

```typescript title="__tests__/config.test.ts"
import { config, wordpress, getContentISR } from '@/lib/config';

describe('Configuration', () => {
  it('should load WordPress config', () => {
    expect(wordpress.graphqlUrl).toBeDefined();
    expect(wordpress.graphqlUrl).toMatch(/^https?:\/\//);
  });

  it('should provide ISR config', () => {
    const postsISR = getContentISR('posts');
    expect(postsISR.revalidate).toBeDefined();
  });

  it('should validate secrets', () => {
    expect(wordpress.revalidateSecret.length).toBeGreaterThanOrEqual(16);
  });
});
```

## Rollback Plan

If you need to rollback:

### 1. Keep Old Files Temporarily

Don't delete old configuration files until migration is verified:

```bash
# Rename instead of delete
mv lib/wordpress.config.ts lib/wordpress.config.ts.old
mv lib/rendering.config.ts lib/rendering.config.ts.old
```

### 2. Feature Flag Migration

Roll out gradually using feature flag:

```typescript title="lib/config.ts"
const USE_NEW_CONFIG = process.env.USE_NEW_CONFIG === 'true';

export const config = USE_NEW_CONFIG
  ? newFlatWPConfig
  : oldConfig;
```

### 3. Restore Old Config

If issues arise:

```bash
# Restore old files
mv lib/wordpress.config.ts.old lib/wordpress.config.ts
git checkout lib/config.ts
```

## Post-Migration Checklist

- [ ] Configuration file created (`flatwp.config.ts`)
- [ ] Runtime helper updated (`lib/config.ts`)
- [ ] All pages migrated to use `getContentISR()`
- [ ] API routes use centralized config
- [ ] Environment variables validated
- [ ] Tests updated and passing
- [ ] Development environment tested
- [ ] Staging environment tested
- [ ] Production deployment verified
- [ ] Old configuration files removed
- [ ] Team documentation updated

## Getting Help

If you encounter issues during migration:

1. **Check documentation**: [Configuration Reference](/docs/configuration/reference)
2. **Review examples**: See `apps/web` and `apps/starter` for reference
3. **Validation errors**: Read error messages carefully - they're designed to be helpful
4. **GitHub issues**: Report bugs or ask questions
5. **Discord community**: Get help from other FlatWP users

## See Also

- [Getting Started](/docs/configuration/getting-started) - Setup guide
- [Configuration Reference](/docs/configuration/reference) - Complete API
- [Environment Variables](/docs/configuration/environment-variables) - Env var reference
- [Runtime Usage](/docs/configuration/runtime-usage) - Using config in code
