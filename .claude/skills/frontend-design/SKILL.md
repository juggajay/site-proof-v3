---
name: frontend-design
description: Use when building any UI, landing page, dashboard, or user-facing interface - enforces bold aesthetic direction, distinctive typography, cohesive color systems, purposeful motion, and textured backgrounds to eliminate generic AI-generated design patterns
---

# Frontend Design

## Overview

**Commit to a bold aesthetic direction BEFORE writing any code.** Generic defaults produce forgettable interfaces. This skill forces intentional design decisions across typography, color, motion, and texture.

## The Iron Law

```
NO CODE WITHOUT AN AESTHETIC DIRECTION FIRST
```

Before any UI work, declare ONE of these directions (or define your own):

| Direction | Characteristics |
|-----------|-----------------|
| **Brutalist** | Raw, bold, intentionally rough. Heavy type, stark contrast, exposed structure |
| **Luxury** | Refined, spacious, premium. Thin weights, muted tones, generous whitespace |
| **Retro-Futuristic** | Nostalgic tech meets tomorrow. CRT glow, scan lines, neon accents |
| **Industrial** | Rugged, utilitarian, functional. Dark metals, amber warnings, dense information |
| **Editorial** | Magazine-quality, type-driven. Large serifs, asymmetric layouts, dramatic scale |
| **Minimal Dark** | Sophisticated darkness. True black, subtle borders, precise micro-interactions |

## The Five Pillars

### 1. Typography - Ban the Defaults

**BANNED FONTS:**
- Arial, Helvetica (system defaults)
- Roboto (overused)
- Inter (AI slop indicator)
- Open Sans (generic)

**REQUIRED:** Distinctive pairings that create tension:

```
Headlines + Body combinations:
- Playfair Display + JetBrains Mono (Editorial)
- Space Grotesk + IBM Plex Mono (Industrial)
- Instrument Serif + Geist Sans (Luxury)
- Bebas Neue + Work Sans (Brutalist)
- Orbitron + Share Tech Mono (Retro-Futuristic)
- Manrope + Fira Code (Minimal Dark)
```

**Scale with purpose:**
```css
/* Not arbitrary - each step has meaning */
--text-xs: 0.75rem;    /* Labels, captions */
--text-sm: 0.875rem;   /* Secondary content */
--text-base: 1rem;     /* Body copy */
--text-lg: 1.125rem;   /* Emphasized body */
--text-xl: 1.25rem;    /* Section headers */
--text-2xl: 1.5rem;    /* Card titles */
--text-3xl: 1.875rem;  /* Page sections */
--text-4xl: 2.25rem;   /* Page titles */
--text-5xl: 3rem;      /* Hero statements */
--text-6xl: 3.75rem;   /* Display, impact */
```

### 2. Color - Systematic, Not Random

**BANNED:** Random hex codes scattered through components.

**REQUIRED:** CSS custom properties with semantic meaning:

```css
:root {
  /* Surface hierarchy - darkest to lightest */
  --surface-0: #000000;  /* True black base */
  --surface-1: #0a0a0a;  /* Elevated surface */
  --surface-2: #141414;  /* Cards, containers */
  --surface-3: #1f1f1f;  /* Interactive elements */
  --surface-4: #292929;  /* Hover states */

  /* Text hierarchy */
  --text-primary: #ffffff;
  --text-secondary: #a1a1a1;
  --text-tertiary: #6b6b6b;
  --text-disabled: #404040;

  /* Accent - ONE primary, use sparingly */
  --accent: #your-brand-color;
  --accent-hover: /* slightly lighter */;
  --accent-subtle: /* 10% opacity version */;

  /* Semantic */
  --success: #22c55e;
  --warning: #eab308;
  --error: #ef4444;

  /* Borders - barely visible structure */
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.1);
  --border-strong: rgba(255,255,255,0.15);
}
```

### 3. Motion - Purposeful, Staggered, Earned

**BANNED:**
- Static page loads
- Instant state changes
- Simultaneous animations (everything at once)
- Decorative-only motion

**REQUIRED:** Motion that communicates:

```css
/* Timing tokens */
--duration-instant: 100ms;  /* Micro-feedback */
--duration-fast: 200ms;     /* UI responses */
--duration-normal: 300ms;   /* Standard transitions */
--duration-slow: 500ms;     /* Emphasis, reveals */

/* Easing - never linear for UI */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* Exits, closes */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* Position changes */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy emphasis */
```

**Page load sequence (staggered reveal):**
```tsx
// Each element enters with delay
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} />
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} />
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} />
```

**Hover states - subtle but present:**
```css
.card {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}
```

### 4. Backgrounds - Depth Over Flatness

**BANNED:**
- Solid flat backgrounds (bg-gray-900)
- Pure CSS without texture
- Uniform surfaces everywhere

**REQUIRED:** At least ONE depth technique:

**Noise texture (subtle grain):**
```css
.surface {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  opacity: 0.03;
}
```

**Gradient mesh (subtle color shifts):**
```css
.hero {
  background:
    radial-gradient(ellipse at 20% 0%, rgba(accent, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(accent, 0.1) 0%, transparent 50%),
    var(--surface-0);
}
```

**Glassmorphism (for overlays/modals):**
```css
.glass {
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
}
```

**Grid/dot patterns (for dashboards):**
```css
.grid-bg {
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

### 5. Spacing & Layout - Intentional Rhythm

**Use 4px base unit consistently:**
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
```

**Asymmetry is professional.** Don't center everything.

## Red Flags - AI Slop Indicators

Stop and reconsider if you see:

- [ ] Using Inter, Roboto, or system fonts
- [ ] Random Tailwind colors (bg-blue-500) without system
- [ ] No hover/focus states on interactive elements
- [ ] Page loads fully formed (no stagger)
- [ ] Flat solid color backgrounds everywhere
- [ ] Perfect symmetry on every section
- [ ] Generic placeholder copy ("Lorem ipsum")
- [ ] Stock icons without customization
- [ ] No border-radius consistency
- [ ] Missing loading/empty states

## Quick Reference

| Element | Requirement |
|---------|-------------|
| Fonts | Distinctive pair, NEVER defaults |
| Colors | CSS variables, semantic naming |
| Motion | Staggered, eased, purposeful |
| Backgrounds | Texture, gradients, or patterns |
| Spacing | Consistent scale, asymmetric layouts |
| States | Hover, focus, active, disabled - ALL of them |

## Before You Code

1. **Declare aesthetic direction** (from table above or custom)
2. **Choose font pairing** (two fonts max)
3. **Define color system** (surfaces + text + accent)
4. **Plan motion** (page load sequence, hover states)
5. **Select texture technique** (noise, gradient, glass, grid)

Then write code.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Starting with components | Start with design tokens |
| Picking colors as you go | Define palette upfront |
| Animations as afterthought | Plan motion from start |
| Same font everywhere | Headlines vs body distinction |
| Obvious centered layouts | Use asymmetry, whitespace |
