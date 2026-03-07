-- SUPABASE DATABASE SETUP SCRIPT FOR ONE HEALTH MAP
-- Copy and paste this into your Supabase SQL Editor and click "Run"

-- ─── 3. ONE HEALTH MAP DATA TABLE ───────────────────────────────────────────
-- Community observations for the One Health interactive map
create table if not exists one_health_data (
  id                        uuid default gen_random_uuid() primary key,
  user_id                   uuid references auth.users on delete cascade not null,
  location_name             text not null,
  latitude                  numeric not null,
  longitude                 numeric not null,
  economic_activity         text not null,
  livestock_diseases        text not null,
  human_diseases            text not null,
  wildlife_trends           text not null,
  water_quality             text not null,
  drought_preparedness      text not null,
  major_stressors           text not null,
  extreme_climate_response  text not null,
  created_at                timestamp with time zone default now()
);

alter table one_health_data enable row level security;

-- Anyone (including anonymous visitors) can read one health data
create policy "One health data is publicly readable."
  on one_health_data for select using ( true );

-- Only authenticated users can insert their own entries
create policy "Authenticated users can insert one health data."
  on one_health_data for insert with check ( auth.uid() = user_id );

-- Users can only update/delete their own entries
create policy "Users can update own one health data."
  on one_health_data for update using ( auth.uid() = user_id );

create policy "Users can delete own one health data."
  on one_health_data for delete using ( auth.uid() = user_id );

-- Enable Realtime for the table
alter publication supabase_realtime add table one_health_data;
