import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPage from '@/components/CategoryPage';
import { categories } from '@/data/categories';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = params;

  // Find the category
  const category = categories.find(cat => cat.id === id);

  if (!category) {
    return {
      title: 'Category Not Found | NewsBlog',
    };
  }

  return {
    title: `${category.name} | NewsBlog - Latest ${category.name} News`,
    description: `Stay updated with the latest ${category.name.toLowerCase()} news, articles, and insights. ${category.description}`,
    openGraph: {
      title: `${category.name} | NewsBlog - Latest ${category.name} News`,
      description: `Stay updated with the latest ${category.name.toLowerCase()} news, articles, and insights.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | NewsBlog - Latest ${category.name} News`,
      description: `Stay updated with the latest ${category.name.toLowerCase()} news, articles, and insights.`,
    },
  };
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    id: category.id,
  }));
}

export default function Category({ params }: CategoryPageProps) {
  const { id } = params;

  // Find the category
  const category = categories.find(cat => cat.id === id);

  if (!category) {
    notFound();
  }

  return <CategoryPage category={category} />;
}
