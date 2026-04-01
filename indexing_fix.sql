-- PERFORMANCE OPTIMIZATION: UNINDEXED FOREIGN KEYS
-- Adding indexes to foreign keys improves join performance and prevents full table scans.

-- 1. Index for diaries(user_id)
CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON public.diaries(user_id);

-- 2. Index for one_health_data(user_id)
CREATE INDEX IF NOT EXISTS idx_one_health_data_user_id ON public.one_health_data(user_id);

-- 3. Also recommend indexing 'profiles' if used for joins (e.g. for status/role checks)
-- Since 'profiles' references 'auth.users' on its primary key 'id', it's already indexed.
