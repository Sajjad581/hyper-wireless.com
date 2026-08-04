import { createFileRoute } from "@tanstack/react-router";
import { Copy, Terminal, Code2, KeyRound, Package, Play } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/api")({
  head: () => ({
    meta: [
      { title: "API & SDK — AEON Cloud" },
      { name: "description", content: "REST API reference, aeon-cli command guide, and official SDKs (Python, C++, JavaScript) for AEON Cloud." },
      { property: "og:title", content: "API & SDK — AEON Cloud" },
      { property: "og:description", content: "REST API, CLI, and SDKs for AEON Cloud." },
    ],
  }),
  component: ApiPage,
});

const restGroups = [
  { name: "Authentication", endpoints: [
    { m: "POST", p: "/v1/auth/login" },
    { m: "POST", p: "/v1/auth/refresh" },
    { m: "POST", p: "/v1/auth/tokens" },
  ]},
  { name: "Projects", endpoints: [
    { m: "GET", p: "/v1/projects" },
    { m: "POST", p: "/v1/projects" },
    { m: "GET", p: "/v1/projects/{id}" },
    { m: "PATCH", p: "/v1/projects/{id}" },
  ]},
  { name: "Builds", endpoints: [
    { m: "GET", p: "/v1/projects/{id}/builds" },
    { m: "POST", p: "/v1/projects/{id}/builds" },
    { m: "GET", p: "/v1/builds/{id}" },
    { m: "POST", p: "/v1/builds/{id}/rollback" },
  ]},
  { name: "Executions", endpoints: [
    { m: "GET", p: "/v1/executions" },
    { m: "POST", p: "/v1/executions" },
    { m: "GET", p: "/v1/executions/{id}" },
    { m: "GET", p: "/v1/executions/{id}/logs" },
  ]},
  { name: "Reports", endpoints: [
    { m: "GET", p: "/v1/reports" },
    { m: "POST", p: "/v1/reports" },
    { m: "GET", p: "/v1/reports/{id}/export" },
  ]},
  { name: "AI Copilot", endpoints: [
    { m: "POST", p: "/v1/ai/ask" },
    { m: "POST", p: "/v1/ai/analyze-failure" },
  ]},
  { name: "Scheduler", endpoints: [
    { m: "GET", p: "/v1/testers" },
    { m: "POST", p: "/v1/testers/{id}/reservations" },
  ]},
];

const methodColor: Record<string, string> = {
  GET: "border-success/40 text-success",
  POST: "border-primary/40 text-primary",
  PATCH: "border-warning/40 text-warning",
  DELETE: "border-destructive/40 text-destructive",
};

const cliCommands = [
  { c: "aeon login", d: "Authenticate against your workspace." },
  { c: "aeon init", d: "Scaffold a new AEON project in the current directory." },
  { c: "aeon upload <path>", d: "Upload a UE firmware build to the repository." },
  { c: "aeon run --campaign <name>", d: "Submit a campaign for execution." },
  { c: "aeon status", d: "List running and queued executions." },
  { c: "aeon logs <id>", d: "Stream live logs for an execution." },
  { c: "aeon report --format pdf", d: "Generate and download a certification report." },
  { c: "aeon connect --tester <id>", d: "Attach a physical UE to a remote tester." },
];

function ApiPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="API & SDK"
        description="Programmatic access to AEON Cloud — REST endpoints, CLI, and official SDKs."
        actions={<Button variant="outline" className="gap-1.5"><KeyRound className="size-3.5" /> Manage tokens</Button>}
      />

      <Tabs defaultValue="rest">
        <TabsList>
          <TabsTrigger value="rest"><Code2 className="mr-1.5 size-3.5" /> REST API</TabsTrigger>
          <TabsTrigger value="cli"><Terminal className="mr-1.5 size-3.5" /> AEON CLI</TabsTrigger>
          <TabsTrigger value="sdk"><Package className="mr-1.5 size-3.5" /> SDK</TabsTrigger>
        </TabsList>

        <TabsContent value="rest" className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {restGroups.map((g) => (
              <div key={g.name} className="overflow-hidden rounded-xl border border-border/70 bg-card">
                <div className="border-b border-border/60 px-4 py-3">
                  <h3 className="text-sm font-semibold">{g.name}</h3>
                </div>
                <ul className="divide-y divide-border/60">
                  {g.endpoints.map((e) => (
                    <li key={e.m + e.p} className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={"w-16 justify-center font-mono text-[10px] " + methodColor[e.m]}>{e.m}</Badge>
                        <code className="font-mono text-xs">{e.p}</code>
                      </div>
                      <Button size="sm" variant="ghost" className="text-xs"><Play className="mr-1 size-3" /> Try</Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside className="space-y-3">
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Example request</h4>
                <Button size="sm" variant="ghost"><Copy className="size-3.5" /></Button>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-md border border-border/60 bg-background p-3 font-mono text-[11px] leading-relaxed">
{`curl -X POST https://api.aeon.cloud/v1/executions \\
  -H "Authorization: Bearer $AEON_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "project_id": "prj_aria_5g",
    "campaign": "smoke",
    "tester": "eu-03"
  }'`}
              </pre>
            </div>
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <h4 className="text-sm font-semibold">Example response</h4>
              <pre className="mt-3 overflow-x-auto rounded-md border border-border/60 bg-background p-3 font-mono text-[11px] leading-relaxed">
{`{
  "id": "exec_4821",
  "status": "queued",
  "eta_seconds": 240,
  "tester": "eu-03"
}`}
              </pre>
            </div>
          </aside>
        </TabsContent>

        <TabsContent value="cli" className="mt-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { os: "Linux", cmd: "curl -fsSL https://install.aeon.cloud | sh" },
              { os: "macOS", cmd: "brew install aeon/tap/aeon-cli" },
              { os: "Windows", cmd: "iwr -useb https://install.aeon.cloud/win.ps1 | iex" },
            ].map((i) => (
              <div key={i.os} className="rounded-xl border border-border/70 bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">{i.os}</p>
                <pre className="mt-2 overflow-x-auto rounded-md border border-border/60 bg-background p-2 font-mono text-[11px]">{i.cmd}</pre>
              </div>
            ))}
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground">Docker</p>
              <pre className="mt-2 overflow-x-auto rounded-md border border-border/60 bg-background p-2 font-mono text-[11px]">docker run --rm ghcr.io/aeon/cli:latest --help</pre>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <div className="border-b border-border/60 px-4 py-3"><h3 className="text-sm font-semibold">Commands</h3></div>
            <ul className="divide-y divide-border/60">
              {cliCommands.map((c) => (
                <li key={c.c} className="grid grid-cols-12 gap-4 px-4 py-2.5 text-sm">
                  <code className="col-span-5 font-mono text-xs">{c.c}</code>
                  <p className="col-span-7 text-muted-foreground">{c.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="sdk" className="mt-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { l: "Python", v: "1.4.2", pkg: "pip install aeon-sdk" },
              { l: "C++", v: "1.2.0", pkg: "conan install aeon/1.2.0@" },
              { l: "JavaScript", v: "1.5.1", pkg: "bun add @aeon/sdk" },
              { l: "REST (any)", v: "v1", pkg: "See REST tab" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-border/70 bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{s.l}</p>
                  <Badge variant="outline" className="font-mono text-[10px]">{s.v}</Badge>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-md border border-border/60 bg-background p-2 font-mono text-[11px]">{s.pkg}</pre>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <h4 className="text-sm font-semibold">Python — submit an execution</h4>
              <pre className="mt-3 overflow-x-auto rounded-md border border-border/60 bg-background p-3 font-mono text-[11px] leading-relaxed">
{`from aeon import Client

client = Client(token="sk_live_…")
exec = client.executions.create(
    project_id="prj_aria_5g",
    campaign="smoke",
    tester="eu-03",
)
for line in client.executions.logs(exec.id, follow=True):
    print(line)`}
              </pre>
            </div>
            <div className="rounded-xl border border-border/70 bg-card p-4">
              <h4 className="text-sm font-semibold">JavaScript — stream logs</h4>
              <pre className="mt-3 overflow-x-auto rounded-md border border-border/60 bg-background p-3 font-mono text-[11px] leading-relaxed">
{`import { Aeon } from "@aeon/sdk";

const aeon = new Aeon({ token: process.env.AEON_TOKEN });
const exec = await aeon.executions.create({
  projectId: "prj_aria_5g",
  campaign: "smoke",
});
for await (const line of aeon.executions.logs(exec.id)) {
  console.log(line);
}`}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
