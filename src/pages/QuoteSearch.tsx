import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, DollarSign, Building2, Users, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  quotes, getStatusColor, getOriginColor, getDaysUntilExpiration, formatCurrency,
} from "@/data/mockData";
import { useCustomer } from "@/contexts/CustomerContext";

export default function QuoteSearch() {
  const navigate = useNavigate();
  const { setActiveModule } = useCustomer();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      const s = search.toLowerCase();
      return (
        !s ||
        q.id.toLowerCase().includes(s) ||
        q.quoteName.toLowerCase().includes(s) ||
        q.customerName.toLowerCase().includes(s) ||
        q.branchName.toLowerCase().includes(s) ||
        q.poNumber?.toLowerCase().includes(s) ||
        q.jobNumber?.toLowerCase().includes(s) ||
        q.transactionRef?.toLowerCase().includes(s)
      );
    });
  }, [search]);

  const renderExpiration = (daysLeft: number) => {
    if (daysLeft < 0) {
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
          {Math.abs(daysLeft)}d overdue
        </span>
      );
    }
    if (daysLeft === 0) {
      return <span className="text-sm font-medium text-warning">Today</span>;
    }
    if (daysLeft <= 7) {
      return <span className="text-sm font-medium text-warning">{daysLeft}d left</span>;
    }
    return <span className="text-sm text-muted-foreground">{daysLeft}d left</span>;
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Back + Search bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
          onClick={() => setActiveModule(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Modules
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
        <Input
          placeholder="Search by Quote Name, ID, Customer, PO, Job, Reference"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-12 pr-4 text-base bg-card border-border rounded-xl shadow-subtle focus-visible:ring-2 focus-visible:ring-brand/30"
          autoFocus
        />
        {search && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearch("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-end">
        <span className="text-xs text-muted-foreground font-mono">
          {filtered.length} of {quotes.length} quotes
        </span>
      </div>

      {/* Quote cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((q) => {
          const daysLeft = getDaysUntilExpiration(q.expirationDate);
          const isAgility = q.origin === "Agility";

          return (
            <button
              key={q.id}
              className={`text-left bg-card rounded-xl border border-border p-4 transition-all hover:shadow-elevated hover:border-brand/30 ${
                isAgility ? "opacity-75" : "cursor-pointer active:scale-[0.99]"
              }`}
              onClick={() => !isAgility && navigate(`/quotes/${q.id}`)}
              disabled={isAgility}
            >
              {/* Top: name + status */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className={`text-sm font-semibold truncate ${isAgility ? "text-foreground" : "text-brand"}`}>
                    {q.quoteName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{q.id}</p>
                </div>
                <span className={`inline-flex items-center text-2xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${getStatusColor(q.status)}`}>
                  {q.status}
                </span>
              </div>

              {/* Middle: customer + branch */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1 truncate">
                  <Users className="h-3 w-3 shrink-0" />
                  {q.customerName}
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1 truncate">
                  <Building2 className="h-3 w-3 shrink-0" />
                  {q.branchName}
                </span>
              </div>

              {/* Bottom: amount + expiration + origin */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-base font-semibold font-mono">{formatCurrency(q.totalAmount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {renderExpiration(daysLeft)}
                  </div>
                  <span className={`inline-flex items-center text-2xs font-medium px-2 py-0.5 rounded-full border ${getOriginColor(q.origin)}`}>
                    {q.origin}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Search className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm font-medium">No quotes found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
