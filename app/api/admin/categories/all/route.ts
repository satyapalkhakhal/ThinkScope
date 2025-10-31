/**
 * API Route: Admin Categories - Get All (including inactive)
 * GET /api/admin/categories/all
 */

import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category.service';

export async function GET(request: NextRequest) {
  try {
    // Get all categories (including inactive)
    const response = await categoryService.getAll(false);

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Admin categories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
