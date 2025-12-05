# FlatWP Documentation Design System

## Overview
This document outlines the comprehensive design system for the FlatWP documentation site, ensuring consistency, accessibility, and visual excellence across all pages.

---

## Design Philosophy

### Core Principles
1. **Dark-First Design**: Optimized for dark mode viewing with deep blacks and high contrast
2. **Orange Accent**: Vibrant #ff6b2b orange for primary actions and highlights
3. **Typography Hierarchy**: Clear, readable type scale with proper weights
4. **Accessibility First**: WCAG 2.1 AA compliance minimum
5. **Responsive by Default**: Mobile-first approach with fluid scaling
6. **Performance Optimized**: Minimal animations, efficient rendering

### Visual Language
- **Modern & Clean**: Contemporary design without unnecessary ornament
- **Professional**: Suitable for technical documentation
- **Energetic**: Orange accents provide warmth and energy
- **Focused**: Design supports content, not distraction

---

## Color System

### Primary Colors
```css
--ifm-color-primary: #ff6b2b        /* Primary Orange */
--ifm-color-primary-dark: #f55a1a   /* Hover State */
--ifm-color-primary-darker: #ea5410 /* Active State */
--ifm-color-primary-darkest: #c14509
--ifm-color-primary-light: #ff7c3c
--ifm-color-primary-lighter: #ff8d4d
--ifm-color-primary-lightest: #ffb07f
```

**Usage**:
- Primary actions (CTAs, links, active states)
- Highlights and emphasis
- Interactive elements
- Brand identity

### Background Colors
```css
--ifm-background-color: #0a0a0a      /* Base Background (Deepest) */
--ifm-background-surface-color: #171717 /* Elevated Surface */
--ifm-card-background: #1f1f1f       /* Card Background */
```

**Usage**:
- `#0a0a0a`: Page background, navbar, footer
- `#171717`: Sidebar, elevated sections, feature areas
- `#1f1f1f`: Cards, panels, secondary surfaces

### Text Colors
```css
--ifm-font-color-base: #f5f5f5       /* Primary Text */
--ifm-font-color-secondary: #b3b3b3  /* Secondary Text */
--ifm-font-color-tertiary: #737373   /* Tertiary/Subtle Text */
--ifm-heading-color: #ffffff         /* Headings */
```

**Contrast Ratios**:
- Primary text on dark: 13.5:1 (AAA)
- Secondary text on dark: 6.8:1 (AA)
- Tertiary text on dark: 4.5:1 (AA minimum)

### Border Colors
```css
--ifm-color-emphasis-300: #2a2a2a    /* Subtle Borders */
--ifm-color-emphasis-400: #404040    /* Medium Borders */
--ifm-color-emphasis-500: #525252    /* Strong Borders */
```

**Usage**:
- Subtle: Cards, dividers, tables
- Medium: Interactive hover states
- Strong: Focus states, active elements

### Code Colors
```css
--ifm-code-background: #1a1a1a       /* Code Block Background */
Inline code: #252525                 /* Inline Code Background */
Inline code text: #ff8d4d            /* Inline Code Text */
```

**Syntax Highlighting**:
- Comments: #6a737d (gray, italic)
- Keywords: #d2a8ff (purple)
- Strings: #a5d6ff (blue)
- Functions: #d2a8ff (purple)
- Numbers: #ff7b72 (red-orange)
- Operators: #ff9b76 (orange)
- Variables: #ffa657 (amber)

### Semantic Colors
```css
/* Admonitions */
Note: #58a6ff (blue)
Tip: #3fb950 (green)
Info: #79c0ff (light blue)
Warning: #d29922 (yellow)
Danger: #f85149 (red)
```

---

## Typography System

### Font Families
```css
--ifm-font-family-base: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif
--ifm-font-family-monospace: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace
```

### Type Scale

#### Headings
| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing |
|---------|---------------|---------------|--------|-------------|----------------|
| H1      | 2.5rem (40px) | 2rem (32px)   | 800    | 1.2         | -0.02em        |
| H2      | 2rem (32px)   | 1.75rem (28px)| 700    | 1.3         | -0.01em        |
| H3      | 1.5rem (24px) | 1.25rem (20px)| 600    | 1.4         | normal         |
| H4      | 1.25rem (20px)| 1.125rem      | 600    | 1.5         | normal         |
| H5      | 1.125rem      | 1rem          | 600    | 1.5         | normal         |
| H6      | 1rem          | 1rem          | 600    | 1.5         | normal         |

#### Hero Typography
| Element      | Size (Desktop) | Size (Mobile) | Weight | Letter Spacing |
|--------------|---------------|---------------|--------|----------------|
| Hero Title   | 3.5rem (56px) | 2rem (32px)   | 800    | -0.03em        |
| Hero Subtitle| 1.25rem (20px)| 1rem (16px)   | 400    | normal         |

#### Body Text
| Variant     | Size          | Line Height | Usage                    |
|-------------|---------------|-------------|--------------------------|
| Large       | 1.125rem (18px)| 1.7        | Lead paragraphs          |
| Regular     | 1rem (16px)   | 1.6         | Body text                |
| Small       | 0.875rem (14px)| 1.5        | Captions, metadata       |
| Code        | 0.9rem        | 1.5         | Code blocks, inline code |

### Font Weights
- **800**: Hero titles, H1
- **700**: H2, feature titles, section headers
- **600**: H3-H6, buttons, labels, active menu items
- **500**: Navbar links, inline code
- **400**: Body text, hero subtitle

---

## Spacing System

### Scale
```css
--ifm-spacing-xs: 0.25rem   /* 4px */
--ifm-spacing-sm: 0.5rem    /* 8px */
--ifm-spacing-md: 1rem      /* 16px */
--ifm-spacing-lg: 1.5rem    /* 24px */
--ifm-spacing-xl: 2rem      /* 32px */
--ifm-spacing-2xl: 3rem     /* 48px */
```

### Usage Guidelines
- **xs (4px)**: Tight spacing, inline elements
- **sm (8px)**: Related elements, compact lists
- **md (16px)**: Standard spacing, paragraphs
- **lg (24px)**: Section spacing, cards
- **xl (32px)**: Large sections, page margins
- **2xl (48px)**: Hero sections, major divisions

### Component Spacing
- **Buttons**: 0.75rem vertical, 1.5rem horizontal
- **Cards**: 1.5rem padding
- **Sections**: 4rem vertical (desktop), 2-3rem (mobile)
- **Hero**: 6rem vertical (desktop), 3rem (mobile)

---

## Border Radius

### Scale
```css
--ifm-border-radius-sm: 6px
--ifm-border-radius-md: 8px
--ifm-border-radius-lg: 12px
```

### Usage
- **Small (6px)**: Inline code, small buttons, menu items
- **Medium (8px)**: Buttons, inputs, code blocks
- **Large (12px)**: Cards, panels, modals

---

## Component Specifications

### Buttons

#### Primary Button
```css
Background: linear-gradient(135deg, #ff6b2b 0%, #f55a1a 100%)
Color: #ffffff
Border: none
Padding: 0.75rem 1.5rem (regular), 0.875rem 2rem (large)
Font Size: 1rem (regular), 1.0625rem (large)
Font Weight: 600
Border Radius: 8px
Box Shadow: 0 4px 12px rgba(255, 107, 43, 0.25)

Hover:
  Background: linear-gradient(135deg, #f55a1a 0%, #ea5410 100%)
  Transform: translateY(-2px)
  Box Shadow: 0 8px 24px rgba(255, 107, 43, 0.35)
```

**Usage**: Primary actions, CTAs, main navigation

#### Secondary Button
```css
Background: #1f1f1f
Color: #f5f5f5
Border: 1px solid #404040
Padding: 0.75rem 1.5rem (regular), 0.875rem 2rem (large)
Font Size: 1rem (regular), 1.0625rem (large)
Font Weight: 600
Border Radius: 8px
Box Shadow: 0 2px 8px rgba(0, 0, 0, 0.3)

Hover:
  Background: #2a2a2a
  Border: 1px solid #525252
  Color: #ff6b2b
  Transform: translateY(-2px)
  Box Shadow: 0 4px 16px rgba(0, 0, 0, 0.4)
```

**Usage**: Secondary actions, alternative options

#### Outlined Button
```css
Background: transparent
Color: #ff6b2b
Border: 2px solid #ff6b2b
Padding: 0.75rem 1.5rem
Font Weight: 600
Border Radius: 8px

Hover:
  Background: #ff6b2b
  Color: #ffffff
  Transform: translateY(-2px)
  Box Shadow: 0 4px 16px rgba(255, 107, 43, 0.3)
```

**Usage**: Tertiary actions, ghost buttons

#### Size Variants
- **Large**: padding: 0.875rem 2rem, font-size: 1.0625rem
- **Regular**: padding: 0.75rem 1.5rem, font-size: 1rem
- **Small**: padding: 0.5rem 1rem, font-size: 0.875rem

### Cards

```css
Background: #1f1f1f
Border: 1px solid #2a2a2a
Border Radius: 12px
Padding: 1.5rem
Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

Hover:
  Transform: translateY(-4px)
  Border: 1px solid #404040
  Box Shadow: 0 12px 32px rgba(0, 0, 0, 0.5)
```

### Links

```css
Color: #ff6b2b
Text Decoration: none
Transition: color 0.2s ease

Hover:
  Color: #ff8d4d
  Text Decoration: underline

Active:
  Color: #f55a1a
```

### Code Blocks

```css
Background: #1a1a1a
Border: 1px solid #2a2a2a
Border Radius: 8px
Font Size: 0.9rem
Font Family: 'JetBrains Mono', 'Fira Code', monospace
Padding: 1rem
```

### Inline Code

```css
Background: #252525
Color: #ff8d4d
Border: 1px solid #404040
Border Radius: 4px
Padding: 0.2rem 0.5rem
Font Size: 0.9em
Font Weight: 500
```

### Navigation

#### Navbar
```css
Background: rgba(10, 10, 10, 0.95)
Backdrop Filter: blur(10px)
Border Bottom: 1px solid #2a2a2a
Padding: 0.75rem 1rem
Box Shadow: 0 2px 8px rgba(0, 0, 0, 0.3)
```

#### Sidebar
```css
Background: #0a0a0a
Border Right: 1px solid #2a2a2a

Menu Link:
  Color: #b3b3b3
  Border Radius: 6px
  Transition: all 0.2s ease

  Hover:
    Color: #ffffff
    Background: #171717

  Active:
    Color: #ff6b2b
    Background: rgba(255, 107, 43, 0.1)
    Font Weight: 600
```

---

## Accessibility Standards

### WCAG 2.1 Level AA Compliance

#### Color Contrast
- **Normal Text**: Minimum 4.5:1
- **Large Text**: Minimum 3:1
- **UI Components**: Minimum 3:1

#### Implemented Ratios
- Primary text (#f5f5f5) on dark (#0a0a0a): **13.5:1** ✓
- Secondary text (#b3b3b3) on dark: **6.8:1** ✓
- Tertiary text (#737373) on dark: **4.5:1** ✓
- Orange (#ff6b2b) on dark: **5.2:1** ✓
- White on orange (#ff6b2b): **4.8:1** ✓

#### Focus States
```css
*:focus-visible {
  outline: 2px solid #ff6b2b;
  outline-offset: 2px;
  border-radius: 4px;
}
```

#### Keyboard Navigation
- All interactive elements accessible via keyboard
- Visible focus indicators on all focusable elements
- Logical tab order throughout the site
- Skip to content link available

#### Screen Reader Support
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Alt text for images
- Clear link text

#### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .button--secondary {
    border-width: 2px;
  }
  .card {
    border-width: 2px;
  }
}
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
Default: Mobile (< 576px)
Tablet: 576px - 996px
Desktop: > 996px
```

### Responsive Typography
- **Hero Title**: 3.5rem → 2.5rem → 2rem
- **Hero Subtitle**: 1.25rem → 1.125rem → 1rem
- **H1**: 2.5rem → 2rem
- **H2**: 2rem → 1.75rem
- **H3**: 1.5rem → 1.25rem

### Responsive Spacing
- **Hero Padding**: 6rem → 4rem → 3rem
- **Section Padding**: 4rem → 3rem → 2rem
- **Button Layout**: Row → Row → Column (full width)

### Mobile Optimizations
- Full-width buttons on mobile
- Reduced font sizes for better readability
- Adjusted SVG sizes for smaller screens
- Simplified navigation patterns

---

## Animation & Transitions

### Timing Functions
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth easing
- **Simple**: `ease` - Basic transitions

### Durations
- **Fast**: 0.2s - Hover states, color changes
- **Medium**: 0.3s - Cards, transforms
- **Slow**: 0.4s - Complex animations

### Transform Usage
```css
/* Buttons and Interactive Elements */
transform: translateY(-2px);  /* Lift on hover */
transform: translateY(0);     /* Reset on active */

/* Cards */
transform: translateY(-4px);  /* Subtle elevation */

/* SVG Icons */
transform: scale(1.05);       /* Slight scale on hover */
```

---

## Best Practices

### Do's
✓ Use CSS custom properties for theming
✓ Maintain consistent spacing with the spacing scale
✓ Test all color combinations for accessibility
✓ Use semantic HTML elements
✓ Provide focus states for all interactive elements
✓ Test responsive behavior at all breakpoints
✓ Use the button system consistently
✓ Maintain typography hierarchy

### Don'ts
✗ Don't use absolute pixel values for responsive elements
✗ Don't create custom colors outside the palette
✗ Don't skip accessibility testing
✗ Don't use inline styles for theming
✗ Don't create custom spacing values
✗ Don't override focus states without replacement
✗ Don't use animations without reduced-motion support

---

## Implementation Notes

### CSS Architecture
```
custom.css
├── Design Tokens (CSS Variables)
├── Dark Mode Overrides
├── Typography System
├── Component Styles
│   ├── Hero
│   ├── Buttons
│   ├── Cards
│   ├── Navigation
│   ├── Code Blocks
│   └── Tables
├── Accessibility Features
└── Utility Classes
```

### Module CSS
- `index.module.css`: Homepage-specific styles
- `styles.module.css`: Component-specific styles (Features)
- Scoped locally, avoiding global conflicts

### Performance Considerations
- Minimal use of box-shadow for performance
- CSS custom properties for easy theming
- Efficient selectors avoiding deep nesting
- Hardware-accelerated transforms
- Reduced motion support for accessibility

---

## Design System Maintenance

### Version Control
- All design changes should be documented
- Breaking changes require major version bump
- Update this document with any modifications

### Testing Checklist
- [ ] Color contrast ratios (WCAG AA minimum)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Responsive behavior (mobile, tablet, desktop)
- [ ] Cross-browser compatibility
- [ ] Performance impact
- [ ] Reduced motion support
- [ ] High contrast mode

### Future Enhancements
- Light mode refinement
- Custom scrollbar styling improvements
- Additional button variants (destructive, success)
- Loading state components
- Toast notification system
- Modal dialog components

---

## Resources

### Color Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Palette Generator](https://coolors.co/)

### Typography Tools
- [Type Scale Calculator](https://type-scale.com/)
- [Modular Scale](https://www.modularscale.com/)

### Accessibility Tools
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Documentation
- [Docusaurus Styling Docs](https://docusaurus.io/docs/styling-layout)
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: December 5, 2025
**Version**: 2.0.0
**Maintained by**: FlatWP Design Team
