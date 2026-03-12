import { useState, useMemo, useRef } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronDown, Plus, Trash2, StickyNote, ArrowLeftRight,
  RefreshCw, AlertTriangle, ArrowLeft, ArrowRightCircle, ShoppingCart, Eye, EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuoteDetailHeader from "@/components/QuoteDetailHeader";
import InventoryStatusDot from "@/components/InventoryStatusDot";
import CheckoutModal from "@/components/CheckoutModal";
import AddItemModal from "@/components/AddItemModal";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const { isManager } = useRole();
  const quote = quotes.find((q) => q.id === id);

  const initialGroups = useMemo(() => {
    if (!quote) return [];
    const groups = [...quote.productGroups];
    if (groups.length < 2) {
      const extraItems: QuoteItem[] = [
        { id: "QI-EXTRA-1", productId: "P008", productName: '2" PVC Pipe Schedule 40 (10ft)', sku: "PVC-40-200-10", quoteQty: 25, purchasedQty: 5, purchaseQty: 0, unitCost: 4.80, unitPrice: 8.50, gmPercent: calcGM(4.80, 8.50), uom: "EA" as UOM },
        { id: "QI-EXTRA-2", productId: "P010", productName: 'Pressure Reducing Valve 3/4"', sku: "PRV-075", quoteQty: 10, purchasedQty: 3, purchaseQty: 0, unitCost: 45.00, unitPrice: 72.50, gmPercent: calcGM(45.00, 72.50), uom: "EA" as UOM },
        { id: "QI-EXTRA-3", productId: "P012", productName: "Expansion Tank 2 Gal", sku: "ET-002", quoteQty: 8, purchasedQty: 0, purchaseQty: 0, unitCost: 28.00, unitPrice: 44.50, gmPercent: calcGM(28.00, 44.50), uom: "EA" as UOM },
      ];
      groups.push({ id: "PG-EXTRA", name: "Valves & Accessories", items: extraItems });
    }
    groups.push({
      id: "PG-PIPE", name: "Pipe & Fittings", items: [
        { id: "QI-P01", productId: "P101", productName: '1" PVC Sch 40 Coupling', sku: "PVC-CPL-100", quoteQty: 50, purchasedQty: 10, purchaseQty: 0, unitCost: 1.20, unitPrice: 2.45, gmPercent: calcGM(1.20, 2.45), uom: "EA" as UOM },
        { id: "QI-P02", productId: "P102", productName: '3/4" PVC 90° Elbow', sku: "PVC-ELB-075", quoteQty: 40, purchasedQty: 0, purchaseQty: 0, unitCost: 0.85, unitPrice: 1.75, gmPercent: calcGM(0.85, 1.75), uom: "EA" as UOM },
        { id: "QI-P03", productId: "P103", productName: '1-1/2" PVC Tee', sku: "PVC-TEE-150", quoteQty: 30, purchasedQty: 15, purchaseQty: 0, unitCost: 2.10, unitPrice: 4.25, gmPercent: calcGM(2.10, 4.25), uom: "EA" as UOM },
        { id: "QI-P04", productId: "P104", productName: '2" PVC Ball Valve Threaded', sku: "PVC-BV-200T", quoteQty: 12, purchasedQty: 0, purchaseQty: 0, unitCost: 8.50, unitPrice: 15.75, gmPercent: calcGM(8.50, 15.75), uom: "EA" as UOM },
        { id: "QI-P05", productId: "P105", productName: '1" Poly Pipe 100ft Coil', sku: "POLY-100-1C", quoteQty: 5, purchasedQty: 2, purchaseQty: 0, unitCost: 32.00, unitPrice: 54.50, gmPercent: calcGM(32.00, 54.50), uom: "RL" as UOM },
        { id: "QI-P06", productId: "P106", productName: '3/4" Brass Adapter MxF', sku: "BRS-ADP-075", quoteQty: 20, purchasedQty: 0, purchaseQty: 0, unitCost: 3.40, unitPrice: 6.80, gmPercent: calcGM(3.40, 6.80), uom: "EA" as UOM },
        { id: "QI-P07", productId: "P107", productName: '1" PVC Union Slip x Slip', sku: "PVC-UNI-100", quoteQty: 15, purchasedQty: 5, purchaseQty: 0, unitCost: 4.25, unitPrice: 8.10, gmPercent: calcGM(4.25, 8.10), uom: "EA" as UOM },
      ]
    });
    groups.push({
      id: "PG-HEADS", name: "Spray Heads & Nozzles", items: [
        { id: "QI-H01", productId: "P201", productName: 'Rain Bird 1804 4" Pop-Up Spray', sku: "RB-1804-4", quoteQty: 60, purchasedQty: 20, purchaseQty: 0, unitCost: 3.15, unitPrice: 5.90, gmPercent: calcGM(3.15, 5.90), uom: "EA" as UOM },
        { id: "QI-H02", productId: "P202", productName: 'Hunter PGP Ultra Rotor', sku: "HNT-PGP-U", quoteQty: 24, purchasedQty: 0, purchaseQty: 0, unitCost: 18.50, unitPrice: 32.00, gmPercent: calcGM(18.50, 32.00), uom: "EA" as UOM },
        { id: "QI-H03", productId: "P203", productName: 'Rain Bird HE-VAN-15 Nozzle', sku: "RB-HEVAN15", quoteQty: 60, purchasedQty: 30, purchaseQty: 0, unitCost: 2.80, unitPrice: 5.25, gmPercent: calcGM(2.80, 5.25), uom: "EA" as UOM },
        { id: "QI-H04", productId: "P204", productName: 'Hunter MP Rotator 1000', sku: "HNT-MP1000", quoteQty: 35, purchasedQty: 0, purchaseQty: 0, unitCost: 5.60, unitPrice: 10.50, gmPercent: calcGM(5.60, 10.50), uom: "EA" as UOM },
        { id: "QI-H05", productId: "P205", productName: 'Toro 570Z 6" Pop-Up Body', sku: "TOR-570Z-6", quoteQty: 20, purchasedQty: 10, purchaseQty: 0, unitCost: 4.10, unitPrice: 7.80, gmPercent: calcGM(4.10, 7.80), uom: "EA" as UOM },
        { id: "QI-H06", productId: "P206", productName: 'Rain Bird 5004 Plus Rotor', sku: "RB-5004P", quoteQty: 18, purchasedQty: 0, purchaseQty: 0, unitCost: 14.20, unitPrice: 26.50, gmPercent: calcGM(14.20, 26.50), uom: "EA" as UOM },
        { id: "QI-H07", productId: "P207", productName: 'Hunter I-20 Stainless Rotor', sku: "HNT-I20SS", quoteQty: 8, purchasedQty: 4, purchaseQty: 0, unitCost: 28.00, unitPrice: 48.75, gmPercent: calcGM(28.00, 48.75), uom: "EA" as UOM },
      ]
    });
    groups.push({
      id: "PG-CTRL", name: "Controllers & Wire", items: [
        { id: "QI-C01", productId: "P301", productName: 'Rain Bird ESP-TM2 8-Station', sku: "RB-TM2-8", quoteQty: 2, purchasedQty: 1, purchaseQty: 0, unitCost: 95.00, unitPrice: 165.00, gmPercent: calcGM(95.00, 165.00), uom: "EA" as UOM },
        { id: "QI-C02", productId: "P302", productName: 'Hunter HC 12-Station WiFi', sku: "HNT-HC12W", quoteQty: 1, purchasedQty: 0, purchaseQty: 0, unitCost: 185.00, unitPrice: 310.00, gmPercent: calcGM(185.00, 310.00), uom: "EA" as UOM },
        { id: "QI-C03", productId: "P303", productName: '18/5 Irrigation Wire 500ft', sku: "WIRE-18-5-500", quoteQty: 3, purchasedQty: 1, purchaseQty: 0, unitCost: 62.00, unitPrice: 105.00, gmPercent: calcGM(62.00, 105.00), uom: "RL" as UOM },
        { id: "QI-C04", productId: "P304", productName: 'Wire Connectors Waterproof (25pk)', sku: "WCON-WP-25", quoteQty: 6, purchasedQty: 0, purchaseQty: 0, unitCost: 12.50, unitPrice: 22.00, gmPercent: calcGM(12.50, 22.00), uom: "BX" as UOM },
        { id: "QI-C05", productId: "P305", productName: 'Rain Bird TBOS-II Battery Controller', sku: "RB-TBOS2", quoteQty: 3, purchasedQty: 0, purchaseQty: 0, unitCost: 78.00, unitPrice: 135.00, gmPercent: calcGM(78.00, 135.00), uom: "EA" as UOM },
        { id: "QI-C06", productId: "P306", productName: 'Decoder Module 2-Wire', sku: "DEC-2W-MOD", quoteQty: 10, purchasedQty: 3, purchaseQty: 0, unitCost: 42.00, unitPrice: 72.50, gmPercent: calcGM(42.00, 72.50), uom: "EA" as UOM },
      ]
    });
    return groups;
  }, [quote]);

  const [groups, setGroups] = useState<ProductGroup[]>(initialGroups);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [expiredResolutionOpen, setExpiredResolutionOpen] = useState(false);
  const [populated, setPopulated] = useState(false);
  const [addItemGroupId, setAddItemGroupId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [panelHidden, setPanelHidden] = useState(false);
  const noteInputRef = useRef<HTMLInputElement>(null);

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
  const orderableTotal = allItems.reduce((s, i) => s + i.unitPrice * i.purchaseQty, 0);

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
            if (field === "purchaseQty") {
              const maxQty = item.quoteQty - item.purchasedQty;
              updated.purchaseQty = Math.min(Math.max(0, value as number), maxQty);
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
          purchaseQty: item.quoteQty - item.purchasedQty,
        })),
      }))
    );
    setPopulated(true);
    toast.info("Purchase quantities populated with remaining qty");
  };

  const showOrderButton = !isExpired && quote.status !== "Received (Awarded)" && quote.status !== "Received (Not Awarded)";

  // Column grid template based on details toggle
  const colTemplate = showDetails
    ? "grid-cols-[minmax(180px,3fr)_minmax(80px,1fr)_minmax(70px,0.7fr)_minmax(70px,0.7fr)_minmax(70px,0.7fr)_minmax(70px,0.7fr)_minmax(100px,1fr)_minmax(60px,0.6fr)_minmax(70px,0.7fr)_minmax(100px,1fr)_36px]"
    : "grid-cols-[minmax(200px,3fr)_minmax(80px,1fr)_minmax(70px,0.7fr)_minmax(70px,0.7fr)_minmax(70px,0.7fr)_minmax(100px,1fr)_minmax(100px,1fr)_36px]";

  // Per-group populate/reset
  const groupPopulated = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;
    return group.items.every(item => item.purchaseQty === item.quoteQty - item.purchasedQty && item.purchaseQty > 0)
      || group.items.some(item => item.purchaseQty > 0);
  };

  const populateGroupQty = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const allFilled = g.items.every(item => item.purchaseQty === item.quoteQty - item.purchasedQty);
      return {
        ...g,
        items: g.items.map(item => ({
          ...item,
          purchaseQty: allFilled ? 0 : item.quoteQty - item.purchasedQty,
        })),
      };
    }));
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-theme(spacing.14)-theme(spacing.10))]">
      {/* LEFT: Item list panel */}
      <div className="flex-1 min-w-0 overflow-auto">
        {/* Back + quote name */}
        <div className="flex items-center gap-3 mb-4">
          <button
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{quote.quoteName}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground font-mono">{quote.id}</span>
              <span className={`text-2xs font-medium px-2 py-0.5 rounded-full border ${getOriginColor(quote.origin)}`}>{quote.origin}</span>
              <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(quote.status)}`}>{quote.status}</span>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 transition-all"
          >
            {showDetails ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            size="sm"
            className={`h-9 text-xs font-semibold px-4 rounded-lg ${
              populated
                ? "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                : "bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm"
            }`}
            onClick={populated ? resetQtyToZero : populateRemainingQty}
          >
            {populated ? "Reset Qty to 0" : "Populate Remaining Qty"}
          </Button>
          <button
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={toggleAllGroups}
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
          {isExpired && (
            <Button size="sm" variant="destructive" className="h-9 text-xs gap-1.5 ml-auto" onClick={() => setExpiredResolutionOpen(true)}>
              <AlertTriangle className="h-3.5 w-3.5" /> Resolve Expired
            </Button>
          )}
        </div>

        {/* Line items */}
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-subtle">
          {/* Column Headers */}
          {showDetails ? (
            <div className={`grid ${colTemplate} gap-0 px-3 py-2.5 bg-muted/40 border-b border-border text-2xs uppercase tracking-wider font-medium text-muted-foreground`}>
              <div className="px-2">Product</div>
              <div className="px-2">SKU</div>
              <div className="px-2 text-right">Cost</div>
              <div className="px-2 text-center">Quote</div>
              <div className="px-2 text-center">Purch'd</div>
              <div className="px-2 text-center">Buy Qty</div>
              <div className="px-2 text-right">Price</div>
              <div className="px-2 text-center">UOM</div>
              <div className="px-2 text-right">GM%</div>
              <div className="px-2 text-right">Ext. Price</div>
              <div />
            </div>
          ) : (
            <div className={`grid ${colTemplate} gap-0 px-3 py-2.5 bg-muted/40 border-b border-border text-2xs uppercase tracking-wider font-medium text-muted-foreground`}>
              <div className="px-2">Product</div>
              <div className="px-2">SKU</div>
              <div className="px-2 text-center">Quote</div>
              <div className="px-2 text-center">Purch'd</div>
              <div className="px-2 text-center">Buy Qty</div>
              <div className="px-2 text-right">Price</div>
              <div className="px-2 text-right">Ext. Price</div>
              <div />
            </div>
          )}

          {/* Product Groups */}
          {groups.map((group) => {
            const isCollapsed = collapsedGroups.has(group.id);
            const gt = groupTotal(group.items);

            return (
              <div key={group.id} className="border-b border-border last:border-0">
                {/* Group Header */}
                <div className={`grid ${colTemplate} gap-0 px-3 py-2.5 bg-muted/20 border-b border-border items-center`}>
                  <div className="flex items-center gap-2 px-2 min-w-0 col-span-5">
                    <button
                      className="flex-shrink-0 flex items-center gap-1 text-foreground hover:text-foreground/70 transition-colors"
                      onClick={() => toggleGroup(group.id)}
                    >
                      {isCollapsed ? (
                        <Plus className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-semibold text-foreground truncate max-w-[300px]">{group.name}</span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom"><p>{group.name}</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-2xs text-muted-foreground flex-shrink-0">({group.items.length})</span>
                    <button
                      className="flex-shrink-0 flex items-center gap-1 text-2xs text-brand hover:underline transition-colors"
                      onClick={() => setAddItemGroupId(group.id)}
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                    {(() => {
                      const allFilled = group.items.every(item => item.purchaseQty === item.quoteQty - item.purchasedQty);
                      return (
                        <button
                          className={`flex-shrink-0 text-2xs font-medium px-2 py-0.5 rounded-md transition-colors ${
                            allFilled
                              ? "text-muted-foreground bg-muted hover:bg-muted/80"
                              : "text-brand bg-brand/10 hover:bg-brand/20"
                          }`}
                          onClick={() => populateGroupQty(group.id)}
                        >
                          {allFilled ? "Reset Qty" : "Populate Qty"}
                        </button>
                      );
                    })()}
                  </div>
                  {showDetails && <><div /><div /><div /></>}
                  <div className="px-2 text-right">
                    <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded-md border ${getGMBgColor(gt.gm)}`}>
                      {gt.gm.toFixed(1)}%
                    </span>
                  </div>
                  <div className="px-2 text-sm text-right font-semibold font-mono">{formatCurrency(gt.amount)}</div>
                  <div />
                </div>

                {/* Group Items */}
                {!isCollapsed && group.items.map((item) => (
                  <div
                    key={item.id}
                    className={`grid ${colTemplate} gap-0 px-3 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors items-center`}
                  >
                    {/* Product */}
                    <div className="flex flex-col gap-0.5 px-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <InventoryStatusDot
                          productId={item.productId}
                          productName={item.productName}
                          sku={item.sku}
                          quoteQty={item.quoteQty}
                          branchId={quote.branchId}
                        />
                        {!item.note && editingNoteId !== item.id && (
                          <button
                            className="flex-shrink-0 text-muted-foreground/30 hover:text-brand transition-colors"
                            title="Add note"
                            onClick={() => {
                              setEditingNoteId(item.id);
                              setNoteText("");
                              setTimeout(() => noteInputRef.current?.focus(), 0);
                            }}
                          >
                            <StickyNote className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <span className="text-sm truncate">{item.productName}</span>
                        <button className="flex-shrink-0 text-muted-foreground/30 hover:text-brand transition-colors ml-auto" title="Replace">
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {editingNoteId === item.id && (
                        <div className="flex items-center gap-1.5 ml-6">
                          <input
                            ref={noteInputRef}
                            type="text"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            onBlur={() => {
                              if (noteText.trim()) updateItemField(group.id, item.id, "note", noteText.trim());
                              setEditingNoteId(null);
                              setNoteText("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                              else if (e.key === "Escape") { setEditingNoteId(null); setNoteText(""); }
                            }}
                            className="flex-1 h-6 text-xs border border-border rounded px-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                            placeholder="Enter note..."
                          />
                        </div>
                      )}
                      {item.note && editingNoteId !== item.id && (
                        <button
                          className="text-2xs text-brand ml-6 text-left truncate hover:underline"
                          onClick={() => { setEditingNoteId(item.id); setNoteText(item.note || ""); setTimeout(() => noteInputRef.current?.focus(), 0); }}
                        >
                          NOTE: {item.note}
                        </button>
                      )}
                    </div>

                    {/* SKU */}
                    <div className="px-2 text-xs font-mono text-muted-foreground truncate">{item.sku}</div>

                    {/* Cost (detail only) */}
                    {showDetails && (
                      <div className="px-2 text-sm text-right font-mono text-muted-foreground">${item.unitCost.toFixed(2)}</div>
                    )}

                    {/* Quote Qty */}
                    <div className="px-1">
                      <Input
                        type="number"
                        value={item.quoteQty}
                        onChange={(e) => updateItemField(group.id, item.id, "quoteQty", parseInt(e.target.value) || 0)}
                        className="h-9 w-full text-sm text-center"
                      />
                    </div>

                    {/* Purchased Qty */}
                    <div className="px-2 text-sm text-center font-mono text-muted-foreground">{item.purchasedQty}</div>

                    {/* Purchase Qty */}
                    <div className="px-1">
                      <Input
                        type="number"
                        value={item.purchaseQty}
                        onChange={(e) => updateItemField(group.id, item.id, "purchaseQty", parseInt(e.target.value) || 0)}
                        className="h-9 w-full text-sm text-center font-semibold"
                      />
                    </div>

                    {/* Price */}
                    <div className="px-1">
                      <div className={`flex items-center h-9 rounded-md border overflow-hidden ${isManager ? "border-border" : "border-border bg-muted/30"}`}>
                        <span className={`px-2 text-xs font-medium h-full flex items-center border-r border-border ${isManager ? "text-muted-foreground bg-muted/30" : "text-muted-foreground bg-muted/50"}`}>$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItemField(group.id, item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          disabled={!isManager}
                          className={`h-full border-0 bg-transparent text-sm text-right font-mono px-2 focus-visible:ring-0 font-medium ${!isManager ? "text-muted-foreground cursor-not-allowed" : ""}`}
                        />
                      </div>
                    </div>

                    {/* UOM (detail only) */}
                    {showDetails && (
                      <div className="px-1">
                        <Select value={item.uom} onValueChange={(val) => updateItemField(group.id, item.id, "uom", val)}>
                          <SelectTrigger className="h-9 text-xs px-2 w-full"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {uomOptions.map((u) => <SelectItem key={u} value={u} className="text-sm">{u}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* GM% (detail only) */}
                    {showDetails && (
                      <div className="px-2 text-right">
                        <span className={`text-xs font-semibold font-mono px-2 py-1 rounded-md ${getGMBgColor(item.gmPercent)}`}>
                          {item.gmPercent.toFixed(1)}%
                        </span>
                      </div>
                    )}

                    {/* Ext Price */}
                    <div className="px-2 text-sm text-right font-mono font-medium">{formatCurrency(item.unitPrice * item.quoteQty)}</div>

                    {/* Delete */}
                    <div className="flex justify-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/30 hover:text-destructive" onClick={() => deleteItem(group.id, item.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Order Summary Panel */}
      <div className="w-[340px] shrink-0 flex flex-col gap-4 overflow-auto">
        {/* Quote info card */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quote Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Customer</span>
              <span className="font-medium text-xs">{quote.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Branch</span>
              <span className="text-xs">{quote.branchName}</span>
            </div>
            {quote.poNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">PO #</span>
                <span className="text-xs font-mono">{quote.poNumber}</span>
              </div>
            )}
            {quote.jobNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Job #</span>
                <span className="text-xs font-mono">{quote.jobNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground text-xs">Expires</span>
              <span className="text-xs">{quote.expirationDate}</span>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4 sticky top-0">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Total Items</span>
              <span className="text-sm font-mono font-medium">{allItems.length}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Quote Total</span>
              <span className="text-lg font-semibold font-mono">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Quote GM%</span>
              <span className={`text-base font-semibold font-mono ${getGMColor(overallGM)}`}>{overallGM.toFixed(1)}%</span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium">Items to Purchase</span>
              <span className="text-sm font-mono font-semibold text-brand">{orderableCount}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium">Purchase Total</span>
              <span className="text-xl font-bold font-mono text-brand">{formatCurrency(orderableTotal)}</span>
            </div>
          </div>

          {/* GM legend */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
            <span className="text-2xs text-muted-foreground font-medium">GM% Legend</span>
            <div className="flex items-center gap-3 text-2xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gm-good" /> Good</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gm-ok" /> Below</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gm-bad" /> Low</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 sticky bottom-0 bg-background pt-2 pb-2">
          <Button
            size="sm"
            className={`w-full h-9 text-xs font-semibold rounded-lg ${
              populated
                ? "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                : "bg-brand/10 text-brand hover:bg-brand/20 border border-brand/20"
            }`}
            onClick={populated ? resetQtyToZero : populateRemainingQty}
          >
            {populated ? "Reset Qty to 0" : "Populate Remaining Qty"}
          </Button>

          {showOrderButton && (
            <Button
              className="w-full h-12 text-sm gap-2 bg-brand text-brand-foreground hover:bg-brand/90 shadow-md rounded-xl font-semibold"
              onClick={() => setCheckoutOpen(true)}
              disabled={orderableCount === 0}
            >
              <ShoppingCart className="h-5 w-5" />
              Purchase Items ({orderableCount})
            </Button>
          )}
        </div>
      </div>

      {/* Modals */}
      {addItemGroupId && (
        <AddItemModal
          open={!!addItemGroupId}
          onOpenChange={(open) => { if (!open) setAddItemGroupId(null); }}
          groupName={groups.find((g) => g.id === addItemGroupId)?.name || ""}
          existingProductIds={allItems.map((i) => i.productId)}
          onConfirm={(newItems) => {
            setGroups((prev) => prev.map((g) => g.id === addItemGroupId ? { ...g, items: [...g.items, ...newItems] } : g));
            toast.success(`Added ${newItems.length} item${newItems.length > 1 ? "s" : ""}`);
            setAddItemGroupId(null);
          }}
        />
      )}

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        quote={quote}
        groups={groups}
        totalAmount={totalAmount}
        overallGM={overallGM}
      />

      <Dialog open={expiredResolutionOpen} onOpenChange={setExpiredResolutionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Resolve Expired Quote</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Choose how to handle this expired quote.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {[
              { label: "Refresh Pricing", desc: "Update all line items to current catalog prices", icon: RefreshCw },
              { label: "Re-quote", desc: "Create a new quote based on this one", icon: ArrowRightCircle },
              { label: "Notify Territory Manager", desc: "Send notification for review and approval", icon: AlertTriangle },
            ].map((opt) => (
              <button
                key={opt.label}
                className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                onClick={() => { toast.success(`${opt.label} initiated for ${quote.id}`); setExpiredResolutionOpen(false); }}
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
