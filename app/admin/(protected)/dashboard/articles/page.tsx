'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  view_count: number;
  category_id: number;
}

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Article deleted successfully!');
        fetchArticles();
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') return true;
    return article.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-500/20 text-green-400 border-green-500',
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      archived: 'bg-gray-500/20 text-gray-400 border-gray-500',
    };
    return styles[status as keyof typeof styles] || styles.draft;
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading articles...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Articles</h1>
          <p className="mt-2 text-gray-400">Manage your content</p>
        </div>
        <Link
          href="/admin/dashboard/articles/new"
          className="bg-accent-400 hover:bg-accent-300 text-primary-900 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
        >
          <span>➕</span>
          <span>New Article</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'published', 'draft'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-accent-400 text-primary-900'
                : 'bg-primary-800 text-gray-300 hover:bg-primary-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({articles.filter(a => f === 'all' || a.status === f).length})
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="bg-primary-800 rounded-xl border border-primary-700 overflow-hidden">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No articles found</p>
            <Link
              href="/admin/dashboard/articles/new"
              className="text-accent-400 hover:underline mt-2 inline-block"
            >
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-900 border-b border-primary-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-primary-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{article.title}</div>
                      <div className="text-gray-400 text-sm">/blog/{article.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                          article.status
                        )}`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{article.view_count || 0}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/dashboard/articles/${article.id}/edit`}
                        className="text-accent-400 hover:text-accent-300 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
