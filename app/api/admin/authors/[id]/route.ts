/**
 * API Route: Single Author Operations
 * GET /api/admin/authors/[id] - Get author by ID
 * PATCH /api/admin/authors/[id] - Update author
 * DELETE /api/admin/authors/[id] - Delete author
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const authorId = parseInt(params.id);

    if (isNaN(authorId)) {
      return NextResponse.json(
        { error: 'Invalid author ID' },
        { status: 400 }
      );
    }

    // Get author
    const { data: author, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', authorId)
      .single();

    if (error || !author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    // Get category assignments
    const { data: assignments } = await supabase
      .from('author_category_assignments')
      .select('category_id, categories(id, name, slug)')
      .eq('author_id', authorId);

    return NextResponse.json({
      success: true,
      author: {
        ...author,
        password: undefined,
        assigned_categories: assignments?.map(a => a.categories) || [],
        category_ids: assignments?.map(a => a.category_id) || [],
      },
    });
  } catch (error) {
    console.error('Author API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const authorId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(authorId)) {
      return NextResponse.json(
        { error: 'Invalid author ID' },
        { status: 400 }
      );
    }

    const { name, email, bio, avatar_url, role, is_active, category_ids } = body;

    // Build update object
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;

    // Update author
    const { data: author, error: updateError } = await supabase
      .from('authors')
      .update(updates)
      .eq('id', authorId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating author:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // Update category assignments if provided
    if (category_ids !== undefined && Array.isArray(category_ids)) {
      // Delete existing assignments
      await supabase
        .from('author_category_assignments')
        .delete()
        .eq('author_id', authorId);

      // Insert new assignments
      if (category_ids.length > 0) {
        const assignments = category_ids.map(cat_id => ({
          author_id: authorId,
          category_id: cat_id,
        }));

        const { error: assignError } = await supabase
          .from('author_category_assignments')
          .insert(assignments);

        if (assignError) {
          console.error('Error updating category assignments:', assignError);
        }
      }
    }

    // Fetch author with updated categories
    const { data: assignments } = await supabase
      .from('author_category_assignments')
      .select('category_id, categories(id, name, slug)')
      .eq('author_id', authorId);

    return NextResponse.json({
      success: true,
      author: {
        ...author,
        password: undefined,
        assigned_categories: assignments?.map(a => a.categories) || [],
        category_ids: assignments?.map(a => a.category_id) || [],
      },
    });
  } catch (error) {
    console.error('Author API error:', error);
    return NextResponse.json(
      { error: 'Failed to update author' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const authorId = parseInt(params.id);

    if (isNaN(authorId)) {
      return NextResponse.json(
        { error: 'Invalid author ID' },
        { status: 400 }
      );
    }

    // Check if author has articles
    const { data: articles, error: checkError } = await supabase
      .from('articles')
      .select('id')
      .eq('author_id', authorId)
      .limit(1);

    if (checkError) {
      console.error('Error checking articles:', checkError);
    }

    if (articles && articles.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete author with existing articles. Please reassign or delete articles first.' },
        { status: 400 }
      );
    }

    // Delete author (cascade will delete category assignments)
    const { error: deleteError } = await supabase
      .from('authors')
      .delete()
      .eq('id', authorId);

    if (deleteError) {
      console.error('Error deleting author:', deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Author deleted successfully',
    });
  } catch (error) {
    console.error('Author API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    );
  }
}
