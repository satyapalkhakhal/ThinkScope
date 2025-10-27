import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import BlogGrid from '@/components/BlogGrid';
import { articleService, categoryService } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Blog | ThinkScope - Latest Articles and Insights',
  description: 'Explore our comprehensive collection of articles covering technology, world affairs, education, lifestyle, sports, and breaking news. Stay informed with expert insights and analysis.',
  openGraph: {
    title: 'Blog | ThinkScope - Latest Articles and Insights',
    description: 'Explore our comprehensive collection of articles covering technology, world affairs, education, lifestyle, sports, and breaking news.',
    type: 'website',
  },
};

export default async function BlogPage() {
  // Fetch all published articles from Supabase
  const { data: articles, error: articlesError } = await articleService.getAll({
    filters: { status: 'published' },
    sort: { sortBy: 'published_at', sortOrder: 'desc' },
    pagination: { limit: 100 },
  });

  // Fetch all categories for the filter buttons
  const { data: categories, error: categoriesError } = await categoryService.getAll();

  if (articlesError || !articles) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-red-500 text-center">Error loading articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Create a map of category IDs to names
  const categoryMap = new Map(
    (categories || []).map(cat => [cat.id, { name: cat.name, slug: cat.slug }])
  );

  // Transform articles for BlogGrid component
  const allArticles = articles.map(article => {
    const category = categoryMap.get(article.category_id);
    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      image: article.featured_image_url,
      date: article.published_at.split('T')[0],
      readTime: article.read_time,
      category: category?.name || 'Uncategorized',
      categoryId: category?.slug || '',
      slug: article.slug,
    };
  });

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-300 font-medium">Blog</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Latest Articles
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover insightful articles, breaking news, and expert analysis across all categories.
            Stay informed with our comprehensive coverage of current events and trends.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap gap-2 justify-center">
            <button className="px-4 py-2 bg-accent-500 text-primary-900 rounded-full font-semibold text-sm hover:bg-accent-400 transition-colors">
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-4 py-2 bg-primary-800 text-gray-300 rounded-full font-semibold text-sm hover:bg-primary-700 hover:text-accent-500 transition-colors border border-gray-700"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <BlogGrid articles={allArticles} />

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-accent-500/10 to-accent-400/10 rounded-2xl p-8 border border-accent-500/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-6">
              Get the latest articles and breaking news delivered directly to your inbox.
              Never miss an important story.
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
