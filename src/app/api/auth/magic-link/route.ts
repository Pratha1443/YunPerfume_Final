/**
 * POST /api/auth/magic-link
 * Send a magic link / OTP to the user's email.
 *
 * Body: { email: string }
 * Returns: { success: true } | { error: string }
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { Resend } from 'resend';
import { getDb, magicTokens, users } from '@/db';
import {
  generateMagicToken,
  getMagicTokenExpiry,
  checkRateLimit,
} from '@/lib/auth';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(req: Request) {
  try {
    const { env } = getRequestContext();
    const body = await req.json();
    
    const parsed = magicLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const email = parsed.data.email.toLowerCase().trim();

    // 2. Check if the user is an admin for a higher rate limit
    const db = getDb(env.DB);
    const existing = await db.select().from(users).where(eq(users.email, email)).get();
    const isAdmin = existing?.role === 'ADMIN';

    // 3. Rate limit via KV — admins get 10 requests/hr, users get 3
    const { allowed } = await checkRateLimit(env.SESSIONS, email, isAdmin);
    if (!allowed) {
      const waitMsg = isAdmin
        ? 'Too many requests. Please wait before requesting another link.'
        : 'Too many requests. Please wait before requesting another link.';
      return NextResponse.json({ error: waitMsg }, { status: 429 });
    }

    // 4. Upsert user in D1 (create if new)
    if (!existing) {
      await db.insert(users).values({
        id: `user_${nanoid(12)}`,
        email,
        role: 'USER',
      });
    }

    // 4. Create magic token
    const token = generateMagicToken();
    const expiresAt = getMagicTokenExpiry();
    await db.insert(magicTokens).values({
      id: `tok_${nanoid(12)}`,
      email,
      token,
      expiresAt,
    });

    // 5. Send email via Resend
    const resend = new Resend(env.RESEND_API_KEY);
    const appUrl = env.NEXT_PUBLIC_APP_URL || 'https://yunperfume.in';
    const verifyUrl = `${appUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: 'YUN Atelier <magic@yunperfume.in>',
      to: [email],
      subject: 'Sign in to YUN — your code is inside',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: 'Georgia', serif; background: #0a0e1a; color: #e8e0d0; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto;">
            <div style="font-size: 11px; letter-spacing: 0.3em; color: #4a6fa5; text-transform: uppercase; margin-bottom: 32px;">YUN Atelier</div>
            <h1 style="font-size: 36px; font-weight: 300; margin: 0 0 24px; line-height: 1.2;">Your sign-in code.</h1>
            <div style="background: #141824; border: 1px solid rgba(255,255,255,0.08); padding: 32px; text-align: center; margin: 32px 0;">
              <div style="font-family: monospace; font-size: 48px; letter-spacing: 0.3em; color: #4a6fa5;">${token}</div>
              <div style="font-size: 12px; color: #888; margin-top: 16px;">Valid for ${15} minutes</div>
            </div>
            <p style="font-size: 14px; color: #888; line-height: 1.6;">
              Or click the link below to sign in directly:
            </p>
            <a href="${verifyUrl}" style="display: inline-block; background: #4a6fa5; color: #fff; padding: 14px 28px; text-decoration: none; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 16px 0;">
              Sign in to YUN
            </a>
            <p style="font-size: 12px; color: #555; margin-top: 32px; line-height: 1.6;">
              If you didn't request this, you can safely ignore it. This link expires in 15 minutes.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[magic-link]', err);
    return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 });
  }
}
