/**
 * Services Index
 * Central export point for all services
 */

// Export services
export { supabaseService } from './supabase.service';
export { categoryService } from './category.service';
export { articleService } from './article.service';

// Export types
export type { ApiResponse } from './supabase.service';
export type {
  Category,
  Article,
  Author,
  Tag,
  ArticleWithRelations,
  PaginationParams,
  SortParams,
  FilterParams,
} from './types';
