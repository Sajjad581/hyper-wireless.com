import type { DocPage } from "./types";

export const openSourcePages: DocPage[] = [
  {
    slug: "install-srsran",
    title: "Install srsRAN UE",
    description:
      "Build and install srsRAN Project / srsRAN 4G on Ubuntu and Debian, including dependencies, UHD and LimeSuite drivers, and a working srsUE binary.",
    group: "Open source UE",
    keywords: ["install srsran ue", "srsran ubuntu build", "srsue install"],
    readMinutes: 8,
    blocks: [
      {
        paragraphs: [
          "srsRAN is the most widely used open-source cellular stack, and srsUE is the easiest legitimate UE to certify against a real TTCN-3 suite. This page gets you a working srsUE on Ubuntu 22.04 or 24.04.",
          "You do not need SDR hardware to follow along. If you plan to run against an AEON lane, the radio is remote — install the drivers anyway so the same binary works on your bench.",
        ],
      },
      {
        heading: "Dependencies",
        code: {
          lang: "bash",
          body: `sudo apt update
sudo apt install -y \\
  build-essential cmake git pkg-config \\
  libfftw3-dev libmbedtls-dev libboost-program-options-dev \\
  libconfig++-dev libsctp-dev libzmq3-dev \\
  libuhd-dev uhd-host limesuite limesuite-udev`,
        },
      },
      {
        heading: "Fetch UHD firmware (Ettus B210)",
        code: { lang: "bash", body: `sudo uhd_images_downloader\nuhd_find_devices` },
      },
      {
        heading: "Build srsRAN 4G (contains srsUE)",
        code: {
          lang: "bash",
          body: `git clone https://github.com/srsRAN/srsRAN_4G.git
cd srsRAN_4G
mkdir build && cd build
cmake ../ -DCMAKE_BUILD_TYPE=Release
make -j"$(nproc)"
sudo make install
sudo srsran_install_configs.sh user

srsue --help | head -20`,
        },
        note: "srsRAN 4G ships srsUE (LTE + NSA). For 5G SA gNB work use srsRAN Project; the UE side for SA conformance is typically srsUE with the 5G NR PHY enabled or a vendor stack.",
      },
      {
        heading: "Verify the build",
        code: {
          lang: "bash",
          body: `srsue --version
ldd "$(which srsue)" | grep -E 'uhd|Lime' || echo "no radio driver linked (ZMQ-only build)"`,
        },
      },
      {
        heading: "Common install failures",
        table: {
          columns: ["Symptom", "Cause / fix"],
          rows: [
            ["Could NOT find MBEDTLS", "Install libmbedtls-dev; on older distros build mbedTLS 2.x from source."],
            ["No UHD device found", "Run sudo uhd_images_downloader, then re-plug the B210 on a USB 3.0 port."],
            ["LimeSDR not detected", "Install limesuite-udev and reload rules: sudo udevadm control --reload-rules."],
            ["make hits OOM", "Reduce parallelism: make -j2."],
          ],
        },
      },
    ],
  },
  {
    slug: "build-srsue",
    title: "Build srsUE for conformance testing",
    description:
      "Configure a conformance-ready srsUE build: RF vs ZMQ, log verbosity, PCAP capture, USIM parameters, and the flags a TTCN-3 campaign expects.",
    group: "Open source UE",
    keywords: ["build srsue", "srsue conformance", "srsue config"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "A default srsUE build works for demos but hides most of what a TTCN-3 campaign needs. Conformance runs want maximum log detail, MAC/NAS PCAP capture, and a deterministic USIM.",
        ],
      },
      {
        heading: "Build flags",
        code: {
          lang: "bash",
          body: `cmake ../ \\
  -DCMAKE_BUILD_TYPE=RelWithDebInfo \\
  -DENABLE_UHD=ON \\
  -DENABLE_SOAPYSDR=ON \\
  -DENABLE_ZEROMQ=ON \\
  -DENABLE_SRSUE=ON \\
  -DENABLE_ASAN=OFF`,
        },
      },
      {
        heading: "Conformance-oriented ue.conf",
        code: {
          lang: "ini",
          label: "ue.conf",
          body: `[rf]
device_name = uhd
device_args = type=b200,master_clock_rate=23.04e6
tx_gain = 70
rx_gain = 40

[usim]
mode = soft
algo = milenage
opc  = 63BFA50EE6523365FF14C1F45F88737D
k    = 00112233445566778899aabbccddeeff
imsi = 001010123456789
imei = 353490069873319

[log]
all_level = debug
phy_lib_level = info
all_hex_limit = 32
filename = /tmp/ue.log

[pcap]
enable      = mac,mac_nr,nas
mac_filename    = /tmp/ue_mac.pcap
mac_nr_filename = /tmp/ue_mac_nr.pcap
nas_filename    = /tmp/ue_nas.pcap`,
        },
      },
      {
        heading: "Package it as an AEON build",
        code: {
          lang: "bash",
          body: `tar czf srsue-bundle.tar.gz \\
  -C build/srsue/src srsue \\
  -C ../../.. ue.conf

aeon builds push ./srsue-bundle.tar.gz --tag srsue-main --entrypoint srsue --config ue.conf`,
        },
        note: "Set all_level = debug. The Copilot's failure explanations are only as good as the log detail it receives.",
      },
    ],
  },
  {
    slug: "connect-srsue-to-aeon-cloud",
    title: "Connect srsUE to AEON Cloud",
    description:
      "Run an open-source srsUE against a remote SDR lane on AEON Cloud — build push, lane reservation, cell parameters, and a first registration attach.",
    group: "Open source UE",
    keywords: ["srsran ue testing", "connect srsue to cloud", "remote 5g ue test lab"],
    readMinutes: 8,
    blocks: [
      {
        paragraphs: [
          "This is the core open-source workflow: a stock srsUE, no tester in your building, a real TTCN-3 suite on the other side of an SDR lane.",
        ],
      },
      {
        heading: "1. Reserve a lane",
        code: {
          lang: "bash",
          body: `aeon lanes list --sdr lime --available
aeon lanes reserve --region eu-west-1 --sdr lime --duration 2h`,
        },
      },
      {
        heading: "2. Declare cell parameters",
        paragraphs: [
          "The lane runs the network side. Your srsUE must be told what to look for — band, SSB position, PLMN — and those values must match the campaign's PIXIT.",
        ],
        code: {
          lang: "yaml",
          label: "aeon.yaml",
          body: `lane:
  band: n78
  dl_arfcn: 632628
  ssb_arfcn: 633000
  scs: 30
  bandwidth: 20
  plmn: "00101"
ue:
  build: srsue-main
  entrypoint: srsue
  config: ue.conf`,
        },
      },
      {
        heading: "3. Attach and verify",
        code: {
          lang: "bash",
          body: `aeon exec run --suite NR_5GS_Registration --case TC_6_1_1_1 --follow

# or a bare attach smoke test, no TTCN-3
aeon exec attach --lane eu-west-1/lime-03 --build srsue-main --follow`,
        },
      },
      {
        heading: "4. What success looks like",
        code: {
          lang: "text",
          label: "log",
          body: `[PHY] cell found: pci=1 rsrp=-72.4 dBm
[RRC] RRCSetupRequest -> RRCSetup -> RRCSetupComplete
[NAS] Registration Request (initial) sent
[NAS] Authentication Request -> Authentication Response
[NAS] Security Mode Command -> Security Mode Complete
[NAS] Registration Accept, 5G-GUTI assigned
[RRC] state: RRC_CONNECTED
verdict: PASS`,
        },
      },
      {
        heading: "Why this matters",
        paragraphs: [
          "Running a real conformance suite against an open-source UE used to require a six-figure tester and a lab. The tester is now a service you reach over HTTPS, which means an individual engineer, a university lab, or a two-person modem team can execute the same suites a tier-1 OEM does.",
        ],
      },
    ],
  },
  {
    slug: "remote-ue-tunnel",
    title: "Remote UE tunnel",
    description:
      "Drive a UE on your own bench from a remote AEON lane using the tunnel agent — setup, NAT traversal, latency budget, and security model.",
    group: "Open source UE",
    keywords: ["remote ue tunnel", "remote 5g test lab", "device under test over ip"],
    readMinutes: 6,
    blocks: [
      {
        paragraphs: [
          "The tunnel exists for UEs you cannot upload: a proprietary modem, a dev board, a device with a JTAG harness. The control plane crosses the internet; RF stays local to whichever side owns the radio.",
        ],
      },
      {
        heading: "Start the agent",
        code: {
          lang: "bash",
          body: `aeon agent install --token "$AEON_TOKEN"
sudo systemctl enable --now aeon-agent

aeon tunnel up --lane eu-west-1/lime-03 --local-ue 192.168.10.24:9000
aeon tunnel status --watch`,
        },
      },
      {
        heading: "Network requirements",
        bullets: [
          "Outbound TCP 443 only — no inbound ports, no firewall exceptions.",
          "Round-trip latency under 80 ms for protocol conformance suites.",
          "Under 25 ms for timing-sensitive RRM cases; otherwise use a hosted or shipped model.",
          "mTLS between agent and lane; the agent never accepts inbound connections.",
        ],
      },
      {
        heading: "Latency and determinism",
        paragraphs: [
          "TTCN-3 timers are specified in 3GPP with real margins, but a jittery tunnel can still turn a PASS into an inconclusive verdict. The platform measures RTT continuously and marks any execution whose jitter exceeded the suite's budget, so you never ship a report built on a noisy link.",
        ],
      },
    ],
  },
  {
    slug: "open-source-ue-options",
    title: "Open-source UE options compared",
    description:
      "srsUE, OpenAirInterface UE, and Amarisoft UE compared for 3GPP conformance work: feature coverage, release support, log quality, and effort to certify.",
    group: "Open source UE",
    keywords: ["open source ue", "srsue vs oai ue", "open source 5g ue stack"],
    readMinutes: 7,
    blocks: [
      {
        paragraphs: [
          "Three stacks dominate open and semi-open UE work. They are not interchangeable, and the right choice depends on which release and which procedure classes you need.",
        ],
      },
      {
        table: {
          columns: ["Stack", "License", "Strength", "Watch out for"],
          rows: [
            ["srsUE (srsRAN)", "AGPLv3", "Clean code, excellent logs and PCAP, easy build", "5G SA UE coverage trails the gNB side"],
            ["OpenAirInterface UE", "OAI Public License", "Broadest NR feature set, strong research community", "Heavier build, config surface is large"],
            ["Amarisoft UE", "Commercial", "Most complete release coverage, vendor support", "Licensed per instance, not open source"],
          ],
        },
      },
      {
        heading: "Recommendation by goal",
        bullets: [
          "Learning TTCN-3 and conformance flows: srsUE.",
          "NR feature research (RedCap, NTN, carrier aggregation): OAI UE.",
          "Pre-certification dry runs before a formal lab: Amarisoft or your own stack.",
        ],
      },
      {
        heading: "All three run the same way here",
        paragraphs: [
          "Whichever stack you pick, the platform contract is identical: a build artifact, a config, a lane, a suite. Swapping stacks is a one-line change to your build tag, which makes cross-stack comparison — the same test case against two UEs — a routine exercise rather than a project.",
        ],
        code: {
          lang: "bash",
          body: `for ue in srsue-main oai-ue-develop; do
  aeon exec run --case TC_6_1_1_1 --build "$ue" --wait --json >> compare.jsonl
done
jq -r '[.build, .verdict, .duration_s] | @tsv' compare.jsonl`,
        },
      },
    ],
  },
  {
    slug: "srsue-config-reference",
    title: "srsUE configuration reference for AEON",
    description:
      "Reference table of srsUE configuration keys that affect conformance results on AEON Cloud, with recommended values and the failure each one prevents.",
    group: "Open source UE",
    keywords: ["srsue config reference", "ue.conf 5g", "srsue rf gain"],
    readMinutes: 6,
    blocks: [
      {
        paragraphs: [
          "These are the keys that actually change verdicts. Everything else in ue.conf can usually stay at its default for conformance runs.",
        ],
      },
      {
        table: {
          columns: ["Key", "Recommended", "Prevents"],
          rows: [
            ["rf.device_args master_clock_rate", "23.04e6 (B210)", "Sample-rate mismatch, PSS never found"],
            ["rf.tx_gain", "70", "Network side fails to decode PRACH"],
            ["rf.rx_gain", "40", "Saturated receiver, corrupt SIB decode"],
            ["usim.algo", "milenage", "Authentication Failure (MAC failure)"],
            ["usim.opc / k", "match PIXIT", "Authentication Reject at step 4"],
            ["nas.apn", "internet", "PDU session establishment reject"],
            ["log.all_level", "debug", "Copilot cannot localise the failure"],
            ["pcap.enable", "mac,mac_nr,nas", "No frame-level evidence in the report"],
          ],
        },
      },
      {
        heading: "Validate before you burn lane time",
        code: {
          lang: "bash",
          body: `aeon config lint ./ue.conf --suite NR_5GS_Registration
# warns on gain, clock rate, and USIM values that contradict the campaign PIXIT`,
        },
        note: "Run the linter in CI. It catches the majority of first-attempt failures without consuming a lane reservation.",
      },
    ],
  },
];
