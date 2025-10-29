# Admin Authentication Setup

This directory contains database schema and setup instructions for the admin authentication system.

## Setup Instructions

### 1. Create the admin_users table in Supabase

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `admin_users_schema.sql`
4. This will create the table and insert a default admin user

### 2. Configure Row Level Security (RLS)

For security, you should enable RLS on the admin_users table:

```sql
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to read (for authentication)
CREATE POLICY "Allow service role to read admin_users"
ON admin_users FOR SELECT
TO service_role
USING (true);

-- Create policy to allow authenticated admin updates
CREATE POLICY "Allow admins to update their own record"
ON admin_users FOR UPDATE
TO authenticated
USING (email = current_user_email());
```

### 3. Default Credentials

After running the schema, you can login with:
- **Email**: `admin@thinkscope.in`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change these credentials in production!

### 4. Adding New Admin Users

You have multiple options to create new admin users:

#### Option 1: Through Admin Dashboard (Recommended)
1. Login to the admin panel at `/admin/login`
2. Navigate to "Users" section at `/admin/dashboard/users`
3. Click "Create New User" button
4. Fill in the form and submit

#### Option 2: Using the Node.js Script
```bash
node scripts/create-admin-user.js
```
This interactive script will guide you through creating a user and generate the SQL.

#### Option 3: Direct SQL in Supabase
Run this in Supabase SQL Editor:
```sql
INSERT INTO admin_users (email, password, name, role, is_active)
VALUES ('newemail@example.com', 'securepassword', 'Admin Name', 'admin', true);
```

#### Option 4: Using API Endpoint
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"email":"new@example.com","password":"pass123","name":"New Admin"}'
```

### 5. Security Recommendations

#### Immediate (Required for Production):
- [ ] Implement password hashing using bcrypt
- [ ] Change default admin credentials
- [ ] Enable RLS policies
- [ ] Use strong passwords

#### Future Improvements:
- [ ] Implement JWT with refresh tokens
- [ ] Add password reset functionality
- [ ] Add 2FA authentication
- [ ] Add login attempt tracking
- [ ] Add session management
- [ ] Implement password complexity requirements

## Table Schema

```
admin_users
├── id (bigserial) - Primary key
├── email (varchar) - Unique email address
├── password (varchar) - User password (TODO: hash with bcrypt)
├── name (varchar) - Admin user's full name
├── role (varchar) - User role (default: 'admin')
├── is_active (boolean) - Account status
├── created_at (timestamp) - Account creation date
└── updated_at (timestamp) - Last update timestamp
```

## API Endpoints

The authentication system provides the following endpoints:

### Authentication
- `POST /api/admin/login` - Authenticate admin user
  - Request body: `{ email: string, password: string }`
  - Response: `{ success: boolean, token: string, user: object }`

### User Management (Requires Authentication)
- `GET /api/admin/users` - List all admin users
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: boolean, users: array }`

- `POST /api/admin/users` - Create new admin user
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ email: string, password: string, name?: string, role?: string }`
  - Response: `{ success: boolean, user: object }`

## Files Modified

1. **`lib/auth.ts`** - Updated to query admin_users table
2. **`app/api/admin/login/route.ts`** - Updated to use async validation
3. **`app/admin/login/page.tsx`** - Removed hardcoded credentials message
4. **`database/admin_users_schema.sql`** - Database schema
