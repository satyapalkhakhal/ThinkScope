-- ============================================
-- Articles Table RLS Policies
-- Fix: "new row violates row-level security policy"
-- ============================================

-- 1. Enable RLS on articles table (if not already enabled)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 2. Allow public SELECT for published articles
CREATE POLICY "Public can view published articles"
ON articles FOR SELECT
USING (status = 'published');

-- 3. Allow service role to do everything (for API routes)
CREATE POLICY "Service role has full access"
ON articles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Allow anon key to INSERT articles (for admin panel)
-- This allows the NEXT_PUBLIC_SUPABASE_ANON_KEY to create articles
CREATE POLICY "Allow insert for anon"
ON articles FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Allow anon key to UPDATE articles
CREATE POLICY "Allow update for anon"
ON articles FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 6. Allow anon key to DELETE articles
CREATE POLICY "Allow delete for anon"
ON articles FOR DELETE
TO anon
USING (true);

-- ============================================
-- Alternative: If you want authenticated-only access
-- Comment out policies 4-6 above and use these instead:
-- ============================================

-- CREATE POLICY "Authenticated users can insert articles"
-- ON articles FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Authenticated users can update articles"
-- ON articles FOR UPDATE
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Authenticated users can delete articles"
-- ON articles FOR DELETE
-- TO authenticated
-- USING (true);

-- ============================================
-- Verify policies are created
-- ============================================
-- Run this to see all policies:
-- SELECT * FROM pg_policies WHERE tablename = 'articles';
