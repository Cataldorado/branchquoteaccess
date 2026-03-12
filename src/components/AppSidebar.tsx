import {
  LayoutDashboard, Package, FileText, ShoppingCart, Truck,
  Receipt, Inbox, StickyNote,
} from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { id: "dashboard", title: "Dashboard", icon: LayoutDashboard, enabled: true },
  { id: "products", title: "Products", icon: Package, enabled: false },
  { id: "quotes", title: "Quotes", icon: FileText, enabled: true },
  { id: "orders", title: "Orders", icon: ShoppingCart, enabled: false },
  { id: "deliveries", title: "Deliveries", icon: Truck, enabled: false },
  { id: "invoices", title: "Invoices", icon: Receipt, enabled: false },
  { id: "inbox", title: "Inbox", icon: Inbox, enabled: false },
  { id: "notepad", title: "Notepad", icon: StickyNote, enabled: false },
];

export function AppSidebar() {
  const { activeTool, setActiveTool, goHome, openSearch } = useCustomer();

  const isActive = (id: string) => {
    if (id === "dashboard") return !activeTool;
    return activeTool === id;
  };

  const handleClick = (item: typeof sidebarItems[0]) => {
    if (!item.enabled) return;
    if (item.id === "dashboard") {
      goHome();
    } else if (item.id === "quotes") {
      setActiveTool("quotes");
      openSearch();
    } else {
      setActiveTool(item.id);
    }
  };

  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border">
      <SidebarContent className="py-2 px-0">
        <nav className="flex flex-col items-center gap-0.5">
          {sidebarItems.map((item) => {
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full py-2 gap-0.5 transition-colors",
                  item.enabled
                    ? "cursor-pointer hover:bg-sidebar-accent/50"
                    : "cursor-default text-sidebar-foreground/25",
                  active && "text-sidebar-primary"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-sidebar-primary" />
                )}
                <item.icon className={cn("h-[18px] w-[18px]", !active && item.enabled && "text-sidebar-foreground/70")} />
                <span className={cn(
                  "text-[10px] leading-tight",
                  active ? "font-semibold" : "font-normal",
                  !item.enabled && "text-sidebar-foreground/25"
                )}>
                  {item.title}
                </span>
              </button>
            );
          })}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}
