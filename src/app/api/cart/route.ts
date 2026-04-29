/**
 * GET  /api/cart  — load user's server-side cart from KV
 * POST /api/cart  — save user's cart to KV
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';

const TTL = 60 * 60 * 24 * 30; // 30 days

async function getUserId(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get('cookie');
  const token = getSessionFromCookies(cookieHeader);
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  const payload = await verifyJWT(token, secret);
  return payload?.userId ?? null;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ items: [] });

    const { env } = getRequestContext();
    const raw = await env.SESSIONS.get(`cart:${userId}`);
    const items = raw ? JSON.parse(raw) : [];
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ ok: false });

    const { env } = getRequestContext();
    const { items } = await req.json() as { items: unknown[] };
    await env.SESSIONS.put(`cart:${userId}`, JSON.stringify(items), {
      expirationTtl: TTL,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
