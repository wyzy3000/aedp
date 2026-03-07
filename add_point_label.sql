-- ADD POINT LABEL COLUMN
-- Run this script in your Supabase SQL Editor

ALTER TABLE one_health_data
ADD COLUMN IF NOT EXISTS point_label text;

-- If you want to automatically set the point_label for your existing rows based on the auto-generated point_number:
UPDATE one_health_data 
SET point_label = 'Point ' || point_number 
WHERE point_label IS NULL AND point_number IS NOT NULL;
