import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import CategoryCarousel from '@/components/CategoryCarousel';
import { categories } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Home | ThinkScope - Latest News and Updates',
  description: 'Stay updated with the latest news across technology, world affairs, education, lifestyle, and sports. Your trusted source for breaking news and current events.',
  openGraph: {
    title: 'ThinkScope - Stay Updated with Latest News',
    description: 'Your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.map((category, index) => (
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
