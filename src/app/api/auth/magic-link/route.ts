import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // In production, we'd generate a token/link and save it to KV or DB
    const token = Math.random().toString(36).slice(2, 8).toUpperCase();

    const { data, error } = await resend.emails.send({
      from: 'YUN Atelier <magic@yun.in>',
      to: [email],
      subject: 'Your Magic Link — YUN',
      html: `<p>Your verification code is: <strong>${token}</strong></p>`,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
