# API Services Documentation

Complete service layer for ThinkScope API integration with Supabase.

---

## 📁 Structure

```
lib/services/
├── supabase.service.ts    # Base API client
├── category.service.ts    # Category operations
├── article.service.ts     # Article operations
├── types.ts               # TypeScript types
├── index.ts               # Central exports
└── README.md              # This file
```

---

## 🚀 Quick Start

### Import Services

```typescript
import { categoryService, articleService } from '@/lib/services';
```

### Basic Usage

```typescript
// Get all categories
const { data, error } = await categoryService.getAll();

// Get articles by category
const articles = await articleService.getByCategory(1, 10);

// Search articles
const results = await articleService.search('technology');
```

---

## 📚 Category Service

### `categoryService.getAll(activeOnly?)`

Get all categories.

```typescript
// Get all active categories (default)
const { data, error } = await categoryService.getAll();

// Get all categories including inactive
const all = await categoryService.getAll(false);
```

**Response:**
```typescript
{
  data: Category[] | null,
  error: string | null,
  status: number
}
```

---

### `categoryService.getById(id)`

Get category by ID.

```typescript
const { data } = await categoryService.getById(1);
const category = data?.[0]; // Returns array, get first item
```

---

### `categoryService.getBySlug(slug)`

Get category by slug.

```typescript
const { data } = await categoryService.getBySlug('technology');
const category = data?.[0];
```

---

### `categoryService.create(category)`

Create new category.

```typescript
const newCategory = {
  name: 'Technology',
  slug: 'technology',
  description: 'Tech news and updates',
  icon: 'Laptop',
  display_order: 1,
  is_active: true,
};

const { data, error } = await categoryService.create(newCategory);
```

---

### `categoryService.update(id, updates)`

Update category.

```typescript
const { data } = await categoryService.update(1, {
  name: 'Updated Name',
  description: 'New description',
});
```

---

### `categoryService.delete(id)`

Delete category.

```typescript
const { data, error } = await categoryService.delete(1);
```

---

### `categoryService.toggleActive(id, isActive)`

Toggle category active status.

```typescript
// Deactivate category
await categoryService.toggleActive(1, false);

// Activate category
await categoryService.toggleActive(1, true);
```

---

### `categoryService.reorder(categoryIds)`

Reorder categories.

```typescript
// New order: [3, 1, 2, 4]
await categoryService.reorder([3, 1, 2, 4]);
```

---

## 📰 Article Service

### `articleService.getAll(options?)`

Get all articles with filters, pagination, and sorting.

```typescript
const { data } = await articleService.getAll({
  pagination: {
    limit: 20,
    offset: 0,
  },
  sort: {
    sortBy: 'published_at',
    sortOrder: 'desc',
  },
  filters: {
    status: 'published',
    categoryId: 1,
    searchQuery: 'AI',
  },
});
```

**Options:**
- `pagination.limit` - Number of articles (default: all)
- `pagination.offset` - Skip N articles
- `sort.sortBy` - Field to sort by (default: 'published_at')
- `sort.sortOrder` - 'asc' or 'desc' (default: 'desc')
- `filters.status` - 'draft', 'published', or 'archived'
- `filters.categoryId` - Filter by category
- `filters.authorId` - Filter by author
- `filters.searchQuery` - Search in title

---

### `articleService.getByCategory(categoryId, limit?)`

Get articles by category.

```typescript
// Get 10 latest articles in category 1
const { data } = await articleService.getByCategory(1, 10);
```

---

### `articleService.getById(id)`

Get article by ID.

```typescript
const { data } = await articleService.getById(123);
const article = data?.[0];
```

---

### `articleService.getBySlug(slug)`

Get article by slug.

```typescript
const { data } = await articleService.getBySlug('future-of-ai');
const article = data?.[0];
```

---

### `articleService.getLatest(limit?)`

Get latest published articles.

```typescript
// Get 10 latest articles
const { data } = await articleService.getLatest(10);
```

---

### `articleService.getTrending(limit?)`

Get trending articles (by view count).

```typescript
// Get 10 most viewed articles
const { data } = await articleService.getTrending(10);
```

---

### `articleService.search(query, limit?)`

Search articles.

```typescript
// Search for "AI technology"
const { data } = await articleService.search('AI technology', 20);
```

---

### `articleService.getRelated(articleId, categoryId, limit?)`

Get related articles (same category, excluding current).

```typescript
// Get 6 related articles
const { data } = await articleService.getRelated(123, 1, 6);
```

---

### `articleService.getByAuthor(authorId, limit?)`

Get articles by author.

```typescript
const { data } = await articleService.getByAuthor(5, 10);
```

---

### `articleService.getByDateRange(startDate, endDate)`

Get articles by date range.

```typescript
const { data } = await articleService.getByDateRange(
  '2024-01-01',
  '2024-12-31'
);
```

---

### `articleService.incrementViewCount(id)`

Increment article view count.

```typescript
// Automatically increments view count
await articleService.incrementViewCount(123);
```

---

### `articleService.create(article)`

Create new article.

```typescript
const newArticle = {
  title: 'My Article',
  slug: 'my-article',
  excerpt: 'Short description',
  content: 'Full article content...',
  category_id: 1,
  featured_image_url: 'https://...',
  read_time: '5 min read',
  status: 'draft',
};

const { data } = await articleService.create(newArticle);
```

---

### `articleService.update(id, updates)`

Update article.

```typescript
const { data } = await articleService.update(123, {
  title: 'Updated Title',
  content: 'Updated content...',
});
```

---

### `articleService.delete(id)`

Delete article.

```typescript
await articleService.delete(123);
```

---

### `articleService.publish(id)`

Publish article.

```typescript
// Sets status to 'published' and published_at to now
await articleService.publish(123);
```

---

### `articleService.unpublish(id)`

Unpublish article (set to draft).

```typescript
await articleService.unpublish(123);
```

---

### `articleService.archive(id)`

Archive article.

```typescript
await articleService.archive(123);
```

---

### `articleService.getCountByCategory(categoryId)`

Get article count for a category.

```typescript
const count = await articleService.getCountByCategory(1);
console.log(`Category has ${count} articles`);
```

---

### `articleService.getTotalCount()`

Get total published articles count.

```typescript
const total = await articleService.getTotalCount();
```

---

## 🎯 Usage Examples

### Example 1: Home Page Data

```typescript
import { categoryService, articleService } from '@/lib/services';

export default async function HomePage() {
  // Get all categories
  const { data: categories } = await categoryService.getAll();

  // Get articles for each category
  const categoriesWithArticles = await Promise.all(
    categories?.map(async (category) => {
      const { data: articles } = await articleService.getByCategory(
        category.id,
        10
      );
      return {
        ...category,
        articles: articles || [],
      };
    }) || []
  );

  return <HomeView categories={categoriesWithArticles} />;
}
```

---

### Example 2: Category Page

```typescript
import { categoryService, articleService } from '@/lib/services';

export default async function CategoryPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Get category
  const { data: categoryData } = await categoryService.getBySlug(params.slug);
  const category = categoryData?.[0];

  if (!category) {
    notFound();
  }

  // Get articles in this category
  const { data: articles } = await articleService.getByCategory(
    category.id,
    50
  );

  return (
    <div>
      <h1>{category.name}</h1>
      <p>{category.description}</p>
      <ArticleList articles={articles || []} />
    </div>
  );
}
```

---

### Example 3: Article Page

```typescript
import { articleService } from '@/lib/services';

export default async function ArticlePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // Get article
  const { data: articleData } = await articleService.getBySlug(params.slug);
  const article = articleData?.[0];

  if (!article) {
    notFound();
  }

  // Increment view count
  articleService.incrementViewCount(article.id);

  // Get related articles
  const { data: related } = await articleService.getRelated(
    article.id,
    article.category_id,
    6
  );

  return (
    <div>
      <Article data={article} />
      <RelatedArticles articles={related || []} />
    </div>
  );
}
```

---

### Example 4: Search Page

```typescript
import { articleService } from '@/lib/services';

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: { q?: string } 
}) {
  const query = searchParams.q || '';

  if (!query) {
    return <SearchForm />;
  }

  // Search articles
  const { data: results } = await articleService.search(query, 20);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <p>Found {results?.length || 0} articles</p>
      <ArticleList articles={results || []} />
    </div>
  );
}
```

---

### Example 5: Trending Articles Widget

```typescript
'use client';

import { useEffect, useState } from 'react';
import { articleService, Article } from '@/lib/services';

export default function TrendingWidget() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrending() {
      const { data } = await articleService.getTrending(5);
      setArticles(data || []);
      setLoading(false);
    }
    loadTrending();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Trending Now</h3>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <a href={`/blog/${article.slug}`}>{article.title}</a>
            <span>{article.view_count} views</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔧 Error Handling

All services return a consistent response format:

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}
```

### Handle Errors:

```typescript
const { data, error, status } = await articleService.getBySlug('my-article');

if (error) {
  console.error('API Error:', error);
  console.error('Status:', status);
  // Handle error
  return;
}

// Use data
const article = data?.[0];
```

---

## 🌐 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📊 Type Definitions

### Category Type

```typescript
interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Article Type

```typescript
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: number;
  author_id: number | null;
  featured_image_url: string;
  featured_image_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  read_time: string;
  view_count: number;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
  updated_at: string;
}
```

---

## 🚀 Best Practices

### 1. Always Handle Errors

```typescript
const { data, error } = await articleService.getBySlug(slug);

if (error) {
  // Show error message to user
  return <ErrorPage message={error} />;
}
```

### 2. Use TypeScript Types

```typescript
import { Article, Category } from '@/lib/services';

const articles: Article[] = data || [];
```

### 3. Implement Loading States

```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState<Article[]>([]);

useEffect(() => {
  async function load() {
    const { data } = await articleService.getLatest();
    setData(data || []);
    setLoading(false);
  }
  load();
}, []);
```

### 4. Cache Data When Appropriate

```typescript
// In Next.js App Router, use caching
export const revalidate = 3600; // Cache for 1 hour

export default async function Page() {
  const { data } = await articleService.getLatest();
  // ...
}
```

---

## 📝 Notes

- All services are **singleton instances**
- Services use **Supabase REST API**
- Responses are **type-safe** with TypeScript
- Services handle **error cases** gracefully
- **View count** increments are non-blocking

---

**Your API services are ready to use! Import and start fetching data.** 🚀
