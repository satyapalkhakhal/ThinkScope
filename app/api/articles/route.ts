/**
 * API Route: Article Creation
 * POST /api/articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { articleService } from '@/lib/services/article.service';
import { Article } from '@/lib/services/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'excerpt', 'content', 'category_id', 'featured_image_url'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare article data
    const articleData: Partial<Article> = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category_id: parseInt(body.category_id),
      author_id: body.author_id || 1,
      featured_image_url: body.featured_image_url,
      featured_image_alt: body.featured_image_alt || body.title,
      meta_title: body.meta_title || body.title,
      meta_description: body.meta_description || body.excerpt,
      meta_keywords: body.meta_keywords || null,
      read_time: body.read_time || '5 min read',
      status: body.status || 'draft',
      view_count: 0,
      published_at: body.status === 'published' ? new Date().toISOString() : null as any,
    };

    // Create article
    const response = await articleService.create(articleData);

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
    console.error('Article creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

// GET all articles (for admin purposes)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | null;
    
    const response = await articleService.getAll({
      filters: status ? { status } : undefined,
      pagination: { limit: 100 },
    });

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
    console.error('Articles fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
