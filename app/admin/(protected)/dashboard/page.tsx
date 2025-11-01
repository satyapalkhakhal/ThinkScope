'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  categories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/categories'),
      ]);

      const articlesData = await articlesRes.json();
      const categoriesData = await categoriesRes.json();

      const articles = articlesData.data || [];
      const publishedCount = articles.filter((a: any) => a.status === 'published').length;
      const draftCount = articles.filter((a: any) => a.status === 'draft').length;

      setStats({
        totalArticles: articles.length,
        publishedArticles: publishedCount,
        draftArticles: draftCount,
        categories: categoriesData.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Articles',
      value: stats.totalArticles,
      color: 'bg-blue-500',
      icon: '📝',
    },
    {
      name: 'Published',
      value: stats.publishedArticles,
      color: 'bg-green-500',
      icon: '✅',
    },
    {
      name: 'Drafts',
      value: stats.draftArticles,
      color: 'bg-yellow-500',
      icon: '📄',
    },
    {
      name: 'Categories',
      value: stats.categories,
      color: 'bg-purple-500',
      icon: '📁',
    },
  ];

  const quickActions = [
    {
      name: 'Create New Article',
      href: '/admin/dashboard/articles/new',
      icon: '➕',
      color: 'bg-accent-400 hover:bg-accent-300',
    },
    {
      name: 'Manage Articles',
      href: '/admin/dashboard/articles',
      icon: '📋',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Manage Authors',
      href: '/admin/dashboard/authors',
      icon: '👥',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'View Categories',
      href: '/admin/dashboard/categories',
      icon: '🗂️',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-gray-400">Welcome back! Here's an overview of your content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-primary-800 rounded-xl p-6 border border-primary-700 hover:border-accent-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`${action.color} text-white rounded-xl p-6 flex items-center space-x-4 transition-all hover:scale-105 shadow-lg`}
            >
              <span className="text-3xl">{action.icon}</span>
              <span className="font-medium">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-primary-800 rounded-xl p-6 border border-primary-700">
        <h2 className="text-xl font-bold text-white mb-4">Getting Started</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center space-x-2">
            <span className="text-accent-400">→</span>
            <span>Create your first article using the "Create New Article" button</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-accent-400">→</span>
            <span>Manage existing articles from the Articles page</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-accent-400">→</span>
            <span>Articles are cached for 2 minutes - changes will be visible shortly after publishing</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
