/**
 * Authentication utilities with database support
 */

import { supabaseService } from './services/supabase.service';

export interface AdminUser {
  id?: number;
  email: string;
  name?: string;
  role: 'admin';
  created_at?: string;
}

interface AdminUserDB {
  id: number;
  email: string;
  password: string;
  name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Validate admin credentials against the database
 */
export async function validateCredentials(
  email: string, 
  password: string
): Promise<AdminUser | null> {
  try {
    // Query the admin_users table
    const response = await supabaseService.get<AdminUserDB[]>(
      '/admin_users',
      {
        email: `eq.${email}`,
        is_active: 'eq.true',
        select: '*'
      },
      { noCache: true } // Don't cache authentication requests
    );

    if (response.error || !response.data || response.data.length === 0) {
      console.log('User not found or error:', response.error);
      return null;
    }

    const user = response.data[0];

    // Verify password (Note: In production, use bcrypt or similar)
    // For now, assuming passwords are stored as plain text
    // TODO: Implement proper password hashing
    if (user.password !== password) {
      console.log('Invalid password');
      return null;
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'admin',
      created_at: user.created_at
    };
  } catch (error) {
    console.error('Credential validation error:', error);
    return null;
  }
}

export function createSession(email: string): string {
  // Simple token - In production, use JWT or session cookies
  const payload = JSON.stringify({ email, role: 'admin', exp: Date.now() + 24 * 60 * 60 * 1000 });
  return Buffer.from(payload).toString('base64');
}

export function verifySession(token: string): AdminUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return {
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
