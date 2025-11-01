/**
 * Services Index
 * Central export point for all services
 */

// Export services
export { supabaseService } from './supabase.service';
export { categoryService } from './category.service';
export { articleService } from './article.service';
export { authorService } from './author.service';

// Export types
export type { ApiResponse } from './supabase.service';
export type {
  Category,
  Article,
  Author,
  AuthorWithCategories,
  AuthorCategoryAssignment,
  Tag,
  ArticleWithRelations,
  PaginationParams,
  SortParams,
  FilterParams,
} from './types';
