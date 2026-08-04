"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@aeon/components/brand-logo";
import { Button } from "@aeon/components/ui/button";
import { Input } from "@aeon/components/ui/input";
import { Label } from "@aeon/components/ui/label";
import { Checkbox } from "@aeon/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8">
        <Link href="/"><BrandLogo /></Link>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to AEON Cloud</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your certification workspace.</p>

          <div className="mt-8 grid gap-2">
            <Button variant="outline" className="justify-center gap-2">
              <GoogleIcon /> Continue with Google
            </Button>
            <Button variant="outline" className="justify-center gap-2">
              <MicrosoftIcon /> Continue with Microsoft
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => router.push("/app"), 500);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@company.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground">Forgot?</a>
              </div>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox /> Remember me for 30 days
            </label>
            <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New to AEON Cloud? <Link href="/register" className="text-foreground underline underline-offset-4">Create an account</Link>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AEON Cloud</p>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border/60 bg-secondary/20 lg:block">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
        <div aria-hidden className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
        <div className="relative flex h-full flex-col justify-center px-16">
          <blockquote className="max-w-md text-xl leading-snug tracking-tight">
            "AEON Cloud cut our 5G-SA registration certification cycle from three months to nine days.
            The AI Copilot alone paid for the subscription."
          </blockquote>
          <div className="mt-6 text-sm text-muted-foreground">
            <p className="text-foreground">Yuki Tanaka</p>
            <p>Head of Modem Validation · Aria Semiconductor</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.3 14.7 2.3 12 2.3 6.7 2.3 2.5 6.5 2.5 12s4.2 9.7 9.5 9.7c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}
function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}
