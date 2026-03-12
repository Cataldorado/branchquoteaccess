import heritageLogo from "@/assets/heritage-logo.svg";
import { useCustomer } from "@/contexts/CustomerContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


import imgQuotes from "@/assets/tool-quotes.jpg";
import imgProducts from "@/assets/tool-products.jpg";
import imgOrders from "@/assets/tool-orders.jpg";
import imgDeliveries from "@/assets/tool-deliveries.jpg";
import imgPickup from "@/assets/tool-pickup.jpg";
import imgInvoices from "@/assets/tool-invoices.jpg";
import imgInbox from "@/assets/tool-inbox.jpg";
import imgNotepad from "@/assets/tool-notepad.jpg";

const tools = [
  { id: "products", label: "Products", image: imgProducts, enabled: false, needsCustomer: false },
  { id: "quotes", label: "Quotes", image: imgQuotes, enabled: true, needsCustomer: true },
  { id: "orders", label: "Orders", image: imgOrders, enabled: false, needsCustomer: false },
  { id: "deliveries", label: "Deliveries", image: imgDeliveries, enabled: false, needsCustomer: false },
  { id: "pickup", label: "Pickup", image: imgPickup, enabled: false, needsCustomer: false },
  { id: "invoices", label: "Invoices", image: imgInvoices, enabled: false, needsCustomer: false },
  { id: "inbox", label: "Inbox", image: imgInbox, enabled: false, needsCustomer: false },
  { id: "notepad", label: "Notepad", image: imgNotepad, enabled: false, needsCustomer: false },
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
    <div className="h-screen flex flex-col bg-background">
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
  );
}
