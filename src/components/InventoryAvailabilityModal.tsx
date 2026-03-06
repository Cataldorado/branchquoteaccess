import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { type BranchInventory, getInventoryStatus, type InventoryStatus } from "@/data/mockData";

const statusConfig: Record<InventoryStatus, { color: string; label: string }> = {
  "in-stock": { color: "bg-emerald-500", label: "In Stock" },
  "partial": { color: "bg-amber-400", label: "Partial" },
  "out-of-stock": { color: "bg-red-500", label: "Out of Stock" },
  "unavailable": { color: "bg-gray-300", label: "Unavailable" },
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  sku: string;
  quoteQty: number;
  quotingBranchId: string;
  branchInventory: BranchInventory[];
}

export default function InventoryAvailabilityModal({
  open, onOpenChange, productName, sku, quoteQty, quotingBranchId, branchInventory,
}: Props) {
  const sorted = [...branchInventory].sort((a, b) => b.available - a.available);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Branch Availability</DialogTitle>
          <DialogDescription className="text-xs">
            {productName} <span className="font-mono text-muted-foreground">({sku})</span>
            <span className="ml-2">· Quote Qty: {quoteQty}</span>
          </DialogDescription>
        </DialogHeader>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No eligible branches available for this Ship-To account.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Branch</TableHead>
                <TableHead className="text-xs text-right">Available</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((b) => {
                const status = getInventoryStatus(quoteQty, b.available);
                const cfg = statusConfig[status];
                const isQuoting = b.branchId === quotingBranchId;
                return (
                  <TableRow key={b.branchId} className={isQuoting ? "bg-brand/5" : ""}>
                    <TableCell className="text-sm py-2">
                      {b.branchName}
                      {isQuoting && <span className="ml-1.5 text-2xs text-brand font-medium">(Quoting)</span>}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-right py-2">{b.available}</TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${cfg.color}`} />
                        <span className="text-2xs text-muted-foreground">{cfg.label}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
