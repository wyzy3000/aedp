-- CONSOLIDATED SECURITY & RLS FIX SCRIPT
-- This script ensures Row Level Security (RLS) is enabled and properly configured for all tables.
-- Run this in your Supabase SQL Editor and click "Run".

-- 0. DYNAMIC RLS ENABLEMENT FOR ALL TABLES (Prevents uncontrolled public access)
do $$ 
declare 
  r record;
begin
  for r in (select tablename from pg_tables where schemaname = 'public') loop
    execute format('alter table public.%I enable row level security', r.tablename);
  end loop;
end $$;

-- 1. PROFILES SECURITY
-- (Ensure specific policies are set up correctly)

-- Drop existing policies to avoid conflicts
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;
drop policy if exists "Admins can update all profiles." on public.profiles;

-- Re-create policies for Profiles
-- Anyone can view profiles (needed for mentions/displaying names)
create policy "Public profiles are viewable by everyone."
  on profiles for select using ( true );

-- Users can insert their own profile during signup
create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );

-- Admins can update any profile; Users can only update their own profile (preserving role/email via trigger)
create policy "Update policy for profiles"
  on profiles for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'Admin' 
    or 
    auth.uid() = id
  );


-- 2. DIARIES SECURITY
alter table public.diaries enable row level security;

-- Drop existing policies
drop policy if exists "Diaries are publicly readable." on public.diaries;
drop policy if exists "Authenticated users can insert diaries." on public.diaries;
drop policy if exists "Users can update own diaries." on public.diaries;
drop policy if exists "Users can delete own diaries." on public.diaries;

-- Re-create policies for Diaries
create policy "Diaries are publicly readable."
  on diaries for select using ( true );

create policy "Authenticated users can insert diaries."
  on diaries for insert with check ( auth.uid() = user_id );

create policy "Users can update own diaries."
  on diaries for update using ( auth.uid() = user_id );

create policy "Users can delete own diaries."
  on diaries for delete using ( auth.uid() = user_id );


-- 3. ONE HEALTH DATA SECURITY
alter table public.one_health_data enable row level security;

-- Drop existing policies
drop policy if exists "One health data is publicly readable." on public.one_health_data;
drop policy if exists "Authenticated users can insert one health data." on public.one_health_data;
drop policy if exists "Users can update own one health data." on public.one_health_data;
drop policy if exists "Users can delete own one health data." on public.one_health_data;

-- Re-create policies for One Health Data
create policy "One health data is publicly readable."
  on one_health_data for select using ( true );

create policy "Authenticated users can insert one health data."
  on one_health_data for insert with check ( auth.uid() = user_id );

create policy "Users can update own one health data."
  on one_health_data for update using ( auth.uid() = user_id );

create policy "Users can delete own one health data."
  on one_health_data for delete using ( auth.uid() = user_id );

-- 4. REALTIME SECURITY (Ensure tables are in publication)
-- Note: Realtime follows RLS policies, so if RLS is enabled, realtime is also secure.
do $$ 
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- Add tables to publication if they aren't already
alter publication supabase_realtime add table if not exists diaries;
alter publication supabase_realtime add table if not exists one_health_data;

-- 5. ENSURE MISSING COLUMNS (Non-security but needed for app functionality)
alter table public.profiles add column if not exists status text default 'Deactivated';

-- 6. ADDITIONAL SECURITY HARDENING (Fixes for Advisor Warnings)
-- Fix: Function Search Path Mutable (Prevent schema injection)
alter function if exists public.handle_new_user() set search_path = public;
alter function if exists public.preserve_sensitive_profile_data() set search_path = public;
alter function if exists public.track_modifications() set search_path = public;

-- 7. VERIFICATION
-- This query returns tables in 'public' schema where RLS is NOT enabled.
-- It should return 0 rows after running this script.
select tablename 
from pg_tables 
where schemaname = 'public' 
and not exists (
  select 1 
  from pg_class c 
  join pg_namespace n on n.oid = c.relnamespace 
  where n.nspname = 'public' 
  and c.relname = tablename 
  and c.relrowsecurity = true
);
