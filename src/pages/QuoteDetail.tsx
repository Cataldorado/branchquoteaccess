import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, Share2, ArrowRightCircle, RefreshCw, Clock, Building2, AlertTriangle,
  History, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  quotes, getStatusColor, getOriginColor, getGMColor, getGMBgColor, getDaysUntilExpiration, formatCurrency,
  type QuoteItem,
} from "@/data/mockData";
import { toast } from "sonner";

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quote = quotes.find((q) => q.id === id);
  const [items, setItems] = useState<QuoteItem[]>(quote?.items || []);
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
  const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const totalCost = items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
  const overallGM = totalAmount > 0 ? Math.round(((totalAmount - totalCost) / totalAmount) * 1000) / 10 : 0;

  const updateItemPrice = (itemId: string, newPrice: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const gm = newPrice > 0 ? Math.round(((newPrice - item.unitCost) / newPrice) * 1000) / 10 : 0;
        return { ...item, unitPrice: newPrice, gmPercent: gm };
      })
    );
  };

  const updateItemQty = (itemId: string, newQty: number) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item)));
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

        {/* Actions */}
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
              setSelectedItems(new Set(items.map((i) => i.id)));
              setConvertOpen(true);
            }}>
              <ArrowRightCircle className="h-3 w-3" /> Convert to Order
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Amount</div>
          <div className="text-xl font-semibold font-mono mt-1">{formatCurrency(totalAmount)}</div>
        </Card>
        <Card className="p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Cost</div>
          <div className="text-xl font-semibold font-mono mt-1">{formatCurrency(totalCost)}</div>
        </Card>
        <Card className="p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Overall GM%</div>
          <div className={`text-xl font-semibold font-mono mt-1 ${getGMColor(overallGM)}`}>{overallGM}%</div>
        </Card>
        <Card className="p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Line Items</div>
          <div className="text-xl font-semibold font-mono mt-1">{items.length}</div>
        </Card>
      </div>

      {/* Line Items */}
      <Card>
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-sm font-semibold">Line Items</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">SKU</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Product</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right w-20">Qty</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Unit Cost</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right w-28">Unit Price</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Line Total</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right w-20">GM%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-3 py-1.5 text-xs font-mono text-muted-foreground">{item.sku}</TableCell>
                <TableCell className="px-3 py-1.5 text-xs">{item.productName}</TableCell>
                <TableCell className="px-3 py-1.5 text-right">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemQty(item.id, parseInt(e.target.value) || 0)}
                    className="h-7 w-16 text-xs text-right ml-auto"
                  />
                </TableCell>
                <TableCell className="px-3 py-1.5 text-xs text-right font-mono text-muted-foreground">{formatCurrency(item.unitCost)}</TableCell>
                <TableCell className="px-3 py-1.5 text-right">
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                    className="h-7 w-24 text-xs text-right ml-auto font-mono"
                  />
                </TableCell>
                <TableCell className="px-3 py-1.5 text-xs text-right font-mono">{formatCurrency(item.unitPrice * item.quantity)}</TableCell>
                <TableCell className="px-3 py-1.5 text-right">
                  <span className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${getGMBgColor(item.gmPercent)}`}>
                    {item.gmPercent}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Quote details */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <h3 className="text-xs font-semibold mb-3">Quote Details</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{quote.createdDate}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expires</span><span>{quote.expirationDate}</span></div>
            {quote.poNumber && <div className="flex justify-between"><span className="text-muted-foreground">PO #</span><span className="font-mono">{quote.poNumber}</span></div>}
            {quote.jobNumber && <div className="flex justify-between"><span className="text-muted-foreground">Job #</span><span className="font-mono">{quote.jobNumber}</span></div>}
            {quote.transactionRef && <div className="flex justify-between"><span className="text-muted-foreground">Tx Ref</span><span className="font-mono">{quote.transactionRef}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Assigned To</span><span>{quote.assignedTo}</span></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold">Pricing History</h3>
            <History className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="text-xs text-muted-foreground text-center py-6">
            No pricing changes recorded yet.
          </div>
        </Card>
      </div>

      {/* Convert to Order Dialog */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Convert to Order</DialogTitle>
            <DialogDescription className="text-xs">Select items to include in the order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-auto">
            {items.map((item) => (
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
                <span className="text-muted-foreground">x{item.quantity}</span>
                <span className="font-mono">{formatCurrency(item.unitPrice * item.quantity)}</span>
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
