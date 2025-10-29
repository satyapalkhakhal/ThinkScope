# ThinkScope Admin Dashboard

## 🎯 Overview
Complete admin dashboard for managing ThinkScope articles with authentication, CRUD operations, and a modern UI.

## 🔐 Access

**URL:** `https://thinkscope.in/admin/login`

**Default Credentials:**
- Email: `admin@thinkscope.in`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials in production!

## 🔧 Setup

### 1. Environment Variables
Create or update your `.env.local` file:

```env
# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL=admin@thinkscope.in
ADMIN_PASSWORD=your-secure-password-here

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access Dashboard
Navigate to: `http://localhost:3000/admin/login`

## 📁 Features

### ✅ Authentication
- Simple email/password login
- Session-based authentication (24h token expiry)
- Protected routes
- Auto-redirect to login if not authenticated

### ✅ Dashboard
- Overview statistics (total articles, published, drafts, categories)
- Quick action buttons
- Modern, responsive UI

### ✅ Article Management
- **List View:** View all articles with filtering (all/published/draft)
- **Create:** Add new articles with rich form
- **Edit:** Update existing articles
- **Delete:** Remove articles with confirmation
- **Publish/Draft:** Control article visibility

### ✅ Categories
- View all categories
- See article count per category
- Browse category details

## 🗂️ File Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx                 # Login page
│   └── (protected)/
│       ├── layout.tsx                # Protected layout with nav
│       └── dashboard/
│           ├── page.tsx              # Main dashboard
│           ├── articles/
│           │   ├── page.tsx          # Articles list
│           │   ├── new/
│           │   │   └── page.tsx      # Create article
│           │   └── [id]/
│           │       └── edit/
│           │           └── page.tsx  # Edit article
│           └── categories/
│               └── page.tsx          # Categories list
│
├── api/
│   ├── admin/
│   │   ├── login/
│   │   │   └── route.ts             # Login API
│   │   └── articles/
│   │       └── [id]/
│   │           └── route.ts         # Update/Delete API
│   ├── articles/
│   │   └── route.ts                 # Create/List API
│   └── categories/
│       └── route.ts                 # Categories API
│
lib/
└── auth.ts                          # Auth utilities
```

## 🎨 UI Components

### Navigation
- Dashboard overview
- Articles management
- Categories view
- Logout button
- Link to public site

### Article Form Fields
- **Title*** (auto-generates slug)
- **Slug*** (URL-friendly identifier)
- **Category*** (dropdown selection)
- **Excerpt*** (short summary)
- **Content*** (HTML/Markdown supported)
- **Featured Image URL*** (image link)
- **Featured Image Alt** (accessibility)
- **Read Time** (e.g., "5 min read")
- **Status** (Draft/Published/Archived)

## 🔄 Workflow

### Creating a New Article

1. Go to **Dashboard** → **Articles** → **New Article**
2. Fill in all required fields (marked with *)
3. Title will auto-generate a URL-friendly slug
4. Select a category
5. Add content (supports HTML and markdown)
6. Set status (Draft or Published)
7. Click **Create Article**

### Editing an Article

1. Go to **Articles** page
2. Click **Edit** on any article
3. Modify fields as needed
4. Click **Save Changes**

### Deleting an Article

1. Go to **Articles** page
2. Click **Delete** on any article
3. Confirm deletion
4. Article is permanently removed

## 🔒 Security Notes

### Current Implementation
- ✅ Simple token-based authentication
- ✅ Client-side route protection
- ✅ Session expiry (24 hours)
- ✅ Protected API routes

### For Production
Consider upgrading to:
- **NextAuth.js** for OAuth providers
- **JWT tokens** with refresh tokens
- **Role-based access control** (RBAC)
- **API middleware** for authentication
- **Rate limiting** on login endpoint
- **Password hashing** with bcrypt
- **HTTPS only** cookies

## 🚀 API Endpoints

### Public
- `GET /api/articles` - List all articles (with filters)
- `POST /api/articles` - Create new article
- `GET /api/categories` - List all categories

### Admin
- `POST /api/admin/login` - Admin login
- `PATCH /api/admin/articles/[id]` - Update article
- `DELETE /api/admin/articles/[id]` - Delete article

## ⚡ Cache Behavior

Articles are cached for **2 minutes** (120 seconds):
- Changes will be visible on the public site within 2 minutes
- No manual cache clearing needed
- ISR (Incremental Static Regeneration) handles updates automatically

## 🎯 Best Practices

1. **Always preview** articles before publishing
2. **Use descriptive slugs** for SEO
3. **Add alt text** to images for accessibility
4. **Write compelling excerpts** (shown in listings)
5. **Set accurate read times** for user experience
6. **Use draft status** while working on articles

## 🐛 Troubleshooting

### "Invalid credentials" on login
- Check `.env.local` for correct credentials
- Restart dev server after changing env vars

### Articles not showing
- Check article status (must be "published")
- Wait 2 minutes for cache refresh
- Verify category exists

### Categories not loading
- Check Supabase connection
- Verify API routes are working
- Check browser console for errors

## 📝 Future Enhancements

- [ ] Rich text editor (TinyMCE/Quill)
- [ ] Image upload to Supabase storage
- [ ] Bulk operations (publish/delete multiple)
- [ ] Article scheduling
- [ ] SEO metadata editor
- [ ] Article analytics
- [ ] Comment management
- [ ] User roles (admin/editor/author)
- [ ] Article versioning
- [ ] Draft preview

## 🔗 Links

- **Public Site:** https://thinkscope.in
- **Admin Login:** https://thinkscope.in/admin/login
- **GitHub:** Your repository URL
- **Supabase Dashboard:** Your Supabase project URL

---

**Built with Next.js 14, TypeScript, and Tailwind CSS**
