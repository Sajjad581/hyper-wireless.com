import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Play,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Clock,
  Terminal,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Copy,
  Check,
  FileText,
  Radio,
  Cpu,
  Activity,
  Layers,
  Filter,
  Code2,
  Download,
  ListOrdered,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/aeon-test")({
  head: () => ({
    meta: [
      { title: "Aeon Test — 3GPP UE Certification & TTCN-3" },
      {
        name: "description",
        content:
          "Cloud-based 3GPP UE certification platform with live TTCN-3 test execution, module parameters, and applicability matrix.",
      },
    ],
  }),
  component: AeonTestPage,
});

type TabView = "output" | "msc" | "campaign" | "info";
type FilterType = "all" | "supported" | "unsupported";

const initialTestcases = [
  {
    id: "TC_6_1_1_1_NR5GC",
    status: "YES" as const,
    description: "PLMN selection of RPLMN, HPLMN/EHPLMN, UPL...",
    steps: 36,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 6",
  },
  {
    id: "TC_6_1_1_2_NR5GC",
    status: "YES" as const,
    description: 'PLMN selection of "Other PLMN/access technolog...',
    steps: 42,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 6",
  },
  {
    id: "TC_6_1_1_3_NR5GC",
    status: "YES" as const,
    description: "Cell reselection of ePLMN in manual mode",
    steps: 5,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 6",
  },
  {
    id: "TC_6_1_1_4_NR5GC",
    status: "YES" as const,
    description: "PLMN selection in shared network environment / A...",
    steps: 30,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 6",
  },
  {
    id: "TC_6_1_1_4a_NR5GC",
    status: "YES" as const,
    description: "PLMN selection in shared network environment / A...",
    steps: 0,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 6",
  },
  {
    id: "TC_6_1_1_5_NR5GC",
    status: "NO" as const,
    description: "PLMN selection of RPLMN, HPLMN/EHPLMN, UPL...",
    steps: 27,
    condition: "NR_C36",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: "pc_UserInitiatedPLMN_Reselection",
    series: "Series 6",
  },
  {
    id: "TC_7_1_1_1_NR5GC",
    status: "YES" as const,
    description: "PDU Session Establishment in SA NR / Initial attach",
    steps: 48,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 7",
  },
  {
    id: "TC_7_1_1_2_NR5GC",
    status: "YES" as const,
    description: "PDU Session Release initiated by UE / Dedicated bearer",
    steps: 22,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 7",
  },
  {
    id: "TC_8_1_2_1_NR5GC",
    status: "YES" as const,
    description: "RRC Reconfiguration for DRB addition / SRB2 establishment",
    steps: 54,
    condition: "NR_C21",
    expressionPrimary: "pc_5GCN",
    expressionSecondary: null,
    series: "Series 8",
  },
];

const testSeriesList = [
  { label: "Series 6", count: 6 },
  { label: "Series 7", count: 2 },
  { label: "Series 8", count: 1 },
  { label: "Series 9", count: 18 },
  { label: "Series 10", count: 42 },
  { label: "Series 11", count: 64 },
  { label: "Series 12", count: 91 },
  { label: "Series 13", count: 114 },
  { label: "Series 14", count: 309 },
];

const sampleModuleParamsJson = {
  Parameters: {
    pc_APN_Default_Configuration: 2,
    pc_APN_TD_C2: "c2",
    pc_APN_ID_Ethernet: "ethernet",
    pc_APN_TD_IMS: "ims",
    pc_APN_ID_Internet: "internet",
    pc_APN_TD_MCX: "mcx",
    pc_APN_ID_MIOT: "miot",
    pc_APN_ID_URLLC: "urllc",
    pc_APN_ID_USS: "uss",
    pc_APN_ID_V2X: "v2x",
    px_AccessPointName: null,
    px_AquireGNSS_MaxTime: 60,
    px_AttachTypeTested: null,
  },
};

function AeonTestPage() {
  const [activeTab, setActiveTab] = useState<TabView>("info");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const [isSuiteExpanded, setIsSuiteExpanded] = useState(true);
  const [isIssueVisible, setIsIssueVisible] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [configText, setConfigText] = useState(
    JSON.stringify(sampleModuleParamsJson, null, 2)
  );

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("UE Launcher status refreshed: Port 43210 active");
    }, 600);
  };

  const handleRunAll = () => {
    toast.success("Executing 647 test cases on Active Port 43210...", {
      description: "UE Launcher (SDR USRP B210) initialized on RF channel 1.",
    });
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(configText);
    setCopiedJson(true);
    toast.success("Module parameters JSON copied to clipboard");
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleSaveConfig = () => {
    try {
      JSON.parse(configText);
      setIsEditingConfig(false);
      toast.success("Module parameters config updated successfully");
    } catch (e) {
      toast.error("Invalid JSON format — please check syntax");
    }
  };

  const filteredTestcases = useMemo(() => {
    return initialTestcases.filter((tc) => {
      const matchesSearch =
        !searchQuery.trim() ||
        tc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tc.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeries =
        !selectedSeries || tc.series === selectedSeries;

      const matchesFilter =
        filterType === "all" ||
        (filterType === "supported" && tc.status === "YES") ||
        (filterType === "unsupported" && tc.status === "NO");

      return matchesSearch && matchesSeries && matchesFilter;
    });
  }, [searchQuery, selectedSeries, filterType]);

  return (
    <div className="-mx-6 -my-6 flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0a0f1d] text-foreground">
      {/* Left Panel - Sub-Sidebar */}
      <aside className="flex w-72 shrink-0 flex-col justify-between border-r border-border/60 bg-[#0d1426]/90 p-4">
        <div className="flex-1 overflow-y-auto pr-1">
          {/* UE Launcher Status */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                UE Launcher Status
              </span>
              <button
                type="button"
                onClick={handleRefreshStatus}
                aria-label="Refresh status"
                className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <RefreshCw
                  className={cn("size-3.5", isRefreshing && "animate-spin")}
                />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 font-mono text-xs font-medium text-emerald-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Active (Port 43210)
            </div>
          </div>

          {/* Test Cases Header & Search */}
          <div className="mt-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Test Cases
            </span>
            <div className="relative mt-2.5">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-8.5 rounded-lg border-border/70 bg-background/60 pl-8 text-xs placeholder:text-muted-foreground/70"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Run All Button */}
            <Button
              onClick={handleRunAll}
              className="mt-3 h-9 w-full gap-2 rounded-lg bg-blue-600 font-semibold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/35"
            >
              <Play className="size-3.5 fill-current" />
              <span>Run All (647)</span>
            </Button>

            {/* Test Suite Accordion */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsSuiteExpanded(!isSuiteExpanded)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/10"
              >
                <div className="flex items-center gap-1.5">
                  {isSuiteExpanded ? (
                    <ChevronDown className="size-3.5" />
                  ) : (
                    <ChevronRight className="size-3.5" />
                  )}
                  <span>IWD_25wk50</span>
                </div>
                <Badge
                  variant="outline"
                  className="border-blue-500/30 bg-blue-500/10 font-mono text-[10px] text-blue-300"
                >
                  647
                </Badge>
              </button>

              {isSuiteExpanded && (
                <div className="mt-1 space-y-0.5 pl-4 font-mono text-xs">
                  {testSeriesList.map((item) => {
                    const isSelected = selectedSeries === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() =>
                          setSelectedSeries(isSelected ? null : item.label)
                        }
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors",
                          isSelected
                            ? "bg-primary/15 font-medium text-primary"
                            : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className="size-3 opacity-60" />
                          <span>{item.label}</span>
                        </div>
                        <span className="text-[10px] opacity-60">
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Runs & Server Logs */}
          <div className="mt-6 space-y-4 border-t border-border/40 pt-4">
            <button
              type="button"
              onClick={() => toast.info("No recent execution history found")}
              className="flex w-full items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <Clock className="size-3.5" />
              <span>Recent Runs</span>
            </button>

            <div>
              <div className="flex items-center justify-between px-2">
                <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="size-3.5" />
                  <span>Server Logs</span>
                </span>
                <button
                  type="button"
                  onClick={() => toast.info("Log directory scanned: 0 files")}
                  className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>
              <p className="mt-1 pl-2 text-[11px] italic text-muted-foreground/70">
                No logs found in logs/ dir
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Alert Pill */}
        {isIssueVisible && (
          <div className="mt-4 border-t border-border/40 pt-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 shadow-sm">
              <span className="flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                N
              </span>
              <span>1 Issue</span>
              <button
                type="button"
                onClick={() => setIsIssueVisible(false)}
                className="ml-1 rounded-full p-0.5 hover:bg-red-500/20"
                aria-label="Dismiss issue alert"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Right Content Panel */}
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-[#080d1a] p-6">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground">
              Select a test case to run or view history
            </h1>
            {selectedSeries && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Filtered by <span className="font-mono text-primary">{selectedSeries}</span>
                {" · "}
                <button
                  type="button"
                  onClick={() => setSelectedSeries(null)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Clear filter
                </button>
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={activeTab === "output" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("output")}
              className="gap-1.5 border-border/70 bg-card/60 text-xs hover:bg-secondary"
            >
              <Terminal className="size-3.5" />
              <span>Output</span>
            </Button>
            <Button
              variant={activeTab === "msc" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("msc")}
              className="gap-1.5 border-border/70 bg-card/60 text-xs hover:bg-secondary"
            >
              <Activity className="size-3.5" />
              <span>MSC Sequence</span>
            </Button>
            <Button
              variant={activeTab === "campaign" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveTab("campaign")}
              className="gap-1.5 border-border/70 bg-card/60 text-xs hover:bg-secondary"
            >
              <Layers className="size-3.5" />
              <span>Campaign Manager</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setActiveTab("info")}
              className={cn(
                "gap-1.5 text-xs font-semibold shadow-sm transition-all",
                activeTab === "info"
                  ? "bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-500"
                  : "border border-border/70 bg-card/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Info className="size-3.5" />
              <span>Info &amp; Params</span>
            </Button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="mt-6 flex-1 space-y-6">
          {activeTab === "info" && (
            <>
              {/* Module Parameters Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold tracking-tight text-foreground">
                      Module Parameters
                    </h2>
                    <Badge
                      variant="outline"
                      className="border-border/60 bg-secondary/80 font-mono text-xs text-muted-foreground"
                    >
                      NR5GC_modulepars.json
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyJson}
                      className="h-8 gap-1.5 border-border/70 bg-card/60 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {copiedJson ? (
                        <Check className="size-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                      <span>{copiedJson ? "Copied" : "Copy"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingConfig(!isEditingConfig)}
                      className={cn(
                        "h-8 gap-1.5 text-xs font-medium",
                        isEditingConfig
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                      )}
                    >
                      <Settings2 className="size-3.5" />
                      <span>{isEditingConfig ? "Close Editor" : "Edit Config"}</span>
                    </Button>
                  </div>
                </div>

                {isEditingConfig ? (
                  <div className="rounded-xl border border-blue-500/40 bg-[#060a12] p-4 shadow-xl">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Editing JSON configuration</span>
                      <Button
                        size="sm"
                        onClick={handleSaveConfig}
                        className="h-7 bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-500"
                      >
                        Save changes
                      </Button>
                    </div>
                    <textarea
                      value={configText}
                      onChange={(e) => setConfigText(e.target.value)}
                      rows={14}
                      className="w-full rounded-lg border border-border/60 bg-[#03060c] p-3 font-mono text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border/70 bg-[#050914] p-5 font-mono text-xs leading-relaxed shadow-lg">
                    <pre className="text-slate-300">
                      <code>
                        <span className="text-slate-400">{`{\n  "Parameters": {\n`}</span>
                        <span className="text-amber-300">
                          {`    "pc_APN_Default_Configuration"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-purple-400">2</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_TD_C2"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"c2"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_ID_Ethernet"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"ethernet"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_TD_IMS"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"ims"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_ID_Internet"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"internet"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_TD_MCX"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"mcx"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_ID_MIOT"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"miot"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_ID_URLLC"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"urllc"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_ID_USS"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"uss"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "pc_APN_ID_V2X"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-emerald-400">{`"v2x"`}</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "px_AccessPointName"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-rose-400">null</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "px_AquireGNSS_MaxTime"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-purple-400">60</span>
                        <span className="text-slate-400">{`,\n`}</span>

                        <span className="text-amber-300">
                          {`    "px_AttachTypeTested"`}
                        </span>
                        <span className="text-slate-400">: </span>
                        <span className="text-rose-400">null</span>
                        <span className="text-slate-400">{`\n  }\n}`}</span>
                      </code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Testcases & Applicability Section */}
              <div className="space-y-3 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-base font-bold tracking-tight text-foreground">
                      Testcases &amp; Applicability
                    </h2>
                    <Badge className="rounded-full border border-blue-500/30 bg-blue-600/20 px-2.5 py-0.5 font-semibold text-blue-400">
                      647 Total
                    </Badge>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 rounded-lg border border-border/70 bg-card/70 p-1">
                    <button
                      type="button"
                      onClick={() => setFilterType("all")}
                      className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium transition-all",
                        filterType === "all"
                          ? "bg-secondary text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("supported")}
                      className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium transition-all",
                        filterType === "supported"
                          ? "bg-secondary text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Supported
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterType("unsupported")}
                      className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium transition-all",
                        filterType === "unsupported"
                          ? "bg-secondary text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Unsupported
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-hidden rounded-xl border border-border/70 bg-[#060a13]/90 shadow-md">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/60 bg-secondary/40 font-semibold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Testcase ID</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Steps</th>
                        <th className="px-4 py-3">Condition</th>
                        <th className="px-4 py-3">Expression</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredTestcases.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-muted-foreground"
                          >
                            No test cases matching the selected filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredTestcases.map((tc) => (
                          <tr
                            key={tc.id}
                            className="transition-colors hover:bg-secondary/30"
                          >
                            <td className="px-4 py-3.5">
                              {tc.status === "YES" ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-400">
                                  <CheckCircle2 className="size-3" />
                                  <span>YES</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-red-400">
                                  <XCircle className="size-3" />
                                  <span>NO</span>
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 font-mono font-medium text-foreground">
                              {tc.id}
                            </td>
                            <td className="px-4 py-3.5 text-muted-foreground">
                              {tc.description}
                            </td>
                            <td className="px-4 py-3.5 font-mono text-muted-foreground">
                              {tc.steps}
                            </td>
                            <td className="px-4 py-3.5">
                              <a
                                href={`#condition-${tc.condition}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  toast.info(`Condition: ${tc.condition} — TS 38.523 Clause 6`);
                                }}
                                className="font-mono font-medium text-blue-400 hover:underline"
                              >
                                {tc.condition}
                              </a>
                            </td>
                            <td className="px-4 py-3.5 font-mono text-xs">
                              {tc.expressionSecondary ? (
                                <span>
                                  <span className="text-emerald-400">
                                    {tc.expressionPrimary}
                                  </span>{" "}
                                  <span className="text-muted-foreground">and</span>{" "}
                                  <span className="text-red-400">
                                    {tc.expressionSecondary}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-emerald-400">
                                  {tc.expressionPrimary}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "output" && (
            <div className="rounded-xl border border-border/70 bg-[#060a12] p-5 shadow-lg">
              <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="size-4 text-primary" />
                  <span className="text-sm font-semibold">
                    Live TTCN-3 Execution Console
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/40 text-emerald-400"
                >
                  Port 43210 Active
                </Badge>
              </div>
              <div className="space-y-1.5 font-mono text-xs leading-relaxed text-slate-300">
                <p className="text-muted-foreground">
                  [14:20:01.042] Aeon Test Launcher: starting campaign IWD_25wk50 (647 TCs)
                </p>
                <p className="text-emerald-400">
                  [14:20:02.118] CONNECTED: USRP B210 SDR RF frontend active (3.5 GHz NR band n78)
                </p>
                <p className="text-blue-400">
                  [14:20:03.491] TC_6_1_1_1_NR5GC: sending RRCSetupRequest (UE identity: 5G-GUTI)
                </p>
                <p className="text-slate-300">
                  [14:20:04.220] TC_6_1_1_1_NR5GC: received RRCSetup, configuring SRB1
                </p>
                <p className="text-emerald-400">
                  [14:20:05.109] TC_6_1_1_1_NR5GC: RegistrationAccept received — VERDICT: PASS (36 steps)
                </p>
                <p className="text-muted-foreground">
                  [14:20:06.012] -- Waiting for next testcase execution in queue --
                </p>
              </div>
            </div>
          )}

          {activeTab === "msc" && (
            <div className="rounded-xl border border-border/70 bg-[#060a12] p-6 shadow-lg">
              <h3 className="text-sm font-semibold text-foreground">
                3GPP Message Sequence Chart (MSC) — TC_6_1_1_1_NR5GC
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Interactive protocol sequence for PLMN selection &amp; initial registration
              </p>
              <div className="mt-6 flex flex-col gap-3 font-mono text-xs">
                {[
                  { from: "UE", to: "gNB", msg: "RRCSetupRequest (EstablishmentCause: mo-Signalling)", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
                  { from: "gNB", to: "UE", msg: "RRCSetup (SRB1 configuration)", color: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
                  { from: "UE", to: "gNB", msg: "RRCSetupComplete (NAS RegistrationRequest)", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
                  { from: "AMF", to: "UE", msg: "AuthenticationRequest (5G-AKA challenge)", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
                  { from: "UE", to: "AMF", msg: "AuthenticationResponse (RES*)", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
                  { from: "AMF", to: "UE", msg: "RegistrationAccept (5G-GUTI allocated)", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
                ].map((seq, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3",
                      seq.color
                    )}
                  >
                    <span className="font-semibold">{seq.from} → {seq.to}</span>
                    <span>{seq.msg}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      Step {idx + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "campaign" && (
            <div className="rounded-xl border border-border/70 bg-[#060a12] p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Campaign Automation &amp; SDR Allocation
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Manage continuous 5G NR test suites across physical lab hardware
                  </p>
                </div>
                <Button size="sm" onClick={handleRunAll} className="gap-1.5 bg-blue-600 font-semibold text-white hover:bg-blue-500">
                  <Play className="size-3.5" />
                  <span>Start Campaign</span>
                </Button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-card/60 p-4">
                  <span className="text-xs font-semibold text-primary">Active Campaign</span>
                  <h4 className="mt-1 text-sm font-bold">IWD_25wk50 — 5G NR Standalone</h4>
                  <p className="mt-1 text-xs text-muted-foreground">647 total testcases · Nightly Regression</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-4">
                  <span className="text-xs font-semibold text-emerald-400">Allocated Hardware</span>
                  <h4 className="mt-1 text-sm font-bold">USRP B210 #01 (Port 43210)</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Frankfurt Lab DC1 · TTCN-3 Release 17</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
