import { cn } from "@/lib/utils";

export function BrandLogo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        aria-hidden
        className="grid size-7 place-items-center rounded-md text-primary-foreground shadow-[0_1px_0_0_oklch(1_0_0_/_0.15)_inset]"
        style={{ background: "var(--gradient-brand)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-4">
          <path
            d="M4 20L12 4L20 20M7.5 14H16.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showWord && (
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold tracking-tight">AEON</span>
          <span className="text-[15px] font-medium tracking-tight text-muted-foreground">Cloud</span>
        </div>
      )}
    </div>
  );
}
