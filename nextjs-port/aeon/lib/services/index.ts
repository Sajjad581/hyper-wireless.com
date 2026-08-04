/**
 * Placeholder service hooks. These return mock data today but present the
 * exact shape backend APIs must satisfy so real HTTP/SDK calls can drop in
 * without refactoring page components.
 *
 * Each service is a plain async function returning typed data. Wrap with
 * useQuery in components when wiring to a real backend.
 */

export type ID = string;

export interface Project {
  id: ID;
  name: string;
  vendor: string;
  chipset: string;
  release: "R15" | "R16" | "R17" | "R18";
  branch: string;
  currentBuild: string;
  device: string;
  latestExecution: string;
  coverage: number;
  certification: "certified" | "in-progress" | "failing" | "draft";
}

export interface Build {
  id: ID;
  version: string;
  branch: string;
  commit: string;
  checksum: string;
  signed: boolean;
  releaseNotes: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  validation: "passed" | "failed" | "pending";
  deployment: "deployed" | "staged" | "archived";
}

export interface Testcase {
  id: ID;
  release: string;
  procedure: string;
  category: string;
  status: "stable" | "beta" | "deprecated";
  coverage: number;
}

export interface Execution {
  id: ID;
  project: string;
  campaign: string;
  tester: string;
  status: "queued" | "running" | "passed" | "failed" | "cancelled";
  verdict: string;
  startedAt: string;
  progress: number;
  eta?: string;
}

export interface Tester {
  id: ID;
  name: string;
  location: string;
  hardware: string;
  sdr: string;
  status: "idle" | "reserved" | "busy" | "offline";
  ue?: string;
  utilization: number;
}

export interface Report {
  id: ID;
  kind: "executive" | "execution" | "certification" | "coverage" | "regression";
  project: string;
  createdAt: string;
  signed: boolean;
  size: string;
}

// ---- Auth ----
export const authService = {
  async login(_email: string, _password: string) { return { userId: "u_1" }; },
  async register(_data: Record<string, string>) { return { userId: "u_1" }; },
  async me() { return { id: "u_1", name: "Alex Rivera", org: "Acme Semiconductor", role: "owner" as const }; },
  async logout() { /* clear session */ },
};

// ---- Projects ----
export const projectService = {
  async list(): Promise<Project[]> { return []; },
  async get(_id: ID): Promise<Project | null> { return null; },
  async create(_input: Omit<Project, "id">): Promise<Project> { throw new Error("not-implemented"); },
};

// ---- Builds ----
export const buildService = {
  async list(_projectId?: ID): Promise<Build[]> { return []; },
  async upload(_file: File): Promise<Build> { throw new Error("not-implemented"); },
  async rollback(_id: ID): Promise<void> {},
};

// ---- Jenkins ----
export const jenkinsService = {
  async listBuilds() { return [] as Array<{ id: string; commit: string; passRate: number }>; },
  async trigger(_projectId: ID, _branch: string) { return { jobId: "j_1" }; },
};

// ---- Test scheduler ----
export const testScheduler = {
  async listCatalog(): Promise<Testcase[]> { return []; },
  async submit(_input: { projectId: ID; campaignId: ID; testerId?: ID }): Promise<Execution> { throw new Error("not-implemented"); },
  async queue(): Promise<Execution[]> { return []; },
};

// ---- Lab manager ----
export const labService = {
  async listTesters(): Promise<Tester[]> { return []; },
  async reserve(_testerId: ID, _from: string, _to: string) { return { reservationId: "r_1" }; },
};

// ---- Reports ----
export const reportService = {
  async list(): Promise<Report[]> { return []; },
  async generate(_kind: Report["kind"], _projectId: ID): Promise<Report> { throw new Error("not-implemented"); },
  async export(_id: ID, _format: "pdf" | "xlsx" | "csv" | "json"): Promise<string> { return ""; },
};

// ---- AI Copilot ----
export const copilotService = {
  async ask(_prompt: string, _context?: { executionId?: ID }) {
    return { answer: "", citations: [] as Array<{ spec: string; clause: string }> };
  },
  async analyzeFailure(_executionId: ID) {
    return { rootCause: "", patch: "", similar: [] as ID[] };
  },
};

// ---- Billing ----
export const billingService = {
  async subscription() { return { plan: "startup", renewsAt: "2026-08-01" }; },
  async invoices() { return [] as Array<{ id: string; amount: number; issuedAt: string }>; },
  async usage() { return { executions: 842, executionLimit: 1500, testerHours: 96, storageGb: 42 }; },
};

// ---- AEON TTCN Engine (read-only telemetry) ----
export const engineService = {
  async status() { return { queueDepth: 0, activeSlots: 0, replayJobs: 0 }; },
  async campaigns() { return [] as Array<{ id: string; name: string; slots: number }>; },
};
