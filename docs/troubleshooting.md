---
sidebar_position: 7
---

# Troubleshooting Guide

Solutions to common issues you might encounter with FlatWP.

## Quick Diagnostic Steps

Before diving into specific issues, try these general diagnostic steps:

1. **Check the basics**
   ```bash
   # Verify Node.js version
   node --version  # Should be 20.0+

   # Check if WordPress is accessible
   curl https://your-wordpress-site.com/graphql

   # Verify environment variables
   cat .env.local
   ```

2. **Clear caches**
   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Reinstall dependencies
   rm -rf node_modules
   npm install

   # Rebuild
   npm run build
   ```

3. **Check logs**
   - Browser console (F12 → Console tab)
   - Terminal output during build
   - WordPress debug.log (if enabled)

## Installation Issues

### Cannot Install Dependencies

**Error**: `npm install` fails with permission errors

**Solutions**:

```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER node_modules

# Or use nvm to avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**Error**: `ERESOLVE unable to resolve dependency tree`

**Solutions**:

```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or use pnpm (recommended)
npm install -g pnpm
pnpm install
```

### Node Version Mismatch

**Error**: "The engine 'node' is incompatible"

**Solution**:

```bash
# Check required version in package.json
cat package.json | grep engines

# Install correct version with nvm
nvm install 20
nvm use 20
nvm alias default 20
```

## WordPress Connection Issues

### GraphQL Endpoint Not Found

**Error**: "Failed to fetch from WordPress GraphQL endpoint"

**Diagnostic**:

```bash
# Test endpoint directly
curl https://your-wordpress-site.com/graphql

# Should return GraphQL introspection query
```

**Solutions**:

1. **WPGraphQL not installed**
   - Go to WordPress admin → Plugins → Add New
   - Search "WPGraphQL"
   - Install and activate

2. **Wrong URL in .env.local**
   ```env
   # Wrong
   NEXT_PUBLIC_WORDPRESS_API_URL=https://yoursite.com

   # Correct
   NEXT_PUBLIC_WORDPRESS_API_URL=https://yoursite.com/graphql
   ```

3. **WordPress not publicly accessible**
   - Check if WordPress is behind firewall
   - Verify DNS is correct
   - Test in browser: `https://yoursite.com/graphql`

4. **Permalink settings**
   - Go to Settings → Permalinks in WordPress
   - Click "Save Changes" to flush rewrite rules

### CORS Errors

**Error**: "Access-Control-Allow-Origin header missing"

**Solution**: Add to WordPress `wp-config.php` (before "That's all, stop editing!"):

```php
// Development
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    exit(0);
}
```

**Production**: Use specific origin:

```php
header('Access-Control-Allow-Origin: https://yoursite.com');
header('Access-Control-Allow-Credentials: true');
```

### Authentication Errors

**Error**: "GraphQL request not authorized"

**Solutions**:

1. **Make sure endpoints are public**
   - WPGraphQL should allow public queries by default
   - Check Settings → GraphQL → "Public Introspection"

2. **For protected content**
   ```typescript
   // Add authentication to GraphQL client
   const client = new ApolloClient({
     uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
     headers: {
       Authorization: `Bearer ${token}`,
     },
   });
   ```

## Build & Development Issues

### Build Fails with TypeScript Errors

**Error**: "Type 'X' is not assignable to type 'Y'"

**Solutions**:

1. **Regenerate GraphQL types**
   ```bash
   npm run graphql:codegen
   ```

2. **Check TypeScript version**
   ```bash
   npm list typescript
   # Should match version in package.json
   ```

3. **Clear TypeScript cache**
   ```bash
   rm -rf .next
   rm -rf node_modules/.cache
   npm run build
   ```

### Development Server Won't Start

**Error**: "Port 3000 is already in use"

**Solutions**:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

**Error**: "Cannot find module"

**Solutions**:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check import paths
# Wrong: import Component from 'components/Button'
# Right: import Component from '@/components/Button'
```

### Hot Reload Not Working

**Issue**: Changes don't appear without manual refresh

**Solutions**:

1. **Check file watching limits** (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart dev server**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

3. **Check for syntax errors**
   - Look for errors in terminal
   - Check browser console

## Content & GraphQL Issues

### GraphQL Types Not Generated

**Error**: "Cannot find module './graphql/generated'"

**Solutions**:

```bash
# Generate types
npm run graphql:codegen

# If it fails, check:
# 1. WordPress is accessible
# 2. WPGraphQL is activated
# 3. .env.local has correct URL

# Test endpoint manually
curl https://your-wordpress-site.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'
```

**Error**: "GraphQL schema loading failed"

**Solutions**:

1. **Check WordPress accessibility**
   - Test in browser
   - Verify no authentication required

2. **Verify .env.local**
   ```env
   NEXT_PUBLIC_WORDPRESS_API_URL=https://yoursite.com/graphql
   ```

3. **Check codegen.ts configuration**
   ```typescript
   schema: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
   ```

### ACF Fields Not Appearing in GraphQL

**Issue**: Custom fields don't show up in GraphQL schema

**Solutions**:

1. **Install WPGraphQL for ACF**
   - Download from [GitHub](https://github.com/wp-graphql/wpgraphql-acf)
   - Install and activate

2. **Enable "Show in GraphQL" for field groups**
   - Edit field group in ACF
   - Check "Show in GraphQL" option
   - Set GraphQL Field Name

3. **Flush permalinks**
   - Go to Settings → Permalinks
   - Click "Save Changes"

4. **Check field group location rules**
   - Make sure fields are assigned to post type
   - Verify post type is in GraphQL schema

### Content Not Updating

**Issue**: Changes in WordPress don't appear on Next.js site

**Solutions**:

1. **Check webhook configuration**
   - WordPress → FlatWP → Settings
   - Verify Next.js URL is correct
   - Confirm secrets match .env.local
   - Enable webhooks checkbox

2. **Test webhook manually**
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "your-revalidation-secret",
       "paths": ["/", "/blog"]
     }'
   ```

3. **Check revalidation settings**
   - For development: Manual revalidation
   - For production: Automatic via webhooks

4. **Clear cache manually**
   ```bash
   rm -rf .next/cache
   npm run build
   ```

## Image Issues

### Images Not Loading

**Error**: "Invalid src prop" or images show as broken

**Solutions**:

1. **Update next.config.ts**
   ```typescript
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: 'your-wordpress-site.com',
         pathname: '/wp-content/uploads/**',
       },
     ],
   },
   ```

2. **Check image URLs in WordPress**
   - Verify images are uploaded
   - Test URL in browser
   - Ensure no hotlink protection

3. **Verify image field returns correct data**
   ```graphql
   featuredImage {
     node {
       sourceUrl
       altText
     }
   }
   ```

### Images Load Slowly

**Issue**: Images take long to load or aren't optimized

**Solutions**:

1. **Use Next.js Image component**
   ```tsx
   import Image from 'next/image';

   <Image
     src={imageUrl}
     alt={altText}
     width={800}
     height={600}
     placeholder="blur"
     blurDataURL={blurData}
   />
   ```

2. **Enable blur placeholders in WordPress**
   - FlatWP plugin generates these automatically
   - Check if plugin is activated

3. **Optimize images before upload**
   - Use tools like TinyPNG
   - Recommended: max 2000px wide
   - Format: WebP or JPEG

## Plugin Issues

### FlatWP Dashboard Won't Load

**Issue**: Blank screen or "Loading..." never finishes

**Solutions**:

1. **Build the React app**
   ```bash
   cd wp-content/plugins/flatwp-react/admin-react
   npm install
   npm run build
   ```

2. **Check file permissions**
   ```bash
   # Folders should be 755, files 644
   chmod -R 755 wp-content/plugins/flatwp-react
   find wp-content/plugins/flatwp-react -type f -exec chmod 644 {} \;
   ```

3. **Check browser console**
   - Press F12 → Console
   - Look for JavaScript errors
   - Check Network tab for failed requests

4. **Verify PHP version**
   - FlatWP requires PHP 7.4+
   - Check: `php -v`

### Connection Status Shows Disconnected

**Issue**: Red "Disconnected" status in WordPress dashboard

**Solutions**:

1. **Verify Next.js is running**
   ```bash
   # Check if development server is running
   curl http://localhost:3000
   ```

2. **Test revalidation endpoint**
   ```bash
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "your-secret",
       "paths": ["/"]
     }'

   # Should return: {"revalidated": true}
   ```

3. **Check secrets match**
   - WordPress plugin settings
   - .env.local file
   - Must be identical

4. **Firewall issues**
   - WordPress server must reach Next.js server
   - Check firewall rules
   - For localhost, use 127.0.0.1 not localhost

### Webhooks Not Working

**Issue**: Manual updates work but automatic webhooks don't

**Solutions**:

1. **Check webhook logs**
   - WordPress → FlatWP → Logs
   - Look for failed webhook attempts

2. **Verify webhook URL**
   - Should be: `https://yoursite.com/api/revalidate`
   - Not: `https://yoursite.com/revalidate`

3. **Test with curl**
   ```bash
   curl -X POST https://yoursite.com/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "production-secret",
       "paths": ["/", "/blog/test-post"]
     }'
   ```

4. **Check WordPress cron**
   ```bash
   # Webhooks use WordPress cron
   # Test if cron is working
   wp cron test  # Using WP-CLI
   ```

## Deployment Issues

### Vercel Build Fails

**Error**: Build fails on Vercel but works locally

**Solutions**:

1. **Check environment variables**
   - Vercel dashboard → Settings → Environment Variables
   - Add all variables from .env.local
   - Apply to all environments

2. **Verify Node version**
   - Vercel dashboard → Settings → General
   - Set Node.js Version to 20.x

3. **Check build logs**
   - Look for specific error message
   - Common issues:
     - Missing environment variables
     - WordPress not accessible from Vercel
     - GraphQL codegen failures

4. **Ignore build errors** (temporary):
   ```typescript
   // next.config.ts
   typescript: {
     ignoreBuildErrors: false,  // Set to true temporarily
   },
   eslint: {
     ignoreDuringBuilds: false,  // Set to true temporarily
   },
   ```

### Production Site Shows 404 Errors

**Issue**: Pages work locally but show 404 in production

**Solutions**:

1. **Check generateStaticParams**
   ```typescript
   // app/blog/[slug]/page.tsx
   export async function generateStaticParams() {
     const posts = await getPosts();
     return posts.map((post) => ({
       slug: post.slug,
     }));
   }
   ```

2. **Verify fallback configuration**
   ```typescript
   export const dynamicParams = true; // Allow dynamic routes
   ```

3. **Check WordPress content**
   - Ensure posts are published
   - Verify slugs match

4. **Rebuild site**
   - Push to trigger new deployment
   - Or manually redeploy in Vercel

### Slow Performance in Production

**Issue**: Site is slow despite optimizations

**Solutions**:

1. **Check Core Web Vitals**
   ```bash
   # Run Lighthouse audit
   npx lighthouse https://yoursite.com --view
   ```

2. **Optimize images**
   - Use WebP format
   - Proper sizing (don't upload 4000px images)
   - Enable blur placeholders

3. **Review ISR settings**
   ```typescript
   // Adjust revalidation times
   export const revalidate = 300; // 5 minutes
   ```

4. **Enable analytics**
   - Vercel Analytics
   - Monitor actual performance data

5. **Optimize WordPress**
   - Use caching plugin (WP Rocket)
   - Enable object caching (Redis)
   - Optimize GraphQL queries

## Getting More Help

### Before Asking for Help

Provide this information:

1. **Environment details**
   ```bash
   node --version
   npm --version
   cat package.json | grep "next"
   ```

2. **Error messages**
   - Full error from terminal
   - Browser console errors
   - WordPress debug.log entries

3. **What you've tried**
   - Steps to reproduce
   - Solutions attempted
   - Relevant configuration

### Where to Get Help

1. **Search existing issues**
   - [GitHub Issues](https://github.com/flatwp/flatwp-starter/issues)
   - [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)

2. **Ask in GitHub Discussions**
   - Include error details
   - System information
   - Steps to reproduce

3. **Report bugs**
   - [Open an issue](https://github.com/flatwp/flatwp-starter/issues/new)
   - Provide reproduction steps
   - Include environment details

### Debug Mode

Enable detailed logging:

```env
# .env.local
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

```typescript
// Add to components for debugging
console.log('Debug info:', {
  data,
  props,
  state,
});
```

WordPress debug mode (`wp-config.php`):

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('GRAPHQL_DEBUG', true);
```

## Common Error Messages Explained

### "Module not found: Can't resolve '@/components/...'"

**Cause**: Path alias not configured or wrong import

**Fix**: Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### "Error: Invalid src prop on next/image"

**Cause**: Image hostname not allowed in next.config.ts

**Fix**: Add to `remotePatterns` in next.config.ts

### "Error: ECONNREFUSED connecting to GraphQL endpoint"

**Cause**: WordPress server not accessible

**Fix**:
- Check WordPress is online
- Verify URL in .env.local
- Test with curl

### "Warning: Each child in a list should have a unique 'key' prop"

**Cause**: Missing key prop in mapped components

**Fix**:
```tsx
{items.map((item, index) => (
  <div key={item.id || index}>  // Add key
    {item.content}
  </div>
))}
```

## Still Stuck?

If you've tried everything and still have issues:

1. **Create minimal reproduction**
   - Isolate the problem
   - Remove unrelated code
   - Test in fresh install if possible

2. **Check recent changes**
   - What did you change recently?
   - Try reverting to last working state
   - Use git to see differences

3. **Ask for help**
   - [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
   - Provide all requested information
   - Be patient - the community is volunteer-based

We're here to help! 🚀
