-- Enable the pgoutput extension (usually enabled by default, but safe to include)
-- It's required for Publications
CREATE PUBLICATION IF NOT EXISTS supabase_realtime;

-- Add the diaries table to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE diaries;

-- Optionally, set replica identity to full so that UPDATEs/DELETEs 
-- broadcast the old record alongside the new one
ALTER TABLE diaries REPLICA IDENTITY FULL;
