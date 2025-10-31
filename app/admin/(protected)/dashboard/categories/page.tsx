'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Power, PowerOff, ExternalLink, AlertCircle, CheckCircle2, Loader2, Eye, Filter, ArrowUp, ArrowDown, GripVertical, Plus, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [articleCounts, setArticleCounts] = useState<Record<number, number>>({});
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [categoriesRes, articlesRes] = await Promise.all([
        fetch('/api/admin/categories/all'),
        fetch('/api/articles'),
      ]);

      const categoriesData = await categoriesRes.json();
      const articlesData = await articlesRes.json();

      setCategories(categoriesData.data || []);

      // Count articles per category
      const counts: Record<number, number> = {};
      articlesData.data?.forEach((article: any) => {
        counts[article.category_id] = (counts[article.category_id] || 0) + 1;
      });
      setArticleCounts(counts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleCategoryStatus = async (categoryId: number, currentStatus: boolean, categoryName: string) => {
    const action = currentStatus ? 'disable' : 'enable';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${categoryName}"?\n\n${currentStatus ? 'This category will be hidden from the public site.' : 'This category will be visible on the public site.'}`
    );

    if (!confirmed) return;

    setTogglingId(categoryId);

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        // Update local state
        setCategories(categories.map(cat => 
          cat.id === categoryId ? { ...cat, is_active: !currentStatus } : cat
        ));
        showNotification('success', `Category ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      } else {
        const data = await response.json();
        showNotification('error', data.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      showNotification('error', 'Failed to update category status');
    } finally {
      setTogglingId(null);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCategory,
          display_order: categories.length + 1,
        }),
      });

      if (response.ok) {
        showNotification('success', 'Category created successfully');
        setShowAddModal(false);
        setNewCategory({
          name: '',
          slug: '',
          description: '',
          icon: '',
          is_active: true,
        });
        fetchCategories();
      } else {
        const data = await response.json();
        showNotification('error', data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('error', 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const moveCategory = async (categoryId: number, direction: 'up' | 'down') => {
    setReorderingId(categoryId);

    try {
      const currentIndex = categories.findIndex(cat => cat.id === categoryId);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === categories.length - 1)
      ) {
        return;
      }

      const newCategories = [...categories];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Swap categories
      [newCategories[currentIndex], newCategories[targetIndex]] = 
        [newCategories[targetIndex], newCategories[currentIndex]];

      // Update local state immediately
      setCategories(newCategories);

      // Send to API
      const categoryIds = newCategories.map(cat => cat.id);
      const response = await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryIds }),
      });

      if (response.ok) {
        showNotification('success', 'Category order updated successfully');
      } else {
        // Revert on error
        fetchCategories();
        showNotification('error', 'Failed to update category order');
      }
    } catch (error) {
      console.error('Error reordering category:', error);
      fetchCategories();
      showNotification('error', 'Failed to update category order');
    } finally {
      setReorderingId(null);
    }
  };

  const filteredCategories = categories.filter(cat => {
    if (filter === 'active') return cat.is_active;
    if (filter === 'inactive') return !cat.is_active;
    return true;
  });

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.is_active).length,
    inactive: categories.filter(c => !c.is_active).length,
    totalArticles: Object.values(articleCounts).reduce((sum, count) => sum + count, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border animate-slide-in ${
            notification.type === 'success'
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Categories Management</h1>
          <p className="text-gray-400">Manage and organize your content categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-400 to-accent-500 text-primary-900 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-accent-400/50 transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-800 to-primary-800/50 backdrop-blur rounded-2xl p-6 border border-primary-700/50 hover:border-accent-400/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-accent-400 to-accent-500 p-3 rounded-xl shadow-lg shadow-accent-400/20">
              <Filter className="w-5 h-5 text-primary-900" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Total</p>
              <p className="text-3xl font-bold text-white mt-0.5">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur rounded-2xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-lg shadow-green-400/20">
              <CheckCircle2 className="w-5 h-5 text-primary-900" />
            </div>
            <div>
              <p className="text-green-400/80 text-xs uppercase tracking-wide font-semibold">Active</p>
              <p className="text-3xl font-bold text-green-400 mt-0.5">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur rounded-2xl p-6 border border-red-500/30 hover:border-red-400/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-red-400 to-red-500 p-3 rounded-xl shadow-lg shadow-red-400/20">
              <AlertCircle className="w-5 h-5 text-primary-900" />
            </div>
            <div>
              <p className="text-red-400/80 text-xs uppercase tracking-wide font-semibold">Inactive</p>
              <p className="text-3xl font-bold text-red-400 mt-0.5">{stats.inactive}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary-800 to-primary-800/50 backdrop-blur rounded-2xl p-6 border border-primary-700/50 hover:border-accent-400/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-accent-400 to-accent-500 p-3 rounded-xl shadow-lg shadow-accent-400/20">
              <Eye className="w-5 h-5 text-primary-900" />
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Articles</p>
              <p className="text-3xl font-bold text-white mt-0.5">{stats.totalArticles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-accent-400 to-accent-500 text-primary-900 shadow-xl shadow-accent-400/30'
              : 'bg-primary-800/50 text-gray-400 hover:text-white border border-primary-700 hover:border-accent-400/50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
            filter === 'active'
              ? 'bg-gradient-to-r from-green-400 to-green-500 text-primary-900 shadow-xl shadow-green-400/30'
              : 'bg-primary-800/50 text-gray-400 hover:text-white border border-primary-700 hover:border-green-400/50'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
            filter === 'inactive'
              ? 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-xl shadow-red-400/30'
              : 'bg-primary-800/50 text-gray-400 hover:text-white border border-primary-700 hover:border-red-400/50'
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-gradient-to-br from-primary-800 to-primary-800/50 rounded-2xl border border-primary-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary-900/50 border-b border-primary-700/50">
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</span>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Articles</span>
                </th>
                <th className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                </th>
                <th className="px-6 py-4 text-right">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-700/30">
              {filteredCategories.map((category, index) => (
                <tr
                  key={category.id}
                  className="group hover:bg-primary-700/20 transition-all"
                >
                  {/* Display Order */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => moveCategory(category.id, 'up')}
                        disabled={index === 0 || reorderingId !== null}
                        className="p-1 rounded hover:bg-primary-700 text-gray-400 hover:text-accent-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-700/30 rounded-lg">
                        <GripVertical className="w-3 h-3 text-gray-500" />
                        <span className="text-sm font-semibold text-white">{index + 1}</span>
                      </div>
                      <button
                        onClick={() => moveCategory(category.id, 'down')}
                        disabled={index === filteredCategories.length - 1 || reorderingId !== null}
                        className="p-1 rounded hover:bg-primary-700 text-gray-400 hover:text-accent-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                  {/* Category Name */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-white group-hover:text-accent-400 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">ID: {category.id}</span>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-5">
                    <code className="text-sm text-gray-400 bg-primary-700/30 px-3 py-1.5 rounded-lg font-mono">
                      /{category.slug}
                    </code>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-5 max-w-md">
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {category.description || 'No description available'}
                    </p>
                  </td>

                  {/* Articles Count */}
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-700/30 px-3 py-1.5 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                      <span className="text-sm font-semibold text-white">
                        {articleCounts[category.id] || 0}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      category.is_active
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {category.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleCategoryStatus(category.id, category.is_active, category.name)}
                        disabled={togglingId === category.id}
                        className={`p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          category.is_active
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}
                        title={category.is_active ? 'Disable category' : 'Enable category'}
                      >
                        {togglingId === category.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : category.is_active ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </button>
                      <Link
                        href={`/category/${category.slug}`}
                        target="_blank"
                        className="p-2.5 rounded-lg bg-accent-400/10 hover:bg-accent-400/20 text-accent-400 border border-accent-400/30 transition-all"
                        title="View category page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-primary-800 to-primary-800/95 rounded-2xl border border-primary-700/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-primary-900/50 backdrop-blur-sm border-b border-primary-700/50 px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Create New Category</h2>
                <p className="text-gray-400 text-sm mt-1">Add a new category to organize your content</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-primary-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-8 space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCategory({
                      ...newCategory,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  className="w-full px-4 py-3 bg-primary-700/50 border border-primary-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
                  placeholder="e.g., Technology, Business, Sports"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full px-4 py-3 bg-primary-700/50 border border-primary-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all font-mono"
                  placeholder="technology-news"
                />
                <p className="text-xs text-gray-500 mt-2">URL: /category/{newCategory.slug || 'your-slug'}</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-primary-700/50 border border-primary-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all resize-none"
                  placeholder="Brief description of this category..."
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-4 py-3 bg-primary-700/50 border border-primary-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all text-2xl"
                  placeholder="📁 💼 🎯 ⚡"
                  maxLength={2}
                />
                <p className="text-xs text-gray-500 mt-2">Single emoji to represent this category</p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-4 bg-primary-700/30 rounded-xl border border-primary-600/30">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={newCategory.is_active}
                  onChange={(e) => setNewCategory({ ...newCategory, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-primary-600 text-accent-400 focus:ring-accent-400 focus:ring-offset-0 bg-primary-700"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-300 cursor-pointer">
                  Make category active (visible on public site)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary-700/50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-primary-700/50 hover:bg-primary-700 text-white rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newCategory.name || !newCategory.slug}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-400 to-accent-500 text-primary-900 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-accent-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredCategories.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gradient-to-br from-primary-800 to-primary-800/50 border border-primary-700/50 rounded-3xl p-16 max-w-lg mx-auto shadow-2xl">
            <div className="bg-gradient-to-br from-accent-400/20 to-accent-500/10 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-accent-400/20">
              <Filter className="w-12 h-12 text-accent-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No categories found</h3>
            <p className="text-gray-400 text-lg">
              {filter !== 'all' 
                ? `No ${filter} categories available`
                : 'No categories have been created yet'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
