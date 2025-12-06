---
sidebar_position: 4
---

# Manual Installation

Detailed step-by-step guide for manually installing FlatWP.

## Overview

This guide covers manual installation of FlatWP for:
- Custom project setups
- Existing monorepos
- Advanced configuration needs
- Learning the internals

:::tip Quick Start Alternative
For faster setup, use the [create-flatwp CLI](/docs/getting-started/quick-start).
:::

## Prerequisites

Before starting, ensure you have:

- **Node.js 20.0.0+** installed
- **pnpm 8.0.0+** installed
- **WordPress 6.4+** with admin access
- **Git** for version control
- Basic terminal/command line knowledge

## Step 1: Clone Repository

### From GitHub

```bash
git clone https://github.com/flatwp/FlatWP-Starter.git my-flatwp-site
cd my-flatwp-site
```

### Or Download ZIP

1. Visit [https://github.com/flatwp/FlatWP-Starter](https://github.com/flatwp/FlatWP-Starter)
2. Click **Code → Download ZIP**
3. Extract to your desired location
4. Open terminal in extracted folder

## Step 2: Install Dependencies

```bash
pnpm install
```

This installs all required packages including:
- Next.js 15.5.6
- React 19
- TypeScript
- TailwindCSS
- GraphQL tools
- Apollo Client

**Installation time**: 30-60 seconds depending on internet speed.

:::info Using npm or yarn?
```bash
# With npm
npm install

# With yarn
yarn install
```
pnpm is recommended for better performance and disk usage.
:::

## Step 3: Configure Environment

### Create Environment File

```bash
cp .env.example .env.local
```

### Edit Configuration

Open `.env.local` and configure:

```env
# WordPress Connection (Required)
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql

# Revalidation Secret (Required)
# Generate with: openssl rand -base64 32
REVALIDATION_SECRET=your-random-secret-here

# Preview Secret (Required for draft preview)
# Generate with: openssl rand -base64 32
PREVIEW_SECRET=another-random-secret

# Site Information (Optional)
NEXT_PUBLIC_SITE_NAME=My FlatWP Site
NEXT_PUBLIC_SITE_URL=http://localhost:3010
NEXT_PUBLIC_SITE_DESCRIPTION=A modern headless WordPress site

# WordPress Domain (Optional, auto-detected from API URL)
NEXT_PUBLIC_WORDPRESS_DOMAIN=your-wordpress.com

# Analytics (Optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
NEXT_PUBLIC_GA_ID=

# Development (Optional)
NEXT_TELEMETRY_DISABLED=1
```

### Generate Secrets

For production-grade security:

```bash
# Generate revalidation secret
openssl rand -base64 32

# Generate preview secret
openssl rand -base64 32
```

Copy the outputs to your `.env.local` file.

## Step 4: WordPress Setup

### Install Required Plugins

#### WPGraphQL

**Via WordPress Admin**:
1. Go to **Plugins → Add New**
2. Search for "WPGraphQL"
3. Click **Install Now**
4. Click **Activate**

**Via WP-CLI**:
```bash
wp plugin install wp-graphql --activate
```

#### FlatWP Companion Plugin

**Download from Releases**:
1. Visit [FlatWP Plugin Releases](https://github.com/flatwp/FlatWP-Plugin/releases)
2. Download latest `flatwp-companion.zip`
3. Upload via **Plugins → Add New → Upload Plugin**
4. Activate the plugin

**Build from Source** (advanced):
```bash
# Clone the repository
git clone https://github.com/flatwp/FlatWP-Plugin.git
cd FlatWP-Plugin

# Install dependencies
pnpm install

# Build plugin
pnpm build

# Upload dist/flatwp-companion.zip to WordPress
```

### Configure Permalinks

1. Go to **Settings → Permalinks**
2. Select **Post name** (recommended) or custom structure
3. Click **Save Changes**

:::warning Important
Default permalinks (`?p=123`) are not supported by FlatWP.
:::

### Configure FlatWP Plugin

1. Go to **Settings → FlatWP**
2. Enter configuration:
   - **Next.js Site URL**: `http://localhost:3010`
   - **Revalidation Secret**: Same as in `.env.local`
   - **Enable Webhooks**: ✅ Checked
3. Click **Save Changes**
4. Click **Test Connection** (should show ✅ Success)

## Step 5: Generate GraphQL Types

Generate TypeScript types from your WordPress schema:

```bash
pnpm graphql:codegen
```

This command:
1. Connects to WordPress GraphQL endpoint
2. Introspects the schema
3. Generates TypeScript types in `packages/graphql-types/`
4. Creates typed document nodes for queries

**Expected output**:
```
✔ Parse Configuration
✔ Generate outputs
✔ Load GraphQL documents
✔ Generate types
  ✔ Write to packages/graphql-types/src/generated/
```

**Generated files**:
- `graphql.ts` - Typed document nodes
- `types.ts` - TypeScript type definitions
- `gql.ts` - GraphQL tag function
- `fragment-masking.ts` - Fragment utilities

:::tip Watch Mode
For development, use watch mode:
```bash
pnpm graphql:codegen:watch
```
Types regenerate automatically when `.graphql` files change.
:::

## Step 6: Start Development Server

```bash
pnpm dev
```

The application starts on **http://localhost:3010**

**You should see**:
```
▲ Next.js 15.5.6
- Local:        http://localhost:3010
- Network:      http://192.168.1.x:3010

✓ Ready in 2.3s
```

### Verify Installation

Visit http://localhost:3010 and check:

- ✅ Homepage loads
- ✅ Blog posts display (if you have content)
- ✅ Navigation works
- ✅ No console errors

## Step 7: Test WordPress Integration

### Create Test Content

In WordPress admin:

1. Create a new blog post
2. Add title, content, featured image
3. Click **Publish**

### Verify Revalidation

1. Visit your Next.js site homepage
2. New post should appear within 5-10 seconds
3. Check browser console for errors

### Test Preview Mode

1. Create a draft post in WordPress
2. Click **Preview** button
3. Should redirect to Next.js site with preview
4. Draft content visible

## Project Structure

After installation, your project contains:

```
my-flatwp-site/
├── apps/
│   ├── web/                    # Main Next.js application
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities & GraphQL client
│   │   ├── graphql/          # GraphQL queries & fragments
│   │   ├── public/           # Static assets
│   │   ├── .env.local        # Your environment config
│   │   └── package.json
│   └── react-plugin/          # WordPress plugin source
├── packages/
│   ├── config/               # Shared configuration (@flatwp/config)
│   ├── graphql-types/        # Generated types (@flatwp/graphql-types)
│   └── typescript-config/    # Shared TypeScript configs
├── docker-compose.yml        # Local WordPress environment
├── railway.json             # Railway deployment config
├── pnpm-workspace.yaml      # pnpm monorepo config
└── package.json            # Root package.json
```

## Optional: Local WordPress with Docker

For complete local development:

### Start WordPress Container

```bash
docker-compose up -d
```

This starts:
- **WordPress 6.4** with PHP 8.2
- **MySQL 8.0** database
- **WPGraphQL** plugin (auto-installed)
- **FlatWP Companion** plugin (auto-installed)

**Access WordPress**:
- URL: http://localhost:8080
- Username: `admin`
- Password: `flatwp_admin_password`

### Configure Local WordPress

1. Complete WordPress setup wizard
2. FlatWP plugin auto-configured for `localhost:3010`
3. Create test content

### Update Next.js Config

```env
# .env.local
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/graphql
```

Restart dev server:
```bash
pnpm dev
```

## Build for Production

Test production build locally:

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

Visit http://localhost:3010 to verify production build.

**Build output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                   142 B          87.2 kB
├ ○ /_not-found                         871 B          85.1 kB
├ ƒ /api/health                         0 B                0 B
├ ƒ /api/preview                        0 B                0 B
└ ƒ /api/revalidate                     0 B                0 B

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

## Troubleshooting Installation

### pnpm install fails

**Error**: `ERR_PNPM_PEER_DEP_ISSUES`

**Solution**: Use `--legacy-peer-deps`:
```bash
pnpm install --legacy-peer-deps
```

### GraphQL codegen fails

**Error**: `Connection to WordPress failed`

**Solutions**:
1. Verify `NEXT_PUBLIC_WORDPRESS_API_URL` is correct
2. Check WordPress is accessible
3. Test endpoint: `curl https://your-wp.com/graphql`
4. Ensure WPGraphQL plugin is activated

### Port 3010 already in use

**Error**: `Port 3010 is already in use`

**Solution**: Use different port:
```bash
PORT=3011 pnpm dev
```

Or kill existing process:
```bash
# Find process
lsof -i :3010

# Kill process
kill -9 [PID]
```

### Build errors

**Error**: `Module not found`

**Solutions**:
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `pnpm install`
3. Regenerate types: `pnpm graphql:codegen`

### WordPress connection fails

**Error**: `Failed to fetch from WordPress API`

**Solutions**:
1. Check WordPress is publicly accessible
2. Verify GraphQL endpoint: visit in browser
3. Check firewall/security settings
4. Ensure HTTPS on production

## Next Steps

Installation complete! Here's what to do next:

1. **[Environment Variables](/docs/development/environment-variables)** - Understand all configuration options
2. **[Project Structure](/docs/development/project-structure)** - Learn the codebase organization
3. **[GraphQL Setup](/docs/development/graphql-setup)** - Master type-safe queries
4. **[ACF Setup](/docs/acf-setup)** - Add custom fields (optional)
5. **[Deploy to Production](/docs/deployment/vercel)** - Go live

## Getting Help

Having issues?

- **Documentation**: [Complete guides](/docs/intro)
- **GitHub Issues**: [Report problems](https://github.com/flatwp/FlatWP-Starter/issues)
- **Discussions**: [Ask questions](https://github.com/flatwp/FlatWP-Starter/discussions)
- **FAQ**: [Common questions](/docs/faq)
