import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from '@/components/BlogPost';
import { categories } from '@/data/categories';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;

  // Find the article
  const allArticles = categories.flatMap(category => category.articles);
  const article = allArticles.find(article => article.slug === slug);

  if (!article) {
    return {
      title: 'Article Not Found | NewsBlog',
    };
  }

  return {
    title: `${article.title} | NewsBlog`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | NewsBlog`,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: ['NewsBlog Team'],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | NewsBlog`,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export async function generateStaticParams() {
  const allArticles = categories.flatMap(category => category.articles);
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;

  // Find the article
  const allArticles = categories.flatMap(category => category.articles);
  const article = allArticles.find(article => article.slug === slug);

  if (!article) {
    notFound();
  }

  return <BlogPost article={article} />;
}
