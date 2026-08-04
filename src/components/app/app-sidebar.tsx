import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  FlaskConical,
  Bot,
  BarChart3,
  BookOpen,
  Code2,
  CreditCard,
  Users,
  Settings,
  LifeBuoy,
  Cpu,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const primary = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/projects", label: "Projects", icon: FolderKanban },
  { to: "/app/builds", label: "Build Repository", icon: Package },
  { to: "/app/testing", label: "Testing", icon: FlaskConical },
  { to: "/app/copilot", label: "AI Copilot", icon: Bot },
  { to: "/app/reports", label: "Reports", icon: BarChart3 },
] as const;

const platform = [
  { to: "/app/engineering", label: "TTCN Engine", icon: Cpu },
  { to: "/app/docs", label: "Documentation", icon: BookOpen },
  { to: "/app/api", label: "API & SDK", icon: Code2 },
] as const;

const secondary = [
  { to: "/app/billing", label: "Billing", icon: CreditCard },
  { to: "/app/team", label: "Team", icon: Users },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link to="/app"><BrandLogo /></Link>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Workspace</p>
        <nav className="flex flex-col gap-0.5">
          {primary.map((i) => (
            <NavItem key={i.to} to={i.to} icon={i.icon} label={i.label} active={isActive(i.to, "exact" in i && i.exact)} />
          ))}
        </nav>

        <p className="mt-6 px-2 pb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Platform</p>
        <nav className="flex flex-col gap-0.5">
          {platform.map((i) => (
            <NavItem key={i.to} to={i.to} icon={i.icon} label={i.label} active={isActive(i.to)} />
          ))}
        </nav>

        <p className="mt-6 px-2 pb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Account</p>
        <nav className="flex flex-col gap-0.5">
          {secondary.map((i) => (
            <NavItem key={i.to} to={i.to} icon={i.icon} label={i.label} active={isActive(i.to)} />
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-2">
        <a href="#" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LifeBuoy className="size-4" /> Support
        </a>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 p-2">
          <div className="grid size-8 place-items-center rounded-md bg-primary/20 font-mono text-xs text-primary">AR</div>
          <div className="min-w-0 flex-1 text-xs">
            <p className="truncate font-medium text-foreground">Alex Rivera</p>
            <p className="truncate text-muted-foreground">Acme Semiconductor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

type NavItemProps = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
};

function NavItem({ to, icon: Icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-4" />
      <span>{label}</span>
    </Link>
  );
}
