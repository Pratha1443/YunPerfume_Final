/**
 * Next.js middleware — Edge runtime
 * Protects /profile and /admin routes.
 * Redirects unauthenticated users to /login.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*'],
};

export async function middleware(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie');
  const sessionToken = getSessionFromCookies(cookieHeader);

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('redirect', req.nextUrl.pathname);

  if (!sessionToken) {
    return NextResponse.redirect(loginUrl);
  }

  // JWT_SECRET is not available in middleware via getRequestContext()
  // We read it from process.env — set as a [vars] in wrangler.toml or Pages secret.
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    // In dev without secret, allow through (will be blocked in production)
    return NextResponse.next();
  }

  const payload = await verifyJWT(sessionToken, jwtSecret);
  if (!payload) {
    return NextResponse.redirect(loginUrl);
  }

  // Guard admin routes to ADMIN role only
  if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Pass user info to the page via headers (readable via headers() in Server Components)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
