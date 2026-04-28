// TODO (Phase 3): Rewrite with full magic link flow:
// - Validate email (Zod)
// - Rate limit via KV
// - Store token in D1 magic_tokens table
// - Send email via Resend
// This stub prevents the build failing while Phase 3 is pending.

export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { email: string };
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Phase 3 will send a real magic link via Resend
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
