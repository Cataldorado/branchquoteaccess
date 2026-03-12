import { TopNav } from "@/components/TopNav";
import { CustomerTabBar } from "@/components/CustomerTabBar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col w-full overflow-hidden">
        <TopNav />
        <div className="flex-1 flex min-h-0">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <CustomerTabBar />
            <main className="flex-1 overflow-auto px-6 py-5">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
