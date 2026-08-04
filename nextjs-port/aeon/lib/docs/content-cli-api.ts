import type { DocPage } from "./types";

export const cliApiPages: DocPage[] = [
  {
    slug: "cli-reference",
    title: "CLI reference",
    description:
      "Complete aeon-cli command reference: builds, lanes, exec, cases, reports, coverage, copilot, tunnel, tokens, and global flags.",
    group: "CLI",
    keywords: ["aeon cli reference", "ttcn-3 cli commands"],
    readMinutes: 8,
    blocks: [
      {
        heading: "Global flags",
        table: {
          columns: ["Flag", "Effect"],
          rows: [
            ["--project <slug>", "Override the project from aeon.yaml"],
            ["--region <id>", "Pin execution to a region (data residency)"],
            ["--json", "Machine-readable output for scripting"],
            ["--quiet", "Suppress progress rendering (use in CI)"],
            ["--timeout <dur>", "Client-side wait limit, e.g. 45m"],
          ],
        },
      },
      {
        heading: "Command tree",
        code: {
          lang: "text",
          body: `aeon
  login | logout | whoami
  builds    push | list | show | tag | rm
  lanes     list | reserve | release | describe
  cases     search | show | applicable
  exec      run | attach | list | describe | tail | artifacts | cancel
  reports   get | diff | verify
  coverage  show | gaps
  trace     clause
  copilot   explain | ask
  tunnel    up | down | status
  tokens    create | list | rotate | revoke
  config    lint | view | set`,
        },
      },
      {
        heading: "Scripting patterns",
        code: {
          lang: "bash",
          body: `# fail the shell when any case fails
aeon exec run --campaign smoke --build "$GIT_SHA" --wait --exit-code

# extract failures for a bug tracker
aeon exec describe --id 4821 --json \\
  | jq -r '.cases[] | select(.verdict=="fail") | "\\(.id)\\t\\(.reason)"'

# wait for many runs
for id in $(aeon exec list --state running --json | jq -r '.[].id'); do
  aeon exec tail --id "$id" --quiet &
done; wait`,
        },
      },
      {
        heading: "Exit codes",
        table: {
          columns: ["Code", "Meaning"],
          rows: [
            ["0", "Success; all verdicts pass"],
            ["1", "At least one fail verdict"],
            ["2", "Usage or configuration error"],
            ["3", "Inconclusive verdict (environment)"],
            ["4", "Auth or quota error"],
            ["5", "Lane or platform error"],
          ],
        },
      },
    ],
  },
  {
    slug: "cli-builds",
    title: "aeon builds",
    description:
      "Manage UE build artifacts: push, tag, inspect, and retire immutable builds with checksums and provenance metadata.",
    group: "CLI",
    keywords: ["ue build repository", "aeon builds push"],
    readMinutes: 5,
    blocks: [
      {
        heading: "Push",
        code: {
          lang: "bash",
          body: `aeon builds push ./ue-v2.4.1.tar.gz \\
  --tag rc3 \\
  --release 18 \\
  --commit "$GIT_SHA" \\
  --branch "$GIT_BRANCH" \\
  --entrypoint srsue \\
  --config ue.conf`,
        },
      },
      {
        heading: "Accepted formats",
        bullets: [
          "tar.gz / tar.zst / zip archives containing a binary and config.",
          "OCI image reference (docker://ghcr.io/org/ue:tag).",
          "Raw firmware image for shipped-device targets.",
        ],
      },
      {
        heading: "Inspect",
        code: {
          lang: "bash",
          body: `aeon builds list --branch main --limit 10
aeon builds show --tag rc3
# sha256: 9f2c...  size: 84.2 MB  pushed: 2026-07-14  runs: 38`,
        },
        note: "Builds are immutable. Pushing the same content twice deduplicates by digest; tags move, content never does.",
      },
      {
        heading: "Retention",
        paragraphs: [
          "Tagged builds are retained for the workspace retention window; untagged builds older than 30 days are pruned. Any build referenced by a signed report is never pruned, so certification evidence stays reproducible.",
        ],
      },
    ],
  },
  {
    slug: "cli-exec",
    title: "aeon exec",
    description:
      "Start, follow, inspect, and cancel TTCN-3 executions from the command line, including parallel lane fan-out and artifact retrieval.",
    group: "CLI",
    keywords: ["aeon exec run", "run 3gpp test cli"],
    readMinutes: 6,
    blocks: [
      {
        heading: "Run",
        code: {
          lang: "bash",
          body: `# single case
aeon exec run --case TC_6_1_1_1 --build rc3 --wait

# a campaign across 8 lanes
aeon exec run --campaign regression --build rc3 --lanes 8 --wait

# an explicit case list
aeon exec run --cases-from applicable.json --build rc3 --lanes 12`,
        },
      },
      {
        heading: "Follow and inspect",
        code: {
          lang: "bash",
          body: `aeon exec tail --id 4821            # live log + verdict stream
aeon exec describe --id 4821 --json
aeon exec artifacts --id 4821 --all --out ./evidence/`,
        },
      },
      {
        heading: "Useful flags",
        table: {
          columns: ["Flag", "Effect"],
          rows: [
            ["--wait", "Block until terminal state"],
            ["--follow", "Stream logs while waiting"],
            ["--lanes N", "Fan out across N reserved lanes"],
            ["--retries N", "Re-run inconclusive cases N times"],
            ["--exit-code", "Map verdicts onto process exit code"],
            ["--label k=v", "Attach metadata for later filtering"],
          ],
        },
      },
    ],
  },
  {
    slug: "api-authentication",
    title: "REST API authentication",
    description:
      "Authenticate against the AEON REST API with bearer tokens, understand scopes and rate limits, and handle 401/403/429 responses correctly.",
    group: "API",
    keywords: ["rest api authentication", "bearer token api", "api rate limit"],
    readMinutes: 5,
    blocks: [
      {
        paragraphs: [
          "The API base URL is https://api.aeon.cloud/v1. Every request requires an Authorization header. There are no cookies and no session state.",
        ],
      },
      {
        code: {
          lang: "bash",
          body: `curl https://api.aeon.cloud/v1/executions \\
  -H "Authorization: Bearer $AEON_TOKEN" \\
  -H "Accept: application/json"`,
        },
      },
      {
        heading: "Errors",
        table: {
          columns: ["Status", "Meaning", "Action"],
          rows: [
            ["401", "Missing or invalid token", "Re-issue the token"],
            ["403", "Token lacks the required scope", "Add the scope, rotate"],
            ["409", "Lane already reserved", "Retry with backoff or drop constraints"],
            ["422", "PICS/PIXIT inconsistent with the suite", "Run aeon config lint"],
            ["429", "Rate limited", "Honour Retry-After"],
          ],
        },
      },
      {
        heading: "Rate limits",
        code: {
          lang: "text",
          body: `X-RateLimit-Limit: 600
X-RateLimit-Remaining: 587
X-RateLimit-Reset: 1786... (unix seconds)`,
        },
        note: "Limits are per token, per minute. Log streaming uses a websocket and does not consume the REST budget.",
      },
    ],
  },
  {
    slug: "api-executions",
    title: "Executions API",
    description:
      "Create and query TTCN-3 executions over REST: request schema, verdict payloads, websocket log streaming, and pagination.",
    group: "API",
    keywords: ["executions api", "rest api 3gpp test", "test automation api"],
    readMinutes: 7,
    blocks: [
      {
        heading: "Create an execution",
        code: {
          lang: "http",
          body: `POST /v1/executions HTTP/1.1
Host: api.aeon.cloud
Authorization: Bearer aeon_pat_...
Content-Type: application/json

{
  "build":    "rc3",
  "campaign": "smoke",
  "release":  18,
  "lanes":    4,
  "constraints": { "region": "eu-west-1", "sdr": "lime" },
  "labels":   { "ci": "github", "pr": "482" }
}`,
        },
      },
      {
        heading: "Response",
        code: {
          lang: "json",
          body: `{
  "id": "4821",
  "state": "queued",
  "created_at": "2026-07-14T09:11:58Z",
  "campaign": "smoke",
  "case_count": 12,
  "links": {
    "self": "/v1/executions/4821",
    "logs": "wss://api.aeon.cloud/v1/executions/4821/logs",
    "report": "/v1/executions/4821/report"
  }
}`,
        },
      },
      {
        heading: "Verdict payload",
        code: {
          lang: "json",
          body: `{
  "id": "4821",
  "state": "verdict",
  "verdict": "fail",
  "duration_s": 214.8,
  "cases": [
    { "id": "TC_6_1_1_1", "verdict": "pass", "duration_s": 14.2 },
    { "id": "TC_6_1_1_2", "verdict": "fail", "duration_s": 31.7,
      "reason": "T3510 expiry, no Registration Accept",
      "clause": "24.501:5.5.1.2.4" }
  ]
}`,
        },
      },
      {
        heading: "Stream logs",
        code: {
          lang: "javascript",
          body: `const ws = new WebSocket(
  "wss://api.aeon.cloud/v1/executions/4821/logs?token=" + token,
);
ws.onmessage = (e) => {
  const { ts, layer, level, text } = JSON.parse(e.data);
  console.log(\`[\${ts}] \${layer}/\${level} \${text}\`);
};`,
        },
      },
    ],
  },
  {
    slug: "api-webhooks",
    title: "Webhooks",
    description:
      "Receive execution and verdict events over HTTPS webhooks: event types, payload schema, HMAC signature verification, retries, and idempotency.",
    group: "API",
    keywords: ["webhooks api", "hmac signature verification", "ci webhook"],
    readMinutes: 6,
    blocks: [
      {
        heading: "Events",
        table: {
          columns: ["Event", "Fires when"],
          rows: [
            ["execution.queued", "An execution is accepted"],
            ["execution.started", "A lane begins running cases"],
            ["execution.case_failed", "Any individual case fails"],
            ["execution.completed", "Terminal verdict reached"],
            ["report.ready", "Signed report available"],
            ["lane.degraded", "Lane health check failed mid-run"],
          ],
        },
      },
      {
        heading: "Payload",
        code: {
          lang: "json",
          body: `{
  "id": "evt_01J...",
  "type": "execution.completed",
  "created_at": "2026-07-14T09:15:32Z",
  "data": { "execution_id": "4821", "verdict": "fail", "failed_cases": 1 }
}`,
        },
      },
      {
        heading: "Verify the signature",
        code: {
          lang: "typescript",
          body: `import { createHmac, timingSafeEqual } from "crypto";

export function verify(rawBody: string, header: string, secret: string) {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}`,
        },
        note: "Always verify before parsing. Signature is sent in X-Aeon-Signature over the exact raw body.",
      },
      {
        heading: "Delivery guarantees",
        bullets: [
          "At-least-once delivery — deduplicate on event id.",
          "Retries at 1s, 10s, 1m, 10m, 1h for non-2xx responses.",
          "Deliveries are disabled after 24 h of consecutive failures.",
        ],
      },
    ],
  },
  {
    slug: "sdk-python",
    title: "Python SDK",
    description:
      "Install and use the AEON Python SDK to push builds, run TTCN-3 campaigns, stream logs, and assert verdicts inside pytest.",
    group: "SDK",
    keywords: ["python sdk", "pytest 3gpp", "python test automation telecom"],
    readMinutes: 6,
    blocks: [
      { code: { lang: "bash", body: `pip install aeon-cloud` } },
      {
        heading: "Run a campaign",
        code: {
          lang: "python",
          body: `from aeon import Client

client = Client()                     # reads AEON_TOKEN

build = client.builds.push("./srsue-bundle.tar.gz", tag="rc3", release=18)

run = client.executions.create(build=build.tag, campaign="smoke", lanes=4)
for line in run.stream_logs():
    print(line.layer, line.text)

result = run.wait()
print(result.verdict, result.duration_s)
for case in result.failed_cases():
    print(case.id, case.reason, case.clause)`,
        },
      },
      {
        heading: "Assert inside pytest",
        code: {
          lang: "python",
          body: `import pytest
from aeon import Client

@pytest.fixture(scope="session")
def registration_run():
    return Client().executions.create(
        build="rc3", cases=["TC_6_1_1_1", "TC_6_1_1_2"],
    ).wait()

def test_initial_registration_passes(registration_run):
    case = registration_run.case("TC_6_1_1_1")
    assert case.verdict == "pass", case.reason`,
        },
      },
      {
        heading: "Async client",
        code: {
          lang: "python",
          body: `import asyncio
from aeon import AsyncClient

async def main():
    async with AsyncClient() as c:
        runs = [c.executions.create(build="rc3", case=cid) for cid in cases]
        results = await asyncio.gather(*(r.wait() for r in await asyncio.gather(*runs)))
        print(sum(r.verdict == "pass" for r in results), "passed")

asyncio.run(main())`,
        },
      },
    ],
  },
  {
    slug: "sdk-typescript",
    title: "TypeScript SDK",
    description:
      "Use the AEON TypeScript SDK from Node or an internal dashboard: typed clients, verdict types, log streaming, and webhook helpers.",
    group: "SDK",
    keywords: ["typescript sdk", "node test automation", "telecom dashboard api"],
    readMinutes: 5,
    blocks: [
      { code: { lang: "bash", body: `npm install @aeon-cloud/sdk` } },
      {
        heading: "Run and await a verdict",
        code: {
          lang: "typescript",
          body: `import { AeonClient } from "@aeon-cloud/sdk";

const aeon = new AeonClient({ token: process.env.AEON_TOKEN! });

const run = await aeon.executions.create({
  build: "rc3",
  campaign: "smoke",
  lanes: 4,
});

for await (const line of run.logs()) {
  console.log(\`\${line.layer}/\${line.level} \${line.text}\`);
}

const result = await run.wait();
if (result.verdict !== "pass") {
  for (const c of result.cases.filter((c) => c.verdict === "fail")) {
    console.error(c.id, c.reason, c.clause);
  }
  process.exitCode = 1;
}`,
        },
      },
      {
        heading: "Types",
        code: {
          lang: "typescript",
          body: `type Verdict = "pass" | "fail" | "inconc" | "error" | "none";

interface CaseResult {
  id: string;
  verdict: Verdict;
  durationS: number;
  reason?: string;
  clause?: string;   // e.g. "24.501:5.5.1.2.4"
}`,
        },
      },
    ],
  },
  {
    slug: "sdk-examples",
    title: "SDK examples and demo projects",
    description:
      "Runnable example projects: srsUE smoke gate, nightly regression matrix, verdict dashboard, Slack failure alerts, and coverage export.",
    group: "SDK",
    keywords: ["sdk examples", "3gpp automation examples", "test automation demo"],
    readMinutes: 5,
    blocks: [
      {
        paragraphs: [
          "Each example is a small, self-contained repository you can clone and run against a trial workspace. They are intentionally boring — the point is that conformance testing becomes ordinary software automation.",
        ],
      },
      {
        table: {
          columns: ["Example", "What it shows"],
          rows: [
            ["srsue-smoke-gate", "12-case PR gate against an open-source UE"],
            ["nightly-matrix", "647 applicable cases across 12 lanes, JUnit output"],
            ["verdict-dashboard", "TypeScript dashboard reading the Executions API"],
            ["slack-failure-alerts", "Webhook receiver posting failures with clause refs"],
            ["coverage-export", "Weekly coverage CSV for release readiness reviews"],
          ],
        },
      },
      {
        heading: "Clone and run",
        code: {
          lang: "bash",
          body: `git clone https://github.com/aeon-cloud/examples.git
cd examples/srsue-smoke-gate
export AEON_TOKEN=aeon_pat_...
make run`,
        },
      },
    ],
  },
];
