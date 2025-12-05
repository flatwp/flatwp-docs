---
sidebar_position: 4
---

# Customization Guide

Learn how to customize FlatWP to match your brand and add new features.

## Quick Customization

### Change Colors

The easiest way to customize FlatWP is by changing the color scheme.

#### 1. Update Tailwind Configuration

Edit `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Change these to your brand colors
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Main primary color
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',  // Main secondary color
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

#### 2. Use Your Colors

Now use your colors in components:

```tsx
// Button with primary color
<button className="bg-primary-500 hover:bg-primary-600 text-white">
  Click Me
</button>

// Text with secondary color
<p className="text-secondary-700">
  Some text content
</p>
```

### Change Fonts

#### 1. Add Google Fonts

Edit `app/layout.tsx`:

```tsx
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

#### 2. Configure Tailwind

Update `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-sans)'],
      serif: ['var(--font-serif)'],
    },
  },
},
```

#### 3. Use in Components

```tsx
<h1 className="font-serif text-4xl">
  Elegant Heading
</h1>
<p className="font-sans">
  Body text
</p>
```

## Component Customization

### Customize Navigation

Edit `components/Navigation.tsx`:

```tsx
export function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              YourBrand
            </Link>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="text-gray-700 hover:text-primary-600">
              About
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-primary-600">
              Services
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-primary-600">
              Blog
            </Link>
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### Customize Footer

Edit `components/Footer.tsx`:

```tsx
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">YourBrand</h3>
            <p className="text-gray-400">
              Building amazing websites since 2024.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/support">Support</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          © {new Date().getFullYear()} YourBrand. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

### Add New Block Component

Create a custom block for your content:

```tsx
// components/blocks/TimelineBlock.tsx

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineBlockProps {
  fields: {
    heading: string;
    items: TimelineItem[];
  };
}

export function TimelineBlock({ fields }: TimelineBlockProps) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12">
          {fields.heading}
        </h2>

        <div className="space-y-8">
          {fields.items.map((item, index) => (
            <div key={index} className="flex gap-6">
              {/* Year Badge */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                  {item.year}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-2xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Advanced Customization

### Create Custom Hooks

Create reusable logic with custom hooks:

```tsx
// hooks/useScrollPosition.ts

import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

// Usage in components
function Header() {
  const scrollY = useScrollPosition();
  const isScrolled = scrollY > 50;

  return (
    <header className={isScrolled ? 'bg-white shadow' : 'bg-transparent'}>
      {/* Header content */}
    </header>
  );
}
```

### Add Animation

Use Framer Motion for smooth animations:

```bash
npm install framer-motion
```

```tsx
// components/AnimatedSection.tsx

'use client';

import { motion } from 'framer-motion';

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

// Usage
<AnimatedSection>
  <h2>This will fade in when scrolled into view</h2>
</AnimatedSection>
```

### Add Dark Mode

Implement dark mode support:

```tsx
// app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}

// In Tailwind config
module.exports = {
  darkMode: 'class',
  // ... rest of config
}

// Usage in components
<div className="bg-white dark:bg-gray-800">
  <h1 className="text-gray-900 dark:text-white">
    Adapts to dark mode
  </h1>
</div>
```

### Custom WordPress Data

Query additional WordPress data:

```tsx
// lib/wordpress/queries/custom.ts

import { gql } from '@apollo/client';

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers {
      nodes {
        id
        title
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        customFields {
          role
          linkedin
          twitter
        }
      }
    }
  }
`;

// Usage in page
async function TeamPage() {
  const { data } = await client.query({
    query: GET_TEAM_MEMBERS,
  });

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {data.teamMembers.nodes.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}
```

## Form Customization

### Customize Contact Form

Edit `components/ContactForm.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-green-800 font-semibold">Thanks for reaching out!</h3>
        <p className="text-green-700">We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email *
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Company Field (Optional) */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium mb-2">
          Company
        </label>
        <input
          {...register('company')}
          type="text"
          id="company"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message *
        </label>
        <textarea
          {...register('message')}
          id="message"
          rows={5}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
        {errors.message && (
          <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

## SEO Customization

### Update Metadata

Edit `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | YourBrand',
    default: 'YourBrand - Professional Web Development',
  },
  description: 'We build modern, fast websites that grow your business.',
  keywords: ['web development', 'nextjs', 'react', 'wordpress'],
  authors: [{ name: 'YourBrand' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourbrand.com',
    siteName: 'YourBrand',
    images: [
      {
        url: 'https://yourbrand.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YourBrand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourbrand',
    creator: '@yourbrand',
  },
};
```

## Environment-Specific Customization

### Development vs Production

```tsx
// lib/config.ts

export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  wordpressUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '',

  // Feature flags
  features: {
    darkMode: true,
    search: true,
    comments: false,
  },

  // Analytics
  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    gaId: process.env.NEXT_PUBLIC_GA_ID,
  },
};

// Usage
import { config } from '@/lib/config';

if (config.features.darkMode) {
  // Enable dark mode toggle
}
```

## Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      className="rounded-lg"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### Code Splitting

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable server-side rendering if not needed
});

export function Page() {
  return (
    <div>
      <h1>Page Title</h1>
      <HeavyComponent />
    </div>
  );
}
```

## Testing Your Customizations

### Manual Testing Checklist

- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Check all navigation links work
- [ ] Verify forms submit correctly
- [ ] Test with real WordPress content
- [ ] Check page load speed
- [ ] Verify images load properly
- [ ] Test dark mode (if enabled)
- [ ] Check browser console for errors

### Browser Testing

Test your customizations in:
- Chrome/Edge
- Firefox
- Safari (Mac/iOS)
- Mobile browsers

## Common Customization Tasks

### Change Logo

Replace `public/logo.svg` with your logo, or update the Navigation component:

```tsx
<Image
  src="/your-logo.png"
  alt="Your Brand"
  width={150}
  height={40}
/>
```

### Add Google Analytics

```tsx
// app/layout.tsx

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Add Custom CSS

Create `app/custom.css`:

```css
/* Custom styles */
.btn-primary {
  @apply bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors;
}

.card {
  @apply bg-white shadow-lg rounded-lg p-6;
}
```

Import in `app/layout.tsx`:

```tsx
import './custom.css';
```

## Get Help

Need help with customization?

- Check [GitHub Discussions](https://github.com/flatwp/flatwp-starter/discussions)
- Browse [GitHub Issues](https://github.com/flatwp/flatwp-starter/issues)
- Visit [flatwp.com](https://flatwp.com)

## Next Steps

- [Configuration](/docs/configuration) - Advanced configuration options
- [WordPress Plugin](/docs/wordpress-plugin) - Learn about the React dashboard
- [Deployment](/docs/deployment) - Deploy your customized site
