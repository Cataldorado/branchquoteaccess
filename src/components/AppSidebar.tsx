import { Search, Leaf, Users, Building2, BarChart3, Plus, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Quote Search", url: "/", icon: Search, active: true },
  { title: "New Quote", url: "/quotes/new", icon: Plus, active: false },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3, active: false },
];

const managementItems = [
  { title: "Customers", url: "/customers", icon: Users, active: false },
  { title: "Branches", url: "/branches", icon: Building2, active: false },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/40 text-2xs uppercase tracking-[0.08em] font-medium px-3 mb-1">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.active ? (
                <SidebarMenuButton asChild isActive={isActive(item.url)}>
                  <NavLink
                    to={item.url}
                    end
                    className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-150 rounded-lg text-[13px]"
                    activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-semibold shadow-[inset_0_0_0_1px_hsl(var(--sidebar-primary)/0.2)]"
                  >
                    <item.icon className="h-4 w-4 opacity-70" />
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
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="px-4 py-5 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-brand-foreground" />
            </div>
            <span className="font-semibold text-sidebar-accent-foreground text-sm tracking-tight">Heritage HQ</span>
          </div>
        ) : (
          <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center mx-auto">
            <Leaf className="h-3.5 w-3.5 text-brand-foreground" />
          </div>
        )}
      </div>
      <SidebarContent className="pt-4">
        {renderGroup("Quotes", mainItems)}
        {renderGroup("Management", managementItems)}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/30 cursor-not-allowed hover:bg-transparent hover:text-sidebar-foreground/30">
              <Settings className="h-4 w-4 opacity-40" />
              {!collapsed && (
                <div className="flex items-center gap-2 flex-1">
                  <span>Settings</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-sidebar-foreground/15 text-sidebar-foreground/30 font-normal">
                    Soon
                  </Badge>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
