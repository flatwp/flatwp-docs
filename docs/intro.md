---
sidebar_position: 1
---

# Getting Started

Welcome to **FlatWP** - the modern way to build headless WordPress sites with Next.js.

## What is FlatWP?

FlatWP is a performance-focused, production-ready starter kit that combines WordPress's powerful content management with Next.js's advanced rendering capabilities. Build blazing-fast, type-safe websites that delight both developers and end users.

### Key Features

- ⚡ **Performance First**: 95+ Lighthouse scores with ISR and optimized delivery
- 🎯 **Type-Safe**: Full TypeScript strict mode with auto-generated GraphQL types
- 🚀 **Production Ready**: WordPress GraphQL integration, preview mode, ACF support
- 🎨 **Modern Stack**: Next.js 14+ App Router, TailwindCSS v4, Shadcn/ui
- 📦 **Open Source**: MIT licensed with active community support

## What You'll Need

Before getting started with FlatWP, make sure you have:

- **Node.js** version 20.0 or higher
- **WordPress** 6.4+ with WPGraphQL plugin installed
- **Package Manager**: npm, yarn, or pnpm
- Basic knowledge of React and Next.js

## Quick Links

<div class="margin-vert--lg">
  <a href="/docs/quick-start" class="button button--primary button--lg">
    Quick Start Guide →
  </a>
  <a href="/docs/architecture" class="button button--secondary button--lg" style={{marginLeft: '1rem'}}>
    Architecture Overview
  </a>
</div>

## Repository Structure

FlatWP follows a **Hybrid Mono-as-Poly** architecture:

```
flatwp-dev/              # Private development monorepo
├── apps/
│   ├── web/            # Production site (flatwp.com)
│   ├── starter/        → flatwp/FlatWP-Starter (Public)
│   └── plugin/         → flatwp/FlatWP-Plugin (Public)
├── packages/
│   ├── typescript-config/
│   └── types/
└── docs/
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4
- **UI Components**: Shadcn/ui + Radix UI
- **GraphQL Client**: Apollo Client or urql

### Backend
- **CMS**: WordPress 6.4+
- **GraphQL**: WPGraphQL plugin
- **Custom Plugin**: FlatWP Companion

### Infrastructure
- **Hosting**: Vercel (recommended) or Netlify
- **WordPress Hosting**: Any standard host with GraphQL support
- **Image CDN**: Built-in next/image optimization

## Next Steps

Ready to build your first FlatWP site? Follow our [Quick Start Guide](/docs/quick-start) to get up and running in minutes.

### Learning Path

1. **[Quick Start](/docs/quick-start)** - Set up your first project
2. **[Architecture](/docs/architecture)** - Understand the system design
3. **[Configuration](/docs/configuration)** - Customize your setup
4. **[Deployment](/docs/deployment)** - Ship to production

## Community & Support

- **GitHub**: [github.com/flatwp](https://github.com/flatwp)
- **Discussions**: [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
- **Issues**: [GitHub Issues](https://github.com/flatwp/flatwp-starter/issues)
- **Main Site**: [flatwp.com](https://flatwp.com)

## License

FlatWP is open source and MIT licensed. Build amazing things! 🚀
