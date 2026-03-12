

## Plan: Quote Item Inventory Status Indicators

### Overview
Add a colored inventory status dot to each quote line item that indicates stock availability at the quoting branch. Clicking the dot opens a modal showing inventory across all eligible branches.

### 1. Mock Inventory Data (`src/data/mockData.ts`)
- Add a `BranchInventory` type: `{ branchId: string; branchName: string; available: number }`
- Add a `generateBranchInventory(productId: string, quoteQty: number)` function that returns mock inventory levels for each of the 6 existing branches, with randomized quantities (some zero, some partial, some full)
- Export a `getInventoryForProduct(productId: string)` function returning `BranchInventory[]`
- Export a helper `getInventoryStatus(quoteQty: number, branchInventory: number)` returning `"in-stock" | "partial" | "out-of-stock" | "unavailable"`

### 2. Inventory Status Dot Component (`src/components/InventoryStatusDot.tsx`)
- Small colored circle: green (in-stock), yellow (partial), red (out-of-stock), gray (unavailable)
- Accepts `productId`, `quoteQty`, `branchId` props
- Computes status from the mock data using the quoting branch's inventory
- Renders a clickable dot with a tooltip showing the status label
- On click, opens the `InventoryAvailabilityModal`

### 3. Inventory Availability Modal (`src/components/InventoryAvailabilityModal.tsx`)
- Dialog showing a table of branches with available inventory for the selected product
- Columns: Branch name, Available Inventory, Status dot per branch
- Sorted by highest availability first
- Highlights the quoting branch row
- Shows "No eligible branches available" message when applicable
- Shows product name and SKU in the header

### 4. Integration into Quote Detail (`src/pages/QuoteDetail.tsx`)
- Add the `InventoryStatusDot` to each item row, placed in the Product Description cell (left of the product name, alongside the existing StickyNote icon)
- Pass the quote's `branchId` and item's `productId` and `quoteQty`
- No changes to the grid column structure needed -- the dot fits inside the existing first column

### Technical Details
- Grid layout remains unchanged (no new columns); the dot is prepended inside the product description cell
- Inventory data is deterministic per product using a seeded approach (product ID hash) so it stays consistent across renders
- Modal uses existing Dialog component from the UI library
- Status colors use Tailwind classes: `bg-emerald-500`, `bg-amber-400`, `bg-red-500`, `bg-gray-300`

