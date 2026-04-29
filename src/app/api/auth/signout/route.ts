/**
 * POST /api/auth/signout
 * Clear the session cookie and redirect to home.
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const url = new URL('/', req.url);
  const res = NextResponse.redirect(url);
  res.headers.set('Set-Cookie', clearSessionCookie());
  return res;
}

export async function GET(req: Request) {
  const url = new URL('/', req.url);
  const res = NextResponse.redirect(url);
  res.headers.set('Set-Cookie', clearSessionCookie());
  return res;
}

