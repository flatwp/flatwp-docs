---
sidebar_position: 8
---

# API Reference

Complete reference for FlatWP's API routes, GraphQL queries, and helper functions.

## API Routes

FlatWP includes several API routes for handling revalidation, preview mode, and contact forms.

### Revalidation API

**Endpoint**: `POST /api/revalidate`

Triggers on-demand revalidation of specific paths.

**Request**:

```typescript
{
  secret: string;      // Must match REVALIDATION_SECRET
  paths: string[];     // Array of paths to revalidate
}
```

**Example**:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "paths": ["/", "/blog", "/blog/my-post"]
  }'
```

**Response**:

```typescript
// Success
{
  revalidated: true;
  paths: string[];
}

// Error
{
  error: string;
}
```

**Status Codes**:
- `200` - Success
- `401` - Invalid secret
- `500` - Server error

### Preview API

**Endpoint**: `GET /api/preview`

Enables draft mode for previewing unpublished content.

**Query Parameters**:

```typescript
{
  secret: string;    // Must match PREVIEW_SECRET
  id: string;        // Post/page ID or slug
  type?: string;     // Optional: 'post' | 'page' (default: 'post')
}
```

**Example**:

```
GET /api/preview?secret=your-secret&id=hello-world&type=post
```

**Response**:
- Redirects to the preview URL with draft mode enabled
- Sets draft mode cookie
- Returns 401 if secret is invalid

### Exit Preview API

**Endpoint**: `GET /api/exit-preview`

Disables draft mode.

**Example**:

```
GET /api/exit-preview
```

**Response**:
- Clears draft mode cookie
- Redirects to homepage

### Contact Form API

**Endpoint**: `POST /api/contact`

Handles contact form submissions.

**Request**:

```typescript
{
  name: string;
  email: string;
  message: string;
  company?: string;
}
```

**Example**:

```typescript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!'
  })
});
```

**Response**:

```typescript
// Success
{
  success: true;
  message: string;
}

// Error
{
  success: false;
  error: string;
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid input
- `500` - Server error

## GraphQL Queries

### Get All Posts

**File**: `graphql/queries/get-posts.graphql`

```graphql
query GetPosts($first: Int = 10, $after: String) {
  posts(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      title
      slug
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

**Usage**:

```typescript
import { GetPostsDocument } from '@/graphql/generated';
import { getClient } from '@/lib/wordpress/client';

const { data } = await getClient().query({
  query: GetPostsDocument,
  variables: { first: 10 }
});
```

### Get Single Post

**File**: `graphql/queries/get-post.graphql`

```graphql
query GetPost($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    id
    title
    content
    slug
    date
    modified
    featuredImage {
      node {
        sourceUrl
        altText
        blurDataUrl
      }
    }
    author {
      node {
        name
        description
        avatar {
          url
        }
      }
    }
    seo {
      title
      metaDesc
      canonical
      opengraphImage {
        sourceUrl
      }
    }
  }
}
```

### Get Pages

**File**: `graphql/queries/get-pages.graphql`

```graphql
query GetPages {
  pages(first: 100) {
    nodes {
      id
      title
      slug
      uri

      # FlatWP Settings
      flatwpSettings {
        hideTitle
        containerWidth
        hideHeader
        hideFooter
        customCssClass
        showSidebar
      }

      # Page Builder Content
      flexibleContent {
        __typename
        ... on Page_Flexiblecontent_FlexibleContent_HeroCentered {
          heading
          subheading
          buttonText
          buttonUrl
        }
        ... on Page_Flexiblecontent_FlexibleContent_HeroSplit {
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
        ... on Page_Flexiblecontent_FlexibleContent_FeaturesGrid {
          sectionHeading
          features {
            icon
            title
            description
          }
        }
        # Add other block types...
      }

      # Sidebar Content (if enabled)
      sidebarBlocks {
        __typename
        ... on Page_Sidebarblocks_SidebarBlocks_ContentSection {
          title
          content
        }
        ... on Page_Sidebarblocks_SidebarBlocks_CtaSimple {
          heading
          text
          buttonText
          buttonUrl
        }
      }
    }
  }
}
```

### Get Navigation Menu

**File**: `graphql/queries/get-menu.graphql`

```graphql
query GetMenu($location: MenuLocationEnum!) {
  menuItems(where: { location: $location }, first: 100) {
    nodes {
      id
      label
      url
      path
      parentId
      order
      target
      cssClasses
    }
  }
}
```

**Locations**:
- `PRIMARY` - Main navigation
- `FOOTER` - Footer menu

### Get Site Settings

**File**: `graphql/queries/get-settings.graphql`

```graphql
query GetSettings {
  generalSettings {
    title
    description
    url
    language
    timezone
  }
}
```

## Helper Functions

### WordPress Client

**File**: `lib/wordpress/client.ts`

```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client';

export function getClient() {
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    cache: new InMemoryCache(),
  });
}
```

**Usage**:

```typescript
import { getClient } from '@/lib/wordpress/client';
import { GetPostsDocument } from '@/graphql/generated';

const client = getClient();
const { data } = await client.query({
  query: GetPostsDocument
});
```

### Data Transformers

**File**: `lib/wordpress/transformers.ts`

Transform WordPress data into clean, type-safe objects.

```typescript
// Transform WordPress post to clean format
export function transformPost(post: WpPost): Post {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    author: {
      name: post.author.node.name,
      avatar: post.author.node.avatar?.url
    },
    featuredImage: post.featuredImage?.node ? {
      url: post.featuredImage.node.sourceUrl,
      alt: post.featuredImage.node.altText,
      blurDataUrl: post.featuredImage.node.blurDataUrl
    } : null,
    categories: post.categories?.nodes.map(cat => ({
      name: cat.name,
      slug: cat.slug
    })) || []
  };
}
```

### Image Helpers

**File**: `lib/image-helpers.ts`

```typescript
// Get responsive image sizes
export function getImageSizes(width: number) {
  return {
    sm: Math.round(width * 0.5),
    md: Math.round(width * 0.75),
    lg: width,
    xl: Math.round(width * 1.5),
  };
}

// Generate srcset for responsive images
export function generateSrcSet(baseUrl: string, sizes: number[]) {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

// Get optimized image URL
export function getOptimizedImageUrl(
  url: string,
  width: number,
  quality: number = 85
) {
  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    fm: 'webp'
  });
  return `${url}?${params.toString()}`;
}
```

### Metadata Helpers

**File**: `lib/metadata.ts`

Generate Next.js metadata for SEO.

```typescript
import type { Metadata } from 'next';

export function generatePageMetadata(page: {
  title: string;
  excerpt?: string;
  seo?: {
    title?: string;
    metaDesc?: string;
    opengraphImage?: {
      sourceUrl: string;
    };
  };
}): Metadata {
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.metaDesc || page.excerpt,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.metaDesc || page.excerpt,
      images: page.seo?.opengraphImage ? [
        {
          url: page.seo.opengraphImage.sourceUrl,
          width: 1200,
          height: 630,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.seo?.title || page.title,
      description: page.seo?.metaDesc || page.excerpt,
    },
  };
}
```

## Type Definitions

### Post Types

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  featuredImage: {
    url: string;
    alt: string;
    blurDataUrl?: string;
  } | null;
  categories: Array<{
    name: string;
    slug: string;
  }>;
  seo?: SEOData;
}
```

### Page Types

```typescript
interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  settings: PageSettings;
  blocks: FlexibleContent[];
  sidebar?: SidebarBlock[];
  seo?: SEOData;
}

interface PageSettings {
  hideTitle?: boolean;
  containerWidth?: 'default' | 'contained' | 'full';
  hideHeader?: boolean;
  hideFooter?: boolean;
  customCssClass?: string;
  showSidebar?: boolean;
}
```

### Block Types

```typescript
type FlexibleContent =
  | HeroCenteredBlock
  | HeroSplitBlock
  | FeaturesGridBlock
  | ContentSectionBlock
  | PricingBlock
  | TestimonialsBlock
  | CTASimpleBlock
  | CTABoxedBlock;

interface HeroCenteredBlock {
  __typename: 'Page_Flexiblecontent_FlexibleContent_HeroCentered';
  heading: string;
  subheading: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface HeroSplitBlock {
  __typename: 'Page_Flexiblecontent_FlexibleContent_HeroSplit';
  heading: string;
  subheading: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: {
    sourceUrl: string;
    altText: string;
  };
  imagePosition: 'left' | 'right';
}

// Additional block types...
```

### SEO Types

```typescript
interface SEOData {
  title?: string;
  metaDesc?: string;
  canonical?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphImage?: {
    sourceUrl: string;
  };
  twitterTitle?: string;
  twitterDescription?: string;
}
```

## Environment Variables

### Required Variables

```env
# WordPress GraphQL endpoint
NEXT_PUBLIC_WORDPRESS_API_URL=https://yoursite.com/graphql

# Your site's public URL
NEXT_PUBLIC_SITE_URL=https://yoursite.com

# Webhook secret for revalidation
REVALIDATION_SECRET=random-secret-string

# Preview mode secret
PREVIEW_SECRET=another-random-secret
```

### Optional Variables

```env
# Email integration (Resend)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yoursite.com
RESEND_AUDIENCE_EMAIL=aud_your_audience_id

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto

# Debug mode
DEBUG=false
NEXT_PUBLIC_DEBUG=false

# Build optimization
ANALYZE=false
```

## Hooks

### useWordPress

Custom hook for fetching WordPress data with caching.

```typescript
import { useQuery } from '@apollo/client';
import { GetPostsDocument } from '@/graphql/generated';

export function useWordPress() {
  const { data, loading, error } = useQuery(GetPostsDocument);

  return {
    posts: data?.posts.nodes || [],
    loading,
    error
  };
}
```

### usePreview

Hook for handling preview mode.

```typescript
import { draftMode } from 'next/headers';

export function usePreview() {
  const { isEnabled } = draftMode();

  return {
    isPreview: isEnabled,
    exitPreview: () => fetch('/api/exit-preview')
  };
}
```

## Utilities

### Formatting Functions

```typescript
// Format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Strip HTML tags
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Get reading time
export function getReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200); // Assume 200 words per minute
}
```

### Validation

```typescript
import { z } from 'zod';

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

## Error Handling

### Custom Error Classes

```typescript
export class WordPressError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'WordPressError';
  }
}

export class GraphQLError extends Error {
  constructor(
    message: string,
    public errors: any[]
  ) {
    super(message);
    this.name = 'GraphQLError';
  }
}
```

### Error Handler

```typescript
export function handleApiError(error: unknown) {
  if (error instanceof WordPressError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      details: error.details
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      statusCode: 500
    };
  }

  return {
    error: 'An unknown error occurred',
    statusCode: 500
  };
}
```

## Best Practices

### API Route Security

```typescript
// Verify secret for protected routes
function verifySecret(secret: string | undefined): boolean {
  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return false;
  }
  return true;
}

// Rate limiting (implement with Upstash or similar)
async function rateLimit(identifier: string): Promise<boolean> {
  // Implementation depends on your rate limiting solution
  return true;
}
```

### GraphQL Query Optimization

```typescript
// Use fragments for repeated fields
const POST_FRAGMENT = `
  fragment PostFields on Post {
    id
    title
    slug
    excerpt
    date
  }
`;

// Batch queries when possible
const GET_POSTS_AND_PAGES = `
  query GetContent {
    posts(first: 10) {
      nodes {
        ...PostFields
      }
    }
    pages(first: 10) {
      nodes {
        ...PageFields
      }
    }
  }
  ${POST_FRAGMENT}
  ${PAGE_FRAGMENT}
`;
```

## Next Steps

- [Customization Guide](/docs/customization) - Extend the API
- [Architecture](/docs/architecture) - Understand the system design
- [Troubleshooting](/docs/troubleshooting) - Common API issues
