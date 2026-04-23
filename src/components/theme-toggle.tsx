"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-10 w-10 rounded-full bg-foreground/5", className)} />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 focus-visible:outline-none",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          "h-[18px] w-[18px] transition-all duration-500 ease-in-out",
          theme === "dark" ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        )}
        strokeWidth={1.4}
      />
      <Moon
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500 ease-in-out",
          theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        )}
        strokeWidth={1.4}
      />
    </button>
  );
}
