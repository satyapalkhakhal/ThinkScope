import { NextRequest, NextResponse } from 'next/server';
import { supabaseService } from '@/lib/services/supabase.service';
import { verifySession } from '@/lib/auth';

/**
 * GET /api/admin/users - Get all admin users
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifySession(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all admin users (without passwords)
    const response = await supabaseService.get<any[]>(
      '/admin_users',
      {
        select: 'id,email,name,role,is_active,created_at,updated_at'
      },
      { noCache: true }
    );

    if (response.error) {
      return NextResponse.json(
        { error: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users: response.data || []
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users - Create a new admin user
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || !verifySession(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, password, name, role = 'admin' } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await supabaseService.get<any[]>(
      '/admin_users',
      { email: `eq.${email}` },
      { noCache: true }
    );

    if (existingUser.data && existingUser.data.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    // TODO: Hash password with bcrypt before storing
    const newUser = {
      email,
      password, // WARNING: Store hashed password in production!
      name: name || null,
      role,
      is_active: true
    };

    const response = await supabaseService.post<any>(
      '/admin_users',
      newUser
    );

    if (response.error) {
      return NextResponse.json(
        { error: 'Failed to create user: ' + response.error },
        { status: 500 }
      );
    }

    // Return user without password
    const createdUser = Array.isArray(response.data) ? response.data[0] : response.data;
    const { password: _, ...userWithoutPassword } = createdUser;

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
