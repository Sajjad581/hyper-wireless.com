"use client";

import { PageHeader } from "@aeon/components/app/page-header";
import { Button } from "@aeon/components/ui/button";
import { Input } from "@aeon/components/ui/input";
import { Label } from "@aeon/components/ui/label";
import { Switch } from "@aeon/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Settings" description="Company profile, security, notifications, and integrations." />

      <Section title="Company profile" desc="Displayed on invoices and certification reports.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Company name" defaultValue="Acme Semiconductor" />
          <Field label="Country" defaultValue="Germany" />
          <Field label="VAT ID" defaultValue="DE123456789" />
          <Field label="Website" defaultValue="https://acme-semi.com" />
        </div>
      </Section>

      <Section title="Security" desc="Password, MFA, and session policies.">
        <div className="grid gap-4">
          <Field label="Current password" type="password" />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="New password" type="password" />
            <Field label="Confirm new password" type="password" />
          </div>
          <ToggleRow title="Two-factor authentication" desc="Require MFA via authenticator app for all sign-ins." defaultChecked />
          <ToggleRow title="Session timeout" desc="Auto sign-out after 8 hours of inactivity." defaultChecked />
          <ToggleRow title="SSO / SAML" desc="Enterprise plan only. Contact sales to enable." />
        </div>
      </Section>

      <Section title="Notifications" desc="Choose which events send email or webhook alerts.">
        <div className="grid gap-3">
          <ToggleRow title="Execution failures" desc="Notify when a TTCN-3 execution ends with FAIL verdict." defaultChecked />
          <ToggleRow title="Certification reports" desc="Notify when a new report is ready to download." defaultChecked />
          <ToggleRow title="Billing events" desc="Invoices, plan changes, and quota warnings." defaultChecked />
        </div>
      </Section>

      <Section title="Webhooks" desc="Send events to your own systems.">
        <Field label="Webhook URL" defaultValue="https://ci.acme-semi.com/aeon/webhook" />
        <p className="mt-2 text-xs text-muted-foreground font-mono">Events: execution.completed · report.generated · build.uploaded</p>
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="ghost">Discard</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} defaultValue={defaultValue} type={type} />
    </div>
  );
}

function ToggleRow({ title, desc, defaultChecked }: { title: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-border/60 p-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
