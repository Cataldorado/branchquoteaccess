import { useState, useMemo } from "react";
import { Plus, Minus, Search, X, Package } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { products, type Product, type QuoteItem, type UOM } from "@/data/mockData";

interface QueuedItem {
  product: Product;
  qty: number;
}

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupName: string;
  onConfirm: (items: QuoteItem[]) => void;
  existingProductIds?: string[];
}

function calcGM(cost: number, price: number): number {
  return price > 0 ? Math.round(((price - cost) / price) * 1000) / 10 : 0;
}

export default function AddItemModal({
  open,
  onOpenChange,
  groupName,
  onConfirm,
  existingProductIds = [],
}: AddItemModalProps) {
  const [search, setSearch] = useState("");
  const [queue, setQueue] = useState<QueuedItem[]>([]);

  const results = useMemo(() => {
    if (search.length < 3) return [];
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
        !queue.some((qi) => qi.product.id === p.id) &&
        !existingProductIds.includes(p.id)
    );
  }, [search, queue, existingProductIds]);

  const addToQueue = (product: Product) => {
    setQueue((prev) => [...prev, { product, qty: 1 }]);
  };

  const removeFromQueue = (productId: string) => {
    setQueue((prev) => prev.filter((qi) => qi.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) qty = 1;
    setQueue((prev) =>
      prev.map((qi) => (qi.product.id === productId ? { ...qi, qty } : qi))
    );
  };

  const handleConfirm = () => {
    const newItems: QuoteItem[] = queue.map((qi, idx) => ({
      id: `QI-NEW-${Date.now()}-${idx}`,
      productId: qi.product.id,
      productName: qi.product.name,
      sku: qi.product.sku,
      quoteQty: qi.qty,
      purchasedQty: 0,
      purchaseQty: 0,
      unitCost: qi.product.unitCost,
      unitPrice: qi.product.listPrice,
      gmPercent: calcGM(qi.product.unitCost, qi.product.listPrice),
      uom: "EA" as UOM,
    }));
    onConfirm(newItems);
    setSearch("");
    setQueue([]);
    onOpenChange(false);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      setSearch("");
      setQueue([]);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Add Items to {groupName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Left: Search & Results */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU (min 3 chars)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <ScrollArea className="flex-1 border border-border rounded-md">
              {search.length < 3 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Search className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">Type at least 3 characters to search</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No matching items found</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-2xs text-muted-foreground font-mono">{product.sku}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                        ${product.listPrice.toFixed(2)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-brand hover:text-brand hover:bg-brand/10 flex-shrink-0"
                        onClick={() => addToQueue(product)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Right: Queue */}
          <div className="w-56 flex flex-col border border-border rounded-md bg-muted/20 flex-shrink-0">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Queued ({queue.length})
              </span>
            </div>
            <ScrollArea className="flex-1">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground px-3">
                  <Plus className="h-6 w-6 mb-1.5 opacity-30" />
                  <p className="text-xs text-center">Click + to add items here</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {queue.map((qi) => (
                    <div key={qi.product.id} className="px-3 py-2.5">
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <p className="text-xs font-medium leading-tight line-clamp-2">
                          {qi.product.name}
                        </p>
                        <button
                          onClick={() => removeFromQueue(qi.product.id)}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors flex-shrink-0 mt-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xs text-muted-foreground">Qty:</span>
                        <Input
                          type="number"
                          min={1}
                          value={qi.qty}
                          onChange={(e) =>
                            updateQty(qi.product.id, parseInt(e.target.value) || 1)
                          }
                          className="h-6 w-16 text-xs text-center px-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={queue.length === 0}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
          >
            Confirm ({queue.length} {queue.length === 1 ? "item" : "items"})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
