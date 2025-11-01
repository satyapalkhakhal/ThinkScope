# Supabase Storage Setup Guide

## Issue
Error: "new row violates row-level security policy" when uploading images to `news-images` bucket.

## Quick Fix (Choose One)

### Option 1: Public Bucket with RLS Policies (Recommended)

Run these SQL commands in Supabase SQL Editor:

```sql
-- 1. Allow public uploads to news folder
CREATE POLICY "Allow public uploads to news folder"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'news-images' 
  AND (storage.foldername(name))[1] = 'news'
);

-- 2. Allow public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- 3. Allow public updates (optional)
CREATE POLICY "Allow public updates to news folder"
ON storage.objects
FOR UPDATE
TO public
USING (
  bucket_id = 'news-images' 
  AND (storage.foldername(name))[1] = 'news'
);

-- 4. Allow public deletes (optional)
CREATE POLICY "Allow public deletes from news folder"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'news-images' 
  AND (storage.foldername(name))[1] = 'news'
);
```

### Option 2: Make Bucket Fully Public (Simplest)

**Via Supabase Dashboard:**
1. Go to Storage → `news-images` bucket
2. Click Settings (gear icon)
3. Toggle "Public bucket" to ON
4. Save

**Via SQL:**
```sql
UPDATE storage.buckets 
SET public = true 
WHERE id = 'news-images';
```

---

## Better Security: Authenticated Uploads Only

For production, restrict uploads to authenticated admin users:

### Step 1: Update Storage Policy

```sql
-- Remove public upload policy if exists
DROP POLICY IF EXISTS "Allow public uploads to news folder" ON storage.objects;

-- Create authenticated-only upload policy
CREATE POLICY "Allow authenticated uploads to news folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'news-images' 
  AND (storage.foldername(name))[1] = 'news'
);

-- Keep public read access
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news-images');
```

### Step 2: Update Upload Route

Create a new authenticated upload route:

**File: `app/api/admin/upload/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication (add your auth logic here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const filePath = `news/${uniqueFileName}`;
    const { data, error } = await supabase.storage
      .from('news-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: filePath,
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
```

### Step 3: Add Service Role Key to .env.local

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get your service role key from: Supabase Dashboard → Settings → API → `service_role` key

---

## Troubleshooting

### Check Bucket Exists
```sql
SELECT * FROM storage.buckets WHERE id = 'news-images';
```

### Check Existing Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

### Delete All Policies (Start Fresh)
```sql
DROP POLICY IF EXISTS "Allow public uploads to news folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to news folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from news folder" ON storage.objects;
```

### Create Bucket if Missing
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

---

## Current Implementation

Your current upload route at `/api/upload` uses the anon key, which requires:
- Either bucket to be public, OR
- RLS policies that allow public INSERT operations

**Immediate Fix:** Use Option 2 above to make the bucket public.
**Long-term Fix:** Implement authenticated uploads with Option for Better Security.
