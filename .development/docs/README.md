# FlatWP Documentation

Comprehensive documentation for the FlatWP configuration system and features.

## Documentation Structure

```
docs-flatwp/
├── docs/
│   └── configuration/
│       ├── index.md                    # Configuration overview
│       ├── getting-started.md          # Quick start guide
│       ├── reference.md                # Complete API reference
│       ├── rendering-strategies.md     # Deep dive into SSG, ISR, SSR
│       ├── runtime-usage.md            # Using config in your app
│       ├── environment-variables.md    # Env var reference
│       └── migration.md                # Migration guide
└── README.md                           # This file
```

## Documentation Topics

### Configuration System

The configuration documentation covers FlatWP's centralized configuration system built on `@flatwp/config`:

1. **Getting Started** - Quick start guide for setting up configuration
2. **Reference** - Complete API reference for all configuration options
3. **Rendering Strategies** - Understanding static, ISR, and SSR rendering
4. **Runtime Usage** - How to access configuration in your Next.js app
5. **Environment Variables** - Complete list of supported environment variables
6. **Migration** - Guide for migrating from older configuration approaches

## Using This Documentation

### For Docusaurus Sites

These docs are formatted for Docusaurus v2/v3. To use:

1. **Copy to your Docusaurus site:**
   ```bash
   cp -r docs-flatwp/docs/configuration path_to_docusaurus/docs/
   ```

2. **Update sidebar:**
   ```javascript title="sidebars.js"
   module.exports = {
     docs: [
       {
         type: 'category',
         label: 'Configuration',
         items: [
           'configuration/index',
           'configuration/getting-started',
           'configuration/reference',
           'configuration/rendering-strategies',
           'configuration/runtime-usage',
           'configuration/environment-variables',
           'configuration/migration',
         ],
       },
     ],
   };
   ```

3. **Start Docusaurus:**
   ```bash
   npm run start
   ```

### For Other Documentation Systems

These markdown files use standard Docusaurus frontmatter but can be adapted:

- **Remove frontmatter** if not using Docusaurus
- **Convert links** to match your documentation structure
- **Adjust code blocks** if using different syntax highlighting
- **Customize admonitions** (`:::tip`, `:::warning`, etc.) to your system

## Documentation Format

### Frontmatter

Each file includes Docusaurus frontmatter:

```yaml
---
sidebar_position: 1
title: Page Title
description: Page description for SEO
---
```

### Code Examples

All code examples include:
- **Language identifier** for syntax highlighting
- **File paths** in title for context
- **Complete, working examples** that can be copy-pasted

```typescript title="flatwp.config.ts"
import { defineConfig } from '@flatwp/config';

export default defineConfig({
  // ...
});
```

### Admonitions

Documentation uses Docusaurus admonitions for important notes:

```markdown
:::tip
Helpful tip for users
:::

:::warning
Important warning about potential issues
:::

:::danger
Critical security or safety information
:::
```

### Links

Internal links use Docusaurus format:

```markdown
[Link Text](/docs/configuration/reference)
```

Update paths if using different documentation structure.

## Contributing to Documentation

### Adding New Documentation

1. Create markdown file in appropriate directory
2. Add frontmatter with `sidebar_position`, `title`, `description`
3. Use consistent formatting (see existing docs)
4. Include code examples with file paths
5. Add links to related documentation
6. Update sidebar configuration

### Documentation Standards

- **Clear, concise writing** - Beginner-friendly but comprehensive
- **Code examples** - Every concept should have working code
- **Cross-references** - Link to related documentation
- **Consistent formatting** - Follow existing patterns
- **TypeScript examples** - Show full type safety
- **Real-world patterns** - Show how features work in practice

### Style Guide

#### Headers

```markdown
# Page Title (H1 - only one per page)
## Section (H2)
### Subsection (H3)
#### Detail (H4)
```

#### Code Blocks

```markdown
```typescript title="path/to/file.ts"
// Code here
\```
```

#### Lists

```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item
```

#### Tables

```markdown
| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
```

## Building Production Docs

### For Docusaurus

```bash
# Install dependencies
npm install

# Development server
npm run start

# Production build
npm run build

# Serve production build
npm run serve
```

### Deployment

Documentation can be deployed to:

- **Vercel** - Connect GitHub repo, auto-deploy
- **Netlify** - Connect GitHub repo, auto-deploy
- **GitHub Pages** - Use Docusaurus GitHub Pages action
- **Static hosting** - Upload `build/` directory

### SEO Optimization

Documentation is optimized for search engines:

- **Descriptive titles** in frontmatter
- **Meta descriptions** for all pages
- **Structured content** with proper headings
- **Internal linking** for better navigation
- **Code examples** with clear context

## Documentation Maintenance

### Keeping Docs Current

- **Version updates** - Update when package versions change
- **API changes** - Document breaking changes immediately
- **New features** - Add documentation before release
- **User feedback** - Update based on common questions
- **Example updates** - Keep code examples current

### Review Checklist

- [ ] All code examples work and are tested
- [ ] Links point to correct destinations
- [ ] Frontmatter is complete and correct
- [ ] No typos or grammar errors
- [ ] Consistent formatting throughout
- [ ] Screenshots/images are current (if any)
- [ ] Cross-references are accurate

## Getting Help

If you need help with documentation:

1. **Check existing docs** - Review all configuration docs
2. **Review examples** - See `apps/web` and `apps/starter`
3. **GitHub issues** - Report documentation bugs
4. **Discord community** - Ask questions (for Pro users)
5. **Email support** - support@flatwp.com

## License

Documentation is part of FlatWP and follows the same license:
- **Free version**: MIT License
- **Pro version**: Commercial license

## Related Documentation

- [CLAUDE.md](/CLAUDE.md) - Development guidelines for Claude Code
- [ARCHITECTURE.md](/docs/ARCHITECTURE.md) - Repository structure
- [DEPLOYMENT.md](/docs/DEPLOYMENT.md) - Deployment guide
- [GRAPHQL_SETUP.md](/docs/GRAPHQL_SETUP.md) - GraphQL configuration

## Questions?

For questions about documentation:

- **Documentation bugs**: Open GitHub issue
- **Feature requests**: GitHub discussions
- **General questions**: Discord or email support
- **Contributing**: See CONTRIBUTING.md (if available)
