---
sidebar_position: 3
---

# ACF Setup Guide

Learn how to set up Advanced Custom Fields (ACF) with FlatWP and create custom page layouts.

## Overview

FlatWP uses ACF to create flexible page layouts with content blocks. The plugin automatically registers all necessary fields - you just need to install ACF and start using them!

## Prerequisites

Before starting, make sure you have:

- WordPress installed and running
- FlatWP Companion plugin activated
- **ACF Pro** installed (recommended) or ACF Free

:::tip Get ACF Pro
ACF Pro is recommended for the full FlatWP experience. Get it from [advancedcustomfields.com](https://www.advancedcustomfields.com/)
:::

## Installation

### Step 1: Install ACF Pro

1. Purchase ACF Pro from [advancedcustomfields.com](https://www.advancedcustomfields.com/)
2. Download the plugin ZIP file
3. In WordPress, go to **Plugins → Add New → Upload Plugin**
4. Upload the ACF Pro ZIP file
5. Click **Install Now**, then **Activate**

### Step 2: Verify FlatWP Fields

After activating ACF, the FlatWP fields are automatically registered! Let's verify:

1. Go to **Pages → Add New**
2. You should see three new sections:
   - **FlatWP Page Settings** (right sidebar)
   - **Page Builder** (main content area)
   - **Page Sidebar Content** (below page builder)

If you see these sections, you're all set! 🎉

## Available Block Types

### Content Blocks (Main Page Builder)

These blocks appear in the main content area:

#### 1. Hero - Centered
Full-width hero section with centered content.

**Fields**:
- Heading (text)
- Subheading (text)
- Button Text (text)
- Button URL (text)

**Usage**: Homepage hero, landing pages

#### 2. Hero - Split with Image
Hero with content on one side and image on the other.

**Fields**:
- Heading (text)
- Subheading (text)
- Content (WYSIWYG editor)
- Button Text (text)
- Button URL (text)
- Image (image upload)
- Image Position (left/right)

**Usage**: Feature showcases, product pages

#### 3. Features Grid
Display features in a responsive grid layout.

**Fields**:
- Section Heading (text)
- Features (repeater)
  - Icon (icon picker or image)
  - Title (text)
  - Description (textarea)

**Usage**: Service listings, feature highlights

#### 4. Content Section
Rich content block with optional image.

**Fields**:
- Heading (text)
- Content (WYSIWYG editor)
- Image (optional image upload)

**Usage**: About pages, informational content

#### 5. Pricing
Pricing table with multiple plans.

**Fields**:
- Section Heading (text)
- Plans (repeater)
  - Plan Name (text)
  - Price (text)
  - Features (repeater)
  - Button Text (text)
  - Button URL (text)

**Usage**: Pricing pages, membership tiers

#### 6. Testimonials
Customer testimonials in a carousel or grid.

**Fields**:
- Section Heading (text)
- Testimonials (repeater)
  - Quote (textarea)
  - Author Name (text)
  - Author Role (text)
  - Author Image (image upload)

**Usage**: Social proof, reviews

#### 7. CTA - Simple
Simple call-to-action section.

**Fields**:
- Heading (text)
- Text (textarea)
- Button Text (text)
- Button URL (text)

**Usage**: Newsletter signups, contact prompts

#### 8. CTA - Boxed
Highlighted call-to-action in a colored box.

**Fields**:
- Heading (text)
- Text (textarea)
- Button Text (text)
- Button URL (text)
- Background Color (color picker)

**Usage**: Important CTAs, special offers

### Sidebar Blocks

These blocks appear in the page sidebar (when enabled):

#### 1. Content Widget
Simple content widget for sidebar.

**Fields**:
- Title (text, optional)
- Content (WYSIWYG editor)

**Usage**: About info, additional content

#### 2. CTA Widget
Call-to-action widget for sidebar.

**Fields**:
- Heading (text)
- Text (textarea, optional)
- Button Text (text)
- Button URL (text)

**Usage**: Download links, contact buttons

## Page Settings

Control page layout and behavior:

- **Hide Title**: Hide the page title
- **Container Width**: Default, Contained, or Full Width
- **Hide Header**: Remove site header on this page
- **Hide Footer**: Remove site footer on this page
- **Custom CSS Classes**: Add custom CSS classes
- **Show Sidebar**: Enable sidebar for this page

## Creating Your First Page

Let's create a simple landing page to see how everything works together.

### Example: Service Landing Page

1. **Create New Page**
   - Go to **Pages → Add New**
   - Title: "Our Services"

2. **Configure Page Settings** (right sidebar)
   - Leave "Show Sidebar" unchecked
   - Container Width: "Default"
   - Leave other settings as is

3. **Add Hero Block**
   - Click "Add Content Block"
   - Select "Hero - Centered"
   - Fill in:
     - Heading: "Professional Web Development Services"
     - Subheading: "We build modern, fast websites that grow your business"
     - Button Text: "Get Started"
     - Button URL: "/contact"

4. **Add Features Block**
   - Click "Add Content Block"
   - Select "Features Grid"
   - Section Heading: "What We Offer"
   - Add 3 features:
     - Feature 1: Title: "Custom Development", Description: "Tailored solutions for your needs"
     - Feature 2: Title: "Performance Optimization", Description: "Lightning-fast loading speeds"
     - Feature 3: Title: "Ongoing Support", Description: "We're here when you need us"

5. **Add CTA Block**
   - Click "Add Content Block"
   - Select "CTA - Boxed"
   - Fill in:
     - Heading: "Ready to Get Started?"
     - Text: "Let's discuss your project"
     - Button Text: "Contact Us"
     - Button URL: "/contact"

6. **Publish**
   - Click "Publish" button
   - Visit your page to see it live!

## Example: Blog Post with Sidebar

Let's create a blog post with sidebar content.

1. **Create New Page**
   - Title: "About Our Company"

2. **Enable Sidebar**
   - In Page Settings, check "Show Sidebar"

3. **Add Main Content**
   - Click "Add Content Block"
   - Select "Content Section"
   - Heading: "Our Story"
   - Content: Write your company story

4. **Add Sidebar Content**
   - Scroll to "Page Sidebar Content"
   - Click "Add Sidebar Block"
   - Select "Content Widget"
   - Title: "Quick Facts"
   - Content: Add bullet points about your company

5. **Add Sidebar CTA**
   - Click "Add Sidebar Block"
   - Select "CTA Widget"
   - Heading: "Join Our Team"
   - Text: "We're hiring!"
   - Button Text: "See Open Positions"
   - Button URL: "/careers"

6. **Publish and View**

## Code Examples

### Querying ACF Data in Next.js

The page data including ACF fields is automatically available in your Next.js app through GraphQL.

```typescript
// Already set up in your starter template
// lib/wordpress/queries/pages.ts

import { gql } from '@apollo/client';

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      title
      content

      # Page settings
      flatwpSettings {
        hideTitle
        containerWidth
        hideHeader
        hideFooter
        customCssClass
        showSidebar
      }

      # Content blocks
      flexibleContent {
        ... on Page_Flexiblecontent_FlexibleContent_HeroCentered {
          fieldGroupName
          heading
          subheading
          buttonText
          buttonUrl
        }
        ... on Page_Flexiblecontent_FlexibleContent_HeroSplit {
          fieldGroupName
          heading
          subheading
          content
          buttonText
          buttonUrl
          image {
            sourceUrl
            altText
          }
          imagePosition
        }
        # ... other block types
      }

      # Sidebar blocks (if enabled)
      sidebarBlocks {
        ... on Page_Sidebarblocks_SidebarBlocks_ContentSection {
          fieldGroupName
          title
          content
        }
        ... on Page_Sidebarblocks_SidebarBlocks_CtaSimple {
          fieldGroupName
          heading
          text
          buttonText
          buttonUrl
        }
      }
    }
  }
`;
```

### Creating Custom Block Components

Want to add your own block type? Here's how:

```typescript
// components/blocks/CustomBlock.tsx

interface CustomBlockProps {
  fields: {
    heading: string;
    description: string;
    image?: {
      sourceUrl: string;
      altText: string;
    };
  };
}

export function CustomBlock({ fields }: CustomBlockProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-4">
          {fields.heading}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {fields.description}
        </p>
        {fields.image && (
          <img
            src={fields.image.sourceUrl}
            alt={fields.image.altText}
            className="rounded-lg shadow-lg"
          />
        )}
      </div>
    </section>
  );
}
```

Then register it in your block renderer:

```typescript
// components/BlockRenderer.tsx

import { CustomBlock } from './blocks/CustomBlock';

export function BlockRenderer({ blocks }: { blocks: any[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.fieldGroupName) {
          case 'Page_Flexiblecontent_FlexibleContent_HeroCentered':
            return <HeroBlock key={index} fields={block} />;

          case 'Page_Flexiblecontent_FlexibleContent_CustomBlock':
            return <CustomBlock key={index} fields={block} />;

          // ... other cases

          default:
            return null;
        }
      })}
    </>
  );
}
```

### Adding Custom ACF Fields (WordPress)

To add your own block type in WordPress:

```php
// In your theme's functions.php or custom plugin

add_action('acf/init', 'register_custom_block');

function register_custom_block() {
    // Only run if ACF is active
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_custom_block',
        'title' => 'Custom Block',
        'fields' => [
            [
                'key' => 'field_custom_heading',
                'label' => 'Heading',
                'name' => 'heading',
                'type' => 'text',
                'required' => 1,
            ],
            [
                'key' => 'field_custom_description',
                'label' => 'Description',
                'name' => 'description',
                'type' => 'textarea',
            ],
            [
                'key' => 'field_custom_image',
                'label' => 'Image',
                'name' => 'image',
                'type' => 'image',
                'return_format' => 'array',
            ],
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'page',
                ],
            ],
        ],
    ]);
}
```

## Troubleshooting

### ACF Fields Not Showing

**Problem**: Meta boxes don't appear when editing a page

**Solutions**:
1. Verify ACF Pro is installed and activated
2. Check that FlatWP Companion plugin is activated
3. Try deactivating and reactivating the FlatWP plugin
4. Clear WordPress cache if using a caching plugin
5. Check for JavaScript errors in browser console

### Blocks Not Rendering on Frontend

**Problem**: Blocks added in WordPress don't appear on the Next.js site

**Solutions**:
1. Verify "Show Sidebar" is checked for sidebar blocks
2. Run `npm run graphql:codegen` to regenerate types
3. Check browser console for React errors
4. Verify the block is included in your GraphQL query
5. Check that the block component exists in `components/blocks/`

### GraphQL Fields Missing

**Problem**: ACF fields not appearing in GraphQL schema

**Solutions**:
1. Install WPGraphQL for ACF plugin
2. Go to **Settings → GraphQL** and click "Flush Permalinks"
3. Verify fields are set to "Show in GraphQL"
4. Check field group is assigned to correct post type
5. Run `npm run graphql:codegen` again

### Styling Issues

**Problem**: Blocks don't look right on the frontend

**Solutions**:
1. Check that TailwindCSS classes are applied correctly
2. Verify images have proper `alt` text and source URLs
3. Test responsive design on different screen sizes
4. Check browser console for CSS errors
5. Ensure Tailwind configuration includes your component paths

## Best Practices

### Content Organization

1. **Use Clear Block Names**: Help editors understand what each block does
2. **Group Related Content**: Use Content Sections to group related info
3. **Limit Block Count**: 5-7 blocks per page for best performance
4. **Test on Mobile**: Always check how blocks look on mobile devices

### Performance

1. **Optimize Images**: Compress images before uploading to WordPress
2. **Use Alt Text**: Always add alt text for accessibility and SEO
3. **Cache Strategy**: Let FlatWP handle caching automatically
4. **Minimize Blocks**: More blocks = longer page load times

### SEO

1. **Use Headings**: Structure content with proper heading hierarchy
2. **Write Good Content**: ACF blocks should contain valuable content
3. **Image Alt Text**: Describe images for search engines
4. **Internal Links**: Link between your pages in block content

## Next Steps

Now that you know how to use ACF with FlatWP:

1. **[Customization Guide](/docs/customization)** - Customize colors and components
2. **[Configuration](/docs/configuration)** - Advanced configuration
3. **[Deployment](/docs/deployment)** - Deploy your site

## Questions?

- Check [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
- Report issues on [GitHub Issues](https://github.com/flatwp/flatwp-starter/issues)
- Visit [flatwp.com](https://flatwp.com) for more resources
