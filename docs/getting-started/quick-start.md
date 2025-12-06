---
sidebar_position: 1
---

# Quick Start

Get FlatWP up and running in under 5 minutes.

## Option 1: Using create-flatwp CLI (Recommended)

The fastest way to get started:

```bash
# Using pnpm (recommended)
pnpm create flatwp my-site

# Using npm
npx create-flatwp my-site

# Using yarn
yarn create flatwp my-site
```

The CLI will guide you through:

1. **Template Selection**
   - `blog` - Blog with posts, categories, and tags
   - `full` - Complete site with blog, pages, and ACF
   - `minimal` - Basic setup without content

2. **WordPress Connection**
   - GraphQL API URL
   - Revalidation secret
   - Preview secret (optional)

3. **Installation**
   - Automatic dependency installation
   - Environment setup
   - Initial configuration

Then start developing:

```bash
cd my-site
pnpm dev
```

Visit http://localhost:3010 🎉

## Option 2: Manual Installation

### 1. Clone the Repository

```bash
git clone https://github.com/flatwp/FlatWP-Starter.git my-site
cd my-site
```

### 2. Install Dependencies

```bash
pnpm install
```

:::tip Why pnpm?
pnpm is faster, uses less disk space, and has better monorepo support. Install it with:
```bash
npm install -g pnpm
```
:::

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your WordPress details:

```env
# Required
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress.com/graphql
REVALIDATION_SECRET=your-random-secret-here
PREVIEW_SECRET=another-random-secret

# Optional
NEXT_PUBLIC_SITE_NAME=My FlatWP Site
NEXT_PUBLIC_SITE_URL=http://localhost:3010
```

:::info Generate Secrets
Create secure random secrets:
```bash
openssl rand -base64 32
```
:::

### 4. Generate GraphQL Types

Generate TypeScript types from your WordPress schema:

```bash
pnpm graphql:codegen
```

This creates type-safe queries and mutations based on your WordPress GraphQL schema.

### 5. Start Development Server

```bash
pnpm dev
```

Your site will be available at http://localhost:3010

## WordPress Setup

Your WordPress site needs two plugins:

### 1. Install WPGraphQL

From WordPress admin:

1. Go to **Plugins → Add New**
2. Search for "WPGraphQL"
3. Click **Install Now** and **Activate**

Or via WP-CLI:

```bash
wp plugin install wp-graphql --activate
```

### 2. Install FlatWP Companion Plugin

Download from [GitHub Releases](https://github.com/flatwp/FlatWP-Plugin/releases) or build from source:

```bash
cd apps/react-plugin
pnpm build
```

Upload `flatwp-companion.zip` to WordPress:

1. Go to **Plugins → Add New → Upload Plugin**
2. Select the ZIP file
3. Click **Install Now** and **Activate**

### 3. Configure FlatWP Plugin

Go to **Settings → FlatWP**:

- **Next.js Site URL**: `http://localhost:3010`
- **Revalidation Secret**: Same as in `.env.local`
- **Enable Webhooks**: ✅ Checked

Click **Test Connection** to verify setup.

## Verify Installation

### Check GraphQL Endpoint

Visit your WordPress GraphQL endpoint:

```
https://your-wordpress.com/graphql
```

You should see the GraphQL Playground.

### Test Next.js Connection

Your Next.js site should show:

- ✅ Homepage with latest posts
- ✅ Blog archive page
- ✅ Individual post pages
- ✅ Category and tag archives

### Test Revalidation

1. Edit a post in WordPress
2. Click **Update**
3. Visit your Next.js site
4. Changes should appear within seconds

## Next Steps

Now that you have FlatWP running:

1. **[Environment Variables](/docs/development/environment-variables)** - Configure all settings
2. **[Project Structure](/docs/development/project-structure)** - Understand the codebase
3. **[ACF Setup](/docs/acf-setup)** - Add custom fields (optional)
4. **[Deploy to Production](/docs/deployment/vercel)** - Go live

## Troubleshooting

### Build Errors

**Error**: `Module not found: Can't resolve '@flatwp/graphql-types'`

**Solution**: Generate GraphQL types:
```bash
pnpm graphql:codegen
```

### Connection Issues

**Error**: `Failed to fetch from WordPress`

**Solution**: 
1. Check `NEXT_PUBLIC_WORDPRESS_API_URL` is correct
2. Verify WPGraphQL is installed and activated
3. Test GraphQL endpoint manually

### Port Already in Use

**Error**: `Port 3010 is already in use`

**Solution**: Use a different port:
```bash
PORT=3011 pnpm dev
```

### pnpm Not Found

**Error**: `command not found: pnpm`

**Solution**: Install pnpm globally:
```bash
npm install -g pnpm
```

## Getting Help

- **Documentation**: [flatwp.com/docs](https://flatwp.com/docs)
- **GitHub Issues**: [Report bugs](https://github.com/flatwp/FlatWP-Starter/issues)
- **Discussions**: [Ask questions](https://github.com/flatwp/FlatWP-Starter/discussions)
