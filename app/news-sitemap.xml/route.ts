import { articleService } from '@/lib/services/article.service';

export const revalidate = 300; // Revalidate every 5 minutes for news

export async function GET() {
  const baseUrl = 'https://thinkscope.in';

  try {
    // Get articles from last 2 days (Google News requirement)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const { data: articles } = await articleService.getAll({
      filters: { status: 'published' },
      pagination: { limit: 1000 },
      sort: { sortBy: 'published_at', sortOrder: 'desc' },
    });

    // Filter articles from last 2 days
    const recentArticles = (articles || []).filter(article => {
      const publishDate = new Date(article.published_at);
      return publishDate >= twoDaysAgo;
    });

    const newsItems = recentArticles.map(article => `
    <url>
      <loc>${baseUrl}/blog/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>ThinkScope</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${article.published_at}</news:publication_date>
        <news:title><![CDATA[${article.title}]]></news:title>
      </news:news>
    </url>`
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsItems}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    return new Response('Error generating news sitemap', { status: 500 });
  }
}
