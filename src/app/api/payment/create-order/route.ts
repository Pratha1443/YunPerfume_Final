export const runtime = 'edge';

import { NextResponse } from "next/server";
import Razorpay from "razorpay";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json() as { amount: number; currency?: string; receipt?: string };
    const { amount, currency = "INR", receipt } = body;

    const order = await razorpay.orders.create({
      amount: amount, // amount in the smallest currency unit
      currency,
      receipt,
    });

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
