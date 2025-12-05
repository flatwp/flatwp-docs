# FlatWP Documentation

> Official documentation site for FlatWP - Modern Headless WordPress Starter Kit

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus-success.svg)](https://docusaurus.io/)

## 🚀 About FlatWP

FlatWP is a performance-focused, production-ready starter kit for building headless WordPress sites using Next.js 14+, TypeScript, and TailwindCSS. This repository contains the official documentation website.

**Key Features:**
- 🎨 Modern Next.js 14+ with App Router
- ⚡ ISR with on-demand revalidation
- 🔒 TypeScript strict mode
- 🎯 WordPress GraphQL integration
- 🚀 95+ Lighthouse scores
- 📦 MIT Licensed

## 📚 Documentation Structure

- **Getting Started** - Installation and initial setup
- **Quick Start** - Build your first FlatWP site in 5 minutes
- **Architecture** - System design and technical decisions
- **API Reference** - Component and utility documentation
- **Guides** - Step-by-step tutorials and best practices

## 🛠️ Local Development

### Prerequisites

- Node.js 20.0 or higher
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/flatwp/flatwp-docs.git
cd flatwp-docs

# Install dependencies
npm install

# Start development server
npm start
```

The site will be available at `http://localhost:3000`

### Available Commands

```bash
npm start              # Start development server
npm run build          # Build for production
npm run serve          # Serve production build locally
npm run clear          # Clear Docusaurus cache
npm run typecheck      # Run TypeScript type checking
```

## 🎨 Theme Customization

The documentation site uses a custom theme inspired by [flatwp.com](https://flatwp.com):

- **Primary Color**: Orange (#f97316)
- **Dark Theme**: Default theme with dark backgrounds
- **Typography**: System fonts for optimal performance
- **Components**: Custom styled Docusaurus components

## 📝 Contributing

We welcome contributions to the documentation! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improved-docs`)
3. Make your changes
4. Commit with conventional commits (`git commit -m "docs: improve quick start guide"`)
5. Push to your branch (`git push origin feature/improved-docs`)
6. Open a Pull Request

### Documentation Guidelines

- Write clear, concise explanations
- Include code examples where applicable
- Use proper markdown formatting
- Test all code examples
- Follow the existing documentation structure

## 🚀 Deployment

### Vercel (Recommended)

The documentation site is automatically deployed to Vercel on every push to the `main` branch.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flatwp/flatwp-docs)

### Manual Deployment

```bash
# Build the site
npm run build

# The build output is in the `build` directory
# Deploy the contents to your hosting provider
```

### Vercel Configuration

The repository includes a `vercel.json` configuration file:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "framework": "docusaurus",
  "installCommand": "npm install"
}
```

## 🔗 Links

- **Main Website**: [flatwp.com](https://flatwp.com)
- **GitHub Organization**: [github.com/flatwp](https://github.com/flatwp)
- **Starter Template**: [github.com/flatwp/flatwp-starter](https://github.com/flatwp/flatwp-starter)
- **WordPress Plugin**: [github.com/flatwp/flatwp-plugin](https://github.com/flatwp/flatwp-plugin)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- **Documentation Issues**: [GitHub Issues](https://github.com/flatwp/flatwp-docs/issues)
- **General Questions**: [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
- **Email**: support@flatwp.com

## 🙏 Acknowledgments

- Built with [Docusaurus](https://docusaurus.io/)
- Inspired by the [flatwp.com](https://flatwp.com) design
- Documentation framework by Meta Open Source

---

**Made with ❤️ by the FlatWP Team**
