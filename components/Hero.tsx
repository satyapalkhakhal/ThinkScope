import Link from 'next/link';
import Image from 'next/image';
import { articleService, categoryService } from '@/lib/services';
import { TrendingUp } from 'lucide-react';
import type { Article, Category } from '@/lib/services';

export default async function Hero() {
  // Fetch latest articles and randomize them
  const { data: latestArticles } = await articleService.getLatest(20);
  
  // Shuffle articles to get random selection
  const shuffled = (latestArticles || []).sort(() => Math.random() - 0.5);
  const articles = shuffled.slice(0, 6);
  
  // Fetch categories to map category names
  const { data: categories } = await categoryService.getAll();
  const categoryMap = new Map((categories || []).map((cat: Category) => [cat.id, cat.name]));

  return (
    <section className="relative pt-24 pb-12 bg-gradient-to-br from-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trending News Grid */}
        {articles.length > 0 && (
          <div className="animate-fade-in-up">
            {/* Main Grid - Large Featured + Small Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Large Featured Article */}
              {articles[0] && (
                <Link
                  href={`/blog/${articles[0].slug}`}
                  className="lg:col-span-2 group relative overflow-hidden rounded-2xl aspect-[16/10] bg-primary-800 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  {articles[0].featured_image_url ? (
                    <Image
                      src={articles[0].featured_image_url}
                      alt={articles[0].featured_image_alt || articles[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-accent-600/20 flex items-center justify-center">
                      <span className="text-8xl opacity-20">📰</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
                    {categoryMap.get(articles[0].category_id) && (
                      <span className="inline-block mb-2 text-[10px] md:text-xs text-accent-400 font-bold uppercase tracking-wider">
                        {categoryMap.get(articles[0].category_id)}
                      </span>
                    )}
                    <h3 className="text-white font-bold text-lg md:text-2xl lg:text-3xl line-clamp-3 md:line-clamp-3 group-hover:text-accent-400 transition-colors">
                      {articles[0].title}
                    </h3>
                    {articles[0].excerpt && (
                      <p className="hidden md:block text-gray-300 text-sm line-clamp-2 mb-4">
                        {articles[0].excerpt}
                      </p>
                    )}
                    <div className="hidden md:flex items-center gap-2 text-gray-400 text-xs">
                      <span>{articles[0].read_time}</span>
                      <span>•</span>
                      <span>{articles[0].view_count || 0} views</span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-accent-500 text-primary-900 text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    <span className="hidden sm:inline">FEATURED</span>
                    <span className="sm:hidden">★</span>
                  </div>
                </Link>
              )}

              {/* Small Article Cards - Right Side */}
              <div className="flex flex-col gap-4">
                {articles.slice(1, 4).map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group flex gap-4 bg-primary-800 hover:bg-primary-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Small Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-primary-700">
                      {article.featured_image_url ? (
                        <Image
                          src={article.featured_image_url}
                          alt={article.featured_image_alt || article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="96px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-accent-600/20 flex items-center justify-center">
                          <span className="text-2xl opacity-30">📰</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {categoryMap.get(article.category_id) && (
                        <span className="text-xs text-accent-400 font-semibold uppercase tracking-wide">
                          {categoryMap.get(article.category_id)}
                        </span>
                      )}
                      <h4 className="text-white font-semibold text-sm mt-1 line-clamp-2 group-hover:text-accent-400 transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                        <span>{article.read_time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
