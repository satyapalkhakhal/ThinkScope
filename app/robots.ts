import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/private/'],
    },
    sitemap: [
      'https://thinkscope.in/sitemap.xml',
      'https://thinkscope.in/news-sitemap.xml',
      'https://thinkscope.in/image-sitemap.xml',
    ],
  };
}
