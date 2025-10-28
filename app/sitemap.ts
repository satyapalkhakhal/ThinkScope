import { MetadataRoute } from 'next';
import { articleService } from '@/lib/services/article.service';
import { categoryService } from '@/lib/services/category.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thinkscope.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  try {
    // Fetch all published articles from Supabase
    const articlesResponse = await articleService.getAll({
      filters: { status: 'published' },
      pagination: { limit: 10000 }, // Get all articles
      sort: { sortBy: 'published_at', sortOrder: 'desc' },
    });

    // Fetch all active categories from Supabase
    const categoriesResponse = await categoryService.getAll();

    const articles = articlesResponse.data || [];
    const categories = categoriesResponse.data || [];

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug || category.id}`,
      lastModified: new Date(category.updated_at || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    // Blog post pages
    const blogPosts: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.updated_at || article.published_at || article.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...categoryPages, ...blogPosts];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if database fetch fails
    return staticPages;
  }
}
