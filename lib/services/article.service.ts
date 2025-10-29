/**
 * Article Service
 * Handles all article-related API calls
 */

import { supabaseService, ApiResponse } from './supabase.service';
import { Article, PaginationParams, SortParams, FilterParams } from './types';

class ArticleService {
  private endpoint = '/articles';

  /**
   * Get all articles with filters and pagination
   */
  async getAll(options?: {
    pagination?: PaginationParams;
    sort?: SortParams;
    filters?: FilterParams;
  }): Promise<ApiResponse<Article[]>> {
    const { pagination, sort, filters } = options || {};
    
    const params: Record<string, any> = {};

    // Pagination
    if (pagination?.limit) {
      params.limit = pagination.limit;
    }
    if (pagination?.offset) {
      params.offset = pagination.offset;
    }

    // Sorting
    const sortBy = sort?.sortBy || 'published_at';
    const sortOrder = sort?.sortOrder || 'desc';
    params.order = `${sortBy}.${sortOrder}`;

    // Filters
    if (filters?.status) {
      params.status = `eq.${filters.status}`;
    } else {
      // Default to published only
      params.status = 'eq.published';
    }

    if (filters?.categoryId) {
      params.category_id = `eq.${filters.categoryId}`;
    }

    if (filters?.authorId) {
      params.author_id = `eq.${filters.authorId}`;
    }

    if (filters?.searchQuery) {
      params.title = `ilike.*${filters.searchQuery}*`;
    }

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get articles by category
   * @param categoryId - Category ID
   * @param limit - Number of articles to fetch
   */
  async getByCategory(categoryId: number, limit: number = 10): Promise<ApiResponse<Article[]>> {
    const params = {
      category_id: `eq.${categoryId}`,
      status: 'eq.published',
      order: 'published_at.desc',
      limit,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get article by ID
   * @param id - Article ID
   */
  async getById(id: number): Promise<ApiResponse<Article[]>> {
    const params = {
      id: `eq.${id}`,
      limit: 1,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get article by slug
   * @param slug - Article slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<Article[]>> {
    const params = {
      slug: `eq.${slug}`,
      status: 'eq.published',
      limit: 1,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get latest articles
   * @param limit - Number of articles to fetch
   */
  async getLatest(limit: number = 10): Promise<ApiResponse<Article[]>> {
    const params = {
      status: 'eq.published',
      order: 'published_at.desc',
      limit,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get trending articles (by view count)
   * @param limit - Number of articles to fetch
   */
  async getTrending(limit: number = 10): Promise<ApiResponse<Article[]>> {
    const params = {
      status: 'eq.published',
      order: 'view_count.desc',
      limit,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Search articles
   * @param query - Search query
   * @param limit - Number of results
   */
  async search(query: string, limit: number = 20): Promise<ApiResponse<Article[]>> {
    const params = {
      or: `(title.ilike.*${query}*,excerpt.ilike.*${query}*)`,
      status: 'eq.published',
      order: 'published_at.desc',
      limit,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 600 });
  }

  /**
   * Get related articles (same category, excluding current article)
   * @param articleId - Current article ID
   * @param categoryId - Category ID
   * @param limit - Number of articles to fetch
   */
  async getRelated(
    articleId: number,
    categoryId: number,
    limit: number = 6
  ): Promise<ApiResponse<Article[]>> {
    const params = {
      category_id: `eq.${categoryId}`,
      id: `neq.${articleId}`,
      status: 'eq.published',
      order: 'published_at.desc',
      limit,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get articles by author
   * @param authorId - Author ID
   * @param limit - Number of articles to fetch
   */
  async getByAuthor(authorId: number, limit: number = 10): Promise<ApiResponse<Article[]>> {
    const params = {
      author_id: `eq.${authorId}`,
      status: 'eq.published',
      order: 'published_at.desc',
      limit,
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get articles by date range
   * @param startDate - Start date (ISO string)
   * @param endDate - End date (ISO string)
   */
  async getByDateRange(startDate: string, endDate: string): Promise<ApiResponse<Article[]>> {
    const params = {
      'published_at': `gte.${startDate},lte.${endDate}`,
      status: 'eq.published',
      order: 'published_at.desc',
    };

    return supabaseService.get<Article[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Increment article view count
   * @param id - Article ID
   */
  async incrementViewCount(id: number): Promise<void> {
    try {
      // First get current view count
      const response = await this.getById(id);
      
      if (response.data && response.data.length > 0) {
        const article = response.data[0];
        const newCount = (article.view_count || 0) + 1;
        
        // Update view count
        const endpoint = `${this.endpoint}?id=eq.${id}`;
        await supabaseService.patch(endpoint, { view_count: newCount });
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw - view count is not critical
    }
  }

  /**
   * Create new article
   * @param article - Article data
   */
  async create(article: Partial<Article>): Promise<ApiResponse<Article[]>> {
    return supabaseService.post<Article[]>(this.endpoint, article);
  }

  /**
   * Update article
   * @param id - Article ID
   * @param updates - Fields to update
   */
  async update(id: number, updates: Partial<Article>): Promise<ApiResponse<Article[]>> {
    const endpoint = `${this.endpoint}?id=eq.${id}`;
    return supabaseService.patch<Article[]>(endpoint, updates);
  }

  /**
   * Delete article
   * @param id - Article ID
   */
  async delete(id: number): Promise<ApiResponse<Article[]>> {
    const params = {
      id: `eq.${id}`,
    };

    return supabaseService.delete<Article[]>(this.endpoint, params);
  }

  /**
   * Publish article
   * @param id - Article ID
   */
  async publish(id: number): Promise<ApiResponse<Article[]>> {
    return this.update(id, {
      status: 'published',
      published_at: new Date().toISOString(),
    });
  }

  /**
   * Unpublish article (set to draft)
   * @param id - Article ID
   */
  async unpublish(id: number): Promise<ApiResponse<Article[]>> {
    return this.update(id, { status: 'draft' });
  }

  /**
   * Archive article
   * @param id - Article ID
   */
  async archive(id: number): Promise<ApiResponse<Article[]>> {
    return this.update(id, { status: 'archived' });
  }

  /**
   * Get article count by category
   * @param categoryId - Category ID
   */
  async getCountByCategory(categoryId: number): Promise<number> {
    const response = await this.getByCategory(categoryId, 1000);
    return response.data?.length || 0;
  }

  /**
   * Get total published articles count
   */
  async getTotalCount(): Promise<number> {
    const response = await this.getAll({
      filters: { status: 'published' },
    });
    return response.data?.length || 0;
  }
}

// Export singleton instance
export const articleService = new ArticleService();
