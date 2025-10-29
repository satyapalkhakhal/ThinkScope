'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Category {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: number;
  featured_image_url: string;
  featured_image_alt: string;
  read_time: string;
  status: 'draft' | 'published' | 'archived';
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchData();
  }, [articleId]);

  const fetchData = async () => {
    try {
      const [categoriesRes, articlesRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/articles'),
      ]);

      const categoriesData = await categoriesRes.json();
      const articlesData = await articlesRes.json();

      setCategories(categoriesData.data || []);
      
      const foundArticle = articlesData.data?.find((a: Article) => a.id === parseInt(articleId));
      if (foundArticle) {
        setArticle(foundArticle);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        alert('Article updated successfully!');
        router.push('/admin/dashboard/articles');
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${article?.title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Article deleted successfully!');
        router.push('/admin/dashboard/articles');
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="text-center py-12 text-red-400">
        Article not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Edit Article</h1>
        <p className="mt-2 text-gray-400">Update article details below</p>
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
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
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
              value={article.slug}
              onChange={(e) => setArticle({ ...article, slug: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
            <p className="mt-1 text-sm text-gray-400">URL: /blog/{article.slug}</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={article.category_id}
              onChange={(e) => setArticle({ ...article, category_id: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
            >
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
              value={article.excerpt}
              onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={article.content}
              onChange={(e) => setArticle({ ...article, content: e.target.value })}
              rows={15}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 font-mono text-sm"
            />
          </div>

          {/* Featured Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={article.featured_image_url}
              onChange={(e) => setArticle({ ...article, featured_image_url: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
          </div>

          {/* Featured Image Alt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image Alt Text
            </label>
            <input
              type="text"
              value={article.featured_image_alt || ''}
              onChange={(e) => setArticle({ ...article, featured_image_alt: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
          </div>

          {/* Read Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Read Time</label>
            <input
              type="text"
              value={article.read_time}
              onChange={(e) => setArticle({ ...article, read_time: e.target.value })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={article.status}
              onChange={(e) => setArticle({ ...article, status: e.target.value as any })}
              className="w-full px-4 py-3 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Delete Article
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-accent-400 hover:bg-accent-300 text-primary-900 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
