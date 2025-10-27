import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Calendar, ChevronRight } from 'lucide-react';
import { categoryService, articleService } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Categories | ThinkScope - Explore All News Categories',
  description: 'Browse all news categories including Technology, Breaking News, World Affairs, Education, Lifestyle, and Sports. Find articles and updates in your area of interest.',
  openGraph: {
    title: 'Categories | ThinkScope - Explore All News Categories',
    description: 'Browse all news categories including Technology, Breaking News, World Affairs, Education, Lifestyle, and Sports.',
    type: 'website',
  },
};

const iconMap: { [key: string]: string } = {
  Laptop: '💻',
  Newspaper: '📰',
  Globe: '🌍',
  GraduationCap: '🎓',
  Heart: '❤️',
  Trophy: '🏆',
};

export default async function CategoriesPage() {
  // Fetch all active categories from Supabase
  const { data: categories, error } = await categoryService.getAll();

  if (error || !categories) {
    return (
      <div className="min-h-screen pt-16 bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-red-500 text-center">Error loading categories. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Fetch latest article for each category
  const categoriesWithArticles = await Promise.all(
    categories.map(async (category) => {
      const { data: articles } = await articleService.getByCategory(category.id, 1);
      const { data: allArticles } = await articleService.getByCategory(category.id, 100);
      
      return {
        id: category.slug,
        name: category.name,
        icon: category.icon || 'Folder',
        description: category.description || '',
        totalArticles: allArticles?.length || 0,
        latestArticle: articles?.[0] ? {
          title: articles[0].title,
          image: articles[0].featured_image_url,
          date: articles[0].published_at.split('T')[0],
          readTime: articles[0].read_time,
        } : null,
      };
    })
  );

  return (
    <div className="min-h-screen pt-16 bg-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300 font-medium">Categories</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            All Categories
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our comprehensive coverage across different topics and find the news that matters most to you.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {categoriesWithArticles.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={index}
              iconMap={iconMap}
            />
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-accent-500/10 to-accent-400/10 rounded-2xl p-8 border border-accent-500/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Never Miss Important Updates</h2>
            <p className="text-gray-300 mb-6">
              Subscribe to our newsletter and get the latest articles from all categories delivered directly to your inbox.
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

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    description: string;
    totalArticles: number;
    latestArticle: {
      title: string;
      image: string;
      date: string;
      readTime: string;
    } | null;
  };
  index: number;
  iconMap: { [key: string]: string };
}

function CategoryCard({ category, index, iconMap }: CategoryCardProps) {
  const latestArticle = category.latestArticle;
  const totalArticles = category.totalArticles;

  return (
    <Link href={`/category/${category.id}`}>
      <div className="card group cursor-pointer animate-fade-in-up overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
        {/* Featured Article Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={latestArticle?.image || 'https://via.placeholder.com/400x250/333/fff?text=No+Image'}
            alt={category.name}
            width={400}
            height={250}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Category Icon and Name Overlay */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <span className="text-2xl">{iconMap[category.icon]}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              <p className="text-gray-200 text-sm">{totalArticles} articles</p>
            </div>
          </div>

          {/* View All Button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-accent-500 text-primary-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Category Description */}
        <div className="p-6">
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>

          {/* Latest Article Preview */}
          {latestArticle && (
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-accent-500 transition-colors">
                    Latest: {latestArticle.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(latestArticle.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{latestArticle.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
