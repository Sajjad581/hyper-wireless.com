"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@aeon/components/brand-logo";
import { Button } from "@aeon/components/ui/button";
import { Input } from "@aeon/components/ui/input";
import { Label } from "@aeon/components/ui/label";
import { Checkbox } from "@aeon/components/ui/checkbox";

const benefits = [
  "14-day trial with real SDR test lanes",
  "3GPP Release 15–18 conformance suites",
  "AI Telecom Copilot for failure triage",
  "Signed PDF / CSV / JSON / XLSX reports",
  "SSO, RBAC, and audit logs on Enterprise",
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8">
        <Link href="/"><BrandLogo /></Link>
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">Create your AEON Cloud workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">14-day trial. No credit card required.</p>

          <form
            className="mt-8 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => router.push("/app"), 500);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="company">Company name</Label>
              <Input id="company" required placeholder="Acme Semiconductor" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Contact person</Label>
                <Input id="name" required placeholder="Alex Rivera" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" required placeholder="Germany" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" required placeholder="alex@acme.com" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="pw">Password</Label>
                <Input id="pw" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pw2">Confirm password</Label>
                <Input id="pw2" type="password" required />
              </div>
            </div>
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <Checkbox className="mt-0.5" required />
              <span>I agree to the <a className="text-foreground underline underline-offset-4" href="#">Terms</a> and <a className="text-foreground underline underline-offset-4" href="#">Privacy Policy</a>.</span>
            </label>
            <Button type="submit" disabled={loading}>{loading ? "Creating…" : "Create workspace"}</Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-foreground underline underline-offset-4">Sign in</Link>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AEON Cloud</p>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border/60 bg-secondary/20 lg:block">
        <div aria-hidden className="absolute inset-0 bg-grid opacity-60" />
        <div aria-hidden className="absolute right-1/2 top-1/4 h-96 w-96 translate-x-1/2 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-brand)" }} />
        <div className="relative flex h-full flex-col justify-center px-16">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">What you get on day one</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">A certification lab, ready in minutes.</h2>
          <ul className="mt-8 space-y-3 text-sm">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-lg border border-border/70 bg-card/60 p-4 text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-widest text-primary">SLA</span>
            <p className="mt-2">99.95% uptime · EU · US · APAC regions · SOC 2 aligned controls.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
