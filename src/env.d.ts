// Cloudflare bindings type declarations
// These bindings are defined in wrangler.toml and injected at runtime.
// This file tells TypeScript what shape the env object has.

interface CloudflareEnv {
  // D1 database binding (wrangler.toml: [[d1_databases]] binding = "DB")
  DB: D1Database;

  // KV namespace binding (wrangler.toml: [[kv_namespaces]] binding = "SESSIONS")
  SESSIONS: KVNamespace;

  // R2 bucket binding (wrangler.toml: [[r2_buckets]] binding = "IMAGES")
  IMAGES: R2Bucket;

  // Environment variables (set via wrangler secret put or [vars] in wrangler.toml)
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  NEXT_PUBLIC_RAZORPAY_KEY_ID: string;
  RESEND_API_KEY: string;
  JWT_SECRET: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_R2_PUBLIC_URL: string;
  NODE_ENV: string;
}
