import { articleService } from '@/lib/services/article.service';
import { categoryService } from '@/lib/services/category.service';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://thinkscope.in';

  try {
    // Fetch latest published articles
    const { data: articles } = await articleService.getAll({
      filters: { status: 'published' },
      pagination: { limit: 50 }, // Last 50 articles
      sort: { sortBy: 'published_at', sortOrder: 'desc' },
    });

    const rssItems = await Promise.all(
      (articles || []).map(async (article) => {
        // Fetch category for the article
        const { data: categoryData } = await categoryService.getById(article.category_id);
        const category = categoryData?.[0];

        return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <category><![CDATA[${category?.name || 'Uncategorized'}]]></category>
      <author>ThinkScope Team</author>
      ${article.featured_image_url ? `<enclosure url="${article.featured_image_url}" type="image/jpeg" />` : ''}
    </item>`;
      })
    );

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>ThinkScope - Latest News and Updates</title>
    <link>${baseUrl}</link>
    <description>Your trusted source for breaking news, technology updates, world affairs, education, lifestyle, and sports. Stay informed with our comprehensive coverage.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/icon-512x512.png</url>
      <title>ThinkScope</title>
      <link>${baseUrl}</link>
    </image>
    ${rssItems.join('')}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}
