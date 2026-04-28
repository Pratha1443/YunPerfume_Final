/**
 * GET /api/auth/verify?token=TOKEN&email=EMAIL
 * Verify a magic token, issue a JWT session cookie, redirect to /profile.
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, magicTokens, users } from '@/db';
import {
  isMagicTokenExpired,
  signJWT,
  makeSessionCookie,
} from '@/lib/auth';
import { eq, and, isNull } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token')?.toUpperCase();
  const email = searchParams.get('email')?.toLowerCase().trim();

  const appUrl = 'https://yunperfume.com';
  const loginUrl = `${appUrl}/login`;
  const profileUrl = `${appUrl}/profile`;

  if (!token || !email) {
    return NextResponse.redirect(`${loginUrl}?error=invalid`);
  }

  try {
    const { env } = getRequestContext();
    const db = getDb(env.DB);

    // 1. Find the token — unused, matching email
    const magicToken = await db
      .select()
      .from(magicTokens)
      .where(
        and(
          eq(magicTokens.token, token),
          eq(magicTokens.email, email),
          isNull(magicTokens.usedAt)
        )
      )
      .get();

    if (!magicToken) {
      return NextResponse.redirect(`${loginUrl}?error=invalid`);
    }

    if (isMagicTokenExpired(magicToken.expiresAt)) {
      return NextResponse.redirect(`${loginUrl}?error=expired`);
    }

    // 2. Mark token as used
    await db
      .update(magicTokens)
      .set({ usedAt: new Date().toISOString() })
      .where(eq(magicTokens.id, magicToken.id));

    // 3. Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get();

    if (!user) {
      return NextResponse.redirect(`${loginUrl}?error=invalid`);
    }

    // 4. Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date().toISOString() })
      .where(eq(users.id, user.id));

    // 5. Issue JWT session cookie
    const jwt = await signJWT(
      { userId: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' },
      env.JWT_SECRET
    );

    const res = NextResponse.redirect(profileUrl);
    res.headers.set('Set-Cookie', makeSessionCookie(jwt));
    return res;

  } catch (err) {
    console.error('[verify]', err);
    return NextResponse.redirect(`${loginUrl}?error=server`);
  }
}

/**
 * POST /api/auth/verify
 * Verify OTP code entered manually on the login page.
 * Body: { token: string, email: string }
 */
export async function POST(req: Request) {
  try {
    const { env } = getRequestContext();
    const body = await req.json() as { token?: string; email?: string };
    const token = body.token?.toUpperCase().trim();
    const email = body.email?.toLowerCase().trim();

    if (!token || !email) {
      return NextResponse.json({ error: 'Token and email required' }, { status: 400 });
    }

    const db = getDb(env.DB);

    const magicToken = await db
      .select()
      .from(magicTokens)
      .where(
        and(
          eq(magicTokens.token, token),
          eq(magicTokens.email, email),
          isNull(magicTokens.usedAt)
        )
      )
      .get();

    if (!magicToken) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
    }

    if (isMagicTokenExpired(magicToken.expiresAt)) {
      return NextResponse.json({ error: 'Code expired — request a new one' }, { status: 401 });
    }

    await db
      .update(magicTokens)
      .set({ usedAt: new Date().toISOString() })
      .where(eq(magicTokens.id, magicToken.id));

    const user = await db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date().toISOString() })
      .where(eq(users.id, user.id));

    const jwt = await signJWT(
      { userId: user.id, email: user.email, role: user.role as 'USER' | 'ADMIN' },
      env.JWT_SECRET
    );

    const res = NextResponse.json({ success: true });
    res.headers.set('Set-Cookie', makeSessionCookie(jwt));
    return res;

  } catch (err) {
    console.error('[verify-post]', err);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
