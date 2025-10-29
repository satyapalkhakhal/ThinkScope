'use client';

/**
 * Author Portal Page
 * Hidden page for creating and submitting articles
 * Access via: /author
 */

import React, { useState, useEffect } from 'react';
import { Upload, Send, FileText, Image as ImageIcon, Loader2, Check, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AuthorPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [readTime, setReadTime] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  
  // UI state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Auto-generate slug if it hasn't been manually edited
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const estimateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    // Auto-calculate read time
    const estimatedTime = estimateReadTime(value);
    setReadTime(estimatedTime);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setFeaturedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!featuredImage) {
      throw new Error('No image selected');
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', featuredImage);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      return data.url;
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!slug.trim()) {
      setError('Slug is required');
      return false;
    }
    if (!excerpt.trim()) {
      setError('Excerpt is required');
      return false;
    }
    if (!content.trim()) {
      setError('Content is required');
      return false;
    }
    if (!categoryId) {
      setError('Please select a category');
      return false;
    }
    if (!featuredImage && !featuredImageUrl) {
      setError('Featured image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload image if a new one was selected
      let imageUrl = featuredImageUrl;
      if (featuredImage) {
        imageUrl = await uploadImage();
      }

      // Create article
      const articleData = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        category_id: categoryId,
        featured_image_url: imageUrl,
        featured_image_alt: imageAlt.trim() || title.trim(),
        read_time: readTime || estimateReadTime(content),
        status: status,
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create article');
      }

      setSuccess(`Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      
      // Reset form
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategoryId(null);
    setFeaturedImage(null);
    setFeaturedImageUrl('');
    setImageAlt('');
    setReadTime('');
    setStatus('draft');
    setImagePreview(null);
    setError(null);
    setSuccess(null);
  };

  const wordCount = content.trim().split(/\s+/).filter(w => w).length;

  if (loadingCategories) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Author Portal</h1>
          <p className="text-gray-400">Create and publish new articles</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
            <X className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Featured Image */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <label className="block text-sm font-semibold text-emerald-400 mb-3">
              Featured Image *
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-12 h-12 text-gray-500 mb-3" />
                  <p className="text-sm text-gray-400 mb-1">Click to upload image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </label>
            )}

            {imagePreview && (
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Image alt text (optional)"
                className="mt-3 w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-emerald-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter article title"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-emerald-400 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Auto-generated from title, or customize</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-emerald-400 mb-3">
              Category *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    categoryId === category.id
                      ? 'bg-emerald-400 text-gray-900'
                      : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-emerald-400'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-emerald-400 mb-2">
              Excerpt *
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the article"
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              required
            />
            <p className="mt-1 text-xs text-gray-400">{excerpt.length} characters</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-emerald-400 mb-2">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your article content here... (Supports Markdown)"
              rows={15}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none font-mono text-sm"
              required
            />
            <div className="mt-1 flex justify-between items-center text-xs">
              <span className="text-gray-400">{wordCount} words</span>
              {readTime && <span className="text-emerald-400 font-semibold">{readTime}</span>}
            </div>
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-sm font-semibold text-emerald-400 mb-2">
              Read Time
            </label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g., 5 min read"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <p className="mt-1 text-xs text-gray-500">Auto-calculated, or customize</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-emerald-400 mb-3">
              Status
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  status === 'draft'
                    ? 'bg-emerald-400 text-gray-900'
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-emerald-400'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  status === 'published'
                    ? 'bg-emerald-400 text-gray-900'
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-emerald-400'
                }`}
              >
                Published
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full px-6 py-4 bg-emerald-400 hover:bg-emerald-500 disabled:bg-gray-700 text-gray-900 font-bold rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading || uploadingImage ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {uploadingImage ? 'Uploading Image...' : 'Creating Article...'}
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {status === 'published' ? 'Publish Article' : 'Save as Draft'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
