export const runtime = 'edge';

import { NextResponse } from "next/server";
import Razorpay from "razorpay";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

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
