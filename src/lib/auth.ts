/**
 * src/lib/auth.ts
 * Edge-compatible auth utilities — JWT (jose) + token generation
 * No Node.js crypto. Uses Web Crypto API available in Cloudflare Workers.
 */

import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
  iat?: number;
  exp?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = 'yun_session';
export const MAGIC_TOKEN_TTL_MINUTES = 15;
export const SESSION_TTL_DAYS = 30;

// ─── JWT helpers ──────────────────────────────────────────────────────────────

function getSecret(jwtSecret: string): Uint8Array {
  return new TextEncoder().encode(jwtSecret);
}

export async function signJWT(
  payload: SessionPayload,
  jwtSecret: string
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getSecret(jwtSecret));
}

export async function verifyJWT(
  token: string,
  jwtSecret: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(jwtSecret));
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Magic token ──────────────────────────────────────────────────────────────

export function generateMagicToken(): string {
  // 6-char uppercase alphanumeric OTP
  return nanoid(6).toUpperCase();
}

export function getMagicTokenExpiry(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + MAGIC_TOKEN_TTL_MINUTES);
  return d.toISOString();
}

export function isMagicTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export function makeSessionCookie(token: string, maxAgeDays = SESSION_TTL_DAYS): string {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

export function getSessionFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}

// ─── Rate limiting via KV ─────────────────────────────────────────────────────

const RATE_LIMIT_MAX = 3;       // max 3 magic links per window for regular users
const RATE_LIMIT_MAX_ADMIN = 10; // max 10 magic links per window for admins
const RATE_LIMIT_WINDOW = 3600;  // 1 hour in seconds

export async function checkRateLimit(
  kv: KVNamespace,
  email: string,
  isAdmin = false
): Promise<{ allowed: boolean; remaining: number }> {
  const limit = isAdmin ? RATE_LIMIT_MAX_ADMIN : RATE_LIMIT_MAX;
  const key = `rl:magic:${email}`;
  const current = await kv.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await kv.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW });
  return { allowed: true, remaining: limit - count - 1 };
}
