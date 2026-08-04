import type { DocPage } from "./types";

export const troubleshootingPages: DocPage[] = [
  {
    slug: "5g-registration-failure",
    title: "Debugging 5G registration failure",
    description:
      "Systematic debugging of 5GS registration failures: every reject cause, T3510 expiry, USIM mismatches, and the log lines that identify each one.",
    group: "Troubleshooting",
    keywords: ["5g registration failure", "registration reject cause", "t3510 expiry"],
    readMinutes: 9,
    blocks: [
      {
        paragraphs: [
          "Registration is the first real procedure a UE performs and the most common place a conformance run dies. Failures split into three classes: the network rejected you, the network never answered, or the UE never asked.",
        ],
      },
      {
        heading: "Class 1 — Registration Reject",
        paragraphs: [
          "The network answered with a 5GMM cause. This is a protocol or provisioning problem and the cause value tells you which.",
        ],
        table: {
          columns: ["Cause", "Meaning", "Usual fix"],
          rows: [
            ["#3 Illegal UE", "Authentication failed on network side", "Check usim.k / usim.opc against PIXIT"],
            ["#6 Illegal ME", "IMEI blocked", "Set a valid usim.imei"],
            ["#7 5GS services not allowed", "Subscription lacks 5GS", "Check PICS pc_NR_SA and lane profile"],
            ["#11 PLMN not allowed", "PLMN mismatch", "Align ue.conf PLMN with lane plmn (00101)"],
            ["#15 No suitable cells in TA", "Tracking area rejected", "Check band/ARFCN against the lane"],
            ["#22 Congestion", "Back-off timer applied", "Retry after T3346; not a UE bug"],
            ["#27 N1 mode not allowed", "SA disabled for subscriber", "Use an SA-enabled lane profile"],
          ],
        },
      },
      {
        heading: "Class 2 — T3510 expiry (no answer)",
        code: {
          lang: "text",
          label: "engine.log",
          body: `[NAS] Registration Request (initial) sent, T3510 started (15s)
[RRC] state: RRC_CONNECTED
[PHY] rsrp=-104.8 dBm sinr=1.2 dB   <- weak link
[NAS] T3510 expiry (attempt 1/5)
verdict: fail  clause 24.501:5.5.1.2.4`,
        },
        paragraphs: [
          "The UE asked and heard nothing back. Almost always lower-layer: gain, timing, or a tunnel with excessive jitter. Check SINR before you touch NAS code.",
        ],
        bullets: [
          "SINR below 5 dB: adjust rf.tx_gain / rf.rx_gain, or request a fresh lane calibration.",
          "Tunnel RTT above 80 ms: switch to a hosted build (Model A) instead of Model B.",
          "Uplink grant never seen in the MAC PCAP: PRACH power problem, raise tx_gain.",
        ],
      },
      {
        heading: "Class 3 — no Registration Request at all",
        bullets: [
          "SIB1 never decoded: wrong dl_arfcn or ssb_arfcn — the UE never found the cell.",
          "Cell found but no PRACH: PLMN in SIB1 is not in the UE's allowed list.",
          "USIM read failure: usim.mode = soft with a malformed k value.",
        ],
      },
      {
        heading: "Fast triage",
        code: {
          lang: "bash",
          body: `aeon copilot explain --exec 4821 --focus registration
aeon exec artifacts --id 4821 --get ue_nas.pcap --out ./e/
tshark -r ./e/ue_nas.pcap -Y 'nas-5gs' -T fields -e nas-5gs.mm.message_type`,
        },
        note: "Order of investigation: SINR, then SIB1, then USIM, then NAS. Skipping to NAS wastes the most time.",
      },
    ],
  },
  {
    slug: "rrc-setup-failure",
    title: "Debugging RRC Setup failure",
    description:
      "Why RRCSetupRequest fails or is rejected: RACH problems, RRCReject with wait times, msg3 decoding, and how to read the MAC PCAP.",
    group: "Troubleshooting",
    keywords: ["rrc setup failure", "rrc reject", "rach failure 5g"],
    readMinutes: 8,
    blocks: [
      {
        paragraphs: [
          "RRC connection establishment is a four-message handshake. Identify which of the four is missing and the cause space collapses immediately.",
        ],
      },
      {
        heading: "The handshake",
        code: {
          lang: "text",
          body: `UE                                gNB (lane)
 |-- msg1: PRACH preamble ---------->|
 |<-- msg2: RAR (grant) -------------|
 |-- msg3: RRCSetupRequest --------->|
 |<-- msg4: RRCSetup ----------------|
 |-- RRCSetupComplete -------------->|`,
        },
      },
      {
        table: {
          columns: ["Missing at", "Diagnosis", "Fix"],
          rows: [
            ["msg2 never arrives", "PRACH not detected", "Raise rf.tx_gain; verify prach_config_index matches SIB1"],
            ["msg2 arrives, msg3 not decoded", "Wrong TA or power ramp", "Check master_clock_rate; re-run lane calibration"],
            ["RRCReject received", "Congestion or wait time applied", "Honour waitTime, retry; not a UE defect"],
            ["msg4 arrives, no Complete", "UE-side ASN.1 decode failure", "Real UE bug — inspect the decoded RRCSetup"],
            ["T300 expiry", "No msg4 within timer", "Check SINR; often a weak-link symptom"],
          ],
        },
      },
      {
        heading: "Read the MAC PCAP",
        code: {
          lang: "bash",
          body: `tshark -r ue_mac_nr.pcap -Y 'mac-nr.rar' -c 5
tshark -r ue_mac_nr.pcap -Y 'nr-rrc.rrcSetupRequest'
tshark -r ue_mac_nr.pcap -Y 'nr-rrc.rrcReject' -T fields -e nr-rrc.waitTime`,
        },
      },
      {
        heading: "Distinguish UE bugs from environment",
        paragraphs: [
          "A genuine UE defect shows up as a decodable message that violates the specification — a malformed RRCSetupComplete, a missing mandatory IE, a wrong establishmentCause. Anything that looks like \"nothing happened\" is an environment problem until proven otherwise. The verdict field tells you which the test system believed: fail means a template mismatch (protocol), inconc means the test system could not tell (environment).",
        ],
      },
    ],
  },
  {
    slug: "nas-security-mode-complete-failure",
    title: "NAS Security Mode Complete failure",
    description:
      "Diagnose Security Mode Command / Security Mode Complete failures in 5GS: integrity check failures, algorithm mismatch, IMEISV requests, and replay protection.",
    group: "Troubleshooting",
    keywords: ["nas security mode complete failure", "security mode reject", "5gs nas integrity failure"],
    readMinutes: 8,
    blocks: [
      {
        paragraphs: [
          "The Security Mode procedure is where NAS ciphering and integrity protection begin, so it is also where key derivation mistakes surface. If authentication passed but Security Mode fails, the problem is almost always key derivation or algorithm selection, not the USIM secret itself.",
        ],
      },
      {
        heading: "Expected flow",
        code: {
          lang: "text",
          body: `AMF -> UE : Security Mode Command (NIA2/NEA2, ngKSI, replayed UE capabilities)
UE  -> AMF: Security Mode Complete (integrity protected + ciphered)
              [ optionally carries IMEISV if requested ]`,
        },
      },
      {
        heading: "Failure modes",
        table: {
          columns: ["Symptom", "Cause", "Fix"],
          rows: [
            ["Security Mode Reject #23", "UE security capabilities mismatch", "Replayed capabilities differ from those in Registration Request — UE bug"],
            ["Security Mode Reject #24", "Integrity check of the Command failed", "K_AMF derivation wrong; verify SN name and ABBA handling"],
            ["No Complete, T3560 expiry", "UE discarded the Command", "Check ngKSI matches the authenticated key set"],
            ["Complete sent unprotected", "UE applied security in wrong order", "Spec violation — Complete must be integrity protected with the new context"],
            ["IMEISV missing", "Command requested IMEISV, UE omitted it", "Set usim.imeisv in ue.conf"],
          ],
        },
      },
      {
        heading: "Verify key derivation",
        code: {
          lang: "bash",
          body: `aeon copilot explain --exec 4821 --focus "security mode"
# typical answer:
#   TS 33.501 A.7 - K_AMF derived with the wrong SN name string.
#   Expected "5G:mnc001.mcc001.3gppnetwork.org"; UE used the LTE format.`,
        },
      },
      {
        heading: "Why this one is worth automating",
        paragraphs: [
          "Security Mode bugs are release-sensitive and easy to regress: a change to capability encoding or ABBA handling breaks it silently and only conformance testing catches it. Putting the security procedure cases in your per-commit smoke gate costs a few minutes of lane time and prevents the class of bug that is most expensive to find in the field.",
        ],
      },
    ],
  },
  {
    slug: "sdr-timing-and-clock",
    title: "SDR timing, clock, and gain problems",
    description:
      "Fix the SDR-layer problems that produce inconclusive verdicts: sample-rate mismatch, clock drift, gain saturation, USB throughput, and calibration.",
    group: "Troubleshooting",
    keywords: ["limesdr timing", "b210 master clock rate", "sdr underrun overflow"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "SDR problems masquerade as protocol problems. Learn the four signatures and you stop chasing NAS bugs that do not exist.",
        ],
      },
      {
        table: {
          columns: ["Signature", "Meaning", "Fix"],
          rows: [
            ["'U' / 'O' spam in logs", "Underrun / overflow — host cannot keep up", "Lower sample rate, use a hosted lane build"],
            ["'L' / 'D' characters", "Late packets / dropped bursts", "Timing problem; re-check master_clock_rate"],
            ["Corrupt SIB decode at high RSRP", "Receiver saturation", "Reduce rf.rx_gain by 10-15 dB"],
            ["Slow drift then loss of sync", "Clock offset (no GPSDO)", "Request a GPSDO-equipped lane"],
          ],
        },
      },
      {
        heading: "Correct clock rates",
        code: {
          lang: "text",
          body: `B210, 20 MHz NR, 30 kHz SCS : master_clock_rate=23.04e6
B210, 10 MHz LTE            : master_clock_rate=11.52e6
LimeSDR USB, 20 MHz NR      : sample_rate=30.72e6, oversample=2`,
        },
      },
      {
        heading: "Lane calibration",
        code: {
          lang: "bash",
          body: `aeon lanes describe --id eu-west-1/lime-03
# sdr: LimeSDR-USB  fw: 22.10  gpsdo: yes  calibrated: 2026-07-13T22:04Z

aeon lanes calibrate --id eu-west-1/lime-03   # ~90 s, free`,
        },
        note: "Lanes auto-calibrate every 24 h and after any firmware change. Every report records the calibration timestamp, which is what makes a cloud verdict defensible.",
      },
    ],
  },
  {
    slug: "common-errors",
    title: "Common errors and fixes",
    description:
      "Reference table of AEON platform error codes and CLI failures with the exact remedy for each, from auth problems to quota and lane errors.",
    group: "Troubleshooting",
    keywords: ["aeon error codes", "cli errors", "troubleshooting reference"],
    readMinutes: 5,
    blocks: [
      {
        table: {
          columns: ["Error", "Cause", "Fix"],
          rows: [
            ["AEON-401 invalid token", "Expired or revoked token", "aeon login, or rotate the machine token"],
            ["AEON-403 scope missing", "Token lacks exec:run", "Recreate the token with the scope"],
            ["AEON-409 lane busy", "All matching lanes reserved", "Drop --sdr / --region constraints"],
            ["AEON-422 pics mismatch", "PICS contradicts the suite", "aeon config lint"],
            ["AEON-429 rate limited", "Too many API calls", "Honour Retry-After; batch calls"],
            ["AEON-503 lane degraded", "Mid-run hardware fault", "Run is re-queued automatically; no charge"],
            ["build entrypoint not found", "Wrong --entrypoint", "aeon builds show to inspect the archive tree"],
            ["verdict inconc, jitter exceeded", "Tunnel latency budget blown", "Switch to hosted build model"],
          ],
        },
      },
      {
        heading: "Getting help with context",
        code: {
          lang: "bash",
          body: `aeon support bundle --exec 4821 --out ./bundle.tar.gz
# redacted logs + config + lane metadata, safe to attach to a ticket`,
        },
      },
    ],
  },
];

export const referencePages: DocPage[] = [
  {
    slug: "ts-38-523-test-cases",
    title: "Complete guide to TS 38.523 test cases",
    description:
      "Structure of 3GPP TS 38.523 for NR: the -1/-2/-3 split, clause numbering, how test case IDs map to procedures, and which subsets matter per device class.",
    group: "Reference",
    keywords: ["ts 38.523 test cases", "38.523-1", "nr conformance testing"],
    readMinutes: 10,
    blocks: [
      {
        paragraphs: [
          "TS 38.523 is the 5G NR protocol conformance specification. If you only remember one thing: the part number tells you what kind of document you are reading.",
        ],
      },
      {
        table: {
          columns: ["Document", "Content"],
          rows: [
            ["TS 38.523-1", "Protocol test case definitions (prose) — what each case does"],
            ["TS 38.523-2", "Applicability — PICS-driven selection tables"],
            ["TS 38.523-3", "The executable TTCN-3 abstract test suite"],
          ],
        },
      },
      {
        heading: "Clause map",
        code: {
          lang: "text",
          body: `4    Idle mode operations (cell selection, reselection, PLMN)
5    Layer 2 (MAC, RLC, PDCP, SDAP)
6    RRC (connection control, reconfiguration, measurement)
7    NAS / 5GMM and 5GSM (registration, sessions, security)
8    IMS / VoNR
9    NSA / EN-DC and multi-RAT
10   Positioning, MBS, and later-release features`,
        },
      },
      {
        heading: "Reading a test case ID",
        code: {
          lang: "text",
          body: `TC_6_1_1_1
 |   | | | +-- variant / sub-case
 |   | | +---- test purpose index
 |   | +------ sub-clause
 |   +-------- clause (6 = RRC)
 +------------ test case`,
        },
        paragraphs: [
          "The ID is a clause path, not an arbitrary number. This is why a failure report citing TC_6_1_1_1 and clause 24.501:5.5.1.2.4 is immediately actionable: one names the test, the other names the requirement.",
        ],
      },
      {
        heading: "Typical applicable counts",
        table: {
          columns: ["Device class", "Applicable NR cases (Rel-18)"],
          rows: [
            ["NR SA only, single band, no IMS", "~380"],
            ["NR SA + VoNR, single band", "~520"],
            ["NR SA + NSA, multi-band", "~647"],
            ["Full feature set incl. CA and slicing", "1,100+"],
          ],
        },
        note: "Derive your own number rather than trusting these: aeon cases applicable --pics ./pics.yaml --count",
      },
      {
        heading: "Running the whole applicable set",
        code: {
          lang: "bash",
          body: `aeon cases applicable --pics ./pics.yaml --release 18 --json > applicable.json
aeon exec run --cases-from applicable.json --build rc3 --lanes 12 --wait
aeon coverage show --build rc3 --release 18`,
        },
        paragraphs: [
          "On a physical tester this is a multi-week booking. On lane fan-out it is an overnight job, which is the practical reason cloud execution changes how often teams run the full set: from once per release to every night.",
        ],
      },
    ],
  },
  {
    slug: "tc-6-1-1-1",
    title: "Understanding TC_6_1_1_1",
    description:
      "Line-by-line walkthrough of test case TC_6_1_1_1 — purpose, preamble, expected message sequence, verdict criteria, and the three ways it commonly fails.",
    group: "Reference",
    keywords: ["tc_6_1_1_1", "3gpp test case walkthrough", "rrc connection establishment test"],
    readMinutes: 8,
    blocks: [
      {
        paragraphs: [
          "TC_6_1_1_1 is the case everyone runs first: RRC connection establishment followed by initial registration. It is a good teaching case because it exercises PHY, MAC, RLC, PDCP, RRC, and NAS in one 15-second window.",
        ],
      },
      {
        heading: "Test purpose",
        paragraphs: [
          "Verify that the UE, on receiving a valid RRCSetup in response to an RRCSetupRequest with establishmentCause set for mobile-originated signalling, transmits a correctly formed RRCSetupComplete carrying an initial Registration Request, and completes registration.",
        ],
      },
      {
        heading: "Preamble",
        bullets: [
          "Cell configured per the reference conditions for the band under test.",
          "UE in state 1 (switched off), USIM inserted with test credentials.",
          "Security context absent; no valid 5G-GUTI stored.",
        ],
      },
      {
        heading: "Expected sequence",
        code: {
          lang: "text",
          body: `1  UE   -> SS : PRACH preamble
2  SS   -> UE : Random Access Response
3  UE   -> SS : RRCSetupRequest (establishmentCause=mo-Signalling)
4  SS   -> UE : RRCSetup
5  UE   -> SS : RRCSetupComplete { Registration Request (initial) }
6  SS   -> UE : Authentication Request
7  UE   -> SS : Authentication Response
8  SS   -> UE : Security Mode Command
9  UE   -> SS : Security Mode Complete
10 SS   -> UE : Registration Accept (5G-GUTI assigned)
11 UE   -> SS : Registration Complete
   verdict: pass`,
        },
      },
      {
        heading: "The three common failures",
        table: {
          columns: ["Stops at", "Verdict", "Real cause"],
          rows: [
            ["step 2", "inconc", "PRACH power — rf.tx_gain too low"],
            ["step 5", "fail", "Malformed RRCSetupComplete or wrong establishmentCause"],
            ["step 9", "fail", "K_AMF derivation / capability replay mismatch"],
          ],
        },
      },
      {
        heading: "Run it now",
        code: { lang: "bash", body: `aeon exec run --case TC_6_1_1_1 --build rc3 --follow` },
        note: "This case takes about 14 seconds on a healthy lane. If it takes 45, you have a timer expiry and a retry, not a slow lane.",
      },
    ],
  },
  {
    slug: "limesdr-vs-b210",
    title: "LimeSDR vs USRP B210 for 5G testing",
    description:
      "Practical comparison of LimeSDR and Ettus USRP B210 for 5G NR and LTE UE testing: bandwidth, clocking, MIMO, throughput, and which conformance suites each suits.",
    group: "Reference",
    keywords: ["limesdr 5g", "b210 5g ue", "limesdr vs usrp b210"],
    readMinutes: 8,
    blocks: [
      {
        paragraphs: [
          "Both boards appear in AEON lanes and both run the same TTCN-3 suites, but they are not equivalent. Pick per campaign rather than per preference.",
        ],
      },
      {
        table: {
          columns: ["", "LimeSDR USB", "Ettus USRP B210"],
          rows: [
            ["Frequency range", "100 kHz - 3.8 GHz", "70 MHz - 6 GHz"],
            ["Instantaneous BW", "up to 61.44 MHz", "up to 56 MHz"],
            ["Channels", "2x2 MIMO", "2x2 MIMO"],
            ["ADC/DAC", "12-bit", "12-bit"],
            ["Host interface", "USB 3.0", "USB 3.0"],
            ["Clock", "internal, optional ext ref", "internal, GPSDO option"],
            ["Driver", "LimeSuite / SoapySDR", "UHD"],
            ["n78 (3.5 GHz)", "yes, near band edge", "yes, comfortable"],
          ],
        },
      },
      {
        heading: "Which to choose",
        bullets: [
          "Sub-3 GHz LTE and NR protocol conformance: LimeSDR is plentiful and cheaper per lane.",
          "n78 / n77 mid-band work: prefer B210 — more headroom above 3.5 GHz.",
          "Timing-sensitive RRM and handover cases: B210 with GPSDO.",
          "Long soak and regression runs: whichever has the larger free pool; verdicts are equivalent.",
        ],
      },
      {
        heading: "Select explicitly",
        code: {
          lang: "bash",
          body: `aeon lanes list --sdr lime --available
aeon lanes reserve --sdr b210 --gpsdo --region eu-west-1
aeon exec run --campaign rrm --sdr b210 --build rc3`,
        },
      },
      {
        heading: "The point about cost",
        paragraphs: [
          "Both boards cost a few hundred to low thousands of dollars. A conventional protocol tester costs six figures plus annual maintenance. The engineering value of a cloud lane is not that the SDR is cheap — it is that you never buy, calibrate, or wait for one, and that ten engineers can run in parallel on a Tuesday afternoon.",
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "Documentation FAQ",
    description:
      "Frequently asked questions about AEON Cloud: report validity, data residency, open-source components, concurrency, offline use, and formal certification.",
    group: "Reference",
    keywords: ["conformance testing faq", "cloud tester faq"],
    readMinutes: 6,
    blocks: [
      {
        heading: "Are AEON reports accepted for formal certification?",
        paragraphs: [
          "AEON executes the 3GPP-published abstract test suites and produces signed evidence, which makes it suitable for pre-certification and internal release gating. Formal certification (GCF/PTCRB) is granted by accredited labs; teams typically use AEON to arrive at a lab with a clean run rather than to replace the lab.",
        ],
      },
      {
        heading: "Where does my build and log data live?",
        paragraphs: [
          "In the region you pin. Reservations and executions accept a --region flag, artifacts never leave that region, and reports record the region they ran in. Retention is configurable from 30 to 365 days.",
        ],
      },
      {
        heading: "Which parts are open source?",
        table: {
          columns: ["Open source", "Proprietary"],
          rows: [
            ["CLI", "TTCN-3 engine"],
            ["Python and TypeScript SDKs", "Cloud scheduler"],
            ["srsRAN integration and UE launcher", "AI Telecom Copilot"],
            ["Example projects and CI templates", "Multi-tenant lab fabric, billing, reports"],
          ],
        },
      },
      {
        heading: "How many executions can I run at once?",
        paragraphs: [
          "Concurrency is a plan quota expressed in lanes, not a hardware booking. A team on 12 lanes can run twelve campaigns simultaneously, and the scheduler queues anything beyond quota rather than failing it.",
        ],
      },
      {
        heading: "Can I use it without internet access?",
        paragraphs: [
          "No. The platform is the tester; there is no on-premise appliance. For air-gapped programmes the practical pattern is a shipped device kept in a shielded lane plus a private link into the region.",
        ],
      },
      {
        heading: "What does a trial include?",
        paragraphs: [
          "A workspace, one lane, and enough execution minutes to run the smoke campaign end to end against an open-source UE. That is deliberately the same path the quickstart describes, so the trial answers the only question that matters: does my build pass?",
        ],
      },
    ],
  },
];
