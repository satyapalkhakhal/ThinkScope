# Authors Management System

Complete role-based author management with category assignments for ThinkScope.

## Features

✅ **Author Management**
- Create, update, and delete authors
- Author profiles with bio and avatar
- Email-based author identification
- Active/Inactive status management

✅ **Role-Based Access Control**
- **Admin**: Full access to all categories and system settings
- **Editor**: Can write and edit for all categories
- **Writer**: Can write for assigned categories only
- **Contributor**: Limited access to assigned categories

✅ **Category Assignments**
- Assign specific categories to writers and contributors
- Admin and editors have automatic access to all categories
- Visual category selection interface
- Bulk category assignment

## Setup Instructions

### 1. Run Database Schema

Execute the SQL script in your Supabase SQL Editor:

```bash
# File: database/authors_schema.sql
```

This will:
- Add `role` and `is_active` columns to authors table
- Create `author_category_assignments` table
- Set up RLS policies
- Create helper functions for category access control
- Add sample authors (optional)

### 2. Verify Tables

Check that these tables exist:
- `authors` - Author information with role
- `author_category_assignments` - Links authors to categories

### 3. Access the UI

Navigate to:
```
/admin/dashboard/authors
```

## API Endpoints

### Get All Authors
```http
GET /api/admin/authors
Query Params:
  - active_only=true/false
  - role=admin|editor|writer|contributor
```

### Create Author
```http
POST /api/admin/authors
Body: {
  "name": "John Doe",
  "email": "john@thinkscope.in",
  "bio": "Technology writer",
  "role": "writer",
  "is_active": true,
  "password": "secure123",
  "category_ids": [1, 2, 3]
}
```

### Update Author
```http
PATCH /api/admin/authors/:id
Body: {
  "name": "Updated Name",
  "role": "editor",
  "category_ids": [1, 2]
}
```

### Delete Author
```http
DELETE /api/admin/authors/:id
```

## Usage Examples

### Creating a Technology Writer

1. Go to Authors Management
2. Click "Create New Author"
3. Fill in details:
   - Name: "Sarah Johnson"
   - Email: "sarah@thinkscope.in"
   - Bio: "Senior Technology Reporter"
   - Role: **Writer**
   - Categories: ✓ Technology, ✓ AI & ML
4. Click "Create Author"

### Creating an Editor

1. Create new author
2. Select role: **Editor**
3. No need to assign categories (has access to all)

### Updating Author Permissions

1. Click Edit icon on author row
2. Change role or update category assignments
3. Click "Update Author"

## Role Permissions Matrix

| Role        | All Categories | Assigned Only | Create Articles | Edit Articles | Admin Access |
|-------------|----------------|---------------|-----------------|---------------|--------------|
| Admin       | ✓              | -             | ✓               | ✓             | ✓            |
| Editor      | ✓              | -             | ✓               | ✓             | ✗            |
| Writer      | ✗              | ✓             | ✓               | Own Only      | ✗            |
| Contributor | ✗              | ✓             | ✓               | Own Only      | ✗            |

## Database Schema

### authors table
```sql
- id: BIGSERIAL PRIMARY KEY
- name: VARCHAR
- email: VARCHAR UNIQUE
- bio: TEXT
- avatar_url: VARCHAR
- role: VARCHAR ('admin', 'editor', 'writer', 'contributor')
- is_active: BOOLEAN
- password: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### author_category_assignments table
```sql
- id: BIGSERIAL PRIMARY KEY
- author_id: BIGINT -> authors(id)
- category_id: BIGINT -> categories(id)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(author_id, category_id)
```

## Helper Functions

### Check if author can write for a category
```sql
SELECT can_author_write_category(author_id, category_id);
```

### Get author's assigned categories
```sql
SELECT * FROM get_author_categories(author_id);
```

## Integration with Article Creation

When creating an article:

1. **Check author permissions**:
   ```typescript
   const canWrite = await authorService.canWriteForCategory(authorId, categoryId);
   if (!canWrite) {
     return { error: 'You do not have permission to write for this category' };
   }
   ```

2. **Filter available categories** based on author role:
   - Admin/Editor: Show all categories
   - Writer/Contributor: Show only assigned categories

## Security Best Practices

⚠️ **Current Implementation**
- Passwords stored in plain text
- Basic role-based access control

🔒 **Production Recommendations**
1. Implement bcrypt password hashing
2. Add JWT authentication
3. Add session management
4. Implement 2FA for admin/editor roles
5. Add audit logging
6. Add rate limiting

## Troubleshooting

### Authors not showing
- Check RLS policies are enabled
- Verify `is_active = true` filter

### Cannot assign categories
- Ensure categories exist in database
- Check `author_category_assignments` table permissions

### Permission denied when writing
- Verify author role
- Check category assignments for writer/contributor
- Use `can_author_write_category()` function

## Sample Workflow

1. **Admin creates authors**
   - Creates writer accounts
   - Assigns relevant categories
   - Sets initial passwords

2. **Authors log in**
   - See only their assigned categories
   - Create articles in permitted categories
   - Cannot access other categories

3. **Editors review**
   - Have access to all content
   - Can edit any article
   - Approve/publish content

## Files Created

```
database/
  └── authors_schema.sql                    # Database setup

lib/services/
  ├── author.service.ts                     # Author service
  └── types.ts                              # Updated with author types

app/api/admin/authors/
  ├── route.ts                              # List/Create authors
  └── [id]/route.ts                         # Update/Delete author

app/admin/(protected)/dashboard/authors/
  └── page.tsx                              # Author management UI
```

## Next Steps

1. ✅ Run database migration
2. ✅ Create sample authors
3. ⬜ Integrate with article creation form
4. ⬜ Add author authentication
5. ⬜ Implement password hashing
6. ⬜ Add author profile page
7. ⬜ Show author info on articles

## Support

For issues or questions:
- Check Supabase logs for errors
- Verify RLS policies
- Check browser console for API errors
- Review authors table in Supabase dashboard
