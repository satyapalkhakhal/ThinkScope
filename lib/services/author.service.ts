/**
 * Author Service
 * Handles all author-related API calls and category assignments
 */

import { supabaseService, ApiResponse } from './supabase.service';
import { Author, AuthorWithCategories, AuthorCategoryAssignment, Category } from './types';

class AuthorService {
  private endpoint = '/authors';
  private assignmentEndpoint = '/author_category_assignments';

  /**
   * Get all authors
   * @param activeOnly - Filter only active authors (default: true)
   */
  async getAll(activeOnly: boolean = true): Promise<ApiResponse<Author[]>> {
    const params: Record<string, any> = {
      order: 'name.asc',
    };

    if (activeOnly) {
      params['is_active'] = 'eq.true';
    }

    return supabaseService.get<Author[]>(this.endpoint, params, { revalidate: 600 });
  }

  /**
   * Get author by ID
   * @param id - Author ID
   */
  async getById(id: number): Promise<ApiResponse<Author[]>> {
    const params = {
      id: `eq.${id}`,
      limit: 1,
    };

    return supabaseService.get<Author[]>(this.endpoint, params, { revalidate: 600 });
  }

  /**
   * Get author by email
   * @param email - Author email
   */
  async getByEmail(email: string): Promise<ApiResponse<Author[]>> {
    const params = {
      email: `eq.${email}`,
      limit: 1,
    };

    return supabaseService.get<Author[]>(this.endpoint, params, { revalidate: 600 });
  }

  /**
   * Get authors by role
   * @param role - Author role
   */
  async getByRole(role: string): Promise<ApiResponse<Author[]>> {
    const params = {
      role: `eq.${role}`,
      is_active: 'eq.true',
      order: 'name.asc',
    };

    return supabaseService.get<Author[]>(this.endpoint, params, { revalidate: 600 });
  }

  /**
   * Get author's assigned categories
   * @param authorId - Author ID
   */
  async getAuthorCategories(authorId: number): Promise<ApiResponse<AuthorCategoryAssignment[]>> {
    const params = {
      author_id: `eq.${authorId}`,
      order: 'category_id.asc',
    };

    return supabaseService.get<AuthorCategoryAssignment[]>(
      this.assignmentEndpoint,
      params,
      { revalidate: 300 }
    );
  }

  /**
   * Get authors by category
   * @param categoryId - Category ID
   */
  async getAuthorsByCategory(categoryId: number): Promise<ApiResponse<AuthorCategoryAssignment[]>> {
    const params = {
      category_id: `eq.${categoryId}`,
      order: 'author_id.asc',
    };

    return supabaseService.get<AuthorCategoryAssignment[]>(
      this.assignmentEndpoint,
      params,
      { revalidate: 300 }
    );
  }

  /**
   * Create a new author
   * @param author - Author data
   */
  async create(author: Partial<Author>): Promise<ApiResponse<Author[]>> {
    const data = {
      name: author.name,
      email: author.email,
      bio: author.bio || null,
      avatar_url: author.avatar_url || null,
      role: author.role || 'writer',
      is_active: author.is_active !== undefined ? author.is_active : true,
    };

    return supabaseService.post<Author[]>(this.endpoint, data);
  }

  /**
   * Update an author
   * @param id - Author ID
   * @param updates - Author updates
   */
  async update(id: number, updates: Partial<Author>): Promise<ApiResponse<Author[]>> {
    const endpoint = `${this.endpoint}?id=eq.${id}`;

    const data: Record<string, any> = {};
    
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.email !== undefined) data.email = updates.email;
    if (updates.bio !== undefined) data.bio = updates.bio;
    if (updates.avatar_url !== undefined) data.avatar_url = updates.avatar_url;
    if (updates.role !== undefined) data.role = updates.role;
    if (updates.is_active !== undefined) data.is_active = updates.is_active;

    return supabaseService.patch<Author[]>(endpoint, data);
  }

  /**
   * Delete an author
   * @param id - Author ID
   */
  async delete(id: number): Promise<ApiResponse<void>> {
    const params = {
      id: `eq.${id}`,
    };

    return supabaseService.delete(this.endpoint, params);
  }

  /**
   * Assign categories to an author
   * @param authorId - Author ID
   * @param categoryIds - Array of category IDs
   */
  async assignCategories(authorId: number, categoryIds: number[]): Promise<ApiResponse<AuthorCategoryAssignment[]>> {
    // First, delete existing assignments
    await supabaseService.delete(this.assignmentEndpoint, {
      author_id: `eq.${authorId}`,
    });

    // Then create new assignments
    if (categoryIds.length === 0) {
      return { data: [], error: null, status: 200 };
    }

    const assignments = categoryIds.map(categoryId => ({
      author_id: authorId,
      category_id: categoryId,
    }));

    return supabaseService.post<AuthorCategoryAssignment[]>(
      this.assignmentEndpoint,
      assignments
    );
  }

  /**
   * Check if author can write for a category
   * @param authorId - Author ID
   * @param categoryId - Category ID
   */
  async canWriteForCategory(authorId: number, categoryId: number): Promise<boolean> {
    // Get author
    const { data: authors } = await this.getById(authorId);
    const author = authors?.[0];

    if (!author || !author.is_active) {
      return false;
    }

    // Admin and Editor can write for all categories
    if (author.role === 'admin' || author.role === 'editor') {
      return true;
    }

    // Check if author has assignment for this category
    const { data: assignments } = await this.getAuthorCategories(authorId);
    return assignments?.some(a => a.category_id === categoryId) || false;
  }
}

export const authorService = new AuthorService();
export default authorService;
