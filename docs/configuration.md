---
sidebar_position: 4
---

# Configuration

Configure FlatWP for your WordPress site and deployment environment.

## Environment Variables

### Required Variables

Create a `.env.local` file in your project root:

```env
# WordPress GraphQL endpoint (required)
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql

# Your site's public URL (required)
NEXT_PUBLIC_SITE_URL=https://your-site.com

# Webhook secret for cache revalidation (required)
REVALIDATION_SECRET=your-random-secret-here

# Preview mode secret (required)
PREVIEW_SECRET=another-random-secret
```

:::tip Generate Secure Secrets
```bash
# macOS/Linux
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
:::

### Optional Variables

```env
# Email integration (Resend)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yoursite.com
RESEND_AUDIENCE_EMAIL=aud_your_audience_id

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto-generated-by-vercel

# Debug logging
DEBUG=false
```

## Rendering Strategy Configuration

Configure how different content types are rendered in `config/rendering-strategy.ts`:

```typescript
export const renderingStrategy = {
  // Static pages - never revalidate
  staticPages: {
    revalidate: false,
    paths: ['/about', '/contact', '/privacy']
  },

  // Blog posts - on-demand revalidation only
  posts: {
    revalidate: false, // On-demand via webhook
    fallback: 'blocking'
  },

  // Archive pages - time-based revalidation
  archives: {
    revalidate: 300, // 5 minutes
    fallback: 'blocking'
  },

  // Homepage - short revalidation
  homepage: {
    revalidate: 60 // 1 minute
  }
};
```

### Rendering Options

**`revalidate: false`**
- Never revalidates automatically
- Use for on-demand revalidation via webhooks
- Best for content updated through WordPress

**`revalidate: number`**
- Time-based revalidation in seconds
- Use for frequently changing content
- Balances freshness with performance

**`fallback: 'blocking'`**
- Server-side render new pages on first request
- Subsequent requests use cached version
- Use with `generateStaticParams()` for ISR

**`fallback: true`**
- Show fallback page while generating
- Then show full page when ready
- Better UX for slow-loading pages

## WordPress Configuration

### Install WPGraphQL Plugin

1. Log in to WordPress admin
2. Navigate to **Plugins → Add New**
3. Search for "WPGraphQL"
4. Install and activate

### Install FlatWP Companion Plugin

1. Download from [GitHub](https://github.com/flatwp/flatwp-plugin/releases)
2. Upload to **Plugins → Add New → Upload Plugin**
3. Activate the plugin

### Configure FlatWP Settings

Navigate to **Settings → FlatWP** in WordPress admin:

#### Connection Settings
```
Next.js Site URL: http://localhost:3000
                  (or your production URL)

Revalidation Secret: [Same as in .env.local]
                     (must match REVALIDATION_SECRET)

Enable Webhooks: ✓ Checked
```

#### Cache Revalidation
```
Auto-revalidate on:
✓ Post published
✓ Post updated
✓ Post deleted
✓ Featured image changed
```

#### Preview Mode
```
Enable Preview Mode: ✓ Checked
Preview Token Expiry: 3600 seconds (1 hour)
```

## Next.js Configuration

### next.config.ts

Essential configuration options:

```typescript
import type { NextConfig } from 'next';

const config: NextConfig = {
  // Enable strict mode
  reactStrictMode: true,

  // Image optimization for WordPress
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-wordpress-site.com',
        pathname: '/wp-content/uploads/**'
      }
    ],
    formats: ['image/avif', 'image/webp']
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/wp-admin',
        destination: 'https://your-wordpress-site.com/wp-admin',
        permanent: false
      }
    ];
  }
};

export default config;
```

### TypeScript Configuration

Extend the shared config in `tsconfig.json`:

```json
{
  "extends": "./node_modules/@flatwp/typescript-config/next.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

## GraphQL Configuration

### Code Generation

Configure GraphQL Code Generator in `codegen.ts`:

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
  documents: ['graphql/**/*.graphql'],
  generates: {
    './graphql/generated/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    }
  }
};

export default config;
```

### Generate Types

Run after adding or modifying queries:

```bash
npm run graphql:codegen
```

## TailwindCSS Configuration

Customize your theme in `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*',
    './components/**/*'
  ],
  theme: {
    extend: {
      colors: {
        // Your brand colors
        primary: '#f97316',
        secondary: '#0f172a'
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
};

export default config;
```

## API Routes Configuration

### Revalidation Endpoint

`app/api/revalidate/route.ts`:

```typescript
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Verify secret
  if (body.secret !== process.env.REVALIDATION_SECRET) {
    return Response.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }

  // Revalidate paths
  for (const path of body.paths) {
    revalidatePath(path);
  }

  return Response.json({ revalidated: true });
}
```

### Preview Endpoint

`app/api/preview/route.ts`:

```typescript
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const id = searchParams.get('id');

  // Verify secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return Response.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Enable draft mode
  draftMode().enable();

  // Redirect to post
  redirect(`/blog/${id}`);
}
```

## Deployment Configuration

### Vercel

Add `vercel.json` to your project root:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Environment Variables in Vercel

Set in Vercel Dashboard → Settings → Environment Variables:

1. All required variables from `.env.local`
2. Production values (not localhost URLs)
3. Apply to Production, Preview, and Development

## WordPress Optimization

### Recommended Plugins

**Required**:
- WPGraphQL (GraphQL API)
- FlatWP Companion (Integration features)

**Recommended**:
- Advanced Custom Fields Pro (Custom fields)
- Yoast SEO or Rank Math (SEO metadata)

**Performance**:
- WP Rocket (Caching - optional)
- Imagify (Image optimization - optional)

### GraphQL Query Limits

Adjust in `wp-config.php` if needed:

```php
// Increase GraphQL query depth
define('GRAPHQL_QUERY_DEPTH_MAX', 15);

// Increase query amount max
define('GRAPHQL_QUERY_AMOUNT_MAX', 500);
```

### CORS Configuration

If experiencing CORS issues, add to `wp-config.php`:

```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
```

## Development Tools

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GraphQL: Syntax Highlighting
- WordPress Snippets

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Troubleshooting

### GraphQL Endpoint Not Accessible

**Check**:
1. WordPress site is publicly accessible
2. WPGraphQL plugin is activated
3. URL ends with `/graphql`
4. Test in browser: `https://your-site.com/graphql`

### Revalidation Not Working

**Check**:
1. Secrets match in WordPress and Vercel
2. Webhook URL is correct
3. Next.js site is publicly accessible
4. Check webhook logs in WordPress plugin

### Preview Mode Not Working

**Check**:
1. Preview secret matches
2. Draft mode enabled in API route
3. Post ID is correct
4. User has permission to view drafts

## Next Steps

- [Deployment Guide](/docs/deployment) - Deploy to production
- [WordPress Plugin](/docs/wordpress-plugin) - Plugin features
- [Architecture](/docs/architecture) - System design
