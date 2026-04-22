"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-store";

export default function Login() {
  const { user, sendMagicLink, verify, signOut } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return (
      <div className="bg-background pt-32 pb-32 md:pt-40">
        <div className="mx-auto max-w-md px-5 text-center">
          <div className="eyebrow text-muted-foreground">Welcome back</div>
          <h1 className="h-display mt-4 text-5xl font-light md:text-6xl">
            {user.email.split("@")[0]}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{user.email}</span>
          </p>
          <div className="mt-10 flex flex-col gap-3">
            <Link href="/shop" className="bg-foreground py-4 text-sm tracking-wider text-background hover:bg-accent text-center">
              CONTINUE SHOPPING
            </Link>
            <button onClick={signOut} className="eyebrow py-2 text-muted-foreground hover:text-foreground">
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background pt-32 pb-32 md:pt-40">
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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              try {
                const { token } = await sendMagicLink(email);
                setIssuedToken(token);
                setStage("code");
              } catch {
                setError("Could not send link. Try again.");
              } finally {
                setLoading(false);
              }
            }}
            className="mt-12 space-y-6"
          >
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground py-4 text-sm tracking-wider text-background transition-colors hover:bg-accent disabled:opacity-50"
            >
              {loading ? "SENDING…" : "SEND MAGIC LINK"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              No password. We'll email you a one-time code.
            </p>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              if (verify(email, code)) {
                router.push("/shop");
              } else {
                setError("Invalid code. Please try again.");
              }
            }}
            className="mt-12 space-y-6"
          >
            <p className="text-center text-sm text-muted-foreground">
              We sent a 6-character code to <span className="text-foreground">{email}</span>.
            </p>

            {issuedToken && (
              <div className="rounded-sm border border-accent/30 bg-accent/5 p-4 text-center">
                <div className="eyebrow text-accent">Demo mode</div>
                <div className="mt-2 font-mono text-2xl tracking-[0.4em] text-foreground">
                  {issuedToken}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  In production this would be emailed via Lovable Cloud.
                </div>
              </div>
            )}

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
                className="w-full border-b border-foreground/30 bg-transparent py-3 text-center font-mono text-2xl tracking-[0.4em] outline-none transition-colors focus:border-foreground"
              />
            </div>

            {error && <div className="text-center text-sm text-destructive">{error}</div>}

            <button
              type="submit"
              className="w-full bg-foreground py-4 text-sm tracking-wider text-background transition-colors hover:bg-accent"
            >
              VERIFY & SIGN IN
            </button>
            <button
              type="button"
              onClick={() => {
                setStage("email");
                setCode("");
                setIssuedToken(null);
              }}
              className="eyebrow w-full py-2 text-muted-foreground hover:text-foreground"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
