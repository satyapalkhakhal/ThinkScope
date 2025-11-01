'use client';

import { useState, useEffect } from 'react';
import { 
  UserPlus, Users, Mail, User, Edit, Trash2, CheckCircle, XCircle,
  Shield, BookOpen, FileText, Tag
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  role: 'admin' | 'editor' | 'writer' | 'contributor';
  is_active: boolean;
  created_at: string;
  assigned_categories?: Category[];
  category_ids?: number[];
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    bio: string;
    avatar_url: string;
    role: 'admin' | 'editor' | 'writer' | 'contributor';
    is_active: boolean;
    category_ids: number[];
  }>({
    name: '',
    email: '',
    bio: '',
    avatar_url: '',
    role: 'writer',
    is_active: true,
    category_ids: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/admin/authors');
      if (response.ok) {
        const data = await response.json();
        setAuthors(data.authors || []);
      }
    } catch (err) {
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories/all');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    try {
      const url = editingAuthor 
        ? `/api/admin/authors/${editingAuthor.id}`
        : '/api/admin/authors';
      
      const method = editingAuthor ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingAuthor ? 'Author updated successfully!' : 'Author created successfully!');
        resetForm();
        fetchAuthors();
      } else {
        setError(data.error || 'Failed to save author');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      role: author.role,
      is_active: author.is_active,
      category_ids: author.category_ids || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this author? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/authors/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Author deleted successfully!');
        fetchAuthors();
      } else {
        setError(data.error || 'Failed to delete author');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      avatar_url: '',
      role: 'writer',
      is_active: true,
      category_ids: [],
    });
    setEditingAuthor(null);
    setShowForm(false);
  };

  const getRoleIcon = (role: 'admin' | 'editor' | 'writer' | 'contributor') => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'editor': return <Edit className="w-4 h-4" />;
      case 'writer': return <FileText className="w-4 h-4" />;
      case 'contributor': return <BookOpen className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: 'admin' | 'editor' | 'writer' | 'contributor') => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-400';
      case 'editor': return 'bg-blue-500/20 text-blue-400';
      case 'writer': return 'bg-green-500/20 text-green-400';
      case 'contributor': return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const toggleCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId],
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-accent-400" />
            Authors Management
          </h1>
          <p className="text-gray-400 mt-2">Manage content authors and their category assignments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-400 text-primary-900 rounded-lg hover:bg-accent-300 transition-colors font-medium"
        >
          <UserPlus className="w-5 h-5" />
          Create New Author
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-primary-800 border border-primary-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingAuthor ? 'Edit Author' : 'Create New Author'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                  placeholder="john@thinkscope.in"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                placeholder="Brief author bio..."
                rows={3}
              />
            </div>

            {/* Role and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-400"
                >
                  <option value="contributor">Contributor</option>
                  <option value="writer">Writer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.role === 'admin' && 'Full access to all categories'}
                  {formData.role === 'editor' && 'Can write for all categories'}
                  {formData.role === 'writer' && 'Can write for assigned categories'}
                  {formData.role === 'contributor' && 'Limited access to assigned categories'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-accent-400 bg-primary-700 border-primary-600 rounded focus:ring-accent-400"
                  />
                  <span className="text-white">Active</span>
                </label>
              </div>
            </div>

            {/* Category Assignment */}
            {(formData.role === 'writer' || formData.role === 'contributor') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Assign Categories *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        formData.category_ids.includes(category.id)
                          ? 'bg-accent-400/20 border-accent-400 text-accent-400'
                          : 'bg-primary-700 border-primary-600 text-gray-300'
                      } border`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.category_ids.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Select categories this author can write for
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-primary-600 text-gray-300 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-accent-400 text-primary-900 rounded-lg hover:bg-accent-300 transition-colors font-medium"
              >
                {editingAuthor ? 'Update Author' : 'Create Author'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Authors List */}
      <div className="bg-primary-800 border border-primary-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading authors...</div>
        ) : authors.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No authors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {authors.map((author) => (
                  <tr key={author.id} className="hover:bg-primary-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">{author.name}</div>
                      {author.bio && (
                        <div className="text-xs text-gray-400 line-clamp-1">{author.bio}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {author.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleColor(author.role)}`}>
                        {getRoleIcon(author.role)}
                        {author.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {author.role === 'admin' || author.role === 'editor' ? (
                        <span className="text-xs text-gray-500 italic">All categories</span>
                      ) : author.assigned_categories && author.assigned_categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {author.assigned_categories.slice(0, 3).map((cat: any) => (
                            <span
                              key={cat.id}
                              className="px-2 py-1 bg-primary-700 text-gray-300 rounded text-xs"
                            >
                              {cat.name}
                            </span>
                          ))}
                          {author.assigned_categories.length > 3 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                              +{author.assigned_categories.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-red-400">No categories</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {author.is_active ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(author)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit author"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete author"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mt-6">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Author Roles</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li><strong>Admin:</strong> Full access to all categories and system settings</li>
            <li><strong>Editor:</strong> Can write and edit articles for all categories</li>
            <li><strong>Writer:</strong> Can write articles for assigned categories only</li>
            <li><strong>Contributor:</strong> Limited access to assigned categories</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
