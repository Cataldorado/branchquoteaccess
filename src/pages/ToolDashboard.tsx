import heritageLogo from "@/assets/heritage-logo.svg";
import { useCustomer } from "@/contexts/CustomerContext";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileText, Package, ClipboardList, Truck, PackageCheck, Receipt, Inbox, StickyNote, type LucideIcon } from "lucide-react";

interface Tool {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  enabled: boolean;
  needsCustomer: boolean;
}

const tools: Tool[] = [
  { id: "quotes", label: "Quotes", icon: FileText, color: "from-blue-500/20 to-blue-600/10", enabled: true, needsCustomer: true },
  { id: "products", label: "Products", icon: Package, color: "from-amber-500/20 to-amber-600/10", enabled: false, needsCustomer: false },
  { id: "orders", label: "Orders", icon: ClipboardList, color: "from-emerald-500/20 to-emerald-600/10", enabled: false, needsCustomer: false },
  { id: "deliveries", label: "Deliveries", icon: Truck, color: "from-violet-500/20 to-violet-600/10", enabled: false, needsCustomer: false },
  { id: "pickup", label: "Pickup", icon: PackageCheck, color: "from-rose-500/20 to-rose-600/10", enabled: false, needsCustomer: false },
  { id: "invoices", label: "Invoices", icon: Receipt, color: "from-cyan-500/20 to-cyan-600/10", enabled: false, needsCustomer: false },
  { id: "inbox", label: "Inbox", icon: Inbox, color: "from-orange-500/20 to-orange-600/10", enabled: false, needsCustomer: false },
  { id: "notepad", label: "Notepad", icon: StickyNote, color: "from-teal-500/20 to-teal-600/10", enabled: false, needsCustomer: false },
];

export default function ToolDashboard() {
  const { setActiveTool, openSearch } = useCustomer();

  const handleToolClick = (tool: typeof tools[0]) => {
    if (!tool.enabled) return;
    if (tool.needsCustomer) {
      setActiveTool(tool.id);
      openSearch();
    } else {
      setActiveTool(tool.id);
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col bg-background w-full">
        {/* Header with Heritage logo */}
        <header className="h-14 border-b border-border bg-card flex items-center px-5 shrink-0">
          <img src={heritageLogo} alt="Heritage" className="h-8 object-contain" />
        </header>

        {/* Content area with sidebar */}
        <div className="flex-1 flex min-h-0">
          <AppSidebar />
          <main className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  disabled={!tool.enabled}
                  className={cn(
                    "relative aspect-[4/3] rounded-xl overflow-hidden group transition-all",
                    tool.enabled
                      ? "cursor-pointer hover:ring-2 hover:ring-brand hover:shadow-lg"
                      : "cursor-default opacity-70"
                  )}
                >
                  <img
                    src={tool.image}
                    alt={tool.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-white font-semibold text-lg tracking-tight drop-shadow-md">
                      {tool.label}
                    </span>
                    {!tool.enabled && (
                      <Badge className="bg-white/20 text-white border-white/30 text-2xs backdrop-blur-sm">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
