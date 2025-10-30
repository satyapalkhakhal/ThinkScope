import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import CategoryCarousel from '@/components/CategoryCarousel';
import { categoryService, articleService } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Home | ThinkScope - Latest News and Updates',
  description: 'Stay updated with the latest news across technology, world affairs, education, lifestyle, and sports. Your trusted source for breaking news and current events.',
  keywords: 'news, latest news, breaking news, technology, world affairs, education, lifestyle, sports, current events, ThinkScope',
  openGraph: {
    title: 'ThinkScope - Stay Updated with Latest News',
    description: 'Your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports.',
    type: 'website',
  },
};

// Enable ISR (Incremental Static Regeneration) - revalidate every 2 minutes
export const revalidate = 120;

export default async function HomePage() {
  // Fetch categories from Supabase
  const { data: categories, error } = await categoryService.getAll();

  if (error || !categories) {
    console.error('Error fetching categories:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-500">Error loading categories. Please try again later.</p>
      </div>
    );
  }

  // Fetch articles for each category
  const categoriesWithArticles = await Promise.all(
    categories.map(async (category) => {
      const { data: articles } = await articleService.getByCategory(category.id, 10);
      
      return {
        id: category.slug,
        name: category.name,
        icon: category.icon || 'Folder',
        description: category.description || '',
        articles: (articles || []).map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          image: article.featured_image_url,
          date: article.published_at.split('T')[0],
          readTime: article.read_time,
          category: category.name,
          slug: article.slug,
        })),
      };
    })
  );

  return (
    <>
      <Hero />
      
      {/* SEO Content Section - Improves text-to-code ratio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-primary-800/50">
        <div className="prose prose-invert max-w-none">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-accent-400 mb-4">Your Trusted Source for Breaking News</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                ThinkScope is your comprehensive news platform delivering the latest updates across multiple categories. 
                We provide in-depth coverage of technology innovations, world affairs, educational developments, lifestyle 
                trends, and sports events. Our team is dedicated to bringing you accurate, timely, and engaging news content 
                that keeps you informed about what matters most.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Whether you're interested in cutting-edge technology breakthroughs, global political developments, 
                educational reforms, lifestyle tips, or sports highlights, ThinkScope delivers comprehensive coverage 
                with expert analysis and insightful commentary. Stay updated with our real-time news feed and never 
                miss an important story.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-accent-400 mb-4">Wide Range of News Categories</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our platform covers diverse topics to cater to all your information needs:
              </p>
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li><strong className="text-white">Technology:</strong> Latest gadgets, software updates, AI developments, and tech industry news</li>
                <li><strong className="text-white">World Affairs:</strong> International politics, global economics, and major world events</li>
                <li><strong className="text-white">Education:</strong> Academic news, learning resources, and educational policy updates</li>
                <li><strong className="text-white">Lifestyle:</strong> Health tips, travel guides, food trends, and personal development</li>
                <li><strong className="text-white">Sports:</strong> Live scores, match analysis, player profiles, and tournament coverage</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                With ThinkScope, you get a one-stop destination for all your news consumption needs. Our user-friendly 
                interface makes it easy to browse through categories and discover content that interests you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoriesWithArticles.map((category, index) => (
          <CategoryCarousel
            key={category.id}
            category={category}
            priority={index < 2} // Prioritize above-the-fold content
          />
        ))}
      </div>

      {/* Additional SEO Footer Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-primary-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-accent-400 mb-4">Why Choose ThinkScope for Your Daily News?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Comprehensive Coverage</h3>
              <p className="leading-relaxed">
                We cover news from multiple sources and categories, ensuring you get a complete picture of current events. 
                Our editorial team curates the most important stories and presents them in an easy-to-digest format.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Updates</h3>
              <p className="leading-relaxed">
                Stay ahead with our real-time news updates. We continuously monitor breaking news and deliver timely 
                information so you're always in the know. Our platform updates every few minutes with the latest developments.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Expert Analysis</h3>
              <p className="leading-relaxed">
                Beyond just reporting facts, we provide context and analysis to help you understand the implications of 
                news events. Our writers bring expertise and insight to every story they cover.
              </p>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed mt-6">
            Join thousands of readers who trust ThinkScope for their daily news. Bookmark our site and check back 
            regularly for the latest updates across technology, world affairs, education, lifestyle, and sports. 
            Subscribe to our newsletter to get top stories delivered directly to your inbox.
          </p>
        </div>
      </section>
    </>
  );
}
