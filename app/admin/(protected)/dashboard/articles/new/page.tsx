'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/supabase-client';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    author_id: 1, // Default author
    featured_image_url: '',
    featured_image_alt: '',
    read_time: '5 min read',
    status: 'draft' as 'draft' | 'published' | 'archived',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    published_at: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    const generatedSlug = generateSlug(title);
    setFormData({
      ...formData,
      title,
      slug: generatedSlug,
      meta_title: title, // Auto-fill meta title
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    
    try {
      // Upload to Supabase Storage
      const { url, error } = await uploadFile(file, 'news-images', 'news');
      
      if (error || !url) {
        throw new Error(error || 'Failed to upload image');
      }

      // Update form data with uploaded URL
      setFormData({
        ...formData,
        featured_image_url: url,
        featured_image_alt: formData.featured_image_alt || formData.title,
      });
      
      // Set preview
      setImagePreview(url);
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      featured_image_url: '',
    });
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare payload
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        author_id: formData.author_id || 1,
        published_at: formData.status === 'published' && formData.published_at
          ? formData.published_at
          : formData.status === 'published'
          ? new Date().toISOString()
          : null,
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Article created successfully!');
        router.push('/admin/dashboard/articles');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Create New Article</h1>
        <p className="mt-2 text-gray-400">Fill in the details below to create a new article</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-primary-800 rounded-xl p-6 border border-primary-700 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
              placeholder="Enter article title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
              placeholder="article-url-slug"
            />
            <p className="mt-1 text-sm text-gray-400">URL: /blog/{formData.slug || 'your-slug'}</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
              placeholder="Brief summary of the article (2-3 sentences)"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={15}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 font-mono text-sm"
              placeholder="Article content (supports HTML and markdown)"
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image <span className="text-red-500">*</span>
            </label>
            
            {/* Upload Button */}
            {!formData.featured_image_url && (
              <div className="border-2 border-dashed border-primary-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center ${
                    uploadingImage ? 'opacity-50' : ''
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <div className="w-12 h-12 border-4 border-accent-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-300 font-medium mb-2">Click to upload image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            )}

            {/* Image Preview */}
            {formData.featured_image_url && (
              <div className="relative border border-primary-600 rounded-lg overflow-hidden">
                <img
                  src={formData.featured_image_url}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-3 bg-primary-800 border-t border-primary-600">
                  <p className="text-xs text-gray-400 truncate">{formData.featured_image_url}</p>
                </div>
              </div>
            )}

            {/* Manual URL Input (Alternative) */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Or enter image URL manually:</label>
              <input
                type="url"
                value={formData.featured_image_url}
                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {/* Featured Image Alt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image Alt Text
            </label>
            <input
              type="text"
              value={formData.featured_image_alt}
              onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
              placeholder="Image description for accessibility"
            />
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Read Time</label>
            <input
              type="text"
              value={formData.read_time}
              onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
              placeholder="5 min read"
            />
          </div>

          {/* Author ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Author ID
            </label>
            <input
              type="number"
              value={formData.author_id}
              onChange={(e) => setFormData({ ...formData, author_id: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
              placeholder="1"
            />
            <p className="mt-1 text-sm text-gray-400">Default: 1 (Admin)</p>
          </div>

          {/* SEO Section */}
          <div className="pt-6 border-t border-primary-600">
            <h3 className="text-lg font-semibold text-accent-500 mb-4">SEO & Metadata</h3>
            
            {/* Meta Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="SEO title for search engines (auto-filled from title)"
              />
              <p className="mt-1 text-sm text-gray-400">
                {formData.meta_title.length}/60 characters
              </p>
            </div>

            {/* Meta Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="Brief description for search engines (150-160 characters)"
              />
              <p className="mt-1 text-sm text-gray-400">
                {formData.meta_description.length}/160 characters
              </p>
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={formData.meta_keywords}
                onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="mt-1 text-sm text-gray-400">
                Comma-separated keywords for SEO
              </p>
            </div>
          </div>

          {/* Publishing Section */}
          <div className="pt-6 border-t border-primary-600">
            <h3 className="text-lg font-semibold text-accent-500 mb-4">Publishing</h3>
            
            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Published At */}
            {formData.status === 'published' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                  className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Leave empty to use current date/time
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-accent-400 hover:bg-accent-300 text-primary-900 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
