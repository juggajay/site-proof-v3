# Project Context: CivilOS

@project {
  name: "CivilOS"
  description: "A premium SaaS platform for Australian civil construction 'self-perform' contractors. Unifies Resource Management, Cost Tracking (Diaries), and Quality Assurance (ITPs)."
  stage: "MVP Development"
}

@tech_stack {
  framework: "Next.js 15 (App Router)"
  language: "TypeScript (Strict Mode)"
  database: "Supabase (PostgreSQL) - Source of Truth"
  auth: "Supabase Auth (Organizations/RLS mandatory)"
  storage: "Supabase Storage (Buckets for Site Photos/Docs)"
  styling: "Tailwind CSS + shadcn/ui components"
  state: "React Query (server state), Zustand (complex client state if needed)"
  forms: "React Hook Form + Zod (Shared validation schemas)"
  pdf: "React-PDF (For generating invoice reports and ITP summaries)"
}

@conventions {
  database_rules: [
    "All tables must have RLS (Row Level Security) enabled.",
    "Use UUIDs for primary keys.",
    "Monetary values must be stored as Integers (cents) to prevent float errors."
  ]
  coding_style: [
    "Use Server Components by default. Use 'use client' only for interactivity.",
    "Implement 'Optimistic UI' updates for all Foreman field actions (submit diary, tick ITP item) so the app feels instant on bad connections.",
    "Mobile-first approach for all '/app/field' routes."
  ]
}
