-- Create a new admin user
-- INSTRUCTIONS: Replace the values below with actual user details

INSERT INTO admin_users (email, password, name, role, is_active)
VALUES (
  'newemail@example.com',  -- Replace with actual email
  'password123',            -- Replace with actual password (TODO: use bcrypt in production)
  'Full Name',              -- Replace with actual name (or NULL)
  'admin',                  -- Role: 'admin' or 'super_admin'
  true                      -- Active status: true or false
);

-- Example: Create multiple users at once
-- INSERT INTO admin_users (email, password, name, role, is_active)
-- VALUES 
--   ('user1@example.com', 'pass1', 'User One', 'admin', true),
--   ('user2@example.com', 'pass2', 'User Two', 'admin', true),
--   ('user3@example.com', 'pass3', 'User Three', 'admin', false);

-- Verify the user was created
-- SELECT id, email, name, role, is_active, created_at FROM admin_users ORDER BY created_at DESC LIMIT 5;
