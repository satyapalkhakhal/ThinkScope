-- Authors Management System with Role-Based Category Access
-- Run this in Supabase SQL Editor

-- 1. Update authors table with role and status
ALTER TABLE authors 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'writer',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Add comments to explain columns
COMMENT ON COLUMN authors.role IS 'Author role: admin, editor, writer, contributor';
COMMENT ON COLUMN authors.password IS 'DEPRECATED: Password field is no longer used in the application';

-- 2. Create author_category_assignments table
CREATE TABLE IF NOT EXISTS author_category_assignments (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(author_id, category_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_author_category_author ON author_category_assignments(author_id);
CREATE INDEX IF NOT EXISTS idx_author_category_category ON author_category_assignments(category_id);

-- 3. Enable RLS on authors table
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for authors
CREATE POLICY "Allow public read access to active authors"
ON authors FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Allow authenticated full access to authors"
ON authors FOR ALL
TO authenticated
USING (true);

-- 5. Enable RLS on author_category_assignments
ALTER TABLE author_category_assignments ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for author_category_assignments
CREATE POLICY "Allow public read access to category assignments"
ON author_category_assignments FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated full access to category assignments"
ON author_category_assignments FOR ALL
TO authenticated
USING (true);

-- 7. Create function to get author's assigned categories
CREATE OR REPLACE FUNCTION get_author_categories(p_author_id BIGINT)
RETURNS TABLE (
  category_id BIGINT,
  category_name VARCHAR,
  category_slug VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.slug
  FROM categories c
  INNER JOIN author_category_assignments aca ON c.id = aca.category_id
  WHERE aca.author_id = p_author_id
  ORDER BY c.name;
END;
$$ LANGUAGE plpgsql;

-- 8. Create function to check if author can write for a category
CREATE OR REPLACE FUNCTION can_author_write_category(p_author_id BIGINT, p_category_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  author_role VARCHAR;
  has_assignment BOOLEAN;
BEGIN
  -- Get author role
  SELECT role INTO author_role FROM authors WHERE id = p_author_id;
  
  -- Admin and Editor can write for all categories
  IF author_role IN ('admin', 'editor') THEN
    RETURN true;
  END IF;
  
  -- Check if author has assignment for this category
  SELECT EXISTS(
    SELECT 1 FROM author_category_assignments 
    WHERE author_id = p_author_id AND category_id = p_category_id
  ) INTO has_assignment;
  
  RETURN has_assignment;
END;
$$ LANGUAGE plpgsql;

-- 9. Create updated_at trigger for author_category_assignments
CREATE OR REPLACE FUNCTION update_author_category_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_author_category_updated_at
  BEFORE UPDATE ON author_category_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_author_category_updated_at();

-- 10. Sample data (optional - remove in production)
-- Insert sample authors
INSERT INTO authors (name, email, bio, role, is_active) VALUES
  ('John Doe', 'john@thinkscope.in', 'Senior Technology Writer', 'editor', true),
  ('Jane Smith', 'jane@thinkscope.in', 'Education Correspondent', 'writer', true),
  ('Mike Johnson', 'mike@thinkscope.in', 'Sports Reporter', 'writer', true),
  ('Sarah Williams', 'sarah@thinkscope.in', 'Lifestyle Columnist', 'contributor', true)
ON CONFLICT (email) DO NOTHING;

-- Assign categories to authors (example)
-- Note: Replace category IDs with your actual category IDs
DO $$
DECLARE
  tech_category_id BIGINT;
  edu_category_id BIGINT;
  sports_category_id BIGINT;
  lifestyle_category_id BIGINT;
  john_id BIGINT;
  jane_id BIGINT;
  mike_id BIGINT;
  sarah_id BIGINT;
BEGIN
  -- Get category IDs
  SELECT id INTO tech_category_id FROM categories WHERE slug = 'technology' LIMIT 1;
  SELECT id INTO edu_category_id FROM categories WHERE slug = 'education' LIMIT 1;
  SELECT id INTO sports_category_id FROM categories WHERE slug = 'sports' LIMIT 1;
  SELECT id INTO lifestyle_category_id FROM categories WHERE slug = 'lifestyle' LIMIT 1;
  
  -- Get author IDs
  SELECT id INTO john_id FROM authors WHERE email = 'john@thinkscope.in';
  SELECT id INTO jane_id FROM authors WHERE email = 'jane@thinkscope.in';
  SELECT id INTO mike_id FROM authors WHERE email = 'mike@thinkscope.in';
  SELECT id INTO sarah_id FROM authors WHERE email = 'sarah@thinkscope.in';
  
  -- Assign categories (John is editor, so he can write for all, but let's assign anyway)
  IF tech_category_id IS NOT NULL AND john_id IS NOT NULL THEN
    INSERT INTO author_category_assignments (author_id, category_id) 
    VALUES (john_id, tech_category_id) ON CONFLICT DO NOTHING;
  END IF;
  
  IF edu_category_id IS NOT NULL AND jane_id IS NOT NULL THEN
    INSERT INTO author_category_assignments (author_id, category_id) 
    VALUES (jane_id, edu_category_id) ON CONFLICT DO NOTHING;
  END IF;
  
  IF sports_category_id IS NOT NULL AND mike_id IS NOT NULL THEN
    INSERT INTO author_category_assignments (author_id, category_id) 
    VALUES (mike_id, sports_category_id) ON CONFLICT DO NOTHING;
  END IF;
  
  IF lifestyle_category_id IS NOT NULL AND sarah_id IS NOT NULL THEN
    INSERT INTO author_category_assignments (author_id, category_id) 
    VALUES (sarah_id, lifestyle_category_id) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Verify setup
SELECT 
  a.name as author,
  a.role,
  a.is_active,
  COUNT(aca.category_id) as assigned_categories
FROM authors a
LEFT JOIN author_category_assignments aca ON a.id = aca.author_id
GROUP BY a.id, a.name, a.role, a.is_active
ORDER BY a.name;
