-- PERFORMANCE UPDATE FOR RLS POLICIES
-- Supabase Postgres Linter flags auth.uid() inside RLS policies if it's not wrapped in a SELECT.
-- Wrapping it as (select auth.uid()) ensures it is evaluated once per statement rather than once per row,
-- resolving the "Auth RLS Initialization Plan" warnings.

-- 1. PROFILES
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Update policy for profiles" on public.profiles;

create policy "Users can insert their own profile." 
  on profiles for insert 
  with check ( (select auth.uid()) = id );

create policy "Update policy for profiles" 
  on profiles for update 
  using ( 
    (select role from public.profiles where id = (select auth.uid())) = 'Admin' 
    or 
    (select auth.uid()) = id 
  );

-- 2. DIARIES
drop policy if exists "Authenticated users can insert diaries." on public.diaries;
drop policy if exists "Users can update own diaries." on public.diaries;
drop policy if exists "Users can delete own diaries." on public.diaries;

create policy "Authenticated users can insert diaries." 
  on diaries for insert 
  with check ( (select auth.uid()) = user_id );

create policy "Users can update own diaries." 
  on diaries for update 
  using ( (select auth.uid()) = user_id );

create policy "Users can delete own diaries." 
  on diaries for delete 
  using ( (select auth.uid()) = user_id );

-- 3. ONE HEALTH DATA
drop policy if exists "Authenticated users can insert one health data." on public.one_health_data;
drop policy if exists "Users can update own one health data." on public.one_health_data;
drop policy if exists "Users can delete own one health data." on public.one_health_data;

create policy "Authenticated users can insert one health data." 
  on one_health_data for insert 
  with check ( (select auth.uid()) = user_id );

create policy "Users can update own one health data." 
  on one_health_data for update 
  using ( (select auth.uid()) = user_id );

create policy "Users can delete own one health data." 
  on one_health_data for delete 
  using ( (select auth.uid()) = user_id );
