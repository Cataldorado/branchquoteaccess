import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Copy, ArrowRightCircle, Eye, X, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  quotes, branches, customers, getStatusColor, getOriginColor, getGMColor, getDaysUntilExpiration, formatCurrency,
  type QuoteStatus,
} from "@/data/mockData";
import { SearchableSelect } from "@/components/SearchableSelect";

const statusOptions: QuoteStatus[] = ["Draft", "Sent", "Negotiating", "Won", "Lost", "Expired"];

export default function QuoteSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  const filtered = useMemo(() => {
    return quotes.filter((q) => {
      const s = search.toLowerCase();
      const matchesSearch =
        !s ||
        q.id.toLowerCase().includes(s) ||
        q.customerName.toLowerCase().includes(s) ||
        q.branchName.toLowerCase().includes(s) ||
        q.poNumber?.toLowerCase().includes(s) ||
        q.jobNumber?.toLowerCase().includes(s) ||
        q.transactionRef?.toLowerCase().includes(s);

      const matchesStatus = statusFilter === "all" || q.status === statusFilter;
      const matchesBranch = branchFilter === "all" || q.branchId === branchFilter;
      const matchesCustomer = customerFilter === "all" || q.customerId === customerFilter;
      const matchesExpired = !showExpiredOnly || q.status === "Expired";

      return matchesSearch && matchesStatus && matchesBranch && matchesCustomer && matchesExpired;
    });
  }, [search, statusFilter, branchFilter, customerFilter, showExpiredOnly]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setBranchFilter("all");
    setCustomerFilter("all");
    setShowExpiredOnly(false);
  };

  const hasFilters = statusFilter !== "all" || branchFilter !== "all" || customerFilter !== "all" || showExpiredOnly;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Quote Search</h1>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{filtered.length} of {quotes.length} quotes</span>
        </div>
      </div>

      {/* Search + Filters */}
      <Card className="p-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by Quote ID, Customer, PO#, Job#, Transaction Ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-muted-foreground" onClick={clearFilters}>
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-border">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Status</label>
            <SearchableSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              allLabel="All Statuses"
              options={statusOptions.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Branch</label>
            <SearchableSelect
              value={branchFilter}
              onValueChange={setBranchFilter}
              allLabel="All Branches"
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1 block">Customer</label>
            <SearchableSelect
              value={customerFilter}
              onValueChange={setCustomerFilter}
              allLabel="All Customers"
              options={customers.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant={showExpiredOnly ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs gap-1 w-full"
              onClick={() => setShowExpiredOnly(!showExpiredOnly)}
            >
              <AlertTriangle className="h-3 w-3" />
              Expired Only
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Quote ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Customer</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Branch</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Origin</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Expiration</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3 text-right">Amount</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3 text-right">GM%</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => {
              const daysLeft = getDaysUntilExpiration(q.expirationDate);
              return (
                <TableRow
                  key={q.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/quotes/${q.id}`)}
                >
                  <TableCell className="px-3 py-2 text-xs font-mono font-medium text-primary">{q.id}</TableCell>
                  <TableCell className="px-3 py-2 text-xs">{q.customerName}</TableCell>
                  <TableCell className="px-3 py-2 text-xs text-muted-foreground">{q.branchName}</TableCell>
                  <TableCell className="px-3 py-2">
                    <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${getOriginColor(q.origin)}`}>
                      {q.origin}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded ${getStatusColor(q.status)}`}>
                      {q.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs">
                    <span className={daysLeft < 0 ? "text-destructive" : daysLeft <= 7 ? "text-warning" : "text-muted-foreground"}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-xs text-right font-mono">{formatCurrency(q.totalAmount)}</TableCell>
                  <TableCell className="px-3 py-2 text-xs text-right">
                    <span className={`font-semibold font-mono ${getGMColor(q.gmPercent)}`}>{q.gmPercent}%</span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); navigate(`/quotes/${q.id}`); }}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      {q.status !== "Won" && q.status !== "Lost" && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary" onClick={(e) => e.stopPropagation()}>
                          <ArrowRightCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Keyboard hint */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground py-2">
        <span><kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">↑↓</kbd> Navigate</span>
        <span><kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">Enter</kbd> Open</span>
        <span><kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">/</kbd> Search</span>
        <span><kbd className="px-1 py-0.5 bg-muted rounded text-[9px] font-mono">N</kbd> New Quote</span>
      </div>
    </div>
  );
}
