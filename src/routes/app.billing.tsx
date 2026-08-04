import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/billing")({
  head: () => ({
    meta: [
      { title: 'Billing & Usage — AEON Cloud' },
      { name: "description", content: 'Monitor test minutes, plan usage, invoices, and subscription tiers for your AEON Cloud workspace.' },
      { property: "og:title", content: 'Billing & Usage — AEON Cloud' },
      { property: "og:description", content: 'Monitor test minutes, plan usage, invoices, and subscription tiers for your AEON Cloud workspace.' },
      { name: "twitter:title", content: 'Billing & Usage — AEON Cloud' },
      { name: "twitter:description", content: 'Monitor test minutes, plan usage, invoices, and subscription tiers for your AEON Cloud workspace.' },
    ],
  }),
  component: BillingPage,
});

const invoices = [
  { id: "INV-2026-07", date: "2026-07-01", amount: "$1,490.00", status: "Paid" },
  { id: "INV-2026-06", date: "2026-06-01", amount: "$1,490.00", status: "Paid" },
  { id: "INV-2026-05", date: "2026-05-01", amount: "$1,490.00", status: "Paid" },
  { id: "INV-2026-04", date: "2026-04-01", amount: "$1,490.00", status: "Paid" },
];

function BillingPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Billing" description="Manage your plan, payment method, and invoices." />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/70 bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Current plan</p>
              <p className="mt-1 text-xl font-semibold">Startup <span className="ml-2 text-sm font-normal text-muted-foreground">$1,490 / month</span></p>
            </div>
            <Button>Upgrade plan</Button>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Executions</span><span className="font-mono">842 / 1,500</span>
              </div>
              <Progress value={56} className="mt-2 h-1.5" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Build storage</span><span className="font-mono">14.2 / 50 GB</span>
              </div>
              <Progress value={28} className="mt-2 h-1.5" />
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Renews on August 1, 2026 · 658 executions remaining</p>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-5">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Payment method</p>
          <div className="mt-3 flex items-center gap-3 rounded-md border border-border/60 bg-secondary/30 p-3">
            <CreditCard className="size-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Visa •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 08/28</p>
            </div>
            <Button size="sm" variant="ghost">Edit</Button>
          </div>
          <Badge variant="outline" className="mt-4 gap-1 border-success/40 text-success">
            <CheckCircle2 className="size-3" /> Stripe verified
          </Badge>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <div className="border-b border-border/60 px-4 py-3">
          <h3 className="text-sm font-semibold">Invoices</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Invoice</th>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Amount</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {invoices.map((i) => (
              <tr key={i.id} className="hover:bg-secondary/30">
                <td className="px-4 py-3 font-mono text-xs">{i.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.date}</td>
                <td className="px-4 py-3">{i.amount}</td>
                <td className="px-4 py-3"><Badge variant="outline" className="border-success/40 text-success">{i.status}</Badge></td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost">Download</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
