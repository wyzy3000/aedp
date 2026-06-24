-- SUPABASE DATABASE SETUP SCRIPT FOR PORTAL CMS CONTENT
-- Copy and paste this into your Supabase SQL Editor and click "Run"

-- ─── 4. PORTAL CMS CONTENT TABLE ───────────────────────────────────────────
-- Stores portal page contents editable by Admins
create table if not exists public.portal_content (
  id          text primary key,
  content     jsonb not null,
  created_at  timestamp with time zone default now(),
  updated_at  timestamp with time zone default now(),
  updated_by  uuid references auth.users on delete set null
);

-- Enable Row Level Security (RLS)
alter table public.portal_content enable row level security;

-- ─── RLS POLICIES ──────────────────────────────────────────────────────────

-- 1. Anyone (including anonymous visitors) can view portal page contents
create policy "Portal content is publicly readable."
  on public.portal_content for select using ( true );

-- 2. Only users with the role of 'Admin' in public.profiles can write/update page contents
create policy "Admins can manage portal content."
  on public.portal_content for all
  using (
    (select role from public.profiles where id = auth.uid()) = 'Admin'
  );

-- Enable Realtime for the table
alter publication supabase_realtime add table public.portal_content;
