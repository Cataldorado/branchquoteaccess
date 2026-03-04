import { Search, FileText, Users, Building2, BarChart3, Plus, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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
  { title: "Quote Search", url: "/", icon: Search },
  { title: "New Quote", url: "/quotes/new", icon: Plus },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
];

const managementItems = [
  { title: "Customers", url: "/customers", icon: Users },
  { title: "Branches", url: "/branches", icon: Building2 },
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
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink
                  to={item.url}
                  end
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-150 rounded-md text-[13px]"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                >
                  <item.icon className="h-4 w-4 opacity-70" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
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
              <FileText className="h-3.5 w-3.5 text-brand-foreground" />
            </div>
            <span className="font-semibold text-sidebar-accent-foreground text-sm tracking-tight">QuoteFlow</span>
          </div>
        ) : (
          <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center mx-auto">
            <FileText className="h-3.5 w-3.5 text-brand-foreground" />
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
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors duration-150 text-[13px]">
                <Settings className="h-4 w-4 opacity-60" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
