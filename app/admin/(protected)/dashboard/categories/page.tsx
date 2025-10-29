'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [articleCounts, setArticleCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const [categoriesRes, articlesRes] = await Promise.all([
        fetch('/api/categories'),
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

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <p className="mt-2 text-gray-400">Browse all content categories</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-primary-800 rounded-xl p-6 border border-primary-700 hover:border-accent-400 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-accent-400/10 w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:bg-accent-400/20 transition-colors">
                {category.icon || '📁'}
              </div>
              <span className="bg-primary-700 px-3 py-1 rounded-full text-sm text-gray-300">
                {articleCounts[category.id] || 0} articles
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">
              {category.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {category.description || 'No description available'}
            </p>
            <div className="flex items-center justify-between">
              <code className="text-xs text-gray-500 bg-primary-700 px-2 py-1 rounded">
                /{category.slug}
              </code>
              <Link
                href={`/category/${category.slug}`}
                target="_blank"
                className="text-accent-400 hover:text-accent-300 text-sm font-medium"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No categories found</p>
        </div>
      )}
    </div>
  );
}
