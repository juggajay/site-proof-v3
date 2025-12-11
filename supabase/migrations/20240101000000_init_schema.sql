-- CivilOS Database Schema
-- Organizations, Vendors, Resources, Diaries, and ITP Quality System

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ORGANIZATIONS (Root Tenant)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROFILES (Users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid references organizations(id),
  full_name text,
  role text check (role in ('owner', 'manager', 'foreman', 'subcontractor')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. VENDORS (Subcontractors)
create table vendors (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  name text not null,
  is_internal boolean default false,
  abn text,
  contact_email text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. RATE CARDS (Pricing)
create table rate_cards (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references vendors(id) not null,
  organization_id uuid references organizations(id) not null,
  role_name text not null,        -- e.g. "Excavator Operator"
  rate_cents integer not null,    -- Stored as cents ($80.00 = 8000)
  unit text default 'hour',       -- 'hour', 'day', 'm3'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. RESOURCES (People/Machines)
create table resources (
  id uuid primary key default uuid_generate_v4(),
  vendor_id uuid references vendors(id) not null,
  organization_id uuid references organizations(id) not null,
  assigned_rate_card_id uuid references rate_cards(id),
  name text not null,
  type text check (type in ('labor', 'plant')),
  phone text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. PROJECTS & LOTS
create table projects (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  name text not null,
  code text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table lots (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) not null,
  organization_id uuid references organizations(id) not null,
  lot_number text not null,
  description text,
  status text default 'open',     -- 'open', 'conformed', 'closed'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. DIARIES (Cost Tracking)
create table diaries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  project_id uuid references projects(id) not null,
  lot_id uuid references lots(id),  -- Optional: Diary can be Project-wide or Lot-specific
  date date not null,
  foreman_id uuid references profiles(id),
  notes text,
  status text default 'draft',    -- 'draft', 'submitted', 'approved'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table diary_entries (
  id uuid primary key default uuid_generate_v4(),
  diary_id uuid references diaries(id) not null,
  resource_id uuid references resources(id) not null,
  start_time time,
  finish_time time,
  break_hours numeric(3,2) default 0.5,
  total_hours numeric(4,2),       -- Calculated
  frozen_rate_cents integer,      -- Snapshots cost at time of entry
  total_cost_cents integer,       -- Calculated
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. ITPs (Quality)
create table itp_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) not null,
  title text not null,            -- e.g. "Concrete Pour"
  items jsonb not null,           -- Array of strings: ["Check formwork", "Check reo"]
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table lot_itps (
  id uuid primary key default uuid_generate_v4(),
  lot_id uuid references lots(id) not null,
  organization_id uuid references organizations(id) not null,
  template_id uuid references itp_templates(id),
  status text default 'in_progress',  -- 'in_progress', 'failed', 'complete'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table itp_checks (
  id uuid primary key default uuid_generate_v4(),
  lot_itp_id uuid references lot_itps(id) not null,
  question text not null,
  status text default 'pending',  -- 'pass', 'fail', 'na'
  photo_url text,
  rectification_note text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 10. ENABLE RLS (Security)
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table vendors enable row level security;
alter table rate_cards enable row level security;
alter table resources enable row level security;
alter table projects enable row level security;
alter table lots enable row level security;
alter table diaries enable row level security;
alter table diary_entries enable row level security;
alter table itp_templates enable row level security;
alter table lot_itps enable row level security;
alter table itp_checks enable row level security;
