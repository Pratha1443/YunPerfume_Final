"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Stage = "email" | "code" | "done";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<Stage>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send magic link
  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to send link");
      setStage("code");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not send link. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP code
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Invalid code");
      // Session cookie is now set — redirect to profile
      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-transparent pt-32 pb-32 md:pt-40">
      <div className="mx-auto max-w-md px-5">
        <div className="text-center">
          <div className="font-display text-5xl font-light tracking-[0.2em]">YUN</div>
          <div className="eyebrow mt-6 text-muted-foreground">
            {stage === "email" ? "Sign in" : "Check your email"}
          </div>
          <h1 className="h-display mt-3 text-4xl font-light md:text-5xl">
            {stage === "email" ? "Welcome." : "We sent a code."}
          </h1>
        </div>

        {stage === "email" ? (
          <form onSubmit={handleSendLink} className="mt-12 space-y-6">
            <div>
              <label htmlFor="email" className="eyebrow mb-3 block text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-b border-foreground/30 bg-transparent py-3 font-display text-xl font-light outline-none transition-colors focus:border-foreground"
              />
            </div>

            {error && <div className="text-center text-sm text-destructive">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground py-4 text-sm tracking-wider text-background transition-colors hover:bg-accent disabled:opacity-50"
            >
              {loading ? "SENDING…" : "SEND MAGIC LINK"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              No password. We&apos;ll email you a one-time code.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="mt-12 space-y-6">
            <p className="text-center text-sm text-muted-foreground">
              We sent a 6-character code to{" "}
              <span className="text-foreground">{email}</span>.
            </p>

            <div>
              <label htmlFor="code" className="eyebrow mb-3 block text-muted-foreground">
                Verification code
              </label>
              <input
                id="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                autoComplete="one-time-code"
                className="w-full border-b border-foreground/30 bg-transparent py-3 text-center font-mono text-2xl tracking-[0.4em] outline-none transition-colors focus:border-foreground"
              />
            </div>

            {error && <div className="text-center text-sm text-destructive">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground py-4 text-sm tracking-wider text-background transition-colors hover:bg-accent disabled:opacity-50"
            >
              {loading ? "VERIFYING…" : "VERIFY & SIGN IN"}
            </button>

            <button
              type="button"
              onClick={() => { setStage("email"); setCode(""); setError(""); }}
              className="eyebrow w-full py-2 text-muted-foreground hover:text-foreground"
            >
              ← Use a different email
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSendLink}
              className="eyebrow w-full py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Resend code
            </button>
          </form>
        )}

        <div className="mt-16 text-center text-xs text-muted-foreground">
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">Terms</Link>
          {" & "}
          <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
