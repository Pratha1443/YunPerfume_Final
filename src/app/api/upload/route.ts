/**
 * POST /api/upload
 * Uploads an image to Cloudflare R2 bucket.
 * Required: Admin session
 * Body: FormData with an 'image' file
 */

export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getSessionFromCookies, verifyJWT } from '@/lib/auth';
import { getR2Url } from '@/lib/r2';
import { nanoid } from 'nanoid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: Request) {
  try {
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

    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP allowed.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    const { env } = getRequestContext();
    const bucket = env.R2 as R2Bucket; // defined in bindings

    if (!bucket) {
      return NextResponse.json({ error: 'R2 Bucket not bound' }, { status: 500 });
    }

    const arrayBuffer = await file.arrayBuffer();
    
    // Generate a unique key
    const extension = file.type.split('/')[1];
    const key = `products/${nanoid(10)}.${extension}`;

    await bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const url = getR2Url(key);

    return NextResponse.json({ success: true, url, key });

  } catch (err) {
    console.error('[api/upload POST]', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
