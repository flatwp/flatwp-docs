# Design System Quick Reference
**FlatWP Documentation - Cheat Sheet**

## Colors

### Primary Palette
```css
/* Orange */
#ff6b2b  /* Primary - Buttons, Links, Active States */
#f55a1a  /* Dark - Hover States */
#ff8d4d  /* Light - Secondary Links */

/* Backgrounds */
#0a0a0a  /* Base - Page Background */
#171717  /* Surface - Elevated Sections */
#1f1f1f  /* Card - Card Backgrounds */

/* Text */
#ffffff  /* Headings */
#f5f5f5  /* Primary Body Text */
#b3b3b3  /* Secondary Text */
#737373  /* Tertiary/Subtle Text */

/* Borders */
#2a2a2a  /* Subtle Borders */
#404040  /* Medium Borders */
#525252  /* Strong Borders/Focus */
```

## Typography

### Heading Sizes
```
Desktop → Mobile

H1: 2.5rem → 2rem (weight: 800)
H2: 2rem → 1.75rem (weight: 700)
H3: 1.5rem → 1.25rem (weight: 600)
Hero Title: 3.5rem → 2rem (weight: 800)
Body: 1rem (weight: 400)
```

### Font Families
```css
Body: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif
Code: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace
```

## Spacing

```
xs:  0.25rem (4px)
sm:  0.5rem  (8px)
md:  1rem    (16px)  ← Standard
lg:  1.5rem  (24px)
xl:  2rem    (32px)
2xl: 3rem    (48px)
```

## Border Radius

```
sm: 6px   (inline code, menu items)
md: 8px   (buttons, code blocks)  ← Standard
lg: 12px  (cards, panels)
```

## Buttons

### Primary
```css
background: linear-gradient(135deg, #ff6b2b, #f55a1a);
color: #ffffff;
padding: 0.875rem 2rem; /* Large */
```

### Secondary
```css
background: #1f1f1f;
border: 1px solid #404040;
color: #f5f5f5;
```
Hover → Color changes to #ff6b2b

### Outlined
```css
background: transparent;
border: 2px solid #ff6b2b;
color: #ff6b2b;
```
Hover → Fills with orange, text becomes white

## Common CSS Variables

```css
/* Use in your code */
var(--ifm-color-primary)
var(--ifm-background-color)
var(--ifm-font-color-base)
var(--ifm-spacing-md)
var(--ifm-border-radius-md)
```

## Breakpoints

```
Mobile:  < 576px    (full-width buttons)
Tablet:  576-996px  (medium sizing)
Desktop: > 996px    (full sizing)
```

## Accessibility

### Minimum Contrast Ratios
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

### Our Ratios
- Primary text: 13.5:1 ✓ AAA
- Secondary text: 6.8:1 ✓ AA
- Orange on dark: 5.2:1 ✓ AA

## Code Examples

### Button Usage
```tsx
<Link className="button button--primary button--lg">
  Primary Action
</Link>

<Link className="button button--secondary button--lg">
  Secondary Action
</Link>

<Link className="button button--outline">
  Outlined Action
</Link>
```

### Utility Classes
```tsx
<div className="margin-bottom--lg padding--md">
  Content
</div>
```

### Responsive Text
```tsx
<p className="text-lg">Large body text</p>
<p className="text-sm">Small caption text</p>
```

## Animation

### Durations
```
Fast:   0.2s (color changes)
Medium: 0.3s (transforms)
```

### Easing
```css
cubic-bezier(0.4, 0, 0.2, 1)
```

### Common Transforms
```css
/* Hover lift */
transform: translateY(-2px);

/* Card elevation */
transform: translateY(-4px);
```

## Checklist for New Components

- [ ] Uses colors from palette
- [ ] Follows spacing scale
- [ ] Has proper focus states
- [ ] Responsive at all breakpoints
- [ ] Meets contrast requirements
- [ ] Has hover/active states
- [ ] Supports reduced motion
- [ ] Uses CSS custom properties

---

**Quick Tip**: When in doubt, check `/home/talaatdev/00-projects/flatwp/doc-flatwp/.development/docs/design-system.md` for full specifications!
