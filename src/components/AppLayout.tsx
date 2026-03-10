import { TopNav } from "@/components/TopNav";
import { CustomerTabBar } from "@/components/CustomerTabBar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col w-full overflow-hidden">
      <TopNav />
      <CustomerTabBar />
      <main className="flex-1 overflow-auto px-6 py-5">
        {children}
      </main>
    </div>
  );
}
