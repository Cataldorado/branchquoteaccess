import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronDown, Plus, Trash2, FileText, StickyNote, ArrowLeftRight,
  RefreshCw, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuoteDetailHeader from "@/components/QuoteDetailHeader";
import InventoryStatusDot from "@/components/InventoryStatusDot";
import CheckoutModal from "@/components/CheckoutModal";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  quotes, getStatusColor, getOriginColor, getGMColor, getGMBgColor, getDaysUntilExpiration, formatCurrency,
  type QuoteItem, type ProductGroup, type UOM,
} from "@/data/mockData";
import { toast } from "sonner";

function calcGM(cost: number, price: number): number {
  return price > 0 ? Math.round(((price - cost) / price) * 1000) / 10 : 0;
}

function groupTotal(items: QuoteItem[]) {
  const amount = items.reduce((s, i) => s + i.unitPrice * i.quoteQty, 0);
  const cost = items.reduce((s, i) => s + i.unitCost * i.quoteQty, 0);
  return { amount, cost, gm: calcGM(cost, amount) };
}

const uomOptions: UOM[] = ["EA", "FT", "LF", "BX", "CS", "RL"];

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quote = quotes.find((q) => q.id === id);

  const initialGroups = useMemo(() => {
    if (!quote) return [];
    const groups = [...quote.productGroups];
    if (groups.length < 2) {
      const extraItems: QuoteItem[] = [
        { id: "QI-EXTRA-1", productId: "P008", productName: '2" PVC Pipe Schedule 40 (10ft)', sku: "PVC-40-200-10", quoteQty: 25, purchaseQty: 0, unitCost: 4.80, unitPrice: 8.50, gmPercent: calcGM(4.80, 8.50), uom: "EA" as UOM },
        { id: "QI-EXTRA-2", productId: "P010", productName: 'Pressure Reducing Valve 3/4"', sku: "PRV-075", quoteQty: 10, purchaseQty: 0, unitCost: 45.00, unitPrice: 72.50, gmPercent: calcGM(45.00, 72.50), uom: "EA" as UOM },
        { id: "QI-EXTRA-3", productId: "P012", productName: "Expansion Tank 2 Gal", sku: "ET-002", quoteQty: 8, purchaseQty: 0, unitCost: 28.00, unitPrice: 44.50, gmPercent: calcGM(28.00, 44.50), uom: "EA" as UOM },
      ];
      groups.push({ id: "PG-EXTRA", name: "Valves & Accessories", items: extraItems });
    }
    // Add additional product groups with more items for scrollable content
    groups.push({
      id: "PG-PIPE", name: "Pipe & Fittings", items: [
        { id: "QI-P01", productId: "P101", productName: '1" PVC Sch 40 Coupling', sku: "PVC-CPL-100", quoteQty: 50, purchaseQty: 0, unitCost: 1.20, unitPrice: 2.45, gmPercent: calcGM(1.20, 2.45), uom: "EA" as UOM },
        { id: "QI-P02", productId: "P102", productName: '3/4" PVC 90° Elbow', sku: "PVC-ELB-075", quoteQty: 40, purchaseQty: 0, unitCost: 0.85, unitPrice: 1.75, gmPercent: calcGM(0.85, 1.75), uom: "EA" as UOM },
        { id: "QI-P03", productId: "P103", productName: '1-1/2" PVC Tee', sku: "PVC-TEE-150", quoteQty: 30, purchaseQty: 0, unitCost: 2.10, unitPrice: 4.25, gmPercent: calcGM(2.10, 4.25), uom: "EA" as UOM },
        { id: "QI-P04", productId: "P104", productName: '2" PVC Ball Valve Threaded', sku: "PVC-BV-200T", quoteQty: 12, purchaseQty: 0, unitCost: 8.50, unitPrice: 15.75, gmPercent: calcGM(8.50, 15.75), uom: "EA" as UOM },
        { id: "QI-P05", productId: "P105", productName: '1" Poly Pipe 100ft Coil', sku: "POLY-100-1C", quoteQty: 5, purchaseQty: 0, unitCost: 32.00, unitPrice: 54.50, gmPercent: calcGM(32.00, 54.50), uom: "RL" as UOM },
        { id: "QI-P06", productId: "P106", productName: '3/4" Brass Adapter MxF', sku: "BRS-ADP-075", quoteQty: 20, purchaseQty: 0, unitCost: 3.40, unitPrice: 6.80, gmPercent: calcGM(3.40, 6.80), uom: "EA" as UOM },
        { id: "QI-P07", productId: "P107", productName: '1" PVC Union Slip x Slip', sku: "PVC-UNI-100", quoteQty: 15, purchaseQty: 0, unitCost: 4.25, unitPrice: 8.10, gmPercent: calcGM(4.25, 8.10), uom: "EA" as UOM },
      ]
    });
    groups.push({
      id: "PG-HEADS", name: "Spray Heads & Nozzles", items: [
        { id: "QI-H01", productId: "P201", productName: 'Rain Bird 1804 4" Pop-Up Spray', sku: "RB-1804-4", quoteQty: 60, purchaseQty: 0, unitCost: 3.15, unitPrice: 5.90, gmPercent: calcGM(3.15, 5.90), uom: "EA" as UOM },
        { id: "QI-H02", productId: "P202", productName: 'Hunter PGP Ultra Rotor', sku: "HNT-PGP-U", quoteQty: 24, purchaseQty: 0, unitCost: 18.50, unitPrice: 32.00, gmPercent: calcGM(18.50, 32.00), uom: "EA" as UOM },
        { id: "QI-H03", productId: "P203", productName: 'Rain Bird HE-VAN-15 Nozzle', sku: "RB-HEVAN15", quoteQty: 60, purchaseQty: 0, unitCost: 2.80, unitPrice: 5.25, gmPercent: calcGM(2.80, 5.25), uom: "EA" as UOM },
        { id: "QI-H04", productId: "P204", productName: 'Hunter MP Rotator 1000', sku: "HNT-MP1000", quoteQty: 35, purchaseQty: 0, unitCost: 5.60, unitPrice: 10.50, gmPercent: calcGM(5.60, 10.50), uom: "EA" as UOM },
        { id: "QI-H05", productId: "P205", productName: 'Toro 570Z 6" Pop-Up Body', sku: "TOR-570Z-6", quoteQty: 20, purchaseQty: 0, unitCost: 4.10, unitPrice: 7.80, gmPercent: calcGM(4.10, 7.80), uom: "EA" as UOM },
        { id: "QI-H06", productId: "P206", productName: 'Rain Bird 5004 Plus Rotor', sku: "RB-5004P", quoteQty: 18, purchaseQty: 0, unitCost: 14.20, unitPrice: 26.50, gmPercent: calcGM(14.20, 26.50), uom: "EA" as UOM },
        { id: "QI-H07", productId: "P207", productName: 'Hunter I-20 Stainless Rotor', sku: "HNT-I20SS", quoteQty: 8, purchaseQty: 0, unitCost: 28.00, unitPrice: 48.75, gmPercent: calcGM(28.00, 48.75), uom: "EA" as UOM },
      ]
    });
    groups.push({
      id: "PG-CTRL", name: "Controllers & Wire", items: [
        { id: "QI-C01", productId: "P301", productName: 'Rain Bird ESP-TM2 8-Station', sku: "RB-TM2-8", quoteQty: 2, purchaseQty: 0, unitCost: 95.00, unitPrice: 165.00, gmPercent: calcGM(95.00, 165.00), uom: "EA" as UOM },
        { id: "QI-C02", productId: "P302", productName: 'Hunter HC 12-Station WiFi', sku: "HNT-HC12W", quoteQty: 1, purchaseQty: 0, unitCost: 185.00, unitPrice: 310.00, gmPercent: calcGM(185.00, 310.00), uom: "EA" as UOM },
        { id: "QI-C03", productId: "P303", productName: '18/5 Irrigation Wire 500ft', sku: "WIRE-18-5-500", quoteQty: 3, purchaseQty: 0, unitCost: 62.00, unitPrice: 105.00, gmPercent: calcGM(62.00, 105.00), uom: "RL" as UOM },
        { id: "QI-C04", productId: "P304", productName: 'Wire Connectors Waterproof (25pk)', sku: "WCON-WP-25", quoteQty: 6, purchaseQty: 0, unitCost: 12.50, unitPrice: 22.00, gmPercent: calcGM(12.50, 22.00), uom: "BX" as UOM },
        { id: "QI-C05", productId: "P305", productName: 'Rain Bird TBOS-II Battery Controller', sku: "RB-TBOS2", quoteQty: 3, purchaseQty: 0, unitCost: 78.00, unitPrice: 135.00, gmPercent: calcGM(78.00, 135.00), uom: "EA" as UOM },
        { id: "QI-C06", productId: "P306", productName: 'Decoder Module 2-Wire', sku: "DEC-2W-MOD", quoteQty: 10, purchaseQty: 0, unitCost: 42.00, unitPrice: 72.50, gmPercent: calcGM(42.00, 72.50), uom: "EA" as UOM },
      ]
    });
    return groups;
  }, [quote]);

  const [groups, setGroups] = useState<ProductGroup[]>(initialGroups);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [expiredResolutionOpen, setExpiredResolutionOpen] = useState(false);
  const [populated, setPopulated] = useState(false);

  if (!quote) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-sm">Quote not found</p>
      </div>
    );
  }

  const daysLeft = getDaysUntilExpiration(quote.expirationDate);
  const isExpired = quote.status === "Expired";
  const allItems = groups.flatMap((g) => g.items);
  const totalAmount = allItems.reduce((s, i) => s + i.unitPrice * i.quoteQty, 0);
  const totalCost = allItems.reduce((s, i) => s + i.unitCost * i.quoteQty, 0);
  const overallGM = calcGM(totalCost, totalAmount);
  const orderableCount = allItems.filter((i) => i.purchaseQty > 0).length;

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(groupId) ? next.delete(groupId) : next.add(groupId);
      return next;
    });
  };

  const allExpanded = collapsedGroups.size === 0;
  const toggleAllGroups = () => {
    if (allExpanded) {
      setCollapsedGroups(new Set(groups.map((g) => g.id)));
    } else {
      setCollapsedGroups(new Set());
    }
  };

  const updateItemField = (groupId: string, itemId: string, field: string, value: number | string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((item) => {
            if (item.id !== itemId) return item;
            const updated = { ...item, [field]: value };
            if (field === "unitPrice") {
              updated.gmPercent = calcGM(item.unitCost, value as number);
            }
            return updated;
          }),
        };
      })
    );
  };

  const deleteItem = (groupId: string, itemId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return { ...g, items: g.items.filter((i) => i.id !== itemId) };
      }).filter((g) => g.items.length > 0)
    );
  };

  const resetQtyToZero = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((item) => ({ ...item, purchaseQty: 0 })),
      }))
    );
    setPopulated(false);
    toast.info("All purchase quantities reset to 0");
  };

  const populateRemainingQty = () => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        items: g.items.map((item) => ({
          ...item,
          purchaseQty: item.quoteQty,
        })),
      }))
    );
    setPopulated(true);
    toast.info("Purchase quantities populated with remaining qty");
  };

  // handleConvert removed – checkout modal handles submission

  return (
    <div className="space-y-5 max-w-[1400px]">
      <QuoteDetailHeader
        quote={quote}
        overallGM={overallGM}
        totalAmount={totalAmount}
        orderableCount={orderableCount}
        isExpired={isExpired}
        onBack={() => navigate(-1)}
        onConvert={() => setCheckoutOpen(true)}
        onResolve={() => setExpiredResolutionOpen(true)}
      />

      {/* Line Items Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card shadow-subtle">
        {/* Table Header with Populate button */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <span className="text-xs font-medium text-muted-foreground">Line Items</span>
          <button
            className="text-xs text-brand hover:underline font-medium transition-colors"
            onClick={toggleAllGroups}
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* Column Headers with Populate button */}
        <div className="relative">
          {/* Populate button row - positioned to align with Purchase Qty column */}
          <div className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-3">
            <div /><div /><div /><div />
            <div className="flex justify-center py-2">
              <Button
                size="sm"
                className={`h-7 text-[10px] font-semibold px-4 rounded-full whitespace-nowrap ${
                  populated
                    ? "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                    : "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm"
                }`}
                onClick={populated ? resetQtyToZero : populateRemainingQty}
              >
                {populated ? "Reset Qty to 0" : "Populate Remaining Qty"}
              </Button>
            </div>
            <div /><div /><div /><div /><div />
          </div>
          {/* Actual column headers */}
          <div className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-3 py-2.5 bg-muted/40 border-b border-border text-2xs uppercase tracking-wider font-medium text-muted-foreground">
            <div className="px-2">Product Description</div>
            <div className="px-2">Item #</div>
            <div className="px-2 text-right">Cost</div>
            <div className="px-2 text-center">Quote</div>
            <div className="px-2 text-center">Purchase Qty</div>
            <div className="px-2 text-right">Price</div>
            <div className="px-2 text-center">UOM</div>
            <div className="px-2 text-right">GM%</div>
            <div className="px-2 text-right">Ext. Price</div>
            <div />
          </div>
        </div>

        {/* Product Groups */}
        {groups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.id);
          const gt = groupTotal(group.items);

          return (
            <div key={group.id} className="border-b border-border last:border-0">
              {/* Group Header */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-muted/20 border-b border-border">
                <button
                  className="flex items-center gap-1 text-foreground hover:text-foreground/70 transition-colors"
                  onClick={() => toggleGroup(group.id)}
                >
                  {isCollapsed ? (
                    <Plus className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                <span className="text-sm font-semibold text-foreground">
                  {group.name}
                </span>
                <span className="text-2xs text-muted-foreground">({group.items.length})</span>
                <span className="text-muted-foreground/30 mx-0.5">·</span>
                <button className="flex items-center gap-1 text-2xs text-brand hover:underline transition-colors">
                  <Plus className="h-3 w-3" /> Add Item
                </button>

                <div className="flex-1" />

                <span className={`text-xs font-semibold font-mono px-2.5 py-1 rounded-md border ${getGMBgColor(gt.gm)}`}>
                  {gt.gm.toFixed(2)}%
                </span>
                <span className="text-2xs text-muted-foreground ml-3">Total</span>
                <span className="text-sm font-semibold font-mono ml-1.5">{formatCurrency(gt.amount)}</span>
              </div>

              {/* Per-group Populate Remaining Qty row */}
              {!isCollapsed && (
                <div className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-3 py-2 border-b border-border/50 bg-muted/10">
                  <div /><div /><div /><div />
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      className={`h-7 text-[10px] font-semibold px-4 rounded-full whitespace-nowrap ${
                        group.items.every((i) => i.purchaseQty >= i.quoteQty)
                          ? "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                          : "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm"
                      }`}
                      onClick={() => {
                        const allPopulated = group.items.every((i) => i.purchaseQty >= i.quoteQty);
                        setGroups((prev) =>
                          prev.map((g) => {
                            if (g.id !== group.id) return g;
                            return {
                              ...g,
                              items: g.items.map((item) => ({
                                ...item,
                                purchaseQty: allPopulated ? 0 : item.quoteQty,
                              })),
                            };
                          })
                        );
                        toast.info(allPopulated ? `Reset quantities for ${group.name}` : `Populated quantities for ${group.name}`);
                      }}
                    >
                      {group.items.every((i) => i.purchaseQty >= i.quoteQty) ? "Reset Qty to 0" : "Populate Remaining Qty"}
                    </Button>
                  </div>
                  <div /><div /><div /><div /><div />
                </div>
              )}

              {/* Group Items */}
              {!isCollapsed && group.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-3 py-2 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors items-center"
                >
                  <div className="flex items-center gap-2 px-2 min-w-0">
                    <InventoryStatusDot
                      productId={item.productId}
                      productName={item.productName}
                      sku={item.sku}
                      quoteQty={item.quoteQty}
                      branchId={quote.branchId}
                    />
                    <button className="flex-shrink-0 text-muted-foreground/30 hover:text-brand transition-colors" title="Item note">
                      <StickyNote className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm truncate" title={item.productName}>
                      {item.productName}
                    </span>
                    <button className="flex-shrink-0 text-muted-foreground/30 hover:text-brand transition-colors ml-auto" title="Replace item">
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="px-2 text-sm font-mono text-muted-foreground truncate" title={item.sku}>
                    {item.sku}
                  </div>

                  <div className="px-2 text-sm text-right font-mono text-muted-foreground">
                    ${item.unitCost.toFixed(2)}
                  </div>

                  <div className="px-1">
                    <Input
                      type="number"
                      value={item.quoteQty}
                      onChange={(e) => updateItemField(group.id, item.id, "quoteQty", parseInt(e.target.value) || 0)}
                      className="h-8 w-full text-sm text-center"
                    />
                  </div>

                  <div className="px-1">
                    <Input
                      type="number"
                      value={item.purchaseQty}
                      onChange={(e) => updateItemField(group.id, item.id, "purchaseQty", parseInt(e.target.value) || 0)}
                      className="h-8 w-full text-sm text-center"
                    />
                  </div>

                  <div className="px-1">
                    <div className="flex items-center h-8 rounded-md border border-success/20 bg-success/5 overflow-hidden">
                      <span className="px-2 text-xs font-medium text-success bg-success/10 h-full flex items-center border-r border-success/20">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItemField(group.id, item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="h-full border-0 bg-transparent text-sm text-right font-mono px-2 focus-visible:ring-0 text-success font-medium"
                      />
                    </div>
                  </div>

                  <div className="px-1">
                    <Select
                      value={item.uom}
                      onValueChange={(val) => updateItemField(group.id, item.id, "uom", val)}
                    >
                      <SelectTrigger className="h-8 text-xs px-2 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uomOptions.map((u) => (
                          <SelectItem key={u} value={u} className="text-sm">{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="px-2 text-right">
                    <span className={`text-xs font-semibold font-mono px-2 py-1 rounded-md ${getGMBgColor(item.gmPercent)}`}>
                      {item.gmPercent.toFixed(1)}%
                    </span>
                  </div>

                  <div className="px-2 text-sm text-right font-mono font-medium">
                    {formatCurrency(item.unitPrice * item.quoteQty)}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground/30 hover:text-destructive transition-colors"
                      onClick={() => deleteItem(group.id, item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* Footer Totals */}
        <div className="flex items-center justify-end gap-5 px-5 py-4 bg-muted/30 border-t border-border">
          <span className={`text-sm font-semibold font-mono px-2.5 py-1 rounded-md ${getGMBgColor(overallGM)}`}>
            {overallGM.toFixed(2)}%
          </span>
          <div className="text-right">
            <span className="text-2xs uppercase tracking-wider text-muted-foreground font-medium block mb-0.5">Grand Total</span>
            <span className="text-lg font-semibold font-mono">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        quote={quote}
        groups={groups}
        totalAmount={totalAmount}
        overallGM={overallGM}
      />

      {/* Expired Resolution Dialog */}
      <Dialog open={expiredResolutionOpen} onOpenChange={setExpiredResolutionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Resolve Expired Quote</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Choose how to handle this expired quote.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {[
              { label: "Refresh Pricing", desc: "Update all line items to current catalog prices", icon: RefreshCw },
              { label: "Re-quote", desc: "Create a new quote based on this one", icon: ChevronRight },
              { label: "Notify Territory Manager", desc: "Send notification for review and approval", icon: AlertTriangle },
            ].map((opt) => (
              <button
                key={opt.label}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                onClick={() => {
                  toast.success(`${opt.label} initiated for ${quote.id}`);
                  setExpiredResolutionOpen(false);
                }}
              >
                <opt.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
