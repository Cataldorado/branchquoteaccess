import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Building2, MapPin, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { customers } from "@/data/mockData";
import { useCustomer } from "@/contexts/CustomerContext";
import { cn } from "@/lib/utils";

export default function CustomerSearch() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSelectedCustomer, activeTool } = useCustomer();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.accountNumber.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    );
  }, [query]);

  const toolLabel = activeTool ? activeTool.charAt(0).toUpperCase() + activeTool.slice(1) : "";

  return (
    <div className="flex-1 flex flex-col items-center pt-[12vh] px-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {toolLabel} – Select a Customer
          </h1>
          <p className="text-sm text-muted-foreground">
            Search by name, account number, or address to get started.
          </p>
        </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="pl-10 h-12 text-base rounded-xl border-border bg-card shadow-sm focus-visible:ring-brand"
            />
          </div>

          {/* Results */}
          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                No customers match your search.
              </div>
            ) : (
              filtered.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border bg-card",
                    "hover:border-brand/40 hover:shadow-sm transition-all text-left group cursor-pointer"
                  )}
                >
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Building2 className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {customer.name}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        {customer.accountNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
                        {customer.address}, {customer.city}, {customer.state}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-brand transition-colors shrink-0" />
                </button>
              ))
            )}
        </div>
      </div>
    </div>
  );
}
