# Design System & Aesthetics

@theme_inspiration {
  source: "Screenshots provided (Slash, Apple Arcade, YouTube Music Dark Mode)."
  vibe: "Premium, High-Contrast, Structured, 'Financial Dashboard meets Rugged Field Tool'."
}

@colors {
  /* A deep, rich dark mode palette based on the inspiration images */
  --background: "222 47% 11%" /* #0F172A - Deep Slate Blue */
  --foreground: "210 40% 98%" /* #F8FAFC - Off-white text */

  /* Cards get a slightly lighter shade to pop */
  --card: "217 33% 17%" /* #1E293B */
  --card-foreground: "210 40% 98%" /* #F8FAFC */

  /* Subtle borders to define structure, like the Slash dashboard */
  --border: "217 33% 22%" /* #334155 */

  /* Primary action color (Buttons, active tabs) - bright blue like Apple/Slash */
  --primary: "217 91% 60%" /* #3B82F6 */
  --primary-foreground: "222 47% 11%" /* #0F172A */

  /* For errors, failed ITPs */
  --destructive: "0 84% 60%" /* #EF4444 */
}

@typography {
  font_family: "Inter, sans-serif (Clean, modern, highly readable)"
  hierarchy: [
    "H1: text-3xl font-bold tracking-tight (Page Titles)",
    "H2: text-xl font-semibold (Section Headers)",
    "Body: text-sm leading-normal (Standard text)",
    "Label: text-xs font-medium text-muted-foreground (Form labels)"
  ]
}

@components {
  radius: "0.75rem (rounded-xl) - Soft but professional corners."

  cards: [
    "Use shadcn/ui Card component.",
    "Background: bg-card.",
    "Border: Thin, subtle border (border-border).",
    "Shadow: Gentle shadow to lift it (shadow-sm or shadow-md)."
  ]

  buttons: [
    "Use shadcn/ui Button.",
    "Primary buttons should be solid blue (bg-primary) with legible text.",
    "Avoid gradients on buttons for clarity."
  ]

  inputs: [
    "Use shadcn/ui Input.",
    "Dark background (bg-background/50), distinct border that highlights on focus to the primary color."
  ]
}

@animations {
  guideline: "Animations must be subtle, fast (max 300ms), and enhance usability, not distract."

  transitions: [
    "Page Transitions: Subtle fade-in/slide-up when navigating routes using Framer Motion or View Transitions API.",
    "Hover States: Buttons and Cards should have a quick, subtle lift or brightness increase on hover (e.g., 'hover:-translate-y-0.5 hover:bg-accent')."
  ]

  feedback: [
    "Optimistic Actions: When a Foreman ticks an ITP item, the tick should appear instantly. If the backend fails, show a toast notification and revert.",
    "Loading: Never show a blank screen. Use 'Skeleton' loaders (pulsing gray shapes) matching the layout of the data being fetched."
  ]
}
