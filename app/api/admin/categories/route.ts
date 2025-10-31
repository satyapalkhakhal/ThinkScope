/**
 * API Route: Admin Categories
 * POST /api/admin/categories - Create new category
 */

import { NextRequest, NextResponse } from 'next/server';
import { categoryService } from '@/lib/services/category.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'slug'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare category data
    const categoryData = {
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      icon: body.icon || null,
      is_active: body.is_active !== undefined ? body.is_active : true,
      display_order: body.display_order || 999,
    };

    // Create category
    const response = await categoryService.create(categoryData);

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
    }, { status: 201 });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
