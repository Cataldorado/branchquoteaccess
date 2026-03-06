import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInventoryForProduct, getInventoryStatus, type InventoryStatus } from "@/data/mockData";
import InventoryAvailabilityModal from "./InventoryAvailabilityModal";

const statusConfig: Record<InventoryStatus, { color: string; label: string }> = {
  "in-stock": { color: "bg-emerald-500", label: "In Stock" },
  "partial": { color: "bg-amber-400", label: "Partial" },
  "out-of-stock": { color: "bg-red-500", label: "Out of Stock" },
  "unavailable": { color: "bg-gray-300", label: "Unavailable" },
};

interface Props {
  productId: string;
  productName: string;
  sku: string;
  quoteQty: number;
  branchId: string;
}

export default function InventoryStatusDot({ productId, productName, sku, quoteQty, branchId }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const branchInventory = getInventoryForProduct(productId);
  const quotingBranch = branchInventory.find((b) => b.branchId === branchId);
  const status = quotingBranch ? getInventoryStatus(quoteQty, quotingBranch.available) : "unavailable";
  const cfg = statusConfig[status];

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${cfg.color} cursor-pointer transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1`}
              onClick={() => setModalOpen(true)}
              aria-label={`Inventory status: ${cfg.label}`}
            />
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {cfg.label}
            {quotingBranch && <span className="text-muted-foreground ml-1">({quotingBranch.available} avail.)</span>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <InventoryAvailabilityModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        productName={productName}
        sku={sku}
        quoteQty={quoteQty}
        quotingBranchId={branchId}
        branchInventory={branchInventory}
      />
    </>
  );
}
