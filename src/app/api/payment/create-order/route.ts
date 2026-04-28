/**
 * POST /api/payment/create-order
 * Creates a Razorpay order via REST API (Edge-compatible, no SDK).
 * Stores the pending order in D1.
 *
 * Body: {
 *   amount: number        (in paise, e.g. 450000 = ₹4500)
 *   email: string
 *   phone: string
 *   name: string
 *   address: { line1, line2?, city, state, pin }
 *   items: { productId, name, size, quantity, price }[]
 * }
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, orders, orderItems, products } from '@/db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

interface CartItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number; // in rupees
}

interface OrderBody {
  amount: number; // in paise
  email: string;
  phone: string;
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pin: string;
  };
  items: CartItem[];
}

export async function POST(req: Request) {
  try {
    const { env } = getRequestContext();
    const body = await req.json() as OrderBody;

    const { email, phone, name, address, items } = body;

    if (!email || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb(env.DB);

    // Calculate amount server-side
    let calculatedAmountPaise = 0;
    const validatedItems = [];

    for (const item of items) {
      // Split off size label if productId contains it (e.g., prod_mogra_noir-50 ml)
      // Actually, productId in cart might just be the DB id if we adjusted it, 
      // but let's assume item.productId is something we can use or we find the product.
      const baseProdId = item.productId.split('-')[0];
      const prod = await db.select().from(products).where(eq(products.id, baseProdId)).get();
      
      if (!prod) {
        return NextResponse.json({ error: `Product not found: ${baseProdId}` }, { status: 400 });
      }

      // Calculate price based on size multiplier
      let multiplier = 1;
      if (item.size.includes('10 ml')) multiplier = 0.35;
      else if (item.size.includes('100 ml')) multiplier = 1.75;
      
      const unitPricePaise = Math.round(prod.price * multiplier);
      calculatedAmountPaise += unitPricePaise * item.quantity;
      
      validatedItems.push({
        ...item,
        unitPricePaise,
      });
    }

    const amount = calculatedAmountPaise;

    // 1. Create Razorpay order via REST API
    const rzpKeyId = env.RAZORPAY_KEY_ID;
    const rzpKeySecret = env.RAZORPAY_KEY_SECRET;

    if (!rzpKeyId || !rzpKeySecret) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 503 });
    }

    const credentials = btoa(`${rzpKeyId}:${rzpKeySecret}`);
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `yun_${nanoid(8)}`,
        notes: { email, phone, name },
      }),
    });

    if (!rzpRes.ok) {
      const err = await rzpRes.text();
      console.error('[razorpay create-order]', err);
      return NextResponse.json({ error: 'Failed to create payment order' }, { status: 502 });
    }

    const rzpOrder = await rzpRes.json() as { id: string; amount: number; currency: string };

    // 2. Persist order in D1 (store phone + name inside shippingAddress JSON)
    const db = getDb(env.DB);
    const orderId = `ord_${nanoid(12)}`;
    const shippingAddress = JSON.stringify({ name, phone, ...address });

    await db.insert(orders).values({
      id: orderId,
      email,
      totalAmount: amount,           // stored in paise
      status: 'PENDING',
      razorpayOrderId: rzpOrder.id,
      shippingAddress,
    });

    // 3. Insert order items (productId required by schema)
    for (const item of validatedItems) {
      await db.insert(orderItems).values({
        id: `oi_${nanoid(10)}`,
        orderId,
        productId: item.productId,
        productName: item.name,
        productSize: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPricePaise,
      });
    }

    return NextResponse.json({
      orderId,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: rzpKeyId,
    });

  } catch (err) {
    console.error('[create-order]', err);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
