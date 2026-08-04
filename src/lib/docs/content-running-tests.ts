import type { DocPage } from "./types";

export const runningTestsPages: DocPage[] = [
  {
    slug: "ttcn3-basics",
    title: "TTCN-3 basics for UE engineers",
    description:
      "A practical introduction to TTCN-3 for engineers who have to read verdicts, not write test suites: modules, components, templates, verdicts, and PICS/PIXIT.",
    group: "Running tests",
    keywords: ["ttcn-3 basics", "what is ttcn-3 testing", "ttcn-3 verdict"],
    readMinutes: 9,
    blocks: [
      {
        paragraphs: [
          "TTCN-3 (Testing and Test Control Notation version 3) is the ETSI-standard language 3GPP uses to specify conformance test cases. You do not need to write it to use AEON, but you do need to read it, because the language explains why a test case failed where it did.",
        ],
      },
      {
        heading: "The five concepts that matter",
        bullets: [
          "Module — a namespace holding test cases, e.g. NR5GC_Registration.",
          "Component — a parallel entity with ports; the test system and the SUT adapter are components.",
          "Template — an expected message shape. A mismatch against a template is the most common failure.",
          "Verdict — none, pass, inconc, fail, error. Verdicts only ever worsen, never improve.",
          "PICS/PIXIT — capability and parameter declarations that select and configure test cases.",
        ],
      },
      {
        heading: "What a test case looks like",
        code: {
          lang: "ttcn3",
          body: `testcase TC_6_1_1_1() runs on NR_UE_Component system TestAdapter {
  timer t_wait := 15.0;

  f_NR_Cell_Setup();
  t_wait.start;

  alt {
    [] NAS.receive(mw_RegistrationRequest_Initial) {
        setverdict(pass, "initial registration received");
        NAS.send(m_AuthenticationRequest);
      }
    [] NAS.receive {
        setverdict(fail, "unexpected NAS message before registration");
      }
    [] t_wait.timeout {
        setverdict(inconc, "no NAS message within 15s");
      }
  }
}`,
        },
      },
      {
        heading: "How to read a failure",
        paragraphs: [
          "A fail verdict always names the branch that matched. If the log says the fail branch matched on an unexpected NAS message, the UE sent something the template did not allow — a protocol bug. If the timeout branch matched, the UE sent nothing — usually a lower-layer or RF problem, not a NAS bug.",
        ],
        note: "inconc is not a pass. It means the test system could not determine conformance, and it is usually an environment issue: gain, timing, or configuration.",
      },
      {
        heading: "Where the suites come from",
        paragraphs: [
          "AEON executes standard 3GPP-published suites — TS 38.523-3 for NR protocol, TS 36.523-3 for LTE, plus RRM and RF suites — not reimplementations. That matters for report credibility: the abstract test suite is the same artifact a formal lab would run.",
        ],
      },
    ],
  },
  {
    slug: "campaigns",
    title: "Campaigns: grouping test cases",
    description:
      "Define reusable TTCN-3 campaigns in YAML — case selection, ordering, parallelism, retries, abort policy, and per-branch campaign variants.",
    group: "Running tests",
    keywords: ["ttcn-3 campaign", "test suite yaml", "conformance regression suite"],
    readMinutes: 6,
    blocks: [
      {
        paragraphs: [
          "A campaign is a versioned, reviewable list of test cases plus execution policy. Campaigns live in your repository, which means test scope changes go through code review like everything else.",
        ],
      },
      {
        heading: "Campaign file",
        code: {
          lang: "yaml",
          label: ".aeon/campaigns/smoke.yaml",
          body: `name: smoke
release: 18
description: 12-case gate for every pull request
policy:
  parallel: 4
  retries: 1
  abort_on_fail: false
  max_duration: 20m
cases:
  - TC_6_1_1_1        # initial registration
  - TC_6_1_1_2        # registration, periodic
  - TC_6_1_2_1        # de-registration, UE initiated
  - TC_7_1_1_1        # PDU session establishment
  - group: RRC_Idle_Mode
    limit: 8`,
        },
      },
      {
        heading: "Run it",
        code: {
          lang: "bash",
          body: `aeon exec run --campaign smoke --build "$GIT_SHA" --wait
aeon exec run --campaign nightly --build main --lanes 8`,
        },
      },
      {
        heading: "Suggested campaign tiers",
        table: {
          columns: ["Campaign", "Cases", "Trigger", "Budget"],
          rows: [
            ["smoke", "~12", "every pull request", "under 20 min"],
            ["regression", "~180", "merge to main", "under 3 h"],
            ["nightly", "~640", "scheduled 02:00", "overnight"],
            ["certification", "full suite", "release candidate", "2-4 days"],
          ],
        },
      },
    ],
  },
  {
    slug: "test-selection",
    title: "Selecting test cases from TS 38.523",
    description:
      "How to narrow thousands of 3GPP NR test cases down to a relevant set using PICS, release, feature groups, and applicability rules.",
    group: "Running tests",
    keywords: ["ts 38.523 test cases", "3gpp test case selection", "pics applicability"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "TS 38.523-1 defines several thousand NR test cases. Almost none of them apply to your device. Applicability is derived mechanically from your PICS declarations — declare capabilities honestly and the applicable set falls out.",
        ],
      },
      {
        heading: "Derive the applicable set",
        code: {
          lang: "bash",
          body: `aeon cases applicable --pics ./pics.yaml --release 18 --json > applicable.json
jq 'length' applicable.json          # e.g. 647
jq -r '.[].id' applicable.json | head`,
        },
      },
      {
        heading: "Filter dimensions",
        bullets: [
          "Release — 15 through 18; a Rel-15 device should not be graded on Rel-17 cases.",
          "Mode — SA, NSA/EN-DC, or both.",
          "Domain — NAS, RRC, PDCP, RLC, MAC, IMS/VoNR, RRM, RF.",
          "Feature groups — RedCap, NTN, carrier aggregation, network slicing.",
          "Band and duplex — per-band applicability for RF suites.",
        ],
      },
      {
        heading: "Example: 647 NR SA cases",
        code: {
          lang: "bash",
          body: `aeon cases applicable \\
  --release 18 --mode sa \\
  --domain nas,rrc,pdcp,rlc,mac \\
  --band n78 --count
# 647 applicable cases

aeon exec run --cases-from applicable.json --build main --lanes 12`,
        },
        note: "Start from applicability, not from the full suite. Running inapplicable cases produces noise, not coverage.",
      },
    ],
  },
  {
    slug: "execution-lifecycle",
    title: "Execution lifecycle and states",
    description:
      "Every state an AEON execution passes through — queued, provisioning, running, verdict, archived — and what to do when one stalls.",
    group: "Running tests",
    keywords: ["execution states", "test queue", "ttcn-3 execution lifecycle"],
    readMinutes: 5,
    blocks: [
      {
        heading: "State machine",
        code: {
          lang: "text",
          body: `queued -> provisioning -> running -> verdict -> archived
   |            |             |
   |            |            +-> aborted    (user or policy)
   |            +----------------> failed   (lane or build error)
   +-----------------------------> cancelled (before dispatch)`,
        },
      },
      {
        table: {
          columns: ["State", "Meaning", "Typical duration"],
          rows: [
            ["queued", "Waiting for a lane matching your constraints", "seconds to minutes"],
            ["provisioning", "Lane flashing your build, SDR calibrating", "20-90 s"],
            ["running", "TTCN-3 engine executing the case list", "case-dependent"],
            ["verdict", "Aggregating verdicts, generating report", "under 10 s"],
            ["archived", "Logs, PCAPs, report retained per policy", "30-365 days"],
          ],
        },
      },
      {
        heading: "When a run stalls in queued",
        bullets: [
          "Your constraints may be too narrow — drop --sdr or --region and let the scheduler pick.",
          "Check quota: aeon quota show.",
          "Check lane availability: aeon lanes list --available.",
        ],
      },
      {
        heading: "Inspect and control",
        code: {
          lang: "bash",
          body: `aeon exec list --state running
aeon exec describe --id 4821
aeon exec cancel --id 4821 --reason "wrong build tag"`,
        },
      },
    ],
  },
  {
    slug: "logs-and-pcaps",
    title: "Logs, PCAPs, and evidence",
    description:
      "Retrieve and interpret execution artifacts: TTCN-3 engine logs, UE logs, MAC/NAS PCAPs, message sequence charts, and Wireshark setup.",
    group: "Running tests",
    keywords: ["nas pcap", "mac pcap wireshark 5g", "ttcn-3 log analysis"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "Every execution keeps four artifact classes. Together they are the evidence chain a certification body expects, and the input the AI Copilot reasons over.",
        ],
      },
      {
        heading: "Download artifacts",
        code: {
          lang: "bash",
          body: `aeon exec artifacts --id 4821 --list
aeon exec artifacts --id 4821 --get ue.log --get ue_nas.pcap --out ./evidence/
aeon exec artifacts --id 4821 --all --out ./evidence/`,
        },
      },
      {
        heading: "Open PCAPs in Wireshark",
        code: {
          lang: "bash",
          body: `# NAS-5GS and MAC-NR dissectors ship with Wireshark 3.6+
wireshark ./evidence/ue_nas.pcap

# useful display filters
nas-5gs.mm.message_type == 0x41   # Registration Request
nas-5gs.mm.message_type == 0x42   # Registration Accept
nas-5gs.mm.message_type == 0x44   # Registration Reject
mac-nr.rnti-type == 3             # C-RNTI`,
        },
      },
      {
        heading: "Artifact classes",
        table: {
          columns: ["Artifact", "Use"],
          rows: [
            ["engine.log", "TTCN-3 verdict trail — which alt branch matched and why"],
            ["ue.log", "Device-side layer logs (PHY/MAC/RRC/NAS)"],
            ["*.pcap", "Frame-level evidence for the report and for Wireshark"],
            ["msc.json", "Message sequence chart rendered in the portal"],
            ["rf.csv", "Per-slot RSRP/SINR/BLER samples from the lane"],
          ],
        },
      },
      {
        heading: "Ask the Copilot first",
        code: { lang: "bash", body: `aeon copilot explain --exec 4821\naeon copilot explain --exec 4821 --focus "why did T3510 expire"` },
        note: "The Copilot cites the 3GPP clause and the exact log line. Treat it as a first-pass triage engineer, then verify against the PCAP.",
      },
    ],
  },
  {
    slug: "reports",
    title: "Reports and verdict exports",
    description:
      "Generate signed conformance reports in PDF, JSON, and JUnit XML — contents, signature verification, retention, and sharing with certification bodies.",
    group: "Running tests",
    keywords: ["conformance test report", "3gpp certification report", "junit test report"],
    readMinutes: 6,
    blocks: [
      {
        heading: "Formats",
        table: {
          columns: ["Format", "For"],
          rows: [
            ["PDF", "Certification bodies, customers, audit trails"],
            ["JSON", "Dashboards, internal tooling, diffing runs"],
            ["JUnit XML", "CI test reporting (GitHub, GitLab, Jenkins)"],
            ["CSV", "Spreadsheet analysis of large campaigns"],
          ],
        },
      },
      {
        heading: "Generate",
        code: {
          lang: "bash",
          body: `aeon reports get --exec 4821 --format pdf   --output ./cert.pdf
aeon reports get --campaign nightly --run 214 --format junit --output ./junit.xml
aeon reports diff --a 4820 --b 4821    # verdict deltas between two runs`,
        },
      },
      {
        heading: "What the PDF contains",
        bullets: [
          "Device and build identity, including artifact checksum.",
          "Lane identity, SDR model, firmware, and calibration timestamp.",
          "Abstract test suite version and 3GPP release.",
          "Per-case verdict, duration, and failure clause reference.",
          "PICS/PIXIT snapshot used for the run.",
          "Detached signature over the whole document.",
        ],
      },
      {
        heading: "Verify a signature",
        code: {
          lang: "bash",
          body: `aeon reports verify ./cert.pdf
# signature: valid  signer: AEON Cloud Reports  signed: 2026-07-14T09:12:03Z`,
        },
      },
    ],
  },
  {
    slug: "coverage-and-traceability",
    title: "Coverage and requirement traceability",
    description:
      "Measure 3GPP procedure coverage across campaigns and trace each executed test case back to the specification clause it validates.",
    group: "Running tests",
    keywords: ["3gpp coverage", "requirement traceability", "conformance coverage matrix"],
    readMinutes: 6,
    blocks: [
      {
        paragraphs: [
          "Coverage in conformance testing is not line coverage. It is the fraction of applicable specification requirements exercised by at least one executed test case, which is what auditors and customers actually ask about.",
        ],
      },
      {
        heading: "Query coverage",
        code: {
          lang: "bash",
          body: `aeon coverage show --build main --release 18
aeon coverage show --build main --domain nas --format json
aeon coverage gaps --build main --top 20   # highest-risk unexercised requirements`,
        },
      },
      {
        heading: "Example output",
        code: {
          lang: "text",
          body: `domain    applicable  executed  passed  coverage
NAS-5GS          184       184     181     100.0%
RRC              206       198     193      96.1%
PDCP              64        58      58      90.6%
RLC               51        44      44      86.3%
MAC               72        63      61      87.5%
IMS/VoNR          70         0       0       0.0%   <- gap
total            647       547     537      84.5%`,
        },
      },
      {
        heading: "Traceability",
        paragraphs: [
          "Every case in a report links to its clause references, so you can answer a request like \"show me the evidence for TS 24.501 clause 5.5.1.2.4\" with a filtered artifact set rather than a manual search.",
        ],
        code: { lang: "bash", body: `aeon trace clause "24.501:5.5.1.2.4" --build main` },
      },
    ],
  },
];
