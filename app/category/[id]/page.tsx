import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPage from '@/components/CategoryPage';
import { categoryService, articleService } from '@/lib/services';

interface CategoryPageProps {
  params: {
    id: string;
  };
}

// Enable ISR - revalidate every 2 minutes
export const revalidate = 120;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = params;

  // Fetch category from Supabase by slug
  const { data, error } = await categoryService.getBySlug(id);
  const category = data?.[0];

  if (!category || error) {
    return {
      title: 'Category Not Found | ThinkScope',
    };
  }

  // Generate keywords for category
  const keywords = `${category.name}, ${category.name.toLowerCase()} news, ThinkScope, latest ${category.name.toLowerCase()}, ${category.name.toLowerCase()} articles, breaking news`;

  return {
    title: `${category.name} | ThinkScope - Latest ${category.name} News`,
    description: `Stay updated with the latest ${category.name.toLowerCase()} news, articles, and insights. ${category.description || ''}`,
    keywords: keywords,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | ThinkScope - Latest ${category.name} News`,
      description: `Stay updated with the latest ${category.name.toLowerCase()} news, articles, and insights.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | ThinkScope - Latest ${category.name} News`,
      description: `Stay updated with the latest ${category.name.toLowerCase()} news, articles, and insights.`,
    },
  };
}

export async function generateStaticParams() {
  // Fetch all active categories from Supabase
  const { data: categories } = await categoryService.getAll();
  
  return (categories || []).map((category) => ({
    id: category.slug,
  }));
}

export default async function Category({ params }: CategoryPageProps) {
  const { id } = params;

  // Fetch category from Supabase by slug
  const { data: categoryData, error: categoryError } = await categoryService.getBySlug(id);
  const category = categoryData?.[0];

  if (!category || categoryError) {
    notFound();
  }

  // Fetch articles for this category (ordered by id desc, limit 20)
  const { data: articles, error: articlesError } = await articleService.getAll({
    filters: { 
      categoryId: category.id,
      status: 'published'
    },
    sort: {
      sortBy: 'id',
      sortOrder: 'desc'
    },
    pagination: {
      limit: 20
    }
  });

  if (articlesError) {
    console.error('Error fetching articles:', articlesError);
  }

  // Transform data for CategoryPage component
  const transformedCategory = {
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

  // CollectionPage Schema for category
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Articles`,
    description: category.description || `Latest ${category.name.toLowerCase()} news and articles from ThinkScope`,
    url: `https://thinkscope.in/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: (articles || []).length,
      itemListElement: (articles || []).slice(0, 10).map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://thinkscope.in/blog/${article.slug}`,
        name: article.title,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://thinkscope.in',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Categories',
          item: 'https://thinkscope.in/categories',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: category.name,
          item: `https://thinkscope.in/category/${category.slug}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <CategoryPage category={transformedCategory} />
    </>
  );
}
