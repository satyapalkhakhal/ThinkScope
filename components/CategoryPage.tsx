'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Calendar, User, Filter, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: Article[];
}

interface CategoryPageProps {
  category: Category;
}

const iconMap: { [key: string]: string } = {
  Laptop: '💻',
  Newspaper: '📰',
  Globe: '🌍',
  GraduationCap: '🎓',
  Heart: '❤️',
  Trophy: '🏆',
};

export default function CategoryPage({ category }: CategoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Filter and sort articles
  const filteredAndSortedArticles = category.articles
    .filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-accent-500 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/categories" className="hover:text-accent-500 transition-colors">
            Categories
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300 font-medium">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <span className="text-4xl">{iconMap[category.icon]}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              {category.name}
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            {category.description}
          </p>

          {/* Category Stats */}
          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-1">
              <span className="text-2xl">📰</span>
              <span className="font-semibold">{category.articles.length}</span>
              <span>Articles</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-2xl">📅</span>
              <span>Updated Daily</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${category.name.toLowerCase()} articles...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                className="px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {filteredAndSortedArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No articles found</div>
              <p className="text-gray-500">
                {searchTerm
                  ? `No articles match your search for "${searchTerm}"`
                  : 'Check back later for new content.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedArticles.map((article, index) => (
                <CategoryArticleCard
                  key={article.id}
                  article={article}
                  index={index}
                  categoryName={category.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More / Pagination could go here */}
        {filteredAndSortedArticles.length > 0 && (
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-gray-400">
              Showing {filteredAndSortedArticles.length} of {category.articles.length} articles
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-6 py-2 bg-primary-800 hover:bg-primary-700 text-gray-300 hover:text-accent-500 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-accent-500/10 to-accent-400/10 rounded-2xl p-8 border border-accent-500/20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Stay Updated with {category.name}</h2>
            <p className="text-gray-300 mb-6">
              Get the latest {category.name.toLowerCase()} articles and breaking news delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-accent-500 hover:bg-accent-400 text-primary-900 font-semibold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryArticleCardProps {
  article: Article;
  index: number;
  categoryName: string;
}

function CategoryArticleCard({ article, index, categoryName }: CategoryArticleCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <article
        className="card h-full group cursor-pointer animate-fade-in-up"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={article.image}
            alt={article.title}
            width={400}
            height={250}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-accent-500 text-primary-900 px-2 py-1 rounded-full text-xs font-semibold">
              {categoryName}
            </span>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
              <span className="text-white text-sm">Read More</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-accent-500 transition-colors">
            {article.title}
          </h2>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <User className="h-3 w-3" />
              <span>ThinkScope Team</span>
            </div>
            <span className="text-accent-500 font-semibold text-sm group-hover:text-accent-400 transition-colors">
              Read More →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
