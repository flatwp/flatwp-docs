---
sidebar_position: 6
---

# Frequently Asked Questions

Common questions and answers about FlatWP.

## General Questions

### What is FlatWP?

FlatWP is a complete starter kit that combines WordPress's powerful content management with Next.js's modern performance and developer experience. It provides a production-ready foundation for building fast, SEO-optimized websites.

### Is FlatWP free?

Yes! FlatWP is completely free and open-source under the MIT license. You can use it for personal and commercial projects without any restrictions.

### What makes FlatWP different from traditional WordPress themes?

Traditional WordPress themes render pages on the server for every request. FlatWP uses Next.js to generate static pages that are incredibly fast, while still giving you the familiar WordPress admin interface for content management.

**Key differences**:
- 10x faster page loads
- Modern React-based frontend
- Built-in TypeScript support
- Automatic image optimization
- Better SEO performance

### Do I need to know React to use FlatWP?

Not to get started! You can use FlatWP out of the box and manage content entirely through WordPress. However, to customize components or add features, basic React knowledge is helpful.

**What you need to know**:
- **Content editors**: Just WordPress (no coding)
- **Theme customization**: Basic HTML/CSS
- **Custom features**: React and TypeScript

## Technical Requirements

### What are the minimum requirements?

**For Development**:
- Node.js 20.0 or higher
- npm, yarn, or pnpm
- WordPress 6.0+ with WPGraphQL plugin
- Code editor (VS Code recommended)

**For Hosting**:
- Vercel, Netlify, or any Node.js hosting
- WordPress hosting (can be separate from Next.js)

### Do I need ACF Pro?

ACF Pro is recommended for the full FlatWP experience with all content blocks, but ACF Free will work for basic functionality. Without ACF, you'll need to create custom fields yourself.

### Can I use my existing WordPress site?

Yes! FlatWP works with any WordPress site that has:
- WPGraphQL plugin installed
- Public GraphQL endpoint
- Compatible custom fields (ACF recommended)

You can keep your existing WordPress site and just add FlatWP as the frontend.

### What hosting do you recommend?

**For Next.js (Frontend)**:
- **Vercel** (recommended) - Best Next.js integration, free hobby plan
- **Netlify** - Good alternative with free tier
- **Cloudflare Pages** - Fast global CDN
- **VPS** - For custom setups

**For WordPress (Backend)**:
- Any WordPress hosting that supports WPGraphQL
- Must have public GraphQL endpoint
- WP Engine, Kinsta, Flywheel all work great

## Setup & Installation

### How long does setup take?

Following our [Quick Start guide](/docs/quick-start), you can have a working FlatWP site in **under 10 minutes**.

**Timeline**:
- Clone and install: 2-3 minutes
- WordPress plugin setup: 3-4 minutes
- First page creation: 2-3 minutes
- **Total: ~10 minutes**

### Why isn't my WordPress content showing up?

Common causes:

1. **GraphQL endpoint not accessible**
   - Check `NEXT_PUBLIC_WORDPRESS_API_URL` in `.env.local`
   - Test endpoint in browser: `https://yoursite.com/graphql`
   - Verify WPGraphQL plugin is activated

2. **Content not published**
   - Make sure posts/pages are published, not draft
   - Check post visibility settings

3. **Types not generated**
   - Run `npm run graphql:codegen` after WordPress changes
   - Check for error messages

4. **Cache not cleared**
   - Try clearing your Next.js cache: `rm -rf .next`
   - Rebuild: `npm run build`

### How do I update WordPress and see changes immediately?

FlatWP uses webhooks for automatic updates:

1. Make sure **FlatWP Companion plugin** is installed and active
2. Configure the plugin with your Next.js URL and secrets
3. Enable webhooks in plugin settings
4. When you update content in WordPress, it automatically updates your site within seconds

No manual rebuilds needed!

### Can I use FlatWP without the companion plugin?

Yes, but you'll lose several features:
- Automatic cache revalidation (must manually rebuild)
- Preview mode for drafts
- WordPress dashboard integration
- ACF block registration

The plugin is highly recommended for the best experience.

## Customization

### How do I change colors and fonts?

Edit `tailwind.config.ts` to change your brand colors:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
},
```

For fonts, see our [Customization Guide](/docs/customization#change-fonts).

### Can I add my own custom blocks?

Yes! You can create custom ACF blocks:

1. Register fields in WordPress (ACF)
2. Create React component in `components/blocks/`
3. Add to your GraphQL queries
4. Register in `BlockRenderer.tsx`

See the [ACF Setup guide](/docs/acf-setup#creating-custom-block-components) for detailed instructions.

### How do I add a new page type?

FlatWP works with any WordPress post type. To add custom post types:

1. Register the post type in WordPress
2. Expose it in WPGraphQL settings
3. Create GraphQL queries in `graphql/`
4. Generate types: `npm run graphql:codegen`
5. Create Next.js routes in `app/`

### Can I use FlatWP with WooCommerce?

Not out of the box, but it's possible with additional setup:

1. Install WooCommerce and WooGraphQL plugin
2. Create product queries
3. Build product templates in Next.js
4. Integrate shopping cart (use WooCommerce REST API or GraphQL)

This requires intermediate React/Next.js knowledge.

## Performance & SEO

### How fast is FlatWP compared to regular WordPress?

FlatWP sites typically achieve:
- **Lighthouse score**: 95-100 (vs 60-80 for typical WordPress)
- **Page load**: Less than 1 second (vs 3-5 seconds)
- **Time to Interactive**: Less than 2 seconds (vs 5-10 seconds)

The performance boost comes from:
- Static page generation
- Automatic image optimization
- Minimal JavaScript
- Edge caching

### Is FlatWP good for SEO?

Yes! FlatWP is excellent for SEO:

- Fast page loads (Google ranking factor)
- Static HTML for search engines
- Automatic sitemap generation
- Optimized meta tags
- Structured data support
- Mobile-first design

All while using WordPress for content management.

### How does caching work?

FlatWP uses multiple caching layers:

1. **Build-time**: Pages generated during build
2. **ISR (Incremental Static Regeneration)**: Pages rebuild after time intervals
3. **On-demand**: Webhooks trigger rebuilds when you update content
4. **Edge cache**: Vercel/Netlify CDN caches globally

You get WordPress flexibility with static site performance.

## Deployment & Production

### Where should I deploy FlatWP?

**Recommended**: Vercel (best Next.js support, free tier)

**Also works great**:
- Netlify
- Cloudflare Pages
- Railway
- Any Node.js hosting

See our [Deployment guide](/docs/deployment) for detailed instructions.

### How much does it cost to run FlatWP?

**Free tier options**:
- **Vercel**: Free for personal projects (100GB bandwidth)
- **Netlify**: Free tier (100GB bandwidth)
- **WordPress**: $5-15/month (shared hosting)

**Total**: Can run for as little as $5/month!

**Production** (for businesses):
- Vercel Pro: $20/month
- Premium WordPress hosting: $30-100/month
- **Total**: $50-120/month for professional setup

### Can I use FlatWP for client projects?

Absolutely! FlatWP is MIT licensed, meaning:
- Use for unlimited client projects
- No attribution required
- Modify as needed
- Charge clients whatever you want

Many agencies use FlatWP to deliver modern WordPress projects.

### How do I handle staging/production environments?

Use separate WordPress instances and Next.js deployments:

**Development**:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Staging**:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://staging-cms.site.com/graphql
NEXT_PUBLIC_SITE_URL=https://staging.site.com
```

**Production**:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.yoursite.com/graphql
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

Vercel/Netlify can automatically deploy branches to preview URLs.

## Troubleshooting

### My site builds locally but fails on Vercel

Common causes:

1. **Missing environment variables**
   - Add all variables to Vercel dashboard
   - Apply to all environments (Production, Preview, Development)

2. **WordPress not accessible**
   - Ensure WordPress URL is public (not localhost)
   - Check firewall/security settings

3. **Node version mismatch**
   - Set Node version in Vercel to 20.x
   - Check `package.json` engines field

### Images aren't loading

1. **Verify `next.config.ts` has correct domains**:
   ```typescript
   images: {
     remotePatterns: [
       {
         hostname: 'your-wordpress-site.com',
       },
     ],
   },
   ```

2. **Check image URLs in WordPress**
   - Make sure images are uploaded and published
   - Verify URLs are accessible

3. **Clear cache and rebuild**:
   ```bash
   rm -rf .next
   npm run build
   ```

### The FlatWP plugin dashboard is blank

This means the React app isn't built:

```bash
cd wp-content/plugins/flatwp-react/admin-react
npm install
npm run build
```

See [WordPress Plugin guide](/docs/wordpress-plugin#step-3-build-the-react-app) for details.

## Migration & Integration

### Can I migrate my existing WordPress theme to FlatWP?

Yes, but it requires manual work:

1. Export your content (stays in WordPress)
2. Recreate page layouts using ACF blocks
3. Custom components → React components
4. Theme functions → Next.js API routes

**Estimated time**: 1-3 weeks depending on complexity.

Consider hiring a developer for complex migrations.

### Does FlatWP work with WordPress plugins?

**Content plugins**: Yes
- ACF, Yoast SEO, Custom Post Types work great
- Data exposed via GraphQL works automatically

**Frontend plugins**: No
- Form builders, sliders, page builders won't work
- You'll need to recreate in Next.js components

**Backend plugins**: Depends
- Admin plugins generally work
- REST API plugins work
- Plugins that modify frontend won't work

### Can I use FlatWP with multiple WordPress sites?

Yes! You can point one Next.js site to multiple WordPress backends:

1. Create separate environment variables
2. Use GraphQL federation or multiple clients
3. Create separate route structures

This is advanced usage and requires custom code.

## Community & Support

### How do I get help?

1. **Documentation**: Start here (you are!)
2. **GitHub Discussions**: Ask questions, share projects
3. **GitHub Issues**: Report bugs and feature requests
4. **Main site**: [flatwp.com](https://flatwp.com)

### How can I contribute?

We welcome contributions!

- **Documentation**: Fix typos, add examples
- **Code**: Submit pull requests for features/fixes
- **Community**: Help others in GitHub Discussions
- **Share**: Blog about your FlatWP project

See our GitHub repository for contribution guidelines.

### Is there a FlatWP community?

Yes! Join us on:
- [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
- [GitHub Issues](https://github.com/flatwp/flatwp-starter/issues)

### Can I hire someone to help with FlatWP?

Yes! Many developers work with FlatWP:
- Post in GitHub Discussions
- Search for Next.js + WordPress developers
- Contact agencies that specialize in headless WordPress

## Roadmap & Features

### What's coming next for FlatWP?

Planned features:
- Multi-language support (i18n)
- E-commerce integration examples
- More ACF blocks
- Analytics dashboard
- Form builder integration
- Advanced caching strategies

Follow our [GitHub repository](https://github.com/flatwp) for updates!

### Can I request features?

Yes! Open a [GitHub Issue](https://github.com/flatwp/flatwp-starter/issues) with:
- Feature description
- Use case
- Why it would help others

We prioritize features based on community need.

### How often is FlatWP updated?

- **Security updates**: As needed (immediately)
- **Next.js updates**: Within days of major releases
- **Feature releases**: Monthly
- **Documentation**: Continuously

All updates maintain backward compatibility when possible.

## Still Have Questions?

If your question isn't answered here:

1. **Search the docs** - Use the search bar at the top
2. **Check GitHub Discussions** - Someone may have asked already
3. **Ask the community** - Post in [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
4. **Report bugs** - Open an [issue](https://github.com/flatwp/flatwp-starter/issues)

We're here to help! 🚀
