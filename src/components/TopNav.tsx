import { Sun, Moon, ShieldCheck, User, LogOut, Building2, Mail, X, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import heritageLogo from "@/assets/heritage-logo.svg";
import { useEffect, useState, useRef, useCallback } from "react";
import { useCustomer } from "@/contexts/CustomerContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/contexts/RoleContext";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { role, setRole, isManager } = useRole();
  const { tabs, activeTabIndex, isSearching, switchTab, closeTab, openSearch, selectedCustomer, goHome } = useCustomer();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-0 shrink-0">
      {/* Logo */}
      <button
        onClick={() => goHome()}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0"
        title="Home"
      >
        <img src={heritageLogo} alt="Heritage" className="h-8 object-contain" />
      </button>

      {/* Customer tabs with overflow carousel */}
      {tabs.length > 0 && (
        <CustomerTabsCarousel
          tabs={tabs}
          activeTabIndex={activeTabIndex}
          isSearching={isSearching}
          switchTab={switchTab}
          closeTab={closeTab}
        />
      )}

      <div className="flex-1" />

      {/* Look up Customer button */}
      <button
        onClick={openSearch}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-primary hover:bg-primary/10 transition-colors mr-2"
        title="Look up Customer"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Look up Customer</span>
      </button>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title={dark ? "Light mode" : "Dark mode"}
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Role toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 ml-1">
        <button
          onClick={() => setRole("branch-manager")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            isManager
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Manager</span>
        </button>
        <button
          onClick={() => setRole("branch-associate")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            !isManager
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Associate</span>
        </button>
      </div>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 cursor-pointer group outline-none ml-2">
            <Avatar className="h-8 w-8 ring-1 ring-border">
              <AvatarFallback className="text-2xs bg-secondary text-secondary-foreground font-medium">JS</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors hidden xl:inline">J. Smith</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal space-y-2 py-3">
            <p className="text-sm font-medium text-foreground">J. Smith</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>jsmith@heritagelandscape.com</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>Denver West Branch</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
