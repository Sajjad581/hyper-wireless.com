import { cn } from "@/lib/utils";

export function BrandLogo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <div className={cn("hyper-animated-logo flex items-center gap-2 cursor-pointer", className)}>
      <img
        src="/hyper-wireless-logo.png"
        alt="Hyper Wireless"
        className="h-10 w-auto max-w-[190px] object-contain drop-shadow-[0_2px_8px_rgba(0,180,216,0.25)] transition-transform duration-300"
      />
    </div>
  );
}



