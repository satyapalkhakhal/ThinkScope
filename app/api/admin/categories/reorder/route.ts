/**
 * API Route: Reorder Categories
 * POST /api/admin/categories/reorder
 */

import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category.service';

export async function POST(request: NextRequest) {
  try {
    const { categoryIds } = await request.json();

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid category IDs array' },
        { status: 400 }
      );
    }

    // Update display order for each category
    await categoryService.reorder(categoryIds);

    return NextResponse.json({
      success: true,
      message: 'Categories reordered successfully',
    });
  } catch (error) {
    console.error('Category reorder error:', error);
    return NextResponse.json(
      { error: 'Failed to reorder categories' },
      { status: 500 }
    );
  }
}
