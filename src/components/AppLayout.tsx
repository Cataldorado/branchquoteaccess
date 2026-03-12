import { TopNav } from "@/components/TopNav";
import { CustomerTabBar } from "@/components/CustomerTabBar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <CustomerTabBar />
          <main className="flex-1 overflow-auto px-6 py-5">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
