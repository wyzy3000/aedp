-- SUPABASE DATABASE MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor

-- Add point_number as an auto-incrementing identity column
-- This ensures values start at 1 and automatically increase for every new row
ALTER TABLE one_health_data
ADD COLUMN IF NOT EXISTS point_number serial NOT NULL;

-- If you want to add this to the Realtime publication if it's not already
-- alter publication supabase_realtime add table one_health_data;
