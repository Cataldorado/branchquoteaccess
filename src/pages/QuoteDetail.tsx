import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, Share2, ArrowRightCircle, RefreshCw, Clock, Building2, AlertTriangle,
  ChevronRight, ChevronDown, Plus, Trash2, GripVertical, FileText, StickyNote, ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [groups, setGroups] = useState<ProductGroup[]>(quote?.productGroups || []);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [convertOpen, setConvertOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [expiredResolutionOpen, setExpiredResolutionOpen] = useState(false);

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
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold font-mono">{quote.id}</h1>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getOriginColor(quote.origin)}`}>{quote.origin}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getStatusColor(quote.status)}`}>{quote.status}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
            <span>{quote.customerName}</span>
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{quote.branchName}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isExpired ? (
                <span className="text-destructive font-medium">Expired {Math.abs(daysLeft)}d ago</span>
              ) : daysLeft <= 7 ? (
                <span className="text-warning font-medium">{daysLeft}d left</span>
              ) : (
                <span>{daysLeft}d left</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isExpired && (
            <Button size="sm" variant="destructive" className="h-8 text-xs gap-1" onClick={() => setExpiredResolutionOpen(true)}>
              <AlertTriangle className="h-3 w-3" /> Resolve
            </Button>
          )}
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
            <Save className="h-3 w-3" /> Save
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
            <Share2 className="h-3 w-3" /> Share
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
            <RefreshCw className="h-3 w-3" /> Re-quote
          </Button>
          {!isExpired && quote.status !== "Won" && quote.status !== "Lost" && (
            <Button size="sm" className="h-8 text-xs gap-1" onClick={() => {
              setSelectedItems(new Set(allItems.filter((i) => i.purchaseQty > 0).map((i) => i.id)));
              setConvertOpen(true);
            }} disabled={orderableCount === 0}>
              <ArrowRightCircle className="h-3 w-3" /> Order Items ({orderableCount})
            </Button>
          )}
        </div>
      </div>

      {/* Quote Details & Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold mb-3">Quote Details</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{quote.createdDate}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expires</span><span>{quote.expirationDate}</span></div>
            {quote.poNumber && <div className="flex justify-between"><span className="text-muted-foreground">PO #</span><span className="font-mono">{quote.poNumber}</span></div>}
            {quote.jobNumber && <div className="flex justify-between"><span className="text-muted-foreground">Job #</span><span className="font-mono">{quote.jobNumber}</span></div>}
            {quote.transactionRef && <div className="flex justify-between"><span className="text-muted-foreground">Tx Ref</span><span className="font-mono">{quote.transactionRef}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Assigned To</span><span>{quote.assignedTo}</span></div>
          </div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <h3 className="text-xs font-semibold mb-3">Summary</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Total Amount</span><span className="font-mono font-semibold">{formatCurrency(totalAmount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Cost</span><span className="font-mono">{formatCurrency(totalCost)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Overall GM%</span><span className={`font-mono font-semibold ${getGMColor(overallGM)}`}>{overallGM.toFixed(1)}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Product Groups</span><span>{groups.length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Line Items</span><span>{allItems.length}</span></div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border">
          <div />
          <button className="text-xs text-primary hover:underline font-medium" onClick={resetQtyToZero}>
            Reset Qty to 0
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
            <button className="block mx-auto mt-0.5 text-[9px] text-primary hover:underline font-medium normal-case tracking-normal" onClick={populateRemainingQty}>
              Populate Remaining
            </button>
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

              {/* Group Items */}
              {!isCollapsed && group.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(280px,2fr)_100px_80px_80px_80px_100px_80px_80px_90px_40px] gap-0 px-2 py-1.5 border-b border-border/50 last:border-0 hover:bg-muted/30 items-center"
                >
                  {/* Product Description */}
                  <div className="flex items-center gap-1.5 px-2 min-w-0">
                    <GripVertical className="h-3 w-3 text-muted-foreground/50 flex-shrink-0 cursor-grab" />
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

                  {/* Item # */}
                  <div className="px-2 text-xs font-mono text-muted-foreground truncate" title={item.sku}>
                    {item.sku}
                  </div>

                  {/* Cost */}
                  <div className="px-2 text-xs text-right font-mono text-muted-foreground">
                    $ {item.unitCost.toFixed(2)}
                  </div>

                  {/* Quote Qty */}
                  <div className="px-1">
                    <Input
                      type="number"
                      value={item.quoteQty}
                      onChange={(e) => updateItemField(group.id, item.id, "quoteQty", parseInt(e.target.value) || 0)}
                      className="h-7 w-full text-xs text-center"
                    />
                  </div>

                  {/* Purchase Qty */}
                  <div className="px-1">
                    <Input
                      type="number"
                      value={item.purchaseQty}
                      onChange={(e) => updateItemField(group.id, item.id, "purchaseQty", parseInt(e.target.value) || 0)}
                      className="h-7 w-full text-xs text-center"
                    />
                  </div>

                  {/* Price */}
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

                  {/* UOM */}
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

                  {/* GM% */}
                  <div className="px-2 text-right">
                    <span className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${getGMBgColor(item.gmPercent)}`}>
                      {item.gmPercent.toFixed(2)} %
                    </span>
                  </div>

                  {/* Ext. Price */}
                  <div className="px-2 text-xs text-right font-mono font-medium">
                    {formatCurrency(item.unitPrice * item.quoteQty)}
                  </div>

                  {/* Delete */}
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
