-- Catalog product overrides
-- Stores admin edits for the static catalog products defined in lib/products.ts
-- Each row corresponds to a product id (e.g. "m1", "m2", etc.)
-- Only non-null columns will override the static values.

create table if not exists catalog_overrides (
  id text primary key,                     -- matches the product id in lib/products.ts (e.g. "m1")
  name text,
  tagline text,
  description text,
  family text,
  notes_top text,
  notes_heart text,
  notes_base text,
  image_url text,                          -- override image (uploaded via admin)
  size text,
  type text,
  gender text,
  best_worn text,
  why_love_it jsonb,                       -- string[]
  suitable_for jsonb,                      -- string[]
  price numeric,                           -- price in INR
  stock integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS — only service_role (admin) can read/write
alter table catalog_overrides enable row level security;

-- No public policies — all access goes through the service_role key
-- which bypasses RLS by design (consistent with orders, products tables).
