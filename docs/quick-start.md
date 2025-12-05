---
sidebar_position: 2
---

# Quick Start

Get your FlatWP site up and running in under 10 minutes!

## Prerequisites

Before you begin, make sure you have:

- **Node.js 20.0+** installed ([Download](https://nodejs.org/))
- **WordPress 6.0+** running with admin access
- **Package manager**: npm, yarn, or pnpm (we recommend pnpm)
- A code editor (VS Code recommended)

Don't have WordPress yet? Check out [WordPress.org](https://wordpress.org/download/) for installation guides.

## Step 1: Clone the Starter Template

Clone the FlatWP starter repository:

```bash
# Clone the repository
git clone https://github.com/flatwp/flatwp-starter.git my-flatwp-site
cd my-flatwp-site
```

Or use the GitHub template (cleaner, no git history):

```bash
npx degit flatwp/flatwp-starter my-flatwp-site
cd my-flatwp-site
```

## Step 2: Install Dependencies

Install the required packages (this takes about 2 minutes):

```bash
# Using pnpm (recommended - faster)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

:::tip Why pnpm?
pnpm is faster and uses less disk space than npm. Install it with: `npm install -g pnpm`
:::

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

### Install Required Plugins

#### 1. Install WPGraphQL

1. Log in to your WordPress admin dashboard
2. Go to **Plugins → Add New**
3. Search for "WPGraphQL"
4. Click **Install Now**, then **Activate**

#### 2. Install FlatWP Companion Plugin

The FlatWP plugin connects WordPress to Next.js and provides ACF blocks:

1. Download `flatwp-react-plugin.zip` from [GitHub Releases](https://github.com/flatwp/flatwp-plugin/releases)
2. Go to **Plugins → Add New → Upload Plugin**
3. Choose the ZIP file and click **Install Now**
4. Click **Activate**

#### 3. Build the Plugin Dashboard (Important!)

The plugin needs to be built before it works:

```bash
# SSH into your WordPress server or use local terminal
cd /path/to/wp-content/plugins/flatwp-react/admin-react

# Install and build (first time only)
npm install
npm run build
```

### Configure Plugin Settings

1. In WordPress, find the new **FlatWP** menu item (lightning bolt icon)
2. Click on it to open the dashboard
3. Click **Settings** tab
4. Enter your configuration:

```
Next.js Site URL: http://localhost:3000
Revalidation Secret: [paste your secret from .env.local]
Preview Secret: [paste your preview secret from .env.local]
```

5. Check **Enable Webhooks**
6. Click **Save Settings**
7. Look for a green checkmark showing "Connected"

## Step 5: Generate GraphQL Types

Generate TypeScript types from your WordPress GraphQL schema:

```bash
# Using pnpm
pnpm graphql:codegen

# Or using npm
npm run graphql:codegen
```

This creates type-safe interfaces in `graphql/generated/`. You'll see output like:

```
✔ Parse Configuration
✔ Generate outputs
```

## Step 6: Start Development Server

Run the development server:

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see your FlatWP site! 🎉

:::tip
The development server runs on port 3000 by default. If you need to change it, edit `package.json`.
:::

## Step 7: Create Your First Page

Let's create a simple "About" page to see everything working:

### In WordPress

1. Go to **Pages → Add New**
2. Title: "About Us"
3. Scroll down to **Page Builder**
4. Click "Add Content Block"
5. Select "Hero - Centered"
6. Fill in:
   - Heading: "About Our Company"
   - Subheading: "We build amazing things"
   - Button Text: "Contact Us"
   - Button URL: "/contact"
7. Click **Publish**

### View Your Page

1. Go to `http://localhost:3000` in your browser
2. Your new "About Us" page should appear automatically
3. Click on it to see the hero block you created! ✨

## ✅ Success Checklist

Make sure everything is working:

- [ ] Next.js site loads at `http://localhost:3000`
- [ ] WordPress pages appear in navigation
- [ ] Page Builder blocks render correctly
- [ ] FlatWP dashboard shows green "Connected" status
- [ ] Making changes in WordPress updates the Next.js site
- [ ] No errors in browser console (F12)

If everything is checked, congratulations! Your FlatWP site is running! 🎉

## Common Issues & Solutions

### GraphQL Endpoint Not Found

**Error**: "Failed to fetch from WordPress GraphQL endpoint"

**Solutions**:
1. Verify WPGraphQL plugin is activated in WordPress
2. Check your `.env.local` has the correct `NEXT_PUBLIC_WORDPRESS_API_URL`
3. Test the endpoint in browser: `https://your-wordpress-site.com/graphql`
4. Make sure WordPress site is accessible from your computer

### CORS Errors

**Error**: "Access-Control-Allow-Origin blocked"

**Solution**: Add to WordPress `wp-config.php` (above "That's all, stop editing!"):

```php
// Allow Next.js to access WordPress
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
```

For production, replace `localhost:3000` with your actual domain.

### GraphQL Types Not Generated

**Error**: "Cannot find module './graphql/generated'"

**Solution**:
```bash
# Make sure WordPress is running
# Then generate types
pnpm graphql:codegen
```

If it fails, check:
- WordPress site is accessible
- WPGraphQL plugin is activated
- `.env.local` has correct URL

### FlatWP Dashboard Shows "Disconnected"

**Problem**: Red status in WordPress FlatWP dashboard

**Solutions**:
1. Make sure Next.js dev server is running (`pnpm dev`)
2. Check secrets match between WordPress and `.env.local`
3. Verify Next.js URL is correct in WordPress settings
4. Test the revalidation endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"your-secret","paths":["/"]}'
   ```

### Plugin Dashboard Not Loading

**Problem**: White screen when clicking FlatWP menu

**Solutions**:
1. Make sure you ran `npm run build` in the plugin's `admin-react` folder
2. Check browser console (F12) for JavaScript errors
3. Verify file permissions on the `dist` folder
4. Try deactivating and reactivating the plugin

## Next Steps

Now that your FlatWP site is running, here's what to explore:

### Immediate Next Steps

1. **[ACF Setup Guide](/docs/acf-setup)** - Learn how to use all 8 content block types
2. **[Customization](/docs/customization)** - Change colors, fonts, and components
3. **[WordPress Plugin](/docs/wordpress-plugin)** - Explore the React dashboard features

### When You're Ready

4. **[Configuration](/docs/configuration)** - Advanced settings and optimization
5. **[Deployment](/docs/deployment)** - Deploy your site to production
6. **[Architecture](/docs/architecture)** - Understand how everything works

## Quick Tips

### Daily Development

```bash
# Start working
pnpm dev

# After WordPress changes
pnpm graphql:codegen

# Build for production
pnpm build
```

### Common Commands

```bash
# Development
pnpm dev                  # Start dev server (port 3000)
pnpm build                # Build for production
pnpm start                # Run production build locally

# Code Quality
pnpm lint                 # Check code quality
pnpm type-check           # TypeScript validation
pnpm graphql:codegen      # Update WordPress types

# Utilities
pnpm clean                # Clear build cache
```

### Project Structure

```
my-flatwp-site/
├── app/                  # Next.js pages and routes
│   ├── (pages)/         # Page routes
│   ├── api/             # API endpoints
│   └── blog/            # Blog section
├── components/           # React components
│   ├── blocks/          # ACF block components
│   ├── ui/              # UI components
│   └── ...              # Other components
├── lib/                 # Utilities and helpers
│   └── wordpress/       # WordPress client & adapters
├── graphql/             # GraphQL queries
│   └── generated/       # Auto-generated types
├── public/              # Static files (images, etc.)
├── .env.local           # Your secrets (not in git)
└── next.config.ts       # Next.js configuration
```

## Learning Resources

### Documentation

- **Full Docs**: [flatwp.com/docs](https://flatwp.com/docs)
- **ACF Guide**: [/docs/acf-setup](/docs/acf-setup)
- **Examples**: Check `components/blocks/` for block examples

### Community

- **Questions**: [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/flatwp/flatwp-starter/issues)
- **Updates**: Follow [@flatwp](https://twitter.com/flatwp) on Twitter

### Video Tutorials (Coming Soon)

- Setting up your first site
- Creating custom blocks
- Deploying to production
- Advanced customization

## Need Help?

Got stuck? Here's how to get help:

1. **Check this guide** - Reread the troubleshooting section
2. **Search docs** - Use the search bar at the top
3. **Ask the community** - Post in [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
4. **Report bugs** - Open an [issue on GitHub](https://github.com/flatwp/flatwp-starter/issues)

Happy building! 🚀
