# User Experience Profiles & Layouts

## Persona 1: The Manager ("The Donga Dweller")
* **Context:** Desktop/Laptop office environment. High bandwidth. Big screen.
* **Goal:** Data entry, configuration, high-level reporting, cost analysis.
* **Design Priority:** Data Density & Structure.

@layout ManagerLayout {
  route_group: "/app/office"
  structure: "Classic Sidebar Layout (like YouTube Music desktop)"

  sidebar: [
    "Fixed left sidebar (w-64).",
    "Logo at top.",
    "Navigation Links (Dashboard, Projects, Resources, Rate Cards, Reports).",
    "User profile menu at bottom."
  ]

  main_content: [
    "Scrollable area.",
    "Top bar with Page Title and Breadcrumbs.",
    "Content uses shadcn/ui 'DataTable' for dense information listing with filtering/sorting.",
    "Dashboard uses grid-based card layout for metrics (like Slash example)."
  ]
}

## Persona 2: The Foreman ("The Muddy Boots")
* **Context:** Mobile Phone/iPad in the field. Bright sun, rain, spotty internet. Gloved hands.
* **Goal:** Quick data capture (Diaries), simple verification (ITPs). Get in, get out.
* **Design Priority:** Speed, Touchability, Clarity.

@layout ForemanLayout {
  route_group: "/app/field"
  structure: "Mobile App Layout (like Apple Arcade)"

  top_bar: [
    "Minimalist header Showing current Project/Lot context.",
    "Back button if deep in navigation."
  ]

  main_content: [
    "Single column layout. No sidebars.",
    "Big touch targets: Buttons and Inputs must be at least 44px tall.",
    "Forms (Diaries/ITPs) should be broken into steps (Wizards) instead of long scrolls to reduce cognitive load."
  ]

  bottom_nav: [
    "Fixed bottom tab bar.",
    "Tabs: 'Today's Diary', 'My Lots (ITPs)', 'Profile'.",
    "Active tab highlighted in primary blue."
  ]

  offline_behavior: [
    "Critical actions (Submit Diary, Pass ITP Item) must use optimistic updates.",
    "If offline, show a subtle 'Offline - Changes queued' indicator in the top bar."
  ]
}
