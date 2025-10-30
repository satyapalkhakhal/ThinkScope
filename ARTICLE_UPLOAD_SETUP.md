# Article Creation with Image Upload - Setup Guide

## ✅ What's Been Added

### New Features:
1. **Image Upload to Supabase Storage** - Upload images directly from the admin panel
2. **All Article Fields** - Complete form with all database fields
3. **SEO Fields** - Meta title, description, keywords
4. **Publishing Controls** - Custom publish date/time
5. **Image Preview** - See uploaded images before saving

---

## 📦 Required Installation

### Step 1: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

Or with yarn:
```bash
yarn add @supabase/supabase-js
```

---

## 🗄️ Supabase Storage Setup

### Step 2: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Create bucket with these settings:
   - **Name:** `news-images`
   - **Public:** ✅ Yes (make it public)
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/*`

5. Click **"Create bucket"**

### Step 3: Set Storage Policies

After creating the bucket, set up policies:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'news-images' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'news-images' );

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'news-images' );
```

Or use the Supabase UI:
1. Go to **Storage** → **Policies**
2. Click **"New Policy"** on `news-images` bucket
3. Choose **"Enable read access for all users"**
4. Choose **"Enable insert access for authenticated users"**
5. Choose **"Enable delete access for authenticated users"**

---

## 🔑 Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📝 Article Fields Reference

The form now includes all fields from the `articles` table:

### Basic Fields:
- ✅ `title` - Article title
- ✅ `slug` - URL-friendly slug (auto-generated)
- ✅ `excerpt` - Brief summary
- ✅ `content` - Full article content
- ✅ `category_id` - Category selection
- ✅ `author_id` - Author ID (default: 1)

### Media Fields:
- ✅ `featured_image_url` - Image URL (from upload or manual)
- ✅ `featured_image_alt` - Alt text for accessibility
- ✅ `read_time` - Estimated reading time

### SEO Fields:
- ✅ `meta_title` - SEO title (auto-filled from title)
- ✅ `meta_description` - Meta description for search engines
- ✅ `meta_keywords` - Comma-separated keywords

### Publishing Fields:
- ✅ `status` - Draft, Published, or Archived
- ✅ `published_at` - Custom publish date (optional)
- ✅ `view_count` - Auto-set to 0
- ✅ `created_at` - Auto-generated
- ✅ `updated_at` - Auto-generated

---

## 🎨 How to Use

### Creating an Article:

1. **Go to Admin Dashboard**
   - Navigate to `/admin/dashboard/articles`
   - Click **"Create New Article"**

2. **Fill Basic Information**
   - Enter article title (slug auto-generates)
   - Select category
   - Write excerpt and content

3. **Upload Image**
   - Click the upload area
   - Select an image file (PNG, JPG, WEBP, max 5MB)
   - Wait for upload to complete
   - Image URL populates automatically
   - Or manually enter an image URL

4. **Add SEO Data**
   - Meta title (auto-filled from title)
   - Meta description (150-160 characters)
   - Meta keywords (comma-separated)

5. **Set Publishing Options**
   - Choose status: Draft, Published, or Archived
   - If Published, optionally set custom date/time

6. **Submit**
   - Click **"Create Article"**
   - Article saves with all data

---

## 📸 Image Upload Flow

```
User selects file
      ↓
Validate (type & size)
      ↓
Upload to Supabase Storage
      ↓
Get public URL
      ↓
Populate form field
      ↓
Show preview
      ↓
Submit with URL
```

### Upload Details:
- **Bucket:** `news-images`
- **Path:** `news/timestamp-random.ext`
- **Max Size:** 5MB
- **Formats:** PNG, JPG, JPEG, WEBP, GIF
- **URL Format:** `https://{project}.supabase.co/storage/v1/object/public/news-images/news/{filename}`

---

## 🔧 Files Modified

### New Files:
1. **`lib/supabase-client.ts`** - Supabase client for browser uploads

### Updated Files:
1. **`app/admin/(protected)/dashboard/articles/new/page.tsx`** - Full article form with:
   - Image upload functionality
   - All article fields
   - SEO fields
   - Publishing controls

---

## 🎯 Example Article Data

Here's what gets submitted:

```json
{
  "title": "Trump–Xi Jinping Busan Meet: Tariffs Cut, Trade Deal Near",
  "slug": "trump-xi-jinping-busan-meeting-trade-talks-2025",
  "excerpt": "Donald Trump and Xi Jinping met in Busan...",
  "content": "In a breakthrough moment for global trade...",
  "author_id": 1,
  "category_id": 3,
  "featured_image_url": "https://mrvapygtxktrgilxqgqr.supabase.co/storage/v1/object/public/news-images/news/1730281234-abc123.webp",
  "featured_image_alt": "Trump and Xi Jinping meeting in Busan",
  "read_time": "4 min read",
  "status": "published",
  "published_at": "2025-10-30T13:45:00",
  "meta_title": "Trump–Xi Jinping Busan Meeting 2025: US Cuts Tariffs",
  "meta_description": "Donald Trump and Xi Jinping met in Busan...",
  "meta_keywords": "donald trump, xi jinping, trade deal, tariffs"
}
```

---

## ✅ Testing Checklist

- [ ] Install `@supabase/supabase-js` package
- [ ] Create `news-images` bucket in Supabase
- [ ] Set bucket to public
- [ ] Configure storage policies
- [ ] Verify environment variables
- [ ] Test image upload (< 5MB)
- [ ] Test image preview
- [ ] Test manual URL input
- [ ] Test form submission
- [ ] Verify article in database
- [ ] Check image URL is accessible

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:** Run `npm install @supabase/supabase-js`

### Issue: Upload fails with 401 error
**Solution:** Check environment variables are set correctly

### Issue: "Bucket not found"
**Solution:** Create `news-images` bucket in Supabase Storage

### Issue: Upload fails with "Not authorized"
**Solution:** Make bucket public and set correct policies

### Issue: Image not displaying
**Solution:** 
1. Check bucket is public
2. Verify URL format is correct
3. Check CORS settings in Supabase

### Issue: Large file upload fails
**Solution:** Image must be under 5MB. Compress before uploading.

---

## 🚀 Next Steps

1. **Install Package:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Setup Bucket:**
   - Create `news-images` bucket
   - Make it public
   - Set policies

3. **Test Upload:**
   - Go to `/admin/dashboard/articles/new`
   - Try uploading an image
   - Verify it works

4. **Create Article:**
   - Fill all fields
   - Upload image
   - Add SEO data
   - Publish

---

## 📚 Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#formdata)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Ready to go!** Install the package and create the storage bucket, then you're all set to create articles with image uploads.
