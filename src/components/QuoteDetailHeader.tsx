import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, Pencil, Plus, Minus,
  ArrowRightCircle, AlertTriangle, Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getGMColor, getGMBgColor, getStatusColor, getOriginColor, formatCurrency,
  type Quote,
} from "@/data/mockData";
import { toast } from "sonner";

interface QuoteDetailHeaderProps {
  quote: Quote;
  overallGM: number;
  totalAmount: number;
  orderableCount: number;
  isExpired: boolean;
  onBack: () => void;
  onConvert: () => void;
  onResolve: () => void;
}

const shipViaOptions = [
  "Deliver HLS Truck",
  "Will Call",
  "UPS Ground",
  "FedEx",
  "Customer Pickup",
];

export default function QuoteDetailHeader({
  quote,
  overallGM,
  totalAmount,
  orderableCount,
  isExpired,
  onBack,
  onConvert,
  onResolve,
}: QuoteDetailHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const [manualCollapse, setManualCollapse] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  const [customerName, setCustomerName] = useState(quote.customerName);
  const [poNumber, setPoNumber] = useState(quote.poNumber || "");
  const [refNumber, setRefNumber] = useState(quote.transactionRef || "");
  const [expDeliveryDate, setExpDeliveryDate] = useState(quote.expirationDate);
  const [shipVia, setShipVia] = useState("Deliver HLS Truck");
  const [quotedBy, setQuotedBy] = useState(quote.assignedTo);
  const [createdDate, setCreatedDate] = useState(quote.createdDate);
  const [expirationDate, setExpirationDate] = useState(quote.expirationDate);

  const [shipTo, setShipTo] = useState({
    name: quote.customerName.toUpperCase(),
    address1: "8940 GREENFIELD ROAD",
    address2: "",
    city: "LORETTO",
    state: "Minnesota",
    zip: "55357",
    phone: "7634987574",
  });

  // Auto-collapse when scrolling down while expanded
  useEffect(() => {
    const scrollParent = headerRef.current?.closest("main");
    if (!scrollParent) return;

    let lastScrollTop = 0;
    const handleScroll = () => {
      const st = scrollParent.scrollTop;
      // If scrolling down past threshold and expanded, auto-collapse
      if (st > lastScrollTop && st > 80 && expanded && !manualCollapse) {
        setExpanded(false);
      }
      setIsStuck(st > 10);
      lastScrollTop = st;
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", handleScroll);
  }, [expanded, manualCollapse]);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => {
      setManualCollapse(prev); // if collapsing, mark as manual
      return !prev;
    });
    // Reset manual flag after a moment so auto-collapse works again
    setTimeout(() => setManualCollapse(false), 500);
  }, []);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL copied to clipboard");
  };

  const showOrderButton = !isExpired && quote.status !== "Received (Awarded)" && quote.status !== "Received (Not Awarded)";

  return (
    <div className="space-y-0">
      {/* Sentinel for detecting when sticky kicks in */}
      <div ref={sentinelRef} className="h-0" />

      {/* Sticky wrapper */}
      <div
        ref={headerRef}
        className={`sticky -top-5 z-20 transition-shadow duration-200 ${isStuck ? "shadow-elevated" : ""}`}
        style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "1.25rem" }}
      >
        <div className="bg-background pb-3 space-y-3">
          {/* Top action bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Quote List
            </button>
            <div className="flex items-center gap-3">
              {isExpired && (
                <Button size="sm" variant="destructive" className="h-8 text-xs gap-1.5" onClick={onResolve}>
                  <AlertTriangle className="h-3.5 w-3.5" /> Resolve
                </Button>
              )}
            </div>
          </div>

          {/* Status banner */}
          <div className="flex items-center justify-between px-5 py-3 rounded-lg border border-border bg-card shadow-subtle">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">Status</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(quote.status)}`}>
                {quote.status}
              </span>
              <span className={`text-2xs font-medium px-2 py-0.5 rounded-full border ${getOriginColor(quote.origin)}`}>
                {quote.origin}
              </span>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={copyUrl}>
              <Link className="h-3.5 w-3.5" /> Copy URL
            </Button>
          </div>

          {/* Main header card */}
          <div className="border border-border rounded-lg overflow-hidden bg-card shadow-subtle">
            {/* Collapsed summary row - always visible */}
            <div className="flex items-center gap-4 px-5 py-3">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="text-lg font-semibold tracking-tight border-0 bg-transparent h-8 px-1 focus-visible:ring-1 focus-visible:ring-ring/20 max-w-sm w-auto"
                /><Pencil className="h-3.5 w-3.5 text-muted-foreground/30" />
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-right">
                  <div className="text-2xs uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Quote GM%</div>
                  <span className={`text-base font-semibold font-mono ${getGMColor(overallGM)}`}>
                    {overallGM.toFixed(2)}%
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xs uppercase tracking-wider text-muted-foreground font-medium mb-0.5">Subtotal</div>
                  <span className="text-base font-semibold font-mono">{formatCurrency(totalAmount)}</span>
                </div>
                {showOrderButton && (
                  <Button
                    size="sm"
                    className="h-9 text-sm gap-2 bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm"
                    onClick={onConvert}
                    disabled={orderableCount === 0}
                  >
                    <ArrowRightCircle className="h-4 w-4" /> Purchase Items ({orderableCount})
                  </Button>
                )}
                <button
                  className="h-8 w-8 rounded-md bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors flex-shrink-0"
                  onClick={toggleExpanded}
                >
                  {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* GM% legend */}
            <div className="flex items-center justify-end gap-5 px-5 py-2 border-t border-border bg-muted/30 text-2xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gm-good" /> Within established GM%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gm-ok" /> Below established GM%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-gm-bad" /> Below acceptable GM%
              </span>
            </div>

            {/* Expanded details */}
            {expanded && (
              <div className="border-t border-border">
                {/* Row 1: IDs & dates */}
                <div className="grid grid-cols-5 gap-5 px-5 py-4 border-b border-border">
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Quote ID</label>
                    <p className="text-sm font-mono mt-1.5">{quote.id}</p>
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">PO #</label>
                    <Input
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="h-8 text-sm mt-1.5 font-mono"
                      placeholder="Enter PO #"
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Created Date</label>
                    <p className="text-sm mt-1.5 h-8 flex items-center">{createdDate}</p>
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Expiration Date</label>
                    <Input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="h-8 text-sm mt-1.5"
                    />
                  </div>
                  <div />
                </div>

                {/* Row 2: Additional refs */}
                <div className="grid grid-cols-5 gap-5 px-5 py-4 border-b border-border">
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Quoted by</label>
                    <p className="text-sm mt-1.5 h-8 flex items-center">{quotedBy}</p>
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Ref #</label>
                    <Input
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      className="h-8 text-sm mt-1.5 font-mono"
                      placeholder="Enter Ref #"
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Exp. Delivery Date</label>
                    <Input
                      type="date"
                      value={expDeliveryDate}
                      onChange={(e) => setExpDeliveryDate(e.target.value)}
                      className="h-8 text-sm mt-1.5"
                    />
                  </div>
                  <div />
                  <div />
                </div>

                {/* Ship-To & Quote Details */}
                <div className="grid grid-cols-2 gap-0">
                  {/* Ship-To */}
                  <div className="px-5 py-4 border-r border-border">
                    <h4 className="text-xs font-semibold mb-3 text-foreground">Ship-To</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Name</span>
                        <Input
                          value={shipTo.name}
                          onChange={(e) => setShipTo({ ...shipTo, name: e.target.value })}
                          className="h-7 text-sm border-0 border-b border-dashed border-border bg-transparent px-0 rounded-none focus-visible:ring-0 font-medium hover:border-muted-foreground/40 transition-colors"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Address Line 1</span>
                        <Input
                          value={shipTo.address1}
                          onChange={(e) => setShipTo({ ...shipTo, address1: e.target.value })}
                          className="h-7 text-sm border-0 border-b border-dashed border-border bg-transparent px-0 rounded-none focus-visible:ring-0 hover:border-muted-foreground/40 transition-colors"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Address Line 2</span>
                        <Input
                          value={shipTo.address2}
                          onChange={(e) => setShipTo({ ...shipTo, address2: e.target.value })}
                          className="h-7 text-sm border-0 border-b border-dashed border-border bg-transparent px-0 rounded-none focus-visible:ring-0 hover:border-muted-foreground/40 transition-colors"
                          placeholder="—"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">City</span>
                        <Input
                          value={shipTo.city}
                          onChange={(e) => setShipTo({ ...shipTo, city: e.target.value })}
                          className="h-7 text-sm border-0 border-b border-dashed border-border bg-transparent px-0 rounded-none focus-visible:ring-0 w-24 hover:border-muted-foreground/40 transition-colors"
                        />
                        <span className="text-muted-foreground text-xs">State</span>
                        <Input
                          value={shipTo.state}
                          onChange={(e) => setShipTo({ ...shipTo, state: e.target.value })}
                          className="h-7 text-sm border-0 border-b border-dashed border-border bg-transparent px-0 rounded-none focus-visible:ring-0 w-28 hover:border-muted-foreground/40 transition-colors"
                        />
                        <span className="text-muted-foreground text-xs">Zip</span>
                        <Input
                          value={shipTo.zip}
                          onChange={(e) => setShipTo({ ...shipTo, zip: e.target.value })}
                          className="h-7 text-sm border-0 border-b border-dashed border-border bg-transparent px-0 rounded-none focus-visible:ring-0 w-20 hover:border-muted-foreground/40 transition-colors"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Phone</span>
                        <Input
                          value={shipTo.phone}
                          onChange={(e) => setShipTo({ ...shipTo, phone: e.target.value })}
                          className="h-7 text-sm border-0 border-b border-dashed border-border bg-transparent px-0 rounded-none focus-visible:ring-0 hover:border-muted-foreground/40 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quote Details */}
                  <div className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold text-foreground">Quote Details</h4>
                      <button className="text-xs text-brand hover:underline flex items-center gap-1.5 transition-colors">
                        <Pencil className="h-3 w-3" /> Change Branch / Ship-To
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Company Name</span>
                        <span className="font-medium">{customerName.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Account #</span>
                        <span className="font-mono text-sm">{quote.customerId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Branch</span>
                        <span>{quote.branchName.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">Ship Via</span>
                        <Select value={shipVia} onValueChange={setShipVia}>
                          <SelectTrigger className="h-8 text-sm w-52">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {shipViaOptions.map((v) => (
                              <SelectItem key={v} value={v} className="text-sm">{v}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
