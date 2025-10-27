import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from '@/components/BlogPost';
import { articleService, categoryService } from '@/lib/services';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;

  // Fetch article from Supabase
  const { data, error } = await articleService.getBySlug(slug);
  const article = data?.[0];

  if (!article || error) {
    return {
      title: 'Article Not Found | ThinkScope',
    };
  }

  return {
    title: `${article.title} | ThinkScope`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | ThinkScope`,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.published_at,
      authors: ['ThinkScope Team'],
      images: [
        {
          url: article.featured_image_url,
          width: 1200,
          height: 630,
          alt: article.featured_image_alt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | ThinkScope`,
      description: article.excerpt,
      images: [article.featured_image_url],
    },
  };
}

export async function generateStaticParams() {
  // Fetch all published articles from Supabase
  const { data: articles } = await articleService.getAll({
    filters: { status: 'published' },
  });
  
  return (articles || []).map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;

  // Fetch article from Supabase by slug
  const { data, error } = await articleService.getBySlug(slug);
  const article = data?.[0];

  if (!article || error) {
    notFound();
  }

  // Increment view count (non-blocking)
  articleService.incrementViewCount(article.id);

  // Fetch category for the article
  const { data: categoryData } = await categoryService.getById(article.category_id);
  const category = categoryData?.[0];

  // Fetch related articles from same category
  const { data: relatedArticles } = await articleService.getRelated(
    article.id,
    article.category_id,
    6
  );

  // Transform article data for BlogPost component
  const transformedArticle = {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    image: article.featured_image_url,
    date: article.published_at.split('T')[0],
    readTime: article.read_time,
    category: category?.name || 'Uncategorized',
    slug: article.slug,
    categoryId: category?.slug || '',
    author: 'ThinkScope Team',
    authorTitle: 'Editorial Team',
    content: article.content,
  };

  // Transform related articles
  const transformedRelated = (relatedArticles || []).map(rel => ({
    id: rel.id,
    title: rel.title,
    excerpt: rel.excerpt,
    image: rel.featured_image_url,
    date: rel.published_at.split('T')[0],
    readTime: rel.read_time,
    category: category?.name || 'Uncategorized',
    slug: rel.slug,
  }));

  return <BlogPost article={transformedArticle} relatedArticles={transformedRelated} />;
}
