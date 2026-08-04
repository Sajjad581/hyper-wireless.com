import type { DocPage } from "./types";

export const gettingStartedPages: DocPage[] = [
  {
    slug: "overview",
    title: "AEON Cloud overview",
    description:
      "What AEON Cloud is, how the digital testbench differs from a physical tester, and how the pieces fit together.",
    group: "Getting started",
    keywords: ["cloud ttcn-3", "3gpp conformance testing", "ue certification platform"],
    readMinutes: 5,
    blocks: [
      {
        paragraphs: [
          "AEON Cloud is a managed 3GPP conformance testing service. You push a UE build (or point us at an open-source UE such as srsUE), reserve an SDR-backed radio lane, and execute standard TTCN-3 campaigns from a browser, a CLI, or a CI pipeline.",
          "The important architectural difference: there is no physical tester in your lab. The tester is a service. Instead of racking a box, calibrating it, and booking time on it, you authenticate to an API and get a lane.",
        ],
      },
      {
        heading: "System components",
        bullets: [
          "Build repository — versioned UE images with checksums and provenance.",
          "Scheduler — assigns executions to free radio lanes across regions.",
          "TTCN-3 engine — compiles and executes 3GPP test suites (TS 38.523, TS 36.523, TS 38.533, TS 38.521).",
          "Radio lanes — LimeSDR and Ettus B210 hardware in shielded enclosures.",
          "AI Telecom Copilot — reads logs and PCAPs and explains failures against 3GPP clauses.",
          "Reports service — signed PDF/JSON verdict reports and coverage traceability.",
        ],
      },
      {
        heading: "Execution flow",
        code: {
          lang: "text",
          label: "flow",
          body: `build push  ->  lane reserve  ->  campaign exec  ->  verdict stream  ->  report
   |               |                 |                  |             |
 storage        scheduler         TTCN-3 engine       websocket     signed PDF`,
        },
      },
      {
        heading: "Next steps",
        bullets: [
          "Quickstart — first verdict in under 30 minutes.",
          "Install the CLI — the primary interface for engineers.",
          "Install srsRAN UE — bring an open-source UE to the platform.",
        ],
      },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart: first verdict in 30 minutes",
    description:
      "End-to-end quickstart — install the AEON CLI, authenticate, push a UE build, reserve an SDR lane, and run your first TTCN-3 test case.",
    group: "Getting started",
    keywords: ["how to run ttcn-3 remotely", "ttcn-3 quickstart", "5g ue test quickstart"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "This quickstart takes you from a clean machine to a signed TTCN-3 verdict. It assumes you have a workspace and can install a binary. No radio hardware is required on your side — the SDR lives in our lab.",
        ],
      },
      {
        heading: "1. Install and authenticate",
        code: {
          lang: "bash",
          body: `curl -fsSL https://get.aeon.cloud | bash
aeon login              # opens a browser, stores a scoped token
aeon whoami`,
        },
      },
      {
        heading: "2. Push a build",
        paragraphs: [
          "A build is any UE artifact: a firmware tarball, a Docker image reference, or a compiled srsUE binary set. Builds are immutable and content-addressed.",
        ],
        code: {
          lang: "bash",
          body: `aeon builds push ./ue-v2.4.1.tar.gz --tag rc3 --release 18
aeon builds list`,
        },
      },
      {
        heading: "3. Reserve a lane and run",
        code: {
          lang: "bash",
          body: `aeon lanes list --available
aeon lanes reserve --region eu-west-1 --sdr lime

aeon exec run \\
  --suite NR_5GS_Registration \\
  --case TC_6_1_1_1 \\
  --build rc3 \\
  --wait`,
        },
      },
      {
        heading: "4. Read the verdict",
        code: {
          lang: "text",
          label: "output",
          body: `exec 4821  TC_6_1_1_1  NR5GC / Registration / initial
  [00:00:03] cell found, SIB1 decoded
  [00:00:05] RRCSetupRequest -> RRCSetup
  [00:00:07] Registration Request (5GS) sent
  [00:00:09] Authentication Request / Response OK
  [00:00:11] Security Mode Command -> Security Mode Complete
  [00:00:14] Registration Accept
  verdict: PASS   duration 14.2s   lane eu-west-1/lime-03`,
        },
      },
      {
        heading: "5. Export the report",
        code: {
          lang: "bash",
          body: `aeon reports get --exec 4821 --format pdf --output ./verdict.pdf
aeon reports get --exec 4821 --format json | jq '.verdict'`,
        },
        note: "If the run failed, ask the Copilot: aeon copilot explain --exec 4821",
      },
    ],
  },
  {
    slug: "install-cli",
    title: "Install the AEON CLI",
    description:
      "Install aeon-cli on Linux, macOS, Docker, or in CI. Covers package managers, checksum verification, shell completion, and version pinning.",
    group: "Getting started",
    keywords: ["aeon cli install", "ttcn-3 cli"],
    readMinutes: 4,
    blocks: [
      {
        paragraphs: [
          "The CLI is the primary engineering interface. It is a single static binary with no runtime dependencies, which makes it safe to drop into a CI image.",
        ],
      },
      {
        heading: "Linux and macOS",
        code: {
          lang: "bash",
          body: `# latest
curl -fsSL https://get.aeon.cloud | bash

# pinned (recommended for CI)
curl -fsSL https://get.aeon.cloud | AEON_VERSION=1.12.3 bash

# verify
aeon version --json`,
        },
      },
      {
        heading: "Docker",
        code: {
          lang: "bash",
          body: `docker run --rm -it \\
  -e AEON_TOKEN \\
  -v "$PWD:/work" -w /work \\
  ghcr.io/aeon-cloud/cli:1.12.3 exec run --suite NR_5GS_Registration`,
        },
      },
      {
        heading: "Shell completion",
        code: {
          lang: "bash",
          body: `aeon completion bash | sudo tee /etc/bash_completion.d/aeon
aeon completion zsh  > "${"$"}{fpath[1]}/_aeon"`,
        },
      },
      {
        heading: "Configuration precedence",
        bullets: [
          "Command flags (highest).",
          "Environment variables: AEON_TOKEN, AEON_REGION, AEON_PROJECT.",
          "Project file: ./aeon.yaml.",
          "User file: ~/.config/aeon/config.yaml (lowest).",
        ],
      },
    ],
  },
  {
    slug: "authentication",
    title: "Authentication and API tokens",
    description:
      "How to authenticate to AEON Cloud: interactive login, scoped personal access tokens, machine tokens for CI, SSO, and token rotation.",
    group: "Getting started",
    keywords: ["api token", "ci authentication", "saml sso telecom platform"],
    readMinutes: 5,
    blocks: [
      {
        paragraphs: [
          "Every call — CLI, REST, SDK — is authenticated with a bearer token. Interactive users get short-lived tokens via browser login; automation gets long-lived scoped tokens you manage in the portal.",
        ],
      },
      {
        heading: "Interactive login",
        code: { lang: "bash", body: `aeon login\naeon login --sso acme-corp   # SAML / OIDC workspaces` },
      },
      {
        heading: "Machine tokens",
        paragraphs: [
          "Create a machine token in the portal under API tokens. Scope it to the minimum set of capabilities the pipeline needs.",
        ],
        table: {
          columns: ["Scope", "Grants"],
          rows: [
            ["builds:write", "Push and tag UE builds"],
            ["exec:run", "Start executions and reserve lanes"],
            ["exec:read", "Stream logs and read verdicts"],
            ["reports:read", "Download PDF/JSON reports"],
            ["admin:*", "Team, billing, and workspace settings"],
          ],
        },
      },
      {
        heading: "Using a token",
        code: {
          lang: "bash",
          body: `export AEON_TOKEN=aeon_pat_xxxxxxxxxxxxxxxx
aeon exec list

curl -H "Authorization: Bearer $AEON_TOKEN" https://api.aeon.cloud/v1/executions`,
        },
        note: "Tokens are shown once. Rotate with `aeon tokens rotate --id tok_...`; the old token stays valid for a 60-minute overlap window.",
      },
    ],
  },
  {
    slug: "connect-your-ue",
    title: "Connect your UE to AEON Cloud",
    description:
      "The three ways to attach a device under test: upload a build image, run the UE launcher against a remote lane, or tunnel a physical UE from your bench.",
    group: "Getting started",
    keywords: ["connect ue to cloud tester", "remote ue testing", "device under test tunnel"],
    readMinutes: 6,
    blocks: [
      {
        paragraphs: [
          "There is no physical tester on your side, but the UE still has to reach the lane. AEON supports three attachment models. Pick based on where your UE stack runs.",
        ],
      },
      {
        heading: "Model A — hosted software UE",
        paragraphs: [
          "Your UE is software (srsUE, OAI UE, or your own stack compiled for x86/ARM). Push it as a build and we run it inside the lane, cabled to the SDR. Lowest latency and fully deterministic. This is the default for open-source UE work.",
        ],
        code: { lang: "bash", body: `aeon builds push ./srsue-bundle.tar.gz --tag main\naeon exec run --suite NR_5GS_Registration --build main` },
      },
      {
        heading: "Model B — remote UE over tunnel",
        paragraphs: [
          "Your UE runs on your bench (a dev board, a modem module, a reference phone). The AEON agent creates an authenticated tunnel so the lane drives your device over IP while RF terminates locally.",
        ],
        code: { lang: "bash", body: `aeon tunnel up --lane eu-west-1/lime-03 --local-ue 192.168.10.24:9000\naeon tunnel status` },
      },
      {
        heading: "Model C — shipped device",
        paragraphs: [
          "For RF-heavy campaigns (TS 38.521) you can ship a device once and keep it racked in a shielded enclosure. It becomes a persistent target you address by ID from CI, indefinitely, without ever touching a chamber yourself.",
        ],
      },
      {
        heading: "Choosing a model",
        table: {
          columns: ["Need", "Model"],
          rows: [
            ["Open-source UE, protocol conformance", "A — hosted software UE"],
            ["Proprietary modem on your own bench", "B — tunnel"],
            ["RF / RRM conformance, long-lived target", "C — shipped device"],
          ],
        },
      },
    ],
  },
  {
    slug: "run-your-first-test",
    title: "Run your first TTCN-3 test case",
    description:
      "Walk through one TTCN-3 execution in detail: suite selection, parameter files, live verdict streaming, and how to read the message sequence chart.",
    group: "Getting started",
    keywords: ["run ttcn-3 test", "ttcn-3 execution", "first 5g conformance test"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "A TTCN-3 execution has four inputs: a test case, a build, a lane, and a parameter set (PIXIT/PICS). The platform resolves defaults for everything you leave out.",
        ],
      },
      {
        heading: "Pick a test case",
        code: {
          lang: "bash",
          body: `aeon cases search "registration" --release 18
aeon cases show TC_6_1_1_1`,
        },
      },
      {
        heading: "Provide PICS/PIXIT",
        code: {
          lang: "yaml",
          label: "aeon.yaml",
          body: `project: nr-modem-x75
release: 18
pics:
  pc_NR_SA: true
  pc_IMS_VoNR: false
pixit:
  px_IMSI: "001010123456789"
  px_Band: n78
  px_SubcarrierSpacing: 30`,
        },
      },
      {
        heading: "Execute with live output",
        code: { lang: "bash", body: `aeon exec run --case TC_6_1_1_1 --build rc3 --follow` },
      },
      {
        heading: "Reading the MSC",
        paragraphs: [
          "Every execution produces a message sequence chart alongside the log. The MSC is the fastest way to see which procedure step diverged from the expected 3GPP flow — the first red arrow is almost always the real failure, and everything after it is fallout.",
        ],
        bullets: [
          "Left column: UE. Right column: simulated network (gNB + AMF).",
          "Timers (T3510, T3502, T310) render as spans, so expiries are visually obvious.",
          "Click any message to open the decoded ASN.1 and the matching PCAP frame.",
        ],
      },
    ],
  },
];
