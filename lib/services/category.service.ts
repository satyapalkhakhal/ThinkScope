/**
 * Category Service
 * Handles all category-related API calls
 */

import { supabaseService, ApiResponse } from './supabase.service';
import { Category } from './types';

class CategoryService {
  private endpoint = '/categories';

  /**
   * Get all categories
   * @param activeOnly - Filter only active categories (default: true)
   */
  async getAll(activeOnly: boolean = true): Promise<ApiResponse<Category[]>> {
    const params: Record<string, any> = {
      order: 'display_order.asc',
    };

    if (activeOnly) {
      params['is_active'] = 'eq.true';
    }

    return supabaseService.get<Category[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get category by ID
   * @param id - Category ID
   */
  async getById(id: number): Promise<ApiResponse<Category[]>> {
    const params = {
      id: `eq.${id}`,
      limit: 1,
    };

    return supabaseService.get<Category[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get category by slug
   * @param slug - Category slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<Category[]>> {
    const params = {
      slug: `eq.${slug}`,
      limit: 1,
    };

    return supabaseService.get<Category[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Get active categories count
   */
  async getActiveCount(): Promise<ApiResponse<Category[]>> {
    const params = {
      is_active: 'eq.true',
      select: 'id',
    };

    return supabaseService.get<Category[]>(this.endpoint, params, { revalidate: 1200 });
  }

  /**
   * Create new category
   * @param category - Category data
   */
  async create(category: Partial<Category>): Promise<ApiResponse<Category[]>> {
    return supabaseService.post<Category[]>(this.endpoint, category);
  }

  /**
   * Update category
   * @param id - Category ID
   * @param updates - Fields to update
   */
  async update(id: number, updates: Partial<Category>): Promise<ApiResponse<Category[]>> {
    const endpoint = `${this.endpoint}?id=eq.${id}`;
    return supabaseService.patch<Category[]>(endpoint, updates);
  }

  /**
   * Delete category
   * @param id - Category ID
   */
  async delete(id: number): Promise<ApiResponse<Category[]>> {
    const params = {
      id: `eq.${id}`,
    };

    return supabaseService.delete<Category[]>(this.endpoint, params);
  }

  /**
   * Toggle category active status
   * @param id - Category ID
   * @param isActive - New active status
   */
  async toggleActive(id: number, isActive: boolean): Promise<ApiResponse<Category[]>> {
    return this.update(id, { is_active: isActive });
  }

  /**
   * Reorder categories
   * @param categoryIds - Array of category IDs in new order
   */
  async reorder(categoryIds: number[]): Promise<void> {
    // Update display_order for each category
    const updates = categoryIds.map((id, index) => 
      this.update(id, { display_order: index + 1 })
    );

    await Promise.all(updates);
  }

  /**
   * Get categories with article count
   */
  async getWithArticleCount(): Promise<ApiResponse<any[]>> {
    // This would require a custom view or RPC function in Supabase
    // For now, return regular categories
    return this.getAll();
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
