// TODO (Phase 6): Rewrite with Razorpay REST API via fetch (no SDK — SDK uses Node crypto, not Edge-compatible)
// This stub prevents the build from failing while Phase 6 is pending.

export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Payment integration coming in Phase 6' },
    { status: 503 }
  );
}
