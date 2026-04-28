/**
 * PATCH /api/admin/orders/[id]/status
 * Updates the status of an order.
 * Required: Admin session (checked via middleware in a real app, here we'll do a basic check)
 * Body: { status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'FAILED' }
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, orders } from '@/db';
import { eq } from 'drizzle-orm';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json() as { status: string };

    if (!body.status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Auth check
    const cookieHeader = req.headers.get('cookie');
    const token = getSessionFromCookies(cookieHeader);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return NextResponse.json({ error: 'Config error' }, { status: 500 });
    
    const payload = await verifyJWT(token, jwtSecret);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { env } = getRequestContext();
    const db = getDb(env.DB);

    const updated = await db
      .update(orders)
      .set({ status: body.status })
      .where(eq(orders.id, id))
      .returning()
      .get();

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error('[api/admin/orders/status]', err);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
