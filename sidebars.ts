import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * FlatWP Documentation Sidebar
 * Organized by user journey: Getting Started → Configuration → Production → Help
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    // Introduction
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'doc',
      id: 'quick-start',
      label: 'Quick Start',
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

    // WordPress Integration
    {
      type: 'category',
      label: 'WordPress',
      collapsed: false,
      items: [
        'wordpress-plugin',
        'acf-setup',
      ],
    },

    // Configuration
    {
      type: 'category',
      label: 'Configuration',
      collapsed: false,
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
      type: 'doc',
      id: 'deployment',
      label: 'Deployment',
    },

    // API Reference
    {
      type: 'doc',
      id: 'api-reference',
      label: 'API Reference',
    },

    // Customization
    {
      type: 'doc',
      id: 'customization',
      label: 'Customization',
    },

    // Architecture
    {
      type: 'doc',
      id: 'architecture',
      label: 'Architecture',
    },

    // Troubleshooting
    {
      type: 'doc',
      id: 'troubleshooting',
      label: 'Troubleshooting',
    },

    // FAQ
    {
      type: 'doc',
      id: 'faq',
      label: 'FAQ',
    },
  ],
};

export default sidebars;