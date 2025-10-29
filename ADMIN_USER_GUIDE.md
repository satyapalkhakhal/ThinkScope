# Admin User Management Guide

## Quick Start: Create Your First Admin User

### Step 1: Set up the Database
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run the SQL from `database/admin_users_schema.sql`
4. This creates the table and a default admin user

### Step 2: Login
- URL: `http://localhost:3000/admin/login`
- Default Email: `admin@thinkscope.in`
- Default Password: `admin123`

### Step 3: Create New Admin Users

## 🎯 Method 1: Admin Dashboard (Easiest)

**Best for:** Non-technical users, production use

1. Login to admin panel
2. Go to `/admin/dashboard/users`
3. Click "Create New User"
4. Fill the form:
   - Email (required)
   - Password (required)
   - Name (optional)
   - Role (admin/super_admin)
5. Click "Create User"

✅ **Advantages:**
- User-friendly interface
- Validation built-in
- Immediate feedback
- No SQL knowledge required

---

## 💻 Method 2: Node.js Script

**Best for:** Command-line users, bulk operations

```bash
node scripts/create-admin-user.js
```

Follow the prompts:
```
Email: newadmin@example.com
Password: secure123
Name (optional): John Smith
```

The script generates SQL for you to run in Supabase.

✅ **Advantages:**
- Interactive prompts
- Email validation
- Generates clean SQL
- Can be automated

---

## 🗄️ Method 3: Direct SQL

**Best for:** Database administrators, batch inserts

```sql
INSERT INTO admin_users (email, password, name, role, is_active)
VALUES ('admin@example.com', 'password123', 'Admin Name', 'admin', true);
```

Or use the template in `scripts/create-admin-user.sql`

✅ **Advantages:**
- Fastest method
- Can create multiple users at once
- No dependencies

---

## 🔌 Method 4: API Endpoint

**Best for:** Programmatic integration, automation

```bash
# First, get your admin token from localStorage after login
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "email": "newadmin@example.com",
    "password": "secure123",
    "name": "John Smith",
    "role": "admin"
  }'
```

✅ **Advantages:**
- Can be integrated into apps
- Suitable for automation
- Returns structured JSON

---

## 📋 User Management Operations

### List All Users
**Dashboard:** `/admin/dashboard/users`

**API:**
```bash
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View User Details
Check the users table in Supabase or use the dashboard.

---

## 🔒 Security Best Practices

### ⚠️ CRITICAL for Production:

1. **Change Default Password**
   ```sql
   UPDATE admin_users 
   SET password = 'new_secure_password' 
   WHERE email = 'admin@thinkscope.in';
   ```

2. **Implement Password Hashing**
   - Current: Plain text (NOT SECURE)
   - Required: bcrypt with salt
   - TODO: Update `lib/auth.ts` to use bcrypt

3. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Avoid common words

4. **Enable Row Level Security (RLS)**
   ```sql
   ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
   ```

---

## 📝 User Roles

- **admin**: Standard admin access
- **super_admin**: Full system access (for future use)

---

## 🐛 Troubleshooting

### "User already exists"
The email is already in the database. Use a different email or update the existing user.

### "Unauthorized"
Your admin token expired or is invalid. Login again.

### "User not found"
Check that the `admin_users` table exists and has the schema.

### Can't login
1. Verify the user exists: `SELECT * FROM admin_users WHERE email = 'your@email.com';`
2. Check `is_active = true`
3. Verify password matches exactly (case-sensitive)

---

## 📚 Files Reference

- **Schema:** `database/admin_users_schema.sql`
- **Auth Logic:** `lib/auth.ts`
- **Login API:** `app/api/admin/login/route.ts`
- **User API:** `app/api/admin/users/route.ts`
- **Login Page:** `app/admin/login/page.tsx`
- **Users Page:** `app/admin/(protected)/dashboard/users/page.tsx`
- **Scripts:** 
  - `scripts/create-admin-user.js`
  - `scripts/create-admin-user.sql`

---

## 🚀 Next Steps

1. ✅ Create the database table
2. ✅ Login with default credentials
3. ✅ Create your first custom admin user
4. ⚠️ Change the default password
5. ⚠️ Implement password hashing
6. 🔒 Enable RLS policies
7. 🎉 Start managing your blog!
