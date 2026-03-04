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
      <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-wider font-semibold">
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
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4" />
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
      <div className="p-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground text-sm">QuoteFlow</span>
          </div>
        ) : (
          <FileText className="h-5 w-5 text-sidebar-primary mx-auto" />
        )}
      </div>
      <SidebarContent>
        {renderGroup("Quotes", mainItems)}
        {renderGroup("Management", managementItems)}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
