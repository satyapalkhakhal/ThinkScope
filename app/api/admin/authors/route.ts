/**
 * API Route: Authors Management
 * GET /api/admin/authors - List all authors
 * POST /api/admin/authors - Create new author
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active_only') !== 'false';
    const role = searchParams.get('role');

    // Build query
    let query = supabase
      .from('authors')
      .select('*')
      .order('name', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (role) {
      query = query.eq('role', role);
    }

    const { data: authors, error } = await query;

    if (error) {
      console.error('Error fetching authors:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Get category assignments for each author
    const authorsWithCategories = await Promise.all(
      (authors || []).map(async (author) => {
        const { data: assignments } = await supabase
          .from('author_category_assignments')
          .select('category_id, categories(id, name, slug)')
          .eq('author_id', author.id);

        return {
          ...author,
          password: undefined, // Don't send password to client
          assigned_categories: assignments?.map(a => a.categories) || [],
          category_ids: assignments?.map(a => a.category_id) || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      authors: authorsWithCategories,
    });
  } catch (error) {
    console.error('Authors API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const { name, email, bio, avatar_url, role, is_active, category_ids } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('authors')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An author with this email already exists' },
        { status: 400 }
      );
    }

    // Create author
    const { data: author, error: createError } = await supabase
      .from('authors')
      .insert({
        name,
        email,
        bio: bio || null,
        avatar_url: avatar_url || null,
        role: role || 'writer',
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating author:', createError);
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      );
    }

    // Assign categories if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      const assignments = category_ids.map(cat_id => ({
        author_id: author.id,
        category_id: cat_id,
      }));

      const { error: assignError } = await supabase
        .from('author_category_assignments')
        .insert(assignments);

      if (assignError) {
        console.error('Error assigning categories:', assignError);
        // Don't fail the request, just log the error
      }
    }

    // Fetch author with categories
    const { data: assignments } = await supabase
      .from('author_category_assignments')
      .select('category_id, categories(id, name, slug)')
      .eq('author_id', author.id);

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
    console.error('Authors API error:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}
