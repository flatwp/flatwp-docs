import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * FlatWP Documentation Sidebar
 * Organized by user journey: Getting Started → Development → Production → Help
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // Introduction
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },

    // Getting Started
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/one-click-deploy',
        'getting-started/requirements',
        'getting-started/installation',
      ],
    },

    // Features
    {
      type: 'category',
      label: 'Core Features',
      collapsed: false,
      items: [
        'features/isr-revalidation',
        'features/dynamic-pages',
        'features/image-optimization',
        'features/preview-mode',
        'features/search',
        'features/performance',
      ],
    },

    // WordPress Integration
    {
      type: 'category',
      label: 'WordPress',
      collapsed: false,
      items: [
        'wordpress/plugin-setup',
        'wordpress/graphql-configuration',
        'wordpress-plugin',
        'acf-setup',
        'wordpress/webhooks',
      ],
    },

    // Development
    {
      type: 'category',
      label: 'Development',
      collapsed: false,
      items: [
        'development/project-structure',
        'development/environment-variables',
        'development/graphql-setup',
        'development/typescript',
        'development/testing',
        'development/debugging',
      ],
    },

    // Configuration
    {
      type: 'category',
      label: 'Configuration',
      collapsed: true,
      link: {
        type: 'doc',
        id: 'configuration/index',
      },
      items: [
        'configuration/getting-started',
        'configuration/reference',
        'configuration/rendering-strategies',
        'configuration/runtime-usage',
        'configuration/environment-variables',
        'configuration/migration',
      ],
    },

    // Deployment
    {
      type: 'category',
      label: 'Deployment',
      collapsed: true,
      items: [
        'deployment/vercel',
        'deployment/netlify',
        'deployment/railway',
        'deployment/docker',
        'deployment/custom-hosting',
      ],
    },

    // API Reference
    {
      type: 'category',
      label: 'API Reference',
      collapsed: true,
      items: [
        'api/rest-endpoints',
        'api/graphql-queries',
        'api/revalidation-api',
        'api/preview-api',
        'api-reference',
      ],
    },

    // Guides
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        'guides/custom-blocks',
        'guides/styling',
        'guides/seo-optimization',
        'guides/multi-language',
        'guides/ecommerce',
      ],
    },

    // Customization
    {
      type: 'category',
      label: 'Customization',
      collapsed: true,
      items: [
        'customization',
      ],
    },

    // Troubleshooting
    {
      type: 'category',
      label: 'Troubleshooting',
      collapsed: true,
      items: [
        'troubleshooting/build-errors',
        'troubleshooting/graphql-errors',
        'troubleshooting/deployment-issues',
        'troubleshooting/performance-tuning',
        'troubleshooting',
      ],
    },

    // Reference
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/configuration',
        'reference/cli-commands',
        'reference/folder-structure',
        'reference/dependencies',
      ],
    },

    // Architecture & Advanced
    {
      type: 'category',
      label: 'Advanced',
      collapsed: true,
      items: [
        'architecture',
      ],
    },

    // Help & Support
    {
      type: 'category',
      label: 'Help & Support',
      collapsed: false,
      items: [
        'faq',
      ],
    },
  ],
};

export default sidebars;
