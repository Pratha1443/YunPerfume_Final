/**
 * Next.js middleware — Edge runtime
 * 1. Injects security headers on every response
 * 2. Protects /profile and /admin routes (JWT auth)
 * 3. Redirects unauthenticated users to /login
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

// ─── Security Headers ─────────────────────────────────────────────────────────

function addSecurityHeaders(res: NextResponse): NextResponse {
  // Prevent clickjacking
  res.headers.set('X-Frame-Options', 'DENY');
  // Prevent MIME-type sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Enable XSS filter in older browsers
  res.headers.set('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy — disable unused browser features
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  );
  // HSTS — force HTTPS for 1 year
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  // Content Security Policy
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.r2.dev https://pub-c9a110b8086f401c85fe75fb7182c610.r2.dev",
      "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ')
  );
  return res;
}

// ─── Auth Guard ───────────────────────────────────────────────────────────────

const PROTECTED = ['/profile', '/admin'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (!isProtected) {
    // For public routes just add security headers
    const res = NextResponse.next();
    return addSecurityHeaders(res);
  }

  const cookieHeader = req.headers.get('cookie');
  const sessionToken = getSessionFromCookies(cookieHeader);

  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('redirect', pathname);

  if (!sessionToken) {
    return addSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return addSecurityHeaders(NextResponse.next());
  }

  const payload = await verifyJWT(sessionToken, jwtSecret);
  if (!payload) {
    return addSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // Guard admin routes to ADMIN role only
  if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
    return addSecurityHeaders(NextResponse.redirect(new URL('/', req.url)));
  }

  // Pass user info to the page via headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  return addSecurityHeaders(res);
}
