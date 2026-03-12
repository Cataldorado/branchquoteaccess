import {
  LayoutDashboard, Package, FileText, ShoppingCart, Truck,
  ClipboardList, Receipt, Inbox, StickyNote, Leaf, Home,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useCustomer } from "@/contexts/CustomerContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, enabled: true },
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
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { goHome } = useCustomer();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="px-4 py-5 border-b border-sidebar-border">
        {!collapsed ? (
          <button onClick={goHome} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-brand-foreground" />
            </div>
            <span className="font-semibold text-sidebar-accent-foreground text-sm tracking-tight">Heritage HQ</span>
          </button>
        ) : (
          <button onClick={goHome} className="hover:opacity-80 transition-opacity">
            <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center mx-auto">
              <Leaf className="h-3.5 w-3.5 text-brand-foreground" />
            </div>
          </button>
        )}
      </div>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.enabled ? (
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink
                        to={item.url}
                        end
                        className="text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-150 rounded-lg text-[13px]"
                        activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-semibold shadow-[inset_0_0_0_1px_hsl(var(--sidebar-primary)/0.2)]"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton className="text-sidebar-foreground/30 cursor-not-allowed hover:bg-transparent hover:text-sidebar-foreground/30">
                      <item.icon className="h-4 w-4 opacity-40" />
                      {!collapsed && (
                        <div className="flex items-center gap-2 flex-1">
                          <span>{item.title}</span>
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-sidebar-foreground/15 text-sidebar-foreground/30 font-normal">
                            Soon
                          </Badge>
                        </div>
                      )}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={goHome}
              className="text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-150 rounded-lg text-[13px]"
            >
              <Home className="h-4 w-4" />
              {!collapsed && <span>Back to Home</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
