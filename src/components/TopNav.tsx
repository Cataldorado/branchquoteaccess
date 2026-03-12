import { Sun, Moon, ShieldCheck, User, LogOut, Building2, Mail, X, Plus, Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
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

function CustomerTabsCarousel({
  tabs,
  activeTabIndex,
  isSearching,
  switchTab,
  closeTab,
}: {
  tabs: import("@/contexts/CustomerContext").CustomerTab[];
  activeTabIndex: number | null;
  isSearching: boolean;
  switchTab: (index: number) => void;
  closeTab: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
  }, [checkScroll, tabs.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="flex items-center ml-1 h-full min-w-0 max-w-[50%] relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="shrink-0 h-full px-1 flex items-center text-muted-foreground hover:text-foreground transition-colors z-10 bg-card border-r border-border"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      <div ref={scrollRef} className="flex items-center h-full overflow-hidden">
        {tabs.map((tab, index) => {
          const isActive = index === activeTabIndex && !isSearching;
          return (
            <button
              key={tab.customer.id}
              onClick={() => switchTab(index)}
              className={cn(
                "relative flex items-center gap-2 px-4 h-full border-r border-border text-xs transition-colors group shrink-0",
                index === 0 && "border-l",
                isActive
                  ? "bg-background text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="font-medium text-xs truncate max-w-[120px]">{tab.customer.name}</span>
                <span className="text-[10px] text-muted-foreground">Customer ID: {tab.customer.accountNumber}</span>
              </div>
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); closeTab(index); }}
                className="ml-1 h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="shrink-0 h-full px-1 flex items-center text-muted-foreground hover:text-foreground transition-colors z-10 bg-card border-l border-border"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function TopNav() {
  const { role, setRole, isManager } = useRole();
  const { tabs, activeTabIndex, isSearching, switchTab, closeTab, openSearch, selectedCustomer, activeTool, goHome } = useCustomer();
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

      {/* Back button — shown when inside a tool with a customer selected */}
      {activeTool && tabs.length > 0 && (
        <button
          onClick={() => goHome()}
          className="flex items-center gap-1.5 px-3 h-full border-r border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>
      )}

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
