import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Copy, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  quotes, branches, customers, getStatusColor, getOriginColor, getDaysUntilExpiration, formatCurrency,
  allStatusOptions, type QuoteStatus,
} from "@/data/mockData";
import { SearchableSelect } from "@/components/SearchableSelect";
import { toast } from "sonner";

const statusOptions = allStatusOptions;

export default function QuoteSearch() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");

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

      return matchesSearch && matchesStatus && matchesBranch && matchesCustomer;
    });
  }, [search, statusFilter, branchFilter, customerFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setBranchFilter("all");
    setCustomerFilter("all");
  };

  const hasFilters = statusFilter !== "all" || branchFilter !== "all" || customerFilter !== "all";

  const copyToClipboard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    toast.success(`Copied ${id} to clipboard`);
  };

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
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border">
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
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Quote Name</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Quote ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Customer</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Branch</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Origin</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3">Expiration</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-9 px-3 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => {
              const daysLeft = getDaysUntilExpiration(q.expirationDate);
              const isAgility = q.origin === "Agility";
              return (
                <TableRow
                  key={q.id}
                  className={isAgility ? "group" : "cursor-pointer group"}
                  onClick={() => !isAgility && navigate(`/quotes/${q.id}`)}
                >
                  <TableCell className="px-3 py-2 text-xs font-medium">{q.customerName}</TableCell>
                  <TableCell className="px-3 py-2 text-xs font-mono font-medium">
                    {isAgility ? (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        {q.id}
                        <button
                          className="text-muted-foreground/60 hover:text-foreground"
                          onClick={(e) => copyToClipboard(e, q.id)}
                          title="Copy Quote ID"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-primary">{q.id}</span>
                    )}
                  </TableCell>
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
