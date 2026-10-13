import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from './prisma';

const SECRET = process.env.JWT_SECRET || 'aapdasetu-emergency-secret-key-2026-super-secure';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'CITIZEN' | 'RESPONDER' | 'ADMIN';
  phone?: string | null;
}

// Simple signed token implementation (HMAC-SHA256)
export function signToken(payload: AuthUser, expiresInSeconds = 86400 * 7): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
    };
  } catch (err) {
    return null;
  }
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('aapdasetu_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireUser(allowedRoles?: Array<'CITIZEN' | 'RESPONDER' | 'ADMIN'>): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

