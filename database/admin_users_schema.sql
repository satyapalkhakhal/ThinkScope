-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE
    ON admin_users FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (CHANGE PASSWORD IN PRODUCTION!)
INSERT INTO admin_users (email, password, name, role, is_active)
VALUES ('admin@thinkscope.in', 'admin123', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Add comment
COMMENT ON TABLE admin_users IS 'Stores admin user credentials for authentication';
COMMENT ON COLUMN admin_users.password IS 'TODO: Implement bcrypt password hashing in production';
