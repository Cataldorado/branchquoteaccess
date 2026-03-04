import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  customers, branches, products, formatCurrency, getGMColor, getGMBgColor,
  type QuoteItem,
} from "@/data/mockData";
import { toast } from "sonner";

type Step = "customer" | "items" | "review";

export default function QuoteCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("customer");
  const [customerId, setCustomerId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [productSearch, setProductSearch] = useState("");

  const filteredProducts = products.filter(
    (p) => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addProduct = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p || items.some((i) => i.productId === productId)) return;
    const gm = Math.round(((p.listPrice - p.unitCost) / p.listPrice) * 1000) / 10;
    setItems([...items, {
      id: `QI-NEW-${items.length + 1}`,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      quoteQty: 1,
      purchaseQty: 0,
      unitCost: p.unitCost,
      unitPrice: p.listPrice,
      gmPercent: gm,
      uom: "EA",
    }]);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const updateItem = (id: string, field: "quoteQty" | "unitPrice", value: number) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "unitPrice") {
        updated.gmPercent = value > 0 ? Math.round(((value - item.unitCost) / value) * 1000) / 10 : 0;
      }
      return updated;
    }));
  };

  const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quoteQty, 0);
  const totalCost = items.reduce((s, i) => s + i.unitCost * i.quoteQty, 0);
  const overallGM = totalAmount > 0 ? Math.round(((totalAmount - totalCost) / totalAmount) * 1000) / 10 : 0;

  const handleSubmit = () => {
    const qId = `QT-${Math.floor(Math.random() * 9000) + 1000}`;
    toast.success(`Quote ${qId} created successfully!`, {
      description: `${items.length} items, Total: ${formatCurrency(totalAmount)}`,
    });
    navigate("/");
  };

  const steps: { key: Step; label: string }[] = [
    { key: "customer", label: "Select Customer" },
    { key: "items", label: "Add Items" },
    { key: "review", label: "Review & Submit" },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">New Quote</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 text-xs">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-colors ${
                step === s.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
              onClick={() => {
                if (s.key === "customer") setStep("customer");
                if (s.key === "items" && customerId && branchId) setStep("items");
                if (s.key === "review" && items.length > 0) setStep("review");
              }}
            >
              <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">{i + 1}</span>
              {s.label}
            </button>
            {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step: Customer */}
      {step === "customer" && (
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1.5 block">Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select customer..." /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name} — {c.accountNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Branch</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select branch..." /></SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">PO Number (optional)</Label>
              <Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className="h-9 text-xs" placeholder="PO-2024-XXXX" />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Job Number (optional)</Label>
              <Input value={jobNumber} onChange={(e) => setJobNumber(e.target.value)} className="h-9 text-xs" placeholder="J-XXX-XXX" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button size="sm" className="text-xs" disabled={!customerId || !branchId} onClick={() => setStep("items")}>
              Continue <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step: Items */}
      {step === "items" && (
        <div className="space-y-3">
          <Card className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
            {productSearch && (
              <div className="mt-2 max-h-48 overflow-auto border border-border rounded">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-muted transition-colors border-b border-border last:border-0"
                    onClick={() => { addProduct(p.id); setProductSearch(""); }}
                  >
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted-foreground ml-2">{p.sku}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">{formatCurrency(p.listPrice)}</span>
                      <Plus className="h-3 w-3 text-primary" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {items.length > 0 && (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3">Product</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right w-20">Qty</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right w-28">Price</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right">Total</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 text-right w-20">GM%</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wider font-semibold h-8 px-3 w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-3 py-1.5 text-xs">{item.productName}</TableCell>
                      <TableCell className="px-3 py-1.5 text-right">
                        <Input type="number" value={item.quoteQty} onChange={(e) => updateItem(item.id, "quoteQty", parseInt(e.target.value) || 0)} className="h-7 w-16 text-xs text-right ml-auto" />
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-right">
                        <Input type="number" step="0.01" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} className="h-7 w-24 text-xs text-right ml-auto font-mono" />
                      </TableCell>
                      <TableCell className="px-3 py-1.5 text-xs text-right font-mono">{formatCurrency(item.unitPrice * item.quoteQty)}</TableCell>
                      <TableCell className="px-3 py-1.5 text-right">
                        <span className={`text-xs font-semibold font-mono px-1.5 py-0.5 rounded ${getGMBgColor(item.gmPercent)}`}>{item.gmPercent}%</span>
                      </TableCell>
                      <TableCell className="px-3 py-1.5">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">{items.length} items</span>
                  <span className={`font-semibold font-mono ${getGMColor(overallGM)}`}>GM: {overallGM}%</span>
                </div>
                <span className="text-sm font-semibold font-mono">{formatCurrency(totalAmount)}</span>
              </div>
            </Card>
          )}

          <div className="flex justify-between">
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setStep("customer")}>
              <ArrowLeft className="h-3 w-3 mr-1" /> Back
            </Button>
            <Button size="sm" className="text-xs" disabled={items.length === 0} onClick={() => setStep("review")}>
              Review <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === "review" && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total</div>
              <div className="text-xl font-semibold font-mono mt-1">{formatCurrency(totalAmount)}</div>
            </Card>
            <Card className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Items</div>
              <div className="text-xl font-semibold font-mono mt-1">{items.length}</div>
            </Card>
            <Card className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Overall GM%</div>
              <div className={`text-xl font-semibold font-mono mt-1 ${getGMColor(overallGM)}`}>{overallGM}%</div>
            </Card>
          </div>
          <Card className="p-4 text-xs space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span>{customers.find((c) => c.id === customerId)?.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Branch</span><span>{branches.find((b) => b.id === branchId)?.name}</span></div>
            {poNumber && <div className="flex justify-between"><span className="text-muted-foreground">PO #</span><span className="font-mono">{poNumber}</span></div>}
            {jobNumber && <div className="flex justify-between"><span className="text-muted-foreground">Job #</span><span className="font-mono">{jobNumber}</span></div>}
          </Card>
          <div className="flex justify-between">
            <Button size="sm" variant="outline" className="text-xs" onClick={() => setStep("items")}>
              <ArrowLeft className="h-3 w-3 mr-1" /> Back
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={handleSubmit}>Save as Draft</Button>
              <Button size="sm" className="text-xs" onClick={handleSubmit}>Submit Quote</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
