/**
 * POST /api/auth/signout
 * Clear the session cookie and redirect to home.
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.redirect('https://yunperfume.com/');
  res.headers.set('Set-Cookie', clearSessionCookie());
  return res;
}

export async function GET() {
  const res = NextResponse.redirect('https://yunperfume.com/');
  res.headers.set('Set-Cookie', clearSessionCookie());
  return res;
}
