import { TopNav } from "@/components/TopNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col w-full overflow-hidden">
      <TopNav />
      <main className="flex-1 overflow-auto px-6 py-5">
        {children}
      </main>
    </div>
  );
}
