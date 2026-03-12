import {
  LayoutDashboard, Package, FileText, ShoppingCart, Truck,
  ClipboardList, Receipt, Inbox, StickyNote, ArrowLeft,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomer } from "@/contexts/CustomerContext";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { title: "Products", url: "/products", icon: Package, enabled: false },
  { title: "Quotes", url: "/", icon: FileText, enabled: true },
  { title: "Orders", url: "/orders", icon: ShoppingCart, enabled: false },
  { title: "Deliveries", url: "/deliveries", icon: Truck, enabled: false },
  { title: "Pickup", url: "/pickup", icon: ClipboardList, enabled: false },
  { title: "Invoices", url: "/invoices", icon: Receipt, enabled: false },
  { title: "Inbox", url: "/inbox", icon: Inbox, enabled: false },
  { title: "Notepad", url: "/notepad", icon: StickyNote, enabled: false },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { goHome } = useCustomer();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border">
      <SidebarContent className="py-2 px-0">
        <nav className="flex flex-col items-center gap-0.5">
          {sidebarItems.map((item) => {
            const active = isActive(item.url);
            return (
              <button
                key={item.title}
                onClick={() => {
                  if (!item.enabled) return;
                  if (item.url === "/dashboard") {
                    goHome();
                  } else {
                    navigate(item.url);
                  }
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full py-2.5 gap-1 transition-colors",
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
