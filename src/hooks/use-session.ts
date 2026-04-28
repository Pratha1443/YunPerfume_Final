/**
 * src/hooks/use-session.ts
 * Client hook to read the current JWT session via /api/auth/session.
 */

"use client";

import { useState, useEffect } from "react";

interface SessionUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface SessionState {
  user: SessionUser | null;
  loading: boolean;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ user: null, loading: true });

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data: { user: SessionUser | null }) => {
        setState({ user: data.user, loading: false });
      })
      .catch(() => setState({ user: null, loading: false }));
  }, []);

  return state;
}
