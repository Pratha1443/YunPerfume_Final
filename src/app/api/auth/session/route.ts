/**
 * GET /api/auth/session
 * Returns current user from JWT cookie (or null).
 * Used by client components to read auth state.
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const token = getSessionFromCookies(cookieHeader);

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyJWT(token, jwtSecret);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    },
  });
}
