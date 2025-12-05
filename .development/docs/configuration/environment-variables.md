---
sidebar_position: 5
title: Environment Variables
description: Complete reference for FlatWP environment variables
---

# Environment Variables

Complete guide to environment variables used in FlatWP configuration.

## Overview

FlatWP uses environment variables for:

- WordPress API credentials
- Secret keys for security
- Feature toggles
- Site metadata
- Third-party service keys

:::tip File Location
Create `.env.local` in your app root (not tracked by git) for local development.
:::

## Required Variables

These variables **must** be set for FlatWP to work.

### `NEXT_PUBLIC_WORDPRESS_API_URL`

**Type:** URL
**Example:** `https://cms.example.com/graphql`
**Description:** WordPress GraphQL API endpoint

```bash title=".env.local"
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
```

:::warning Public Variable
The `NEXT_PUBLIC_` prefix exposes this to the browser. Only use for public APIs.
:::

**Setup:**
1. Install WPGraphQL plugin in WordPress
2. Navigate to GraphQL → Settings
3. Copy the GraphQL endpoint URL
4. Paste into `.env.local`

**Validation:**
```typescript
import { validateEnv } from '@flatwp/config';

const graphqlUrl = validateEnv(
  'NEXT_PUBLIC_WORDPRESS_API_URL',
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL
);
```

### `REVALIDATION_SECRET`

**Type:** String (min 16 characters)
**Example:** `your-secure-random-secret-here`
**Description:** Secret key for authenticating revalidation webhooks from WordPress

```bash title=".env.local"
REVALIDATION_SECRET=your-secure-random-secret-here
```

:::danger Security
- **Never** commit this to version control
- Use a cryptographically random string
- Minimum 16 characters required
- Store securely in production (environment secrets)
:::

**Generate Secure Secret:**
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using 1Password/password manager
# Generate 32+ character random password
```

**Configuration:**
1. Generate secure secret
2. Add to `.env.local`
3. Configure same secret in WordPress FlatWP plugin settings

**Validation:**
```typescript
import { validateEnv } from '@flatwp/config';

const revalidateSecret = validateEnv(
  'REVALIDATION_SECRET',
  process.env.REVALIDATION_SECRET
);
```

## Optional Variables

### WordPress Configuration

#### `NEXT_PUBLIC_WORDPRESS_DOMAIN`

**Type:** String (domain name)
**Example:** `cms.example.com`
**Default:** Auto-detected from `NEXT_PUBLIC_WORDPRESS_API_URL`
**Description:** WordPress domain for image optimization

```bash title=".env.local"
NEXT_PUBLIC_WORDPRESS_DOMAIN=cms.example.com
```

Only needed if:
- WordPress domain differs from GraphQL URL
- Using CDN for WordPress images
- Custom image proxy setup

#### `PREVIEW_SECRET`

**Type:** String (min 16 characters)
**Example:** `another-secure-random-secret`
**Description:** Secret key for draft preview mode

```bash title=".env.local"
PREVIEW_SECRET=another-secure-random-secret
```

**When Required:**
- Enabling preview mode in FlatWP
- Allowing editors to preview drafts

**Security:**
- Same security requirements as `REVALIDATION_SECRET`
- Can be the same value but recommend using different secrets
- Configure in WordPress FlatWP plugin settings

### Site Metadata

#### `NEXT_PUBLIC_SITE_URL`

**Type:** URL
**Example:** `https://example.com`
**Description:** Public site URL for SEO and canonical URLs

```bash title=".env.local"
NEXT_PUBLIC_SITE_URL=https://example.com
```

**Used For:**
- Open Graph URLs
- Canonical URLs
- Sitemaps
- Structured data

**Validation:**
```typescript
import { site } from '@/lib/config';

// Must be valid URL if provided
const siteUrl = site.url ? new URL(site.url) : null;
```

#### `NEXT_PUBLIC_SITE_NAME`

**Type:** String
**Example:** `My Awesome Blog`
**Default:** `'FlatWP'`
**Description:** Site name for metadata and branding

```bash title=".env.local"
NEXT_PUBLIC_SITE_NAME=My Awesome Blog
```

**Used For:**
- Page titles (`<title>`)
- Open Graph site name
- Schema.org structured data
- Default branding

#### `NEXT_PUBLIC_SITE_DESCRIPTION`

**Type:** String
**Example:** `The best blog about web development and design`
**Default:** `'A modern headless WordPress site built with Next.js'`
**Description:** Site description for SEO

```bash title=".env.local"
NEXT_PUBLIC_SITE_DESCRIPTION=The best blog about web development and design
```

**Used For:**
- Meta descriptions
- Open Graph descriptions
- Schema.org descriptions
- RSS feed descriptions

### Analytics & Monitoring

#### `NEXT_PUBLIC_VERCEL_ANALYTICS`

**Type:** Boolean string (`'true'` or `'false'`)
**Example:** `true`
**Default:** `false`
**Description:** Enable Vercel Analytics

```bash title=".env.local"
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

**Setup:**
1. Install `@vercel/analytics` package
2. Set variable to `'true'`
3. Deploy to Vercel (auto-configured)

**Usage:**
```typescript
import { isFeatureEnabled } from '@/lib/config';

const analyticsEnabled = isFeatureEnabled('vercel-analytics');
```

#### `NEXT_PUBLIC_GA_ID`

**Type:** String (Google Analytics measurement ID)
**Example:** `G-XXXXXXXXXX`
**Description:** Google Analytics 4 measurement ID

```bash title=".env.local"
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Setup:**
1. Create Google Analytics 4 property
2. Copy measurement ID (starts with `G-`)
3. Add to environment variables

**Validation:**
```typescript
import { features } from '@/lib/config';

if (features.analytics.google) {
  // Initialize Google Analytics
  initializeGA(features.analytics.google);
}
```

#### `NEXT_PUBLIC_SENTRY_DSN`

**Type:** String (Sentry DSN URL)
**Example:** `https://xxx@xxx.ingest.sentry.io/xxx`
**Description:** Sentry error tracking DSN

```bash title=".env.local"
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Setup:**
1. Create Sentry project
2. Copy DSN from project settings
3. Add to environment variables

### Search Configuration

#### Algolia (Pro Feature)

**`NEXT_PUBLIC_ALGOLIA_APP_ID`**

**Type:** String
**Example:** `ABC123XYZ`
**Description:** Algolia application ID

```bash title=".env.local"
NEXT_PUBLIC_ALGOLIA_APP_ID=ABC123XYZ
```

**`NEXT_PUBLIC_ALGOLIA_API_KEY`**

**Type:** String (public search API key)
**Example:** `abc123def456...`
**Description:** Algolia search-only API key

```bash title=".env.local"
NEXT_PUBLIC_ALGOLIA_API_KEY=abc123def456ghi789...
```

:::warning API Key
Use the **search-only** API key, not the admin API key. Search key should:
- Have search-only permissions
- Be safe to expose in client-side code
- Not allow index modifications
:::

**`NEXT_PUBLIC_ALGOLIA_INDEX_NAME`**

**Type:** String
**Example:** `posts`
**Default:** `'posts'`
**Description:** Algolia index name for searching

```bash title=".env.local"
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=posts
```

**Configuration:**
```typescript title="flatwp.config.ts"
export default defineConfig({
  features: {
    search: {
      enabled: true,
      provider: 'algolia',
      algolia: {
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY!,
        indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'posts',
      },
    },
  },
});
```

## Environment-Specific Configuration

### Development (.env.local)

```bash title=".env.local"
# WordPress
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:10004/graphql
REVALIDATION_SECRET=dev-secret-1234567890abcdef
PREVIEW_SECRET=dev-preview-1234567890abcdef

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=FlatWP Dev
NEXT_PUBLIC_SITE_DESCRIPTION=Development environment

# Features (disabled for local dev)
NEXT_PUBLIC_VERCEL_ANALYTICS=false
```

### Staging

```bash title=".env (Vercel/Netlify)"
# WordPress
NEXT_PUBLIC_WORDPRESS_API_URL=https://staging-cms.example.com/graphql
REVALIDATION_SECRET=<secure-random-secret>
PREVIEW_SECRET=<secure-random-secret>

# Site
NEXT_PUBLIC_SITE_URL=https://staging.example.com
NEXT_PUBLIC_SITE_NAME=FlatWP Staging
NEXT_PUBLIC_SITE_DESCRIPTION=Staging environment

# Analytics (test with real IDs)
NEXT_PUBLIC_VERCEL_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-STAGING123
```

### Production

```bash title=".env (Vercel/Netlify)"
# WordPress
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.example.com/graphql
REVALIDATION_SECRET=<strong-random-secret>
PREVIEW_SECRET=<strong-random-secret>

# Site
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_SITE_NAME=My Site
NEXT_PUBLIC_SITE_DESCRIPTION=Production site description

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS=true
NEXT_PUBLIC_GA_ID=G-PRODUCTION123
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Search (if using Algolia)
NEXT_PUBLIC_ALGOLIA_APP_ID=ABC123
NEXT_PUBLIC_ALGOLIA_API_KEY=search-only-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=posts
```

## Validation

### Automatic Validation

FlatWP validates environment variables on startup:

```typescript title="flatwp.config.ts"
import { validateEnv } from '@flatwp/config';

export default defineConfig({
  wordpress: {
    // Throws error if missing or empty
    graphqlUrl: validateEnv(
      'NEXT_PUBLIC_WORDPRESS_API_URL',
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    ),
  },
});
```

### Manual Validation

```typescript
import { validateEnv } from '@flatwp/config';

try {
  const apiUrl = validateEnv('API_URL', process.env.API_URL);
  console.log('API URL:', apiUrl);
} catch (error) {
  console.error('Missing required environment variable:', error.message);
  process.exit(1);
}
```

### Validation Errors

**Missing Variable:**
```
ConfigError: Missing required environment variable: NEXT_PUBLIC_WORDPRESS_API_URL
Hint: Set NEXT_PUBLIC_WORDPRESS_API_URL in your .env.local file
```

**Invalid URL:**
```
❌ FlatWP Configuration Error:

Your flatwp.config.ts has validation errors:

  ➤ wordpress.graphqlUrl:
    Must be a valid URL (e.g., https://example.com)
```

**Short Secret:**
```
❌ FlatWP Configuration Error:

Your flatwp.config.ts has validation errors:

  ➤ wordpress.revalidateSecret:
    Must be at least 16 characters (currently 8)
```

## Platform-Specific Setup

### Vercel

**Environment Variables:**
1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate scope:
   - **Production**: Production deployments
   - **Preview**: Preview deployments
   - **Development**: Local development

**Auto-Populated:**
- `VERCEL` - Automatically set to `'1'`
- `VERCEL_URL` - Deployment URL (can use for `NEXT_PUBLIC_SITE_URL`)

### Netlify

**Environment Variables:**
1. Go to Site Settings → Build & Deploy → Environment
2. Add variables
3. Redeploy to apply changes

**Build Context:**
```toml title="netlify.toml"
[build.environment]
  NEXT_PUBLIC_SITE_URL = "https://example.com"

[context.production.environment]
  NEXT_PUBLIC_WORDPRESS_API_URL = "https://cms.example.com/graphql"

[context.deploy-preview.environment]
  NEXT_PUBLIC_WORDPRESS_API_URL = "https://staging-cms.example.com/graphql"
```

### Railway

**Environment Variables:**
1. Go to Project → Variables
2. Add variables
3. Redeploy service

**Template:**
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=
REVALIDATION_SECRET=
PREVIEW_SECRET=
NEXT_PUBLIC_SITE_URL=
```

### Docker

**Environment File:**
```bash title=".env.docker"
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.example.com/graphql
REVALIDATION_SECRET=your-secret
PREVIEW_SECRET=your-secret
```

**Docker Compose:**
```yaml title="docker-compose.yml"
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.docker
```

## Security Best Practices

### Secret Management

1. **Never commit secrets** to version control
   - Add `.env.local` to `.gitignore`
   - Use `.env.example` for documentation

2. **Use environment-specific secrets**
   - Different secrets for dev/staging/production
   - Rotate secrets periodically

3. **Minimum secret length**
   - At least 16 characters
   - Recommend 32+ characters
   - Use cryptographically random generation

4. **Secure storage**
   - Use platform secret management (Vercel, Netlify, etc.)
   - Never share secrets in plain text
   - Use encrypted secret management tools

### Public vs Private Variables

**Public Variables** (`NEXT_PUBLIC_*`):
- Exposed to browser
- Safe to use for public APIs
- Can be seen in browser DevTools
- Examples: GraphQL URL, site URL

**Private Variables** (no prefix):
- Server-side only
- Never exposed to browser
- Use for secrets and API keys
- Examples: `REVALIDATION_SECRET`, admin API keys

:::danger Never Expose Secrets
Never use `NEXT_PUBLIC_` prefix for:
- API secrets
- Authentication tokens
- Admin credentials
- Private keys
:::

## Troubleshooting

### Variables Not Loading

**Problem:** Environment variables show as `undefined`

**Solutions:**
1. Restart dev server after changing `.env.local`
2. Check variable name spelling (case-sensitive)
3. Verify `.env.local` is in app root
4. Ensure no trailing spaces in variable values

### Public Variables Not Available

**Problem:** `NEXT_PUBLIC_*` variables undefined in browser

**Solutions:**
1. Ensure `NEXT_PUBLIC_` prefix is present
2. Restart dev server (required for new variables)
3. Check browser console for value
4. Rebuild production build

### Validation Errors

**Problem:** Configuration validation fails on startup

**Solutions:**
1. Read error message carefully
2. Check all required variables are set
3. Verify URLs are valid (include `https://`)
4. Ensure secrets are at least 16 characters
5. Check for typos in variable names

## Example Files

### `.env.example`

Create this file for documentation (committed to git):

```bash title=".env.example"
# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_WORDPRESS_DOMAIN=your-wordpress-site.com

# Secrets (generate secure random strings)
REVALIDATION_SECRET=your-secure-secret-min-16-chars
PREVIEW_SECRET=your-preview-secret-min-16-chars

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS=false
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Search - Algolia (Pro feature, optional)
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_API_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=posts
```

### `.gitignore`

Ensure environment files are ignored:

```bash title=".gitignore"
# Environment variables
.env
.env.local
.env.*.local
.env.production

# Keep example file
!.env.example
```

## See Also

- [Getting Started](/docs/configuration/getting-started) - Initial setup
- [Configuration Reference](/docs/configuration/reference) - Complete config API
- [Runtime Usage](/docs/configuration/runtime-usage) - Using env vars in code
- [Security Best Practices](/docs/security/overview) - Security guidelines
