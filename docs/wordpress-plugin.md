---
sidebar_position: 5
---

# WordPress Plugin

The FlatWP React Companion plugin brings modern administration to WordPress with a beautiful React dashboard.

## Overview

FlatWP React Companion is a modern WordPress plugin that connects your WordPress site to Next.js. It features a React-based admin dashboard for easy management, automatic cache updates, and seamless content synchronization.

## Key Features

### Modern React Dashboard

Beautiful, responsive admin interface built with React:

- **Real-time monitoring** - See connection status and statistics live
- **Cache management** - Control Next.js cache from WordPress
- **Activity logs** - Track all plugin activities
- **Settings management** - Configure everything in one place
- **Auto-refresh** - Dashboard updates every 30 seconds

### Automatic Cache Updates

Content changes in WordPress automatically update your Next.js site:

**What triggers updates**:
- Publishing or updating posts/pages
- Changing featured images
- Updating custom fields (ACF)
- Deleting content

**How it works**:
1. You save content in WordPress
2. Plugin detects the change instantly
3. Sends update signal to Next.js
4. Your website shows new content automatically
5. No manual refresh needed!

### Preview Mode

Preview drafts and scheduled posts before publishing:

- Secure preview links
- Time-limited access
- See exactly how content will look
- No need to publish to preview

### ACF Integration

Automatic registration of flexible content blocks:

- 8 content block types ready to use
- 2 sidebar widget types
- Page settings meta box
- All exposed via GraphQL automatically

## Installation

### Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- Node.js 18+ (for building the React app)
- WPGraphQL plugin

### Step 1: Install WPGraphQL

1. Go to **Plugins → Add New**
2. Search for "WPGraphQL"
3. Click **Install Now**, then **Activate**

### Step 2: Install FlatWP Plugin

**Option A: Upload ZIP** (Recommended)

1. Download `flatwp-react-plugin.zip` from [GitHub Releases](https://github.com/flatwp/flatwp-plugin/releases)
2. Go to **Plugins → Add New → Upload Plugin**
3. Choose the ZIP file
4. Click **Install Now**

**Option B: Manual Install**

1. Extract the ZIP file
2. Upload the `flatwp-react` folder to `/wp-content/plugins/`
3. Go to **Plugins** in WordPress admin
4. Find "FlatWP React Companion" and click **Activate**

### Step 3: Build the React App

The plugin includes React source code that needs to be built:

```bash
# SSH into your WordPress server or use local terminal
cd /path/to/wp-content/plugins/flatwp-react/admin-react

# Install dependencies (first time only)
npm install

# Build the React app
npm run build
```

This creates a `dist/` folder with the compiled dashboard.

### Step 4: Configure Plugin

1. In WordPress, go to the new **FlatWP** menu item (lightning bolt icon)
2. Click on **Settings**
3. Enter your configuration:

```
Next.js Site URL: http://localhost:3000
(or your production URL like https://yourbrand.com)

Revalidation Secret: [generate a secure random string]
(must match REVALIDATION_SECRET in your Next.js .env.local)

Preview Secret: [generate another secure random string]
(must match PREVIEW_SECRET in your Next.js .env.local)
```

**Generate secrets**:
```bash
openssl rand -base64 32
```

4. Check **Enable Webhooks**
5. Click **Save Settings**

### Step 5: Test Connection

1. Go to **FlatWP → Dashboard**
2. Look for the connection status indicator
3. It should show a green checkmark if connected
4. You'll see live statistics about your site

## Dashboard Features

### Overview Tab

The main dashboard shows:

- **Connection Status** - Is Next.js connected?
- **Content Statistics** - Posts, pages, and draft counts
- **System Information** - PHP version, WordPress version, plugin status
- **Quick Actions** - Common tasks at your fingertips

### Cache Management

Control your Next.js cache:

- View cache statistics
- Clear cache manually
- See recent cache operations
- Monitor cache performance

### Settings

Configure all plugin options:

- Next.js connection settings
- Revalidation preferences
- Preview mode options
- ACF field configuration

### Activity Logs

Track everything the plugin does:

- Content updates
- Cache revalidation events
- Preview requests
- Error logs

## Using the Plugin

### Publishing Content

When you publish or update content:

1. Edit your post/page in WordPress
2. Click **Update** or **Publish**
3. Plugin automatically notifies Next.js
4. Changes appear on your site within seconds
5. Check the dashboard to see the activity

### Previewing Drafts

To preview content before publishing:

1. Create or edit a draft post/page
2. Click the **Preview** button (standard WordPress button)
3. Opens your Next.js site with the draft content
4. Share the preview URL with others if needed

### Managing ACF Blocks

The plugin automatically provides ACF fields:

1. Edit any page
2. Scroll down to **Page Builder**
3. Click **Add Content Block**
4. Choose from 8 block types
5. Fill in the fields
6. Publish - the blocks appear automatically on your Next.js site

## Troubleshooting

### Dashboard Not Loading

**Problem**: White screen or "Loading..." never finishes

**Solutions**:
1. Check that React app is built:
   ```bash
   cd wp-content/plugins/flatwp-react/admin-react
   ls dist/
   ```
2. If `dist/` doesn't exist, run:
   ```bash
   npm install
   npm run build
   ```
3. Clear WordPress cache
4. Check browser console for JavaScript errors
5. Verify file permissions (folders: 755, files: 644)

### Connection Status Shows Red

**Problem**: Dashboard shows "Disconnected" or red status

**Solutions**:
1. Verify Next.js site is running and accessible
2. Check that secrets match between WordPress and Next.js
3. Test the revalidation endpoint manually:
   ```bash
   curl -X POST http://your-nextjs-site.com/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret":"your-secret","paths":["/"]}'
   ```
4. Check WordPress can make outbound HTTP requests
5. Verify no firewall blocking the connection

### ACF Fields Not Showing

**Problem**: Page Builder and sidebar blocks don't appear

**Solutions**:
1. Install and activate ACF Pro
2. Deactivate and reactivate FlatWP plugin
3. Check for PHP errors in WordPress debug log
4. Verify FlatWP Companion plugin is fully activated
5. Try creating a new page to see if fields appear

### Content Not Updating on Next.js Site

**Problem**: Changes in WordPress don't appear on the website

**Solutions**:
1. Check webhook is enabled in Settings
2. Verify revalidation secret matches
3. Check Activity Logs for webhook errors
4. Test revalidation endpoint is working
5. Try manually clearing cache from dashboard
6. Check Next.js site logs for errors

### Build Errors

**Problem**: `npm run build` fails with errors

**Solutions**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build

# Try specific Node version
nvm use 18
npm install
npm run build
```

## Advanced Configuration

### Custom Revalidation Paths

Add a filter to customize which paths get revalidated:

```php
// In your theme's functions.php

add_filter('flatwp_revalidation_paths', function($paths, $post_id) {
    // Add custom paths
    $paths[] = '/custom-page';
    $paths[] = '/another-page';

    return $paths;
}, 10, 2);
```

### Modify Preview Token Expiry

Change how long preview links stay active:

```php
add_filter('flatwp_preview_token_expiry', function($expiry) {
    return 7200; // 2 hours instead of default 1 hour
});
```

### Custom Dashboard Branding

The React dashboard can be customized by modifying the source files in `admin-react/src/` and rebuilding.

## API Endpoints

The plugin provides REST API endpoints:

### Health Check
```http
GET /wp-json/flatwp-react/v1/dashboard/stats
```

Returns dashboard statistics.

### Connection Status
```http
GET /wp-json/flatwp-react/v1/connection/status
```

Checks Next.js connection.

### Cache Stats
```http
GET /wp-json/flatwp-react/v1/cache/stats
```

Returns cache information.

All endpoints require WordPress authentication (nonce).

## Performance Tips

### Production Optimization

1. **Always use production build**:
   ```bash
   npm run build
   # NOT npm run dev
   ```

2. **Enable WordPress object caching** with Redis or Memcached

3. **Use a CDN** for static assets

4. **Keep WordPress updated** for security and performance

### Development Tips

1. Use `npm run dev` in `admin-react/` for hot reload during development
2. Check browser console for React errors
3. Use React DevTools extension for debugging
4. Monitor Network tab for API calls

## Updating the Plugin

When a new version is released:

1. Download the latest release from GitHub
2. Deactivate the current plugin
3. Delete the old plugin folder
4. Upload and activate the new version
5. Run `npm install && npm run build` in `admin-react/`
6. Check that everything still works

## Getting Help

### Documentation

- [Installation Guide](https://github.com/flatwp/flatwp-plugin/blob/main/INSTALL.md)
- [GitHub Repository](https://github.com/flatwp/flatwp-plugin)
- [Issue Tracker](https://github.com/flatwp/flatwp-plugin/issues)

### Community Support

- [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions) - Ask questions
- [GitHub Issues](https://github.com/flatwp/flatwp-plugin/issues) - Report bugs
- [FlatWP Website](https://flatwp.com) - Documentation and updates

## Next Steps

Now that your plugin is set up:

1. **[ACF Setup](/docs/acf-setup)** - Learn how to use the content blocks
2. **[Customization](/docs/customization)** - Customize your site
3. **[Configuration](/docs/configuration)** - Advanced configuration options
4. **[Deployment](/docs/deployment)** - Deploy to production

## FAQ

**Q: Do I need ACF Pro?**
A: ACF Pro is recommended for the full experience, but ACF Free works for basic functionality.

**Q: Can I use my own custom fields?**
A: Yes! The plugin works with any ACF fields exposed via WPGraphQL.

**Q: Will this work with my existing WordPress site?**
A: Yes, as long as you have WPGraphQL installed.

**Q: Is the React dashboard required?**
A: No, but it provides a much better experience for managing the integration.

**Q: Can I customize the dashboard?**
A: Yes, you can modify the React source code and rebuild.

**Q: What happens if Next.js is down?**
A: WordPress continues to work normally. The plugin logs failed webhook attempts.
