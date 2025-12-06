---
sidebar_position: 3
---

# Requirements

System requirements and prerequisites for FlatWP.

## Minimum Requirements

### Node.js and Package Manager

- **Node.js 20.0.0 or higher** - Required for Next.js 15
- **pnpm 8.0.0 or higher** - Recommended package manager
- Alternative: npm 9+ or yarn 3+

:::tip Check Your Versions
```bash
node --version  # Should show v20.0.0 or higher
pnpm --version  # Should show 8.0.0 or higher
```
:::

### WordPress

- **WordPress 6.4 or higher** - For latest WPGraphQL compatibility
- **PHP 8.0 or higher** - Required for WordPress 6.4+
- **MySQL 8.0 or MariaDB 10.5+** - Database requirements

### Required WordPress Plugins

1. **WPGraphQL 1.14.0+** - GraphQL API for WordPress
   - Free, available on WordPress.org
   - [Documentation](https://www.wpgraphql.com/)

2. **FlatWP Companion** - Revalidation and webhooks
   - Included with FlatWP
   - Custom built for Next.js integration

### Optional WordPress Plugins

1. **Advanced Custom Fields (ACF) Pro** - Flexible content blocks
   - License required for Pro version
   - Free version works with limitations

2. **Yoast SEO** or **Rank Math** - SEO optimization
   - Enhanced metadata support
   - WPGraphQL integration available

## Development Environment

### Operating System

FlatWP works on:

- **macOS** 11.0+ (Big Sur or higher)
- **Windows** 10/11 (with WSL2 recommended)
- **Linux** (Ubuntu 20.04+, Debian 11+, or equivalent)

### Development Tools

**Required**:
- **Code Editor** - VS Code, WebStorm, or similar
- **Terminal** - For running commands
- **Git** - Version control

**Recommended**:
- **Docker Desktop** - For local WordPress development
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - GraphQL
  - TypeScript

## Local WordPress Setup

### Option 1: Docker Compose (Recommended)

FlatWP includes a Docker Compose configuration:

**Requirements**:
- Docker Desktop 4.0+
- 4GB+ RAM allocated to Docker
- 10GB+ free disk space

**Included Services**:
- WordPress 6.4 with PHP 8.2
- MySQL 8.0
- WPGraphQL plugin (auto-installed)
- FlatWP Companion plugin (auto-installed)

**Start Command**:
```bash
docker-compose up -d
```

### Option 2: Local by Flywheel

Popular WordPress local development tool:

- **Download**: [localwp.com](https://localwp.com/)
- **Requirements**: 8GB+ RAM recommended
- **Benefits**: User-friendly GUI, SSL support

### Option 3: Existing WordPress

Use your existing WordPress installation:

**Requirements**:
- Publicly accessible (for webhooks)
- HTTPS enabled (recommended)
- WPGraphQL plugin installed

## Production Hosting

### Next.js Hosting

**Recommended Platforms**:

1. **Vercel**
   - Zero configuration for Next.js
   - Automatic deployments from Git
   - Free hobby tier available
   - [Requirements](https://vercel.com/docs/concepts/limits/overview)

2. **Netlify**
   - Next.js support built-in
   - Easy custom domain setup
   - Free tier available
   - [Requirements](https://docs.netlify.com/configure-builds/overview/)

3. **Railway**
   - Full-stack platform
   - Docker support
   - Automatic HTTPS
   - [Requirements](https://docs.railway.app/reference/project-limits)

**Minimum Server Requirements** (self-hosting):
- Node.js 20+
- 1GB RAM (2GB+ recommended)
- 10GB disk space
- HTTPS/SSL certificate

### WordPress Hosting

**Requirements**:
- WordPress 6.4+
- PHP 8.0+
- MySQL 8.0+ or MariaDB 10.5+
- HTTPS enabled
- Publicly accessible (for GraphQL API)
- 512MB+ PHP memory limit

**Recommended Hosts**:
- Kinsta (optimized for WordPress)
- WP Engine (managed WordPress)
- SiteGround (good performance)
- Any VPS with WordPress support

## Network Requirements

### Bandwidth

**Development**:
- Minimal bandwidth needed
- GraphQL responses typically 10-100KB
- Images served from WordPress

**Production**:
- Depends on traffic
- Next.js static assets cached at edge
- WordPress API calls minimal (thanks to ISR)

### Latency Considerations

**Optimal Setup**:
- Next.js deployed on global edge network (Vercel/Netlify)
- WordPress hosted in single region
- GraphQL queries cached via ISR

**Acceptable Latency**:
- WordPress API response: <500ms
- Next.js page generation: <1s
- Edge delivery: <100ms

## Browser Support

FlatWP supports all modern browsers:

### Desktop
- **Chrome** 90+ ✅
- **Firefox** 90+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅

### Mobile
- **iOS Safari** 14+ ✅
- **Chrome Mobile** 90+ ✅
- **Samsung Internet** 14+ ✅

:::info Internet Explorer
IE 11 is not supported. Use modern browsers for best experience.
:::

## Performance Requirements

### Build Times

**Local Development**:
- Initial build: 30-60 seconds
- Incremental builds: 1-5 seconds
- Type generation: 5-15 seconds

**Production Builds**:
- Small site (<100 pages): 1-2 minutes
- Medium site (100-1000 pages): 2-5 minutes
- Large site (1000+ pages): 5-10 minutes

### Resource Usage

**Development**:
- RAM: 2GB+ available
- CPU: 2+ cores recommended
- Disk: 500MB for node_modules

**Production**:
- RAM: 512MB minimum (1GB+ recommended)
- CPU: 1 vCPU minimum (2+ recommended)
- Disk: 100MB for built assets

## Security Requirements

### SSL/HTTPS

**Required**:
- Production Next.js site must use HTTPS
- WordPress GraphQL endpoint should use HTTPS
- Webhooks require HTTPS

**Development**:
- HTTP acceptable for localhost
- HTTPS recommended for staging

### Secrets Management

**Required Environment Variables**:
- `REVALIDATION_SECRET` - 32+ characters, random
- `PREVIEW_SECRET` - 32+ characters, random

**Generation**:
```bash
openssl rand -base64 32
```

**Storage**:
- Never commit to version control
- Use platform environment variable storage
- Rotate regularly (quarterly recommended)

## WordPress Configuration

### Permalinks

Required setting for proper routing:

1. Go to **Settings → Permalinks**
2. Select **Post name** or custom structure
3. Save changes

:::warning Important
Default permalinks (`?p=123`) are not supported.
:::

### GraphQL Settings

**Recommended Configuration**:

1. **GraphQL Endpoint**: `/graphql` (default)
2. **GraphQL Playground**: Enabled in development, disabled in production
3. **Query Depth Limit**: 10 (default)
4. **Query Complexity**: Disabled or 1000+

## Monitoring Requirements

### Recommended Tools

**Application Monitoring**:
- Vercel Analytics (built-in)
- Sentry (optional, error tracking)
- LogRocket (optional, session replay)

**WordPress Monitoring**:
- Query Monitor plugin (development)
- New Relic (production, optional)
- Server monitoring (varies by host)

### Health Checks

FlatWP includes health check endpoint:

**Endpoint**: `/api/health`

**Checks**:
- WordPress API connectivity
- Environment variable presence
- Revalidation secret configuration

## Scalability Considerations

### Small Sites (<10K visits/month)

- Free tier hosting sufficient
- Basic WordPress hosting
- Minimal configuration needed

### Medium Sites (10K-100K visits/month)

- Pro/paid hosting recommended
- CDN for WordPress images
- Consider caching plugins

### Large Sites (100K+ visits/month)

- Enterprise hosting
- Dedicated WordPress infrastructure
- Advanced caching strategies
- Consider multi-region deployment

## Development Team Requirements

### Skills Needed

**Frontend Developer**:
- React/Next.js experience
- TypeScript knowledge
- TailwindCSS familiarity
- GraphQL basics

**WordPress Developer**:
- WordPress plugin development
- WPGraphQL experience
- PHP knowledge
- ACF familiarity (for custom fields)

**DevOps** (optional for small teams):
- Git/GitHub
- CI/CD basics
- Environment management
- Basic Docker knowledge

## License Requirements

### FlatWP
- **MIT License** - Free for personal and commercial use
- No attribution required
- Open source

### Dependencies
- All dependencies use permissive licenses (MIT, Apache, ISC)
- No GPL conflicts
- Safe for commercial use

### WordPress Plugins
- **WPGraphQL**: GPL v3
- **ACF Pro**: Proprietary (license required for Pro features)
- **FlatWP Companion**: MIT License

## Check Your Setup

Ready to verify your environment?

```bash
# Check Node.js version
node --version
# Expected: v20.0.0 or higher

# Check pnpm
pnpm --version
# Expected: 8.0.0 or higher

# Check Docker (if using local WordPress)
docker --version
# Expected: Docker version 20.0.0 or higher

# Check Git
git --version
# Expected: git version 2.x.x
```

All green? You're ready to [get started](/docs/getting-started/quick-start)!

## Upgrade Paths

### From Older Node.js Versions

If running Node.js <20:

**Using nvm** (recommended):
```bash
nvm install 20
nvm use 20
```

**Using direct download**:
- Download from [nodejs.org](https://nodejs.org/)
- Install Node.js 20 LTS

### From Older WordPress Versions

If running WordPress <6.4:

1. **Backup your site** (database + files)
2. **Update WordPress** via admin dashboard
3. **Update plugins** including WPGraphQL
4. **Test GraphQL endpoint** after update

### From npm to pnpm

Switching to pnpm:

```bash
# Install pnpm globally
npm install -g pnpm

# Remove npm artifacts
rm -rf node_modules package-lock.json

# Install with pnpm
pnpm install
```

## Getting Help

Having trouble meeting requirements?

- **Documentation**: [flatwp.com/docs](https://flatwp.com/docs)
- **GitHub Discussions**: [Ask questions](https://github.com/flatwp/FlatWP-Starter/discussions)
- **GitHub Issues**: [Report problems](https://github.com/flatwp/FlatWP-Starter/issues)

## Next Steps

Requirements met? Let's get started:

1. **[Quick Start](/docs/getting-started/quick-start)** - Install FlatWP
2. **[One-Click Deploy](/docs/getting-started/one-click-deploy)** - Deploy to production
3. **[WordPress Setup](/docs/wordpress/plugin-setup)** - Configure WordPress
