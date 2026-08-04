import { AppSidebar } from "@aeon/components/app/app-sidebar";
import { AppTopbar } from "@aeon/components/app/app-topbar";

export default function AppPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
