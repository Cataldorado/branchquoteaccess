import { useState } from "react";
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

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="space-y-3">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Quote List
        </button>
        <div className="flex items-center gap-3">
          {isExpired && (
            <Button size="sm" variant="destructive" className="h-8 text-xs gap-1" onClick={onResolve}>
              <AlertTriangle className="h-3 w-3" /> Resolve
            </Button>
          )}
        </div>
      </div>

      {/* Status banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-md border bg-accent/50 border-accent">
        <div>
          <span className="text-xs font-semibold">Quote Status: </span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getStatusColor(quote.status)}`}>
            {quote.status}
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ml-2 ${getOriginColor(quote.origin)}`}>
            {quote.origin}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={copyUrl}>
            <Link className="h-3 w-3" /> Copy URL
          </Button>
        </div>
      </div>

      {/* Main header card */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Collapsed summary row */}
        <div className="flex items-center gap-4 px-4 py-3 bg-background">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="text-lg font-semibold border-0 bg-transparent h-8 px-1 focus-visible:ring-1 max-w-sm w-auto"
            /><Pencil className="h-3.5 w-3.5 text-muted-foreground/50 -ml-1" />
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-right">
              <span className="text-xs text-muted-foreground mr-2">Quote GM%:</span>
              <span className={`text-sm font-bold font-mono ${getGMColor(overallGM)}`}>
                {overallGM.toFixed(2)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground mr-2">Subtotal:</span>
              <span className="text-sm font-bold font-mono">{formatCurrency(totalAmount)}</span>
            </div>
            <button
              className="h-7 w-7 rounded border border-primary bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* GM% legend */}
        <div className="flex items-center justify-end gap-4 px-4 py-1.5 border-t border-border bg-muted/20 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-gm-good" /> Within established GM%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-gm-ok" /> Below established GM%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-gm-bad" /> Below acceptable GM%
          </span>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-border">
            {/* Row 1: IDs & dates */}
            <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-border bg-muted/10">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quote ID:</label>
                <p className="text-xs font-mono mt-0.5">{quote.id}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">PO #:</label>
                <Input
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="h-7 text-xs mt-0.5 font-mono"
                  placeholder="Enter PO #"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created Date:</label>
                <Input
                  type="date"
                  value={createdDate}
                  onChange={(e) => setCreatedDate(e.target.value)}
                  className="h-7 text-xs mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Expiration Date:</label>
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="h-7 text-xs mt-0.5"
                />
              </div>
              <div />
            </div>

            {/* Row 2: Additional refs */}
            <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-border bg-muted/10">
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quoted by:</label>
                <Input
                  value={quotedBy}
                  onChange={(e) => setQuotedBy(e.target.value)}
                  className="h-7 text-xs mt-0.5"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ref #:</label>
                <Input
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="h-7 text-xs mt-0.5 font-mono"
                  placeholder="Enter Ref #"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Exp. Del. Date:</label>
                <Input
                  type="date"
                  value={expDeliveryDate}
                  onChange={(e) => setExpDeliveryDate(e.target.value)}
                  className="h-7 text-xs mt-0.5"
                />
              </div>
              <div />
              <div />
            </div>

            {/* Ship-To & Quote Details */}
            <div className="grid grid-cols-2 gap-0">
              {/* Ship-To */}
              <div className="px-4 py-3 border-r border-border">
                <h4 className="text-xs font-semibold mb-2">Ship-To:</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Name:</span>
                    <Input
                      value={shipTo.name}
                      onChange={(e) => setShipTo({ ...shipTo, name: e.target.value })}
                      className="h-6 text-xs border-0 bg-transparent px-0 focus-visible:ring-0 font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Address Line 1:</span>
                    <Input
                      value={shipTo.address1}
                      onChange={(e) => setShipTo({ ...shipTo, address1: e.target.value })}
                      className="h-6 text-xs border-0 bg-transparent px-0 focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Address Line 2:</span>
                    <Input
                      value={shipTo.address2}
                      onChange={(e) => setShipTo({ ...shipTo, address2: e.target.value })}
                      className="h-6 text-xs border-0 bg-transparent px-0 focus-visible:ring-0"
                      placeholder="—"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">City:</span>
                    <Input
                      value={shipTo.city}
                      onChange={(e) => setShipTo({ ...shipTo, city: e.target.value })}
                      className="h-6 text-xs border-0 bg-transparent px-0 focus-visible:ring-0 w-20"
                    />
                    <span className="text-muted-foreground">State:</span>
                    <Input
                      value={shipTo.state}
                      onChange={(e) => setShipTo({ ...shipTo, state: e.target.value })}
                      className="h-6 text-xs border-0 bg-transparent px-0 focus-visible:ring-0 w-24"
                    />
                    <span className="text-muted-foreground">Zip:</span>
                    <Input
                      value={shipTo.zip}
                      onChange={(e) => setShipTo({ ...shipTo, zip: e.target.value })}
                      className="h-6 text-xs border-0 bg-transparent px-0 focus-visible:ring-0 w-16"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-24 flex-shrink-0">Phone:</span>
                    <Input
                      value={shipTo.phone}
                      onChange={(e) => setShipTo({ ...shipTo, phone: e.target.value })}
                      className="h-6 text-xs border-0 bg-transparent px-0 focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Quote Details */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold">Quote Details:</h4>
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Pencil className="h-3 w-3" /> Change Branch / Ship-To
                  </button>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 flex-shrink-0">Company Name:</span>
                    <span className="font-medium">{customerName.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 flex-shrink-0">Account #:</span>
                    <span className="font-mono">{quote.customerId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 flex-shrink-0">Branch:</span>
                    <span>{quote.branchName.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-28 flex-shrink-0">Ship Via:</span>
                    <Select value={shipVia} onValueChange={setShipVia}>
                      <SelectTrigger className="h-7 text-xs w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shipViaOptions.map((v) => (
                          <SelectItem key={v} value={v} className="text-xs">{v}</SelectItem>
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

      {/* Order Items button - below header */}
      {!isExpired && quote.status !== "Received (Awarded)" && quote.status !== "Received (Not Awarded)" && (
        <div className="flex justify-end">
          <Button size="sm" className="h-8 text-xs gap-1" onClick={onConvert} disabled={orderableCount === 0}>
            <ArrowRightCircle className="h-3.5 w-3.5" /> Order Items ({orderableCount})
          </Button>
        </div>
      )}
    </div>
  );
}
