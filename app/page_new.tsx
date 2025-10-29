import Link from 'next/link';
import Image from 'next/image';
import { categoryService, articleService } from '@/lib/services';
import { Clock, TrendingUp, Users, Calendar, Folder } from 'lucide-react';

export const revalidate = 3600;

export default async function HomePage() {
  // Fetch categories and articles
  const { data: categories } = await categoryService.getAll();
  const { data: allArticles } = await articleService.getLatest(20);

  // Get featured article (first article)
  const featuredArticle = allArticles?.[0];
  
  // Get secondary featured articles
  const secondaryFeatured = allArticles?.slice(1, 5) || [];

  // Group articles by category
  const categorizedArticles = categories?.map(category => ({
    ...category,
    articles: allArticles?.filter(article => article.category_id === category.id).slice(0, 3) || []
  })) || [];

  // Stats data
  const stats = [
    { label: 'Articles', value: '10K+', icon: TrendingUp },
    { label: 'Readers', value: '50K+', icon: Users },
    { label: 'Updates', value: '24/7', icon: Calendar },
    { label: 'Categories', value: categories?.length || 0, icon: Folder },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-850 to-primary-800 dark:from-primary-950 dark:via-primary-900 dark:to-primary-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Featured Article */}
            <div className="relative group">
              {featuredArticle && (
                <Link href={`/blog/${featuredArticle.slug}`}>
                  <div className="relative h-[500px] rounded-2xl overflow-hidden">
                    <Image
                      src={featuredArticle.featured_image_url || '/placeholder.jpg'}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="inline-block px-3 py-1 bg-accent-500 text-primary-950 text-xs font-bold rounded-full mb-3">
                        FEATURED
                      </span>
                      <h2 className="text-3xl font-bold text-white mb-3 line-clamp-3">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-gray-200 text-sm line-clamp-2 mb-4">
                        {featuredArticle.excerpt}
                      </p>
                      <button className="px-6 py-2 bg-accent-500 text-primary-950 rounded-lg font-medium hover:bg-accent-400 transition-colors inline-flex items-center space-x-2">
                        <span>Read Latest Articles</span>
                        <TrendingUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Secondary Featured Articles */}
            <div className="grid grid-cols-2 gap-4">
              {secondaryFeatured.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <div className="relative h-[240px] rounded-xl overflow-hidden group">
                    <Image
                      src={article.featured_image_url || '/placeholder.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-2 py-1 bg-primary-800/80 text-accent-500 text-xs font-medium rounded mb-2">
                        {article.category_id}
                      </span>
                      <h3 className="text-white font-semibold text-sm line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Explore Categories Button */}
          <div className="mt-8 text-center">
            <Link href="/categories">
              <button className="px-8 py-3 bg-primary-800 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                Explore Categories
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-900 dark:bg-primary-950 border-y border-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-500/10 rounded-full mb-3">
                    <Icon className="h-6 w-6 text-accent-500" />
                  </div>
                  <div className="text-3xl font-bold text-accent-500 mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categorizedArticles.slice(0, 3).map((category) => (
        <section key={category.id} className="py-12 bg-primary-950 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">{category.name}</h2>
              <Link href={`/category/${category.slug}`}>
                <button className="px-4 py-2 bg-primary-800 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
                  View All
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {category.articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <div className="bg-primary-900 dark:bg-primary-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-accent-500 transition-all group">
                    <div className="relative h-48">
                      <Image
                        src={article.featured_image_url || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-2 py-1 bg-accent-500/10 text-accent-500 text-xs font-medium rounded mb-2">
                        {category.name}
                      </span>
                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent-500 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-gray-500 text-xs space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.read_time} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
