# Service Usage Examples

Real-world examples of using the API services in your ThinkScope application.

---

## 🏠 Home Page - Fetch Categories with Articles

```typescript
// app/page.tsx
import { categoryService, articleService } from '@/lib/services';
import CategoryCarousel from '@/components/CategoryCarousel';

export default async function HomePage() {
  // Fetch all active categories
  const { data: categories, error } = await categoryService.getAll();

  if (error || !categories) {
    return <div>Error loading categories</div>;
  }

  // Fetch articles for each category
  const categoriesWithArticles = await Promise.all(
    categories.map(async (category) => {
      const { data: articles } = await articleService.getByCategory(
        category.id,
        10 // Limit to 10 articles per category
      );

      return {
        id: category.id.toString(),
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
    })
  );

  return (
    <div>
      {categoriesWithArticles.map((category) => (
        <CategoryCarousel
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}
```

---

## 📄 Article Page - Fetch Single Article

```typescript
// app/blog/[slug]/page.tsx
import { articleService } from '@/lib/services';
import { notFound } from 'next/navigation';
import BlogPost from '@/components/BlogPost';

interface Props {
  params: { slug: string };
}

export default async function ArticlePage({ params }: Props) {
  // Fetch article by slug
  const { data, error } = await articleService.getBySlug(params.slug);

  if (error || !data || data.length === 0) {
    notFound();
  }

  const article = data[0];

  // Increment view count (non-blocking)
  articleService.incrementViewCount(article.id);

  // Fetch related articles
  const { data: relatedArticles } = await articleService.getRelated(
    article.id,
    article.category_id,
    6
  );

  return (
    <div>
      <BlogPost
        article={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          image: article.featured_image_url,
          date: article.published_at.split('T')[0],
          readTime: article.read_time,
          category: '', // Fetch category name if needed
          slug: article.slug,
        }}
      />

      {relatedArticles && relatedArticles.length > 0 && (
        <div>
          <h2>Related Articles</h2>
          {relatedArticles.map(related => (
            <ArticleCard key={related.id} article={related} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📁 Category Page - List All Articles in Category

```typescript
// app/category/[slug]/page.tsx
import { categoryService, articleService } from '@/lib/services';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  // Get category
  const { data: categoryData } = await categoryService.getBySlug(params.slug);

  if (!categoryData || categoryData.length === 0) {
    notFound();
  }

  const category = categoryData[0];
  const page = parseInt(searchParams.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  // Get articles with pagination
  const { data: articles } = await articleService.getAll({
    pagination: { limit, offset },
    filters: { categoryId: category.id },
    sort: { sortBy: 'published_at', sortOrder: 'desc' },
  });

  return (
    <div>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <Pagination currentPage={page} totalArticles={articles?.length || 0} />
    </div>
  );
}
```

---

## 🔍 Search Page - Search Articles

```typescript
// app/search/page.tsx
import { articleService } from '@/lib/services';
import { Suspense } from 'react';

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';

  if (!query) {
    return (
      <div>
        <h1>Search Articles</h1>
        <SearchForm />
      </div>
    );
  }

  // Search articles
  const { data: results, error } = await articleService.search(query, 50);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {results && (
        <>
          <p>{results.length} articles found</p>
          <div className="space-y-4">
            {results.map(article => (
              <SearchResultItem key={article.id} article={article} />
            ))}
          </div>
        </>
      )}

      {results && results.length === 0 && (
        <p>No articles found. Try a different search term.</p>
      )}
    </div>
  );
}
```

---

## 📊 Trending Articles Component (Client-Side)

```typescript
// components/TrendingArticles.tsx
'use client';

import { useEffect, useState } from 'react';
import { articleService, Article } from '@/lib/services';
import Link from 'next/link';

export default function TrendingArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrending() {
      try {
        const { data, error } = await articleService.getTrending(5);
        
        if (error) {
          setError(error);
        } else {
          setArticles(data || []);
        }
      } catch (err) {
        setError('Failed to load trending articles');
      } finally {
        setLoading(false);
      }
    }

    loadTrending();
  }, []);

  if (loading) {
    return <div>Loading trending articles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">🔥 Trending Now</h3>
      <ul className="space-y-3">
        {articles.map((article, index) => (
          <li key={article.id} className="flex items-start">
            <span className="text-2xl font-bold text-gray-300 mr-3">
              {index + 1}
            </span>
            <div>
              <Link 
                href={`/blog/${article.slug}`}
                className="font-semibold hover:text-blue-600"
              >
                {article.title}
              </Link>
              <p className="text-sm text-gray-600">
                {article.view_count} views • {article.read_time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 📈 Latest Articles Component (Server-Side)

```typescript
// components/LatestArticles.tsx
import { articleService } from '@/lib/services';
import Link from 'next/link';
import Image from 'next/image';

export default async function LatestArticles() {
  const { data: articles } = await articleService.getLatest(6);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <article key={article.id} className="border rounded-lg overflow-hidden">
            <Image
              src={article.featured_image_url}
              alt={article.featured_image_alt || article.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">
                <Link href={`/blog/${article.slug}`}>
                  {article.title}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{article.read_time}</span>
                <span>{new Date(article.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

---

## 🎯 Category Selector Component

```typescript
// components/CategorySelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { categoryService, Category } from '@/lib/services';
import Link from 'next/link';

export default function CategorySelector() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await categoryService.getAll();
      setCategories(data || []);
      setLoading(false);
    }
    loadCategories();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="flex space-x-4">
      {categories.map(category => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
```

---

## 📝 Create Article Form (Admin)

```typescript
// app/admin/articles/new/page.tsx
'use client';

import { useState } from 'react';
import { articleService } from '@/lib/services';
import { useRouter } from 'next/navigation';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const article = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      category_id: parseInt(formData.get('category_id') as string),
      featured_image_url: formData.get('image_url') as string,
      read_time: formData.get('read_time') as string,
      status: 'draft' as const,
    };

    const { data, error } = await articleService.create(article);

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    // Redirect to article page
    if (data && data[0]) {
      router.push(`/blog/${data[0].slug}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            required
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Content</label>
          <textarea
            name="content"
            required
            rows={10}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Category ID</label>
          <input
            type="number"
            name="category_id"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Image URL</label>
          <input
            type="url"
            name="image_url"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Read Time</label>
          <input
            type="text"
            name="read_time"
            placeholder="5 min read"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Article'}
        </button>
      </div>
    </form>
  );
}
```

---

## 🔄 Refresh Data Button (Client Component)

```typescript
// components/RefreshButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RefreshButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRefresh() {
    setLoading(true);
    router.refresh(); // Refresh server components
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      {loading ? 'Refreshing...' : '🔄 Refresh Data'}
    </button>
  );
}
```

---

**These examples cover the most common use cases. Mix and match as needed for your application!** 🚀
