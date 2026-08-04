import { Link } from "@tanstack/react-router";
import { Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/85 px-6 backdrop-blur">
      <button className="flex items-center gap-2 rounded-md border border-border/70 bg-card px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground">
        <span>Acme Semiconductor</span>
        <ChevronDown className="size-3.5" />
      </button>
      <div className="relative ml-4 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Search projects, executions, and testcases" placeholder="Search projects, executions, testcases…" className="h-9 pl-8 font-normal" />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border/70 bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline" className="hidden gap-1.5 border-success/40 text-success md:inline-flex">
          <span className="size-1.5 rounded-full bg-success" /> All systems operational
        </Badge>
        <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="size-4" /></Button>
        <Link to="/">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-red-500/30 bg-card/60 text-red-400 transition-colors hover:bg-red-500/15 hover:text-red-300"
          >
            <LogOut className="size-3.5" />
            <span>Log Out</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}

