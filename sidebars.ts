import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * FlatWP Documentation Sidebar
 * Organized by user journey: Getting Started → Setup → Customization → Advanced
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Getting Started',
    },
    {
      type: 'doc',
      id: 'quick-start',
      label: 'Quick Start',
    },
    {
      type: 'category',
      label: 'Setup & Configuration',
      collapsed: false,
      items: [
        'acf-setup',
        'wordpress-plugin',
        {
          type: 'category',
          label: 'Configuration System',
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
      ],
    },
    {
      type: 'category',
      label: 'Customization',
      collapsed: false,
      items: [
        'customization',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      collapsed: true,
      items: [
        'architecture',
        'deployment',
        'api-reference',
      ],
    },
    {
      type: 'category',
      label: 'Help & Support',
      collapsed: false,
      items: [
        'faq',
        'troubleshooting',
      ],
    },
  ],
};

export default sidebars;
