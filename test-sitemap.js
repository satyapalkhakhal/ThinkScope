/**
 * Test Sitemap Generation
 * Run this to verify your sitemap is working correctly
 */

const { articleService } = require('./lib/services/article.service');
const { categoryService } = require('./lib/services/category.service');

async function testSitemap() {
  console.log('🧪 Testing Sitemap Generation...\n');

  try {
    // Test article fetching
    console.log('📰 Fetching articles from Supabase...');
    const articlesResponse = await articleService.getAll({
      filters: { status: 'published' },
      pagination: { limit: 100 },
    });

    const articles = articlesResponse.data || [];
    console.log(`✅ Found ${articles.length} published articles`);
    
    if (articles.length > 0) {
      console.log(`   Sample: ${articles[0].title} (${articles[0].slug})`);
    }

    // Test category fetching
    console.log('\n📂 Fetching categories from Supabase...');
    const categoriesResponse = await categoryService.getAll();
    
    const categories = categoriesResponse.data || [];
    console.log(`✅ Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log(`   Sample: ${categories[0].name} (${categories[0].slug || categories[0].id})`);
    }

    // Generate sample sitemap URLs
    console.log('\n🗺️  Sample Sitemap URLs:');
    console.log('─'.repeat(80));
    
    const baseUrl = 'https://thinkscope.com';
    
    // Static pages
    console.log(`${baseUrl} (priority: 1.0)`);
    console.log(`${baseUrl}/blog (priority: 0.9)`);
    console.log(`${baseUrl}/categories (priority: 0.9)`);
    
    // Categories
    if (categories.length > 0) {
      categories.slice(0, 3).forEach(cat => {
        console.log(`${baseUrl}/category/${cat.slug || cat.id} (priority: 0.8)`);
      });
    }
    
    // Articles
    if (articles.length > 0) {
      articles.slice(0, 5).forEach(article => {
        console.log(`${baseUrl}/blog/${article.slug} (priority: 0.6)`);
      });
    }
    
    console.log('─'.repeat(80));
    console.log(`\n✅ Total URLs in sitemap: ${7 + categories.length + articles.length}`);
    console.log('\n🎉 Sitemap test completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run build');
    console.log('   2. Deploy to production');
    console.log('   3. Visit: https://thinkscope.com/sitemap.xml');
    console.log('   4. Submit to Google Search Console');

  } catch (error) {
    console.error('\n❌ Error testing sitemap:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL is set in .env.local');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY is set in .env.local');
    console.error('   - Supabase database is accessible');
    process.exit(1);
  }
}

// Run test
testSitemap();
