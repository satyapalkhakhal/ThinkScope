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

// Enable ISR (Incremental Static Regeneration) - revalidate every hour
export const revalidate = 3600;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categoriesWithArticles.map((category, index) => (
          <CategoryCarousel
            key={category.id}
            category={category}
            priority={index < 2} // Prioritize above-the-fold content
          />
        ))}
      </div>
    </>
  );
}
