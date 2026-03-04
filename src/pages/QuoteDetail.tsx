import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight, ChevronDown, Plus, Trash2, FileText, StickyNote, ArrowLeftRight,
  RefreshCw, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuoteDetailHeader from "@/components/QuoteDetailHeader";
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

  // Ensure at least 2 product groups for display
  const initialGroups = useMemo(() => {
    if (!quote) return [];
    const groups = [...quote.productGroups];
    if (groups.length < 2) {
      // Add a second product group with some items
      const extraItems: QuoteItem[] = [
        {
          id: "QI-EXTRA-1",
          productId: "P008",
          productName: '2" PVC Pipe Schedule 40 (10ft)',
          sku: "PVC-40-200-10",
          quoteQty: 25,
          purchaseQty: 0,
          unitCost: 4.80,
          unitPrice: 8.50,
          gmPercent: calcGM(4.80, 8.50),
          uom: "EA" as UOM,
        },
        {
          id: "QI-EXTRA-2",
          productId: "P010",
          productName: 'Pressure Reducing Valve 3/4"',
          sku: "PRV-075",
          quoteQty: 10,
          purchaseQty: 0,
          unitCost: 45.00,
          unitPrice: 72.50,
          gmPercent: calcGM(45.00, 72.50),
          uom: "EA" as UOM,
        },
        {
          id: "QI-EXTRA-3",
          productId: "P012",
          productName: "Expansion Tank 2 Gal",
          sku: "ET-002",
          quoteQty: 8,
          purchaseQty: 0,
          unitCost: 28.00,
          unitPrice: 44.50,
          gmPercent: calcGM(28.00, 44.50),
          uom: "EA" as UOM,
        },
      ];
      groups.push({
        id: "PG-EXTRA",
        name: "Valves & Accessories",
        items: extraItems,
      });
    }
    return groups;
  }, [quote]);

  const [groups, setGroups] = useState<ProductGroup[]>(initialGroups);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [convertOpen, setConvertOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expiredResolutionOpen, setExpiredResolutionOpen] = useState(false);
  const [populated, setPopulated] = useState(false);

  if (!quote) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Quote not found</p>
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

  const handleConvert = () => {
    toast.success(`Order created from ${quote.id}`, {
      description: `${selectedItems.size} items converted. Order reference: ORD-${Math.floor(Math.random() * 9000) + 1000}`,
    });
    setConvertOpen(false);
  };

  return (
    <div className="space-y-4">
      <QuoteDetailHeader
        quote={quote}
        overallGM={overallGM}
        totalAmount={totalAmount}
        orderableCount={orderableCount}
        isExpired={isExpired}
        onBack={() => navigate(-1)}
        onConvert={() => {
          setSelectedItems(new Set(allItems.filter((i) => i.purchaseQty > 0).map((i) => i.id)));
          setConvertOpen(true);
        }}
        onResolve={() => setExpiredResolutionOpen(true)}
      />

      {/* Line Items Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
          <div />
          <button className="text-xs text-primary hover:underline font-medium" onClick={toggleAllGroups}>
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-2 py-2 bg-muted/20 border-b border-border text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
          <div className="px-2">Product Description</div>
          <div className="px-2">Item #</div>
          <div className="px-2 text-right">Cost</div>
          <div className="px-2 text-center">Quote Qty</div>
          <div className="px-2 text-center">
            <span>Purchase Qty</span>
          </div>
          <div className="px-2 text-right">Price</div>
          <div className="px-2 text-center">UOM</div>
          <div className="px-2 text-right">GM%</div>
          <div className="px-2 text-right">Ext. Price</div>
          <div />
        </div>

        {/* Product Groups */}
        {groups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.id);
          const gt = groupTotal(group.items);

          return (
            <div key={group.id} className="border-b border-border last:border-0">
              {/* Group Header */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/10 border-b border-border">
                <button
                  className="flex items-center gap-1 text-primary hover:text-primary/80"
                  onClick={() => toggleGroup(group.id)}
                >
                  {isCollapsed ? (
                    <Plus className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
                <span className="text-xs font-semibold text-primary">
                  {group.name} ({group.items.length})
                </span>
                <span className="text-[10px] text-muted-foreground mx-1">:</span>
                <button className="flex items-center gap-1 text-[10px] text-primary hover:underline">
                  <Plus className="h-3 w-3" /> Add Item
                </button>
                <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground ml-2">
                  <FileText className="h-3 w-3" /> Add Section Note
                </button>

                <div className="flex-1" />

                <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded border ${getGMBgColor(gt.gm)}`}>
                  {gt.gm.toFixed(2)} %
                </span>
                <span className="text-[10px] text-muted-foreground ml-2">Total :</span>
                <span className="text-xs font-semibold font-mono ml-1">{formatCurrency(gt.amount)}</span>
              </div>

              {/* Per-group Populate Remaining Qty row */}
              {!isCollapsed && (
                <div className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-2 py-1 border-b border-border/50 bg-muted/5">
                  <div /><div /><div /><div />
                  <div className="px-1 text-center">
                    <button
                      className="text-[9px] text-primary hover:underline font-medium"
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
                    </button>
                  </div>
                  <div /><div /><div /><div /><div />
                </div>
              )}

              {/* Group Items */}
              {!isCollapsed && group.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-2 py-1.5 border-b border-border/50 last:border-0 hover:bg-muted/30 items-center"
                >
                  <div className="flex items-center gap-1.5 px-2 min-w-0">
                    <button className="flex-shrink-0 text-muted-foreground/50 hover:text-primary" title="Item note">
                      <StickyNote className="h-3 w-3" />
                    </button>
                    <span className="text-xs truncate" title={item.productName}>
                      {item.productName}
                    </span>
                    <button className="flex-shrink-0 text-muted-foreground/50 hover:text-primary ml-auto" title="Replace item">
                      <ArrowLeftRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="px-2 text-xs font-mono text-muted-foreground truncate" title={item.sku}>
                    {item.sku}
                  </div>

                  <div className="px-2 text-xs text-right font-mono text-muted-foreground">
                    $ {item.unitCost.toFixed(2)}
                  </div>

                  <div className="px-1">
                    <Input
                      type="number"
                      value={item.quoteQty}
                      onChange={(e) => updateItemField(group.id, item.id, "quoteQty", parseInt(e.target.value) || 0)}
                      className="h-7 w-full text-xs text-center"
                    />
                  </div>

                  <div className="px-1">
                    <Input
                      type="number"
                      value={item.purchaseQty}
                      onChange={(e) => updateItemField(group.id, item.id, "purchaseQty", parseInt(e.target.value) || 0)}
                      className="h-7 w-full text-xs text-center"
                    />
                  </div>

                  <div className="px-1">
                    <div className="flex items-center h-7 rounded border border-success/30 bg-success/10 overflow-hidden">
                      <span className="px-1.5 text-xs font-semibold text-success bg-success/20 h-full flex items-center">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItemField(group.id, item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="h-full border-0 bg-transparent text-xs text-right font-mono px-1.5 focus-visible:ring-0 text-success font-semibold"
                      />
                    </div>
                  </div>

                  <div className="px-1">
                    <Select
                      value={item.uom}
                      onValueChange={(val) => updateItemField(group.id, item.id, "uom", val)}
                    >
                      <SelectTrigger className="h-7 text-[10px] px-1.5 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {uomOptions.map((u) => (
                          <SelectItem key={u} value={u} className="text-xs">{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="px-2 text-right">
                    <span className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${getGMBgColor(item.gmPercent)}`}>
                      {item.gmPercent.toFixed(2)} %
                    </span>
                  </div>

                  <div className="px-2 text-xs text-right font-mono font-medium">
                    {formatCurrency(item.unitPrice * item.quoteQty)}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
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
        <div className="flex items-center justify-end gap-4 px-4 py-3 bg-muted/20 border-t border-border">
          <span className={`text-sm font-semibold font-mono px-2 py-0.5 rounded ${getGMBgColor(overallGM)}`}>
            {overallGM.toFixed(2)} %
          </span>
          <span className="text-xs text-muted-foreground">Grand Total :</span>
          <span className="text-base font-bold font-mono">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Convert to Order Dialog */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Convert to Order</DialogTitle>
            <DialogDescription className="text-xs">Select items to include in the order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-auto">
            {allItems.map((item) => (
              <label key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer text-xs">
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={(checked) => {
                    const next = new Set(selectedItems);
                    checked ? next.add(item.id) : next.delete(item.id);
                    setSelectedItems(next);
                  }}
                />
                <span className="flex-1">{item.productName}</span>
                <span className="text-muted-foreground">x{item.quoteQty}</span>
                <span className="font-mono">{formatCurrency(item.unitPrice * item.quoteQty)}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setConvertOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleConvert} disabled={selectedItems.size === 0}>
              Confirm Order ({selectedItems.size} items)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expired Resolution Dialog */}
      <Dialog open={expiredResolutionOpen} onOpenChange={setExpiredResolutionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Resolve Expired Quote</DialogTitle>
            <DialogDescription className="text-xs">Choose how to handle this expired quote.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {[
              { label: "Refresh Pricing", desc: "Update all line items to current catalog prices", icon: RefreshCw },
              { label: "Re-quote", desc: "Create a new quote based on this one", icon: ChevronRight },
              { label: "Notify Territory Manager", desc: "Send notification for review and approval", icon: AlertTriangle },
            ].map((opt) => (
              <button
                key={opt.label}
                className="w-full flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors text-left"
                onClick={() => {
                  toast.success(`${opt.label} initiated for ${quote.id}`);
                  setExpiredResolutionOpen(false);
                }}
              >
                <opt.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs font-medium">{opt.label}</div>
                  <div className="text-[10px] text-muted-foreground">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
