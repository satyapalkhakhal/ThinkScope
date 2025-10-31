/**
 * Service Types
 * Type definitions for API responses
 */

export interface Category {
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

export interface Article {
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
  meta_keywords: string | null;
  read_time: string;
  view_count: number;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

export interface ArticleWithRelations extends Article {
  category?: Category;
  author?: Author;
  tags?: Tag[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  status?: 'draft' | 'published' | 'archived';
  categoryId?: number;
  authorId?: number;
  searchQuery?: string;
}
