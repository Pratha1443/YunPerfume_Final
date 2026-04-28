/**
 * POST /api/payment/webhook
 * Receives Razorpay webhook events.
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, orders, products, orderItems } from '@/db';
import { eq } from 'drizzle-orm';
import { verifyWebhookSignature } from '@/lib/razorpay';
// TODO: import resend and send confirmation email

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Missing RAZORPAY_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Config error' }, { status: 500 });
    }

    const isValid = await verifyWebhookSignature(rawBody, signature, secret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { env } = getRequestContext();
    const db = getDb(env.DB);

    // Idempotency: We only process captured or failed events
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      
      // 1. Find the order by Razorpay order ID
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.razorpayOrderId, razorpayOrderId))
        .get();

      if (order && order.status === 'PENDING') {
        // 2. Update order to PAID
        await db
          .update(orders)
          .set({ 
            status: 'PAID', 
            razorpayPaymentId: payment.id,
            paidAt: new Date().toISOString()
          })
          .where(eq(orders.id, order.id));

        // 3. Decrement stock
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id))
          .all();

        for (const item of items) {
          if (!item.productId.startsWith('prod_discovery')) {
             const prod = await db.select().from(products).where(eq(products.id, item.productId)).get();
             if (prod) {
                await db.update(products).set({ stock: Math.max(0, prod.stock - item.quantity) }).where(eq(products.id, item.productId));
             }
          }
        }
        
        // 4. (Optional) Send confirmation email
        // sendOrderConfirmationEmail(...)
      }
    } else if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.razorpayOrderId, razorpayOrderId))
        .get();

      if (order && order.status === 'PENDING') {
        await db
          .update(orders)
          .set({ status: 'FAILED' })
          .where(eq(orders.id, order.id));
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[Webhook]', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
