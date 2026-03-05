-- SUPABASE DATABASE SETUP SCRIPT
-- Copy and paste this entirely into your Supabase SQL Editor and click "Run"

-- ─── 1. PROFILES TABLE ──────────────────────────────────────────────────────
-- Stores public user profile info linked to auth.users
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using ( true );

create policy "Users can insert their own profile."
  on profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update using ( auth.uid() = id );

-- Trigger: auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── 2. DIARIES TABLE ───────────────────────────────────────────────────────
-- Community diary entries posted by logged-in users
create table if not exists diaries (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  location    text not null,
  date        date not null default current_date,
  content     text not null,
  sentiment   integer not null check (sentiment >= 1 and sentiment <= 10),
  created_at  timestamp with time zone default now()
);

alter table diaries enable row level security;

-- Anyone (including anonymous visitors) can read diary entries
create policy "Diaries are publicly readable."
  on diaries for select using ( true );

-- Only authenticated users can insert their own entries
create policy "Authenticated users can insert diaries."
  on diaries for insert with check ( auth.uid() = user_id );

-- Users can only update/delete their own entries
create policy "Users can update own diaries."
  on diaries for update using ( auth.uid() = user_id );

create policy "Users can delete own diaries."
  on diaries for delete using ( auth.uid() = user_id );
