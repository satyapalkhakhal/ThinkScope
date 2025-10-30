import { articleService } from '@/lib/services/article.service';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://thinkscope.in';

  try {
    // Fetch all published articles
    const { data: articles } = await articleService.getAll({
      filters: { status: 'published' },
      pagination: { limit: 1000 },
      sort: { sortBy: 'published_at', sortOrder: 'desc' },
    });

    const imageUrls = (articles || [])
      .filter(article => article.featured_image_url)
      .map(article => `
    <url>
      <loc>${baseUrl}/blog/${article.slug}</loc>
      <image:image>
        <image:loc>${article.featured_image_url}</image:loc>
        <image:title><![CDATA[${article.title}]]></image:title>
        <image:caption><![CDATA[${article.excerpt}]]></image:caption>
      </image:image>
    </url>`)
      .join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${imageUrls}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating image sitemap:', error);
    return new Response('Error generating image sitemap', { status: 500 });
  }
}
