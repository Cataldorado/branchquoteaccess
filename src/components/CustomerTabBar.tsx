import { X, Plus, Building2 } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { cn } from "@/lib/utils";

export function CustomerTabBar() {
  const { tabs, activeTabIndex, isSearching, switchTab, closeTab, openSearch } = useCustomer();

  if (tabs.length === 0) return null;

  return (
    <div className="h-10 bg-secondary/50 border-b border-border flex items-center px-2 gap-1 shrink-0 overflow-x-auto">
      {tabs.map((tab, index) => (
        <button
          key={tab.customer.id}
          onClick={() => switchTab(index)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all max-w-[200px] group",
            index === activeTabIndex && !isSearching
              ? "bg-card text-foreground shadow-sm border border-border"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{tab.customer.name}</span>
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); closeTab(index); }}
            className="ml-auto h-4 w-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-muted transition-all shrink-0"
          >
            <X className="h-2.5 w-2.5" />
          </span>
        </button>
      ))}
      <button
        onClick={openSearch}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
          isSearching
            ? "bg-card text-foreground shadow-sm border border-border"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        )}
        title="Add customer"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>New Customer</span>
      </button>
    </div>
  );
}
