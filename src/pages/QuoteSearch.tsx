import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Copy, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6 max-w-[1400px]">
      {/* Page header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Quotes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} of {quotes.length} quotes
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-card rounded-lg border border-border shadow-subtle p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              placeholder="Search by Quote ID, Customer, PO#, Job#..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-sm bg-background"
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-2xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">Status</label>
            <SearchableSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              allLabel="All Statuses"
              options={statusOptions.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <div>
            <label className="text-2xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">Branch</label>
            <SearchableSelect
              value={branchFilter}
              onValueChange={setBranchFilter}
              allLabel="All Branches"
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
          </div>
          <div>
            <label className="text-2xs uppercase tracking-wider text-muted-foreground font-medium mb-1.5 block">Customer</label>
            <SearchableSelect
              value={customerFilter}
              onValueChange={setCustomerFilter}
              allLabel="All Customers"
              options={customers.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-card rounded-lg border border-border shadow-subtle overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4">Quote Name</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4">Quote ID</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4">Customer</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4">Branch</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4">Origin</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4">Status</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4">Expiration</TableHead>
              <TableHead className="text-2xs uppercase tracking-wider font-medium text-muted-foreground h-10 px-4 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((q) => {
              const daysLeft = getDaysUntilExpiration(q.expirationDate);
              const isAgility = q.origin === "Agility";
              return (
                <TableRow
                  key={q.id}
                  className={`${isAgility ? "" : "cursor-pointer"} group transition-colors duration-100 hover:bg-muted/50`}
                  onClick={() => !isAgility && navigate(`/quotes/${q.id}`)}
                >
                  <TableCell className="px-4 py-3 text-sm font-medium">
                    {isAgility ? (
                      <span className="text-foreground">{q.customerName}</span>
                    ) : (
                      <span className="text-brand cursor-pointer hover:underline">{q.customerName}</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono">
                    {isAgility ? (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        {q.id}
                        <button
                          className="text-muted-foreground/40 hover:text-foreground transition-colors"
                          onClick={(e) => copyToClipboard(e, q.id)}
                          title="Copy Quote ID"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-brand">{q.id}</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">{q.customerName}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">{q.branchName}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`inline-flex items-center text-2xs font-medium px-2 py-0.5 rounded-full border ${getOriginColor(q.origin)}`}>
                      {q.origin}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className={`inline-flex items-center text-2xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(q.status)}`}>
                      {q.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <span className={daysLeft < 0 ? "text-destructive" : daysLeft <= 7 ? "text-warning font-medium" : "text-muted-foreground"}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : daysLeft === 0 ? "Today" : `${daysLeft}d left`}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right font-mono font-medium">{formatCurrency(q.totalAmount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Keyboard hint */}
      <div className="flex items-center justify-center gap-6 text-2xs text-muted-foreground/60 py-1">
        <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-2xs font-mono border border-border">↑↓</kbd> Navigate</span>
        <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-2xs font-mono border border-border">Enter</kbd> Open</span>
        <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-2xs font-mono border border-border">/</kbd> Search</span>
        <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-2xs font-mono border border-border">N</kbd> New Quote</span>
      </div>
    </div>
  );
}
