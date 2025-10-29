/**
 * Simple authentication utilities
 * For production, use NextAuth.js or similar
 */

export interface AdminUser {
  email: string;
  role: 'admin';
}

// Simple password check - In production, use proper auth service
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@thinkscope.in',
  password: process.env.ADMIN_PASSWORD || 'admin123', // Change this!
};

export function validateCredentials(email: string, password: string): boolean {
  return (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  );
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
