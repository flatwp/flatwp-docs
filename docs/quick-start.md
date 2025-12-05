---
sidebar_position: 2
---

# Quick Start

Get your FlatWP site up and running in less than 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20.0+** installed ([Download](https://nodejs.org/))
- **WordPress 6.4+** with WPGraphQL plugin
- **Package manager**: npm, yarn, or pnpm
- A code editor (VS Code recommended)

## Step 1: Clone the Starter Template

Clone the FlatWP starter repository:

```bash
git clone https://github.com/flatwp/flatwp-starter.git my-flatwp-site
cd my-flatwp-site
```

Or use the GitHub template:

```bash
npx degit flatwp/flatwp-starter my-flatwp-site
cd my-flatwp-site
```

## Step 2: Install Dependencies

Install the required packages:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your WordPress details:

```env
# WordPress GraphQL endpoint
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql

# Secret for revalidation webhooks
REVALIDATION_SECRET=your-random-secret-here

# Preview mode secret
PREVIEW_SECRET=another-random-secret
```

:::tip
Generate secure secrets using:
```bash
openssl rand -base64 32
```
:::

## Step 4: Set Up WordPress

### Install WPGraphQL Plugin

1. Log in to your WordPress admin
2. Navigate to **Plugins → Add New**
3. Search for "WPGraphQL"
4. Install and activate the plugin

### Install FlatWP Companion Plugin (Optional)

The FlatWP Companion plugin adds enhanced features:

1. Download the latest release from [GitHub](https://github.com/flatwp/flatwp-plugin)
2. Upload to **Plugins → Add New → Upload Plugin**
3. Activate the plugin

### Configure Plugin Settings

Go to **Settings → FlatWP** and configure:

- **Next.js Site URL**: `http://localhost:3000` (development) or your production URL
- **Revalidation Secret**: Same as in `.env.local`
- **Enable Webhooks**: Check this box

## Step 5: Generate GraphQL Types

Generate TypeScript types from your WordPress GraphQL schema:

```bash
npm run graphql:codegen
```

This creates type-safe interfaces in `graphql/generated/`.

## Step 6: Start Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your FlatWP site! 🎉

## Step 7: Create Your First Page

### In WordPress

1. Create a new page in WordPress admin
2. Add some content and featured image
3. Publish the page

### In Your Next.js App

The page will automatically appear in your Next.js site through GraphQL queries.

## Verify Installation

Check that everything is working:

1. **Homepage loads**: Visit `http://localhost:3000`
2. **Pages render**: Navigate to a WordPress page
3. **GraphQL works**: Check the Network tab for successful GraphQL requests
4. **Hot reload**: Edit a component and see instant updates

## Common Issues

### GraphQL Endpoint Not Found

**Error**: `Failed to fetch from WordPress GraphQL endpoint`

**Solution**:
- Verify WPGraphQL plugin is activated
- Check your `NEXT_PUBLIC_WORDPRESS_API_URL` is correct
- Test the endpoint: `https://your-site.com/graphql`

### CORS Errors

**Error**: `Access-Control-Allow-Origin blocked`

**Solution**:
Add to your WordPress `wp-config.php`:
```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
```

### GraphQL Types Not Generated

**Error**: `Cannot find module './graphql/generated'`

**Solution**:
```bash
npm run graphql:codegen
```

Ensure your WordPress GraphQL endpoint is accessible.

## Next Steps

Now that your FlatWP site is running:

1. **Customize Theme** - Brand your site with custom colors and components
2. **Add Content Types** - Extend functionality with custom post types
3. **Configure Rendering** - Optimize performance with ISR strategies
4. **Deploy to Vercel** - Go live with your production site

## Development Workflow

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Run production build locally

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript checking
npm run graphql:codegen  # Regenerate GraphQL types

# Utilities
npm run clean            # Clear build cache
```

### File Structure

```
my-flatwp-site/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                # Utilities & WordPress client
├── graphql/            # GraphQL queries & types
├── public/             # Static assets
├── .env.local          # Environment variables (not committed)
└── next.config.js      # Next.js configuration
```

## Get Help

If you run into issues:

- **Check the docs**: [flatwp.com/docs](https://flatwp.com/docs)
- **Ask the community**: [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
- **Report bugs**: [GitHub Issues](https://github.com/flatwp/flatwp-starter/issues)

Happy building! 🚀
