import { useState } from "react";
import {
  X, ArrowRightCircle, CheckCircle2, Pencil,
  ChevronDown, ChevronRight, Truck, Building2, FileText, Phone, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency, getGMBgColor,
  type Quote, type ProductGroup, type QuoteItem,
} from "@/data/mockData";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote;
  groups: ProductGroup[];
  totalAmount: number;
  overallGM: number;
}

function calcGroupPurchaseTotal(items: QuoteItem[]) {
  return items
    .filter((i) => i.purchaseQty > 0)
    .reduce((s, i) => s + i.unitPrice * i.purchaseQty, 0);
}

const shipViaOptions = [
  "Deliver HLS Truck",
  "Will Call",
  "UPS Ground",
  "FedEx",
  "Customer Pickup",
];

type Step = "review" | "confirmed";

export default function CheckoutModal({
  open,
  onOpenChange,
  quote,
  groups,
  totalAmount,
  overallGM,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("review");

  // Editable fields mirroring the header
  const [poNumber, setPoNumber] = useState(quote.poNumber || "");
  const [refNumber, setRefNumber] = useState(quote.transactionRef || "");
  const [expDeliveryDate, setExpDeliveryDate] = useState(quote.expirationDate);
  const [shipVia, setShipVia] = useState("Deliver HLS Truck");
  const [shipTo, setShipTo] = useState({
    name: quote.customerName.toUpperCase(),
    address1: "8940 GREENFIELD ROAD",
    address2: "",
    city: "LORETTO",
    state: "Minnesota",
    zip: "55357",
    phone: "7634987574",
  });

  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Only items with purchaseQty > 0
  const purchaseGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.purchaseQty > 0),
    }))
    .filter((g) => g.items.length > 0);

  const purchaseItemCount = purchaseGroups.reduce((s, g) => s + g.items.length, 0);
  const purchaseTotal = purchaseGroups.reduce((s, g) => s + calcGroupPurchaseTotal(g.items), 0);

  const orderRef = `ORD-${Math.floor(Math.random() * 9000) + 1000}`;

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    setStep("confirmed");
  };

  const handleClose = () => {
    setStep("review");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        {step === "review" ? (
          <>
            {/* Header */}
            <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold tracking-tight">Purchase Order Review</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Review details before submitting to Agility
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Order Details Section */}
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Details</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Quote ID</label>
                    <p className="text-sm font-mono mt-1">{quote.id}</p>
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">PO #</label>
                    <Input
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="h-8 text-sm mt-1 font-mono"
                      placeholder="Enter PO #"
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Ref #</label>
                    <Input
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      className="h-8 text-sm mt-1 font-mono"
                      placeholder="Enter Ref #"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Exp. Delivery Date</label>
                    <Input
                      type="date"
                      value={expDeliveryDate}
                      onChange={(e) => setExpDeliveryDate(e.target.value)}
                      className="h-8 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Ship Via</label>
                    <Select value={shipVia} onValueChange={setShipVia}>
                      <SelectTrigger className="h-8 text-sm mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shipViaOptions.map((v) => (
                          <SelectItem key={v} value={v} className="text-sm">{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Customer</label>
                    <p className="text-sm mt-1 font-medium">{quote.customerName}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ship-To Section */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ship-To Address</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                      <Input
                        value={shipTo.name}
                        onChange={(e) => setShipTo({ ...shipTo, name: e.target.value })}
                        className="h-8 text-sm mt-1 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Address Line 1</label>
                      <Input
                        value={shipTo.address1}
                        onChange={(e) => setShipTo({ ...shipTo, address1: e.target.value })}
                        className="h-8 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Address Line 2</label>
                      <Input
                        value={shipTo.address2}
                        onChange={(e) => setShipTo({ ...shipTo, address2: e.target.value })}
                        className="h-8 text-sm mt-1"
                        placeholder="—"
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">City</label>
                        <Input
                          value={shipTo.city}
                          onChange={(e) => setShipTo({ ...shipTo, city: e.target.value })}
                          className="h-8 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">State</label>
                        <Input
                          value={shipTo.state}
                          onChange={(e) => setShipTo({ ...shipTo, state: e.target.value })}
                          className="h-8 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Zip</label>
                        <Input
                          value={shipTo.zip}
                          onChange={(e) => setShipTo({ ...shipTo, zip: e.target.value })}
                          className="h-8 text-sm mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Phone</label>
                      <Input
                        value={shipTo.phone}
                        onChange={(e) => setShipTo({ ...shipTo, phone: e.target.value })}
                        className="h-8 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Items Section */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Items to Purchase ({purchaseItemCount})
                    </h3>
                  </div>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Column headers */}
                  <div className="grid grid-cols-[2fr_80px_80px_100px_100px] gap-0 px-4 py-2 bg-muted/40 border-b border-border text-2xs uppercase tracking-wider font-semibold text-muted-foreground">
                    <div>Product</div>
                    <div className="text-center">Qty</div>
                    <div className="text-center">UOM</div>
                    <div className="text-right">Unit Price</div>
                    <div className="text-right">Ext. Price</div>
                  </div>

                  {purchaseGroups.map((group) => {
                    const isCollapsed = collapsedGroups.has(group.id);
                    const groupTotal = calcGroupPurchaseTotal(group.items);
                    return (
                      <div key={group.id} className="border-b border-border last:border-0">
                        {/* Group header */}
                        <button
                          className="w-full flex items-center gap-2 px-4 py-2.5 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
                          onClick={() => toggleGroup(group.id)}
                        >
                          {isCollapsed ? (
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span className="text-sm font-semibold text-foreground">{group.name}</span>
                          <span className="text-2xs text-muted-foreground">({group.items.length})</span>
                          <span className="flex-1" />
                          <span className="text-sm font-semibold font-mono">{formatCurrency(groupTotal)}</span>
                        </button>

                        {/* Group items */}
                        {!isCollapsed && group.items.map((item, idx) => (
                          <div
                            key={item.id}
                            className={`grid grid-cols-[2fr_80px_80px_100px_100px] gap-0 px-4 py-2.5 border-t border-border/30 items-center ${idx % 2 !== 0 ? "bg-muted/15" : ""}`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm truncate" title={item.productName}>{item.productName}</p>
                              <p className="text-2xs text-muted-foreground font-mono">{item.sku}</p>
                            </div>
                            <div className="text-sm text-center font-medium">{item.purchaseQty}</div>
                            <div className="text-sm text-center text-muted-foreground">{item.uom}</div>
                            <div className="text-sm text-right font-mono">{formatCurrency(item.unitPrice)}</div>
                            <div className="text-sm text-right font-mono font-medium">{formatCurrency(item.unitPrice * item.purchaseQty)}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div className="border-t border-border px-6 py-4 bg-card flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xs uppercase tracking-wider text-muted-foreground font-medium block">Order Total</span>
                    <span className="text-xl font-bold font-mono">{formatCurrency(purchaseTotal)}</span>
                  </div>
                  <span className={`text-xs font-semibold font-mono px-2.5 py-1 rounded-md ${getGMBgColor(overallGM)}`}>
                    {overallGM.toFixed(2)}% GM
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="h-9 text-sm" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 text-sm gap-2 bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm"
                    onClick={handleSubmit}
                    disabled={purchaseItemCount === 0}
                  >
                    <ArrowRightCircle className="h-4 w-4" /> Submit Order to Agility
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Confirmation step */
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">Order Submitted Successfully</h2>
            <p className="text-sm text-muted-foreground mb-1">
              Your order has been submitted to Agility for processing.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              <span className="font-medium text-foreground">{purchaseItemCount} items</span> totaling{" "}
              <span className="font-semibold font-mono text-foreground">{formatCurrency(purchaseTotal)}</span>
            </p>
            <div className="bg-muted/50 rounded-lg border border-border px-6 py-4 mb-8 space-y-2">
              <div className="flex items-center justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Quote ID</span>
                <span className="font-mono font-medium">{quote.id}</span>
              </div>
              <div className="flex items-center justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Order Reference</span>
                <span className="font-mono font-medium">{orderRef}</span>
              </div>
              {poNumber && (
                <div className="flex items-center justify-between gap-8 text-sm">
                  <span className="text-muted-foreground">PO #</span>
                  <span className="font-mono font-medium">{poNumber}</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Ship Via</span>
                <span className="font-medium">{shipVia}</span>
              </div>
              <div className="flex items-center justify-between gap-8 text-sm">
                <span className="text-muted-foreground">Ship To</span>
                <span className="font-medium">{shipTo.name}</span>
              </div>
            </div>
            <Button size="sm" className="h-9 text-sm" onClick={handleClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
