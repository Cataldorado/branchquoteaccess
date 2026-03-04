// ---- Types ----
export type QuoteOrigin = "H+" | "Agility" | "Both";
export type QuoteStatus = "Draft" | "Sent" | "Negotiating" | "Won" | "Lost" | "Expired";

export interface Branch {
  id: string;
  name: string;
  region: string;
}

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  contactEmail: string;
  contactPhone: string;
}

export interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  gmPercent: number;
  qtyReleased?: number;
}

export interface PricingHistory {
  timestamp: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  branchId: string;
  branchName: string;
  origin: QuoteOrigin;
  status: QuoteStatus;
  createdDate: string;
  expirationDate: string;
  poNumber?: string;
  jobNumber?: string;
  transactionRef?: string;
  items: QuoteItem[];
  gmPercent: number;
  totalAmount: number;
  totalCost: number;
  notes?: string;
  pricingHistory: PricingHistory[];
  assignedTo: string;
}

export interface Order {
  id: string;
  quoteId: string;
  purchaseTimestamp: string;
  totalAmount: number;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitCost: number;
  listPrice: number;
}

// ---- Data ----

export const branches: Branch[] = [
  { id: "BR001", name: "Downtown Main", region: "Northeast" },
  { id: "BR002", name: "Westside Industrial", region: "West" },
  { id: "BR003", name: "Southport Hub", region: "Southeast" },
  { id: "BR004", name: "Northgate Center", region: "Northeast" },
  { id: "BR005", name: "Lakeside Depot", region: "Midwest" },
  { id: "BR006", name: "Riverside Branch", region: "West" },
];

export const customers: Customer[] = [
  { id: "C001", name: "Apex Construction", accountNumber: "ACX-10042", contactEmail: "orders@apexconst.com", contactPhone: "(555) 123-4567" },
  { id: "C002", name: "Metro Plumbing Co", accountNumber: "MPC-20081", contactEmail: "purchasing@metroplumb.com", contactPhone: "(555) 234-5678" },
  { id: "C003", name: "Valley Mechanical", accountNumber: "VME-30019", contactEmail: "quotes@valleymech.com", contactPhone: "(555) 345-6789" },
  { id: "C004", name: "Summit HVAC Systems", accountNumber: "SHS-40055", contactEmail: "procurement@summithvac.com", contactPhone: "(555) 456-7890" },
  { id: "C005", name: "Ironclad Fabrication", accountNumber: "ICF-50027", contactEmail: "orders@ironcladfab.com", contactPhone: "(555) 567-8901" },
  { id: "C006", name: "Pacific Pipe & Supply", accountNumber: "PPS-60033", contactEmail: "buying@pacificpipe.com", contactPhone: "(555) 678-9012" },
  { id: "C007", name: "Harbor Electric", accountNumber: "HBE-70014", contactEmail: "quotes@harborelec.com", contactPhone: "(555) 789-0123" },
  { id: "C008", name: "Greenfield Builders", accountNumber: "GFB-80046", contactEmail: "orders@greenfieldbl.com", contactPhone: "(555) 890-1234" },
  { id: "C009", name: "Titan Industrial", accountNumber: "TIN-90028", contactEmail: "purchasing@titanind.com", contactPhone: "(555) 901-2345" },
  { id: "C010", name: "CrossPoint Contractors", accountNumber: "CPC-10061", contactEmail: "bids@crosspoint.com", contactPhone: "(555) 012-3456" },
];

export const products: Product[] = [
  { id: "P001", name: '1/2" Copper Pipe Type L (10ft)', sku: "CU-L-050-10", category: "Copper Pipe", unitCost: 18.50, listPrice: 28.75 },
  { id: "P002", name: '3/4" Copper Pipe Type L (10ft)', sku: "CU-L-075-10", category: "Copper Pipe", unitCost: 26.30, listPrice: 40.90 },
  { id: "P003", name: '1" Copper Pipe Type M (10ft)', sku: "CU-M-100-10", category: "Copper Pipe", unitCost: 32.10, listPrice: 49.95 },
  { id: "P004", name: '1/2" PEX Tubing Red (100ft)', sku: "PEX-R-050-100", category: "PEX", unitCost: 28.00, listPrice: 45.50 },
  { id: "P005", name: '3/4" PEX Tubing Blue (100ft)', sku: "PEX-B-075-100", category: "PEX", unitCost: 35.00, listPrice: 56.80 },
  { id: "P006", name: "Tankless Water Heater 199K BTU", sku: "WH-TL-199K", category: "Water Heaters", unitCost: 890.00, listPrice: 1350.00 },
  { id: "P007", name: "50 Gal Electric Water Heater", sku: "WH-EL-050", category: "Water Heaters", unitCost: 420.00, listPrice: 650.00 },
  { id: "P008", name: '2" PVC Pipe Schedule 40 (10ft)', sku: "PVC-40-200-10", category: "PVC Pipe", unitCost: 4.80, listPrice: 8.50 },
  { id: "P009", name: '4" Cast Iron Pipe (5ft)', sku: "CI-400-5", category: "Cast Iron", unitCost: 22.00, listPrice: 36.75 },
  { id: "P010", name: "Pressure Reducing Valve 3/4\"", sku: "PRV-075", category: "Valves", unitCost: 45.00, listPrice: 72.50 },
  { id: "P011", name: "Ball Valve 1\" Full Port", sku: "BV-100-FP", category: "Valves", unitCost: 12.50, listPrice: 21.00 },
  { id: "P012", name: "Expansion Tank 2 Gal", sku: "ET-002", category: "Tanks", unitCost: 28.00, listPrice: 44.50 },
  { id: "P013", name: "Circulator Pump 1/25 HP", sku: "CP-025HP", category: "Pumps", unitCost: 95.00, listPrice: 155.00 },
  { id: "P014", name: "ProPress Fitting Kit 1/2\"", sku: "PP-KIT-050", category: "Fittings", unitCost: 185.00, listPrice: 295.00 },
  { id: "P015", name: "Copper Elbow 90° 3/4\"", sku: "CE-90-075", category: "Fittings", unitCost: 1.80, listPrice: 3.25 },
];

function calcGM(cost: number, price: number): number {
  return price > 0 ? Math.round(((price - cost) / price) * 1000) / 10 : 0;
}

function makeItems(indices: number[], qtyRange: [number, number], priceVariance: number): QuoteItem[] {
  return indices.map((i, idx) => {
    const p = products[i];
    const qty = Math.floor(Math.random() * (qtyRange[1] - qtyRange[0] + 1)) + qtyRange[0];
    const price = Math.round(p.listPrice * (1 + (Math.random() * priceVariance * 2 - priceVariance)) * 100) / 100;
    return {
      id: `QI-${idx + 1}`,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      quantity: qty,
      unitCost: p.unitCost,
      unitPrice: price,
      gmPercent: calcGM(p.unitCost, price),
    };
  });
}

function quoteFromItems(items: QuoteItem[]): { totalAmount: number; totalCost: number; gmPercent: number } {
  const totalAmount = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const totalCost = items.reduce((s, i) => s + i.unitCost * i.quantity, 0);
  return { totalAmount: Math.round(totalAmount * 100) / 100, totalCost: Math.round(totalCost * 100) / 100, gmPercent: calcGM(totalCost, totalAmount) };
}

const statuses: QuoteStatus[] = ["Draft", "Sent", "Negotiating", "Won", "Lost", "Expired"];
const origins: QuoteOrigin[] = ["H+", "Agility", "Both"];
const users = ["jsmith", "mgarcia", "tlee", "awright", "kpatel"];

function randomDate(daysBack: number, daysForward: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysBack + Math.floor(Math.random() * (daysBack + daysForward)));
  return d.toISOString().split("T")[0];
}

function generateQuotes(): Quote[] {
  const configs: Array<{
    custIdx: number; branchIdx: number; origin: QuoteOrigin; status: QuoteStatus;
    itemIndices: number[]; qtyRange: [number, number]; priceVar: number;
    po?: string; job?: string; txRef?: string; daysBack: number; expDays: number;
  }> = [
    { custIdx: 0, branchIdx: 0, origin: "H+", status: "Negotiating", itemIndices: [0, 1, 14], qtyRange: [10, 50], priceVar: 0.05, po: "PO-2024-1001", job: "J-APX-440", daysBack: 5, expDays: 25 },
    { custIdx: 1, branchIdx: 0, origin: "Agility", status: "Sent", itemIndices: [3, 4, 9], qtyRange: [5, 20], priceVar: 0.08, daysBack: 3, expDays: 27 },
    { custIdx: 2, branchIdx: 1, origin: "H+", status: "Draft", itemIndices: [5, 6], qtyRange: [1, 3], priceVar: 0.03, job: "J-VME-112", daysBack: 1, expDays: 29 },
    { custIdx: 3, branchIdx: 1, origin: "Both", status: "Won", itemIndices: [0, 2, 7, 8], qtyRange: [20, 100], priceVar: 0.1, po: "PO-2024-1004", txRef: "TX-889012", daysBack: 30, expDays: 0 },
    { custIdx: 4, branchIdx: 2, origin: "H+", status: "Expired", itemIndices: [10, 11, 12], qtyRange: [5, 15], priceVar: 0.06, daysBack: 45, expDays: -15 },
    { custIdx: 5, branchIdx: 2, origin: "Agility", status: "Negotiating", itemIndices: [13, 14, 0], qtyRange: [8, 30], priceVar: 0.04, po: "PO-2024-1006", daysBack: 7, expDays: 23 },
    { custIdx: 6, branchIdx: 3, origin: "H+", status: "Sent", itemIndices: [1, 3, 5], qtyRange: [2, 10], priceVar: 0.07, daysBack: 10, expDays: 20 },
    { custIdx: 7, branchIdx: 3, origin: "H+", status: "Lost", itemIndices: [6, 7], qtyRange: [1, 5], priceVar: 0.02, job: "J-GFB-331", daysBack: 40, expDays: -10 },
    { custIdx: 8, branchIdx: 4, origin: "Both", status: "Negotiating", itemIndices: [8, 9, 10, 11], qtyRange: [15, 40], priceVar: 0.09, po: "PO-2024-1009", daysBack: 4, expDays: 26 },
    { custIdx: 9, branchIdx: 4, origin: "H+", status: "Draft", itemIndices: [12, 13], qtyRange: [3, 8], priceVar: 0.05, daysBack: 0, expDays: 30 },
    { custIdx: 0, branchIdx: 5, origin: "Agility", status: "Expired", itemIndices: [0, 4, 7], qtyRange: [10, 25], priceVar: 0.06, po: "PO-2024-1011", daysBack: 60, expDays: -30 },
    { custIdx: 1, branchIdx: 5, origin: "H+", status: "Won", itemIndices: [5], qtyRange: [1, 2], priceVar: 0.03, txRef: "TX-990123", daysBack: 20, expDays: 10 },
    { custIdx: 2, branchIdx: 0, origin: "H+", status: "Sent", itemIndices: [2, 9, 14], qtyRange: [10, 30], priceVar: 0.04, daysBack: 6, expDays: 24 },
    { custIdx: 3, branchIdx: 1, origin: "Agility", status: "Draft", itemIndices: [1, 6, 10], qtyRange: [2, 8], priceVar: 0.07, daysBack: 2, expDays: 28 },
    { custIdx: 4, branchIdx: 2, origin: "H+", status: "Negotiating", itemIndices: [3, 8, 12, 13], qtyRange: [5, 20], priceVar: 0.08, po: "PO-2024-1015", job: "J-ICF-208", daysBack: 8, expDays: 22 },
    { custIdx: 5, branchIdx: 3, origin: "Both", status: "Expired", itemIndices: [0, 5, 11], qtyRange: [3, 12], priceVar: 0.05, daysBack: 50, expDays: -20 },
    { custIdx: 6, branchIdx: 4, origin: "H+", status: "Sent", itemIndices: [7, 14], qtyRange: [20, 60], priceVar: 0.06, daysBack: 12, expDays: 18 },
    { custIdx: 7, branchIdx: 5, origin: "Agility", status: "Negotiating", itemIndices: [2, 4, 9], qtyRange: [8, 25], priceVar: 0.04, daysBack: 9, expDays: 21 },
    { custIdx: 8, branchIdx: 0, origin: "H+", status: "Won", itemIndices: [1, 6, 10, 13], qtyRange: [10, 40], priceVar: 0.1, txRef: "TX-112233", daysBack: 25, expDays: 5 },
    { custIdx: 9, branchIdx: 1, origin: "H+", status: "Draft", itemIndices: [0, 3], qtyRange: [5, 15], priceVar: 0.03, daysBack: 1, expDays: 29 },
    { custIdx: 0, branchIdx: 2, origin: "Both", status: "Sent", itemIndices: [5, 7, 8, 14], qtyRange: [2, 6], priceVar: 0.05, po: "PO-2024-1021", daysBack: 14, expDays: 16 },
    { custIdx: 1, branchIdx: 3, origin: "H+", status: "Expired", itemIndices: [9, 12], qtyRange: [10, 30], priceVar: 0.09, daysBack: 55, expDays: -25 },
    { custIdx: 2, branchIdx: 4, origin: "Agility", status: "Negotiating", itemIndices: [1, 11, 13], qtyRange: [4, 12], priceVar: 0.06, daysBack: 6, expDays: 24 },
    { custIdx: 3, branchIdx: 5, origin: "H+", status: "Won", itemIndices: [0, 2, 4, 6, 10], qtyRange: [15, 50], priceVar: 0.08, po: "PO-2024-1024", txRef: "TX-334455", daysBack: 18, expDays: 12 },
    { custIdx: 4, branchIdx: 0, origin: "H+", status: "Lost", itemIndices: [3, 8], qtyRange: [5, 20], priceVar: 0.04, daysBack: 35, expDays: -5 },
    { custIdx: 5, branchIdx: 1, origin: "Agility", status: "Sent", itemIndices: [5, 14], qtyRange: [1, 4], priceVar: 0.07, daysBack: 11, expDays: 19 },
    { custIdx: 6, branchIdx: 2, origin: "H+", status: "Draft", itemIndices: [7, 9, 12], qtyRange: [8, 24], priceVar: 0.03, job: "J-HBE-517", daysBack: 0, expDays: 30 },
    { custIdx: 7, branchIdx: 3, origin: "Both", status: "Negotiating", itemIndices: [0, 1, 2], qtyRange: [20, 80], priceVar: 0.1, po: "PO-2024-1028", daysBack: 3, expDays: 27 },
    { custIdx: 8, branchIdx: 4, origin: "H+", status: "Expired", itemIndices: [4, 6, 11], qtyRange: [6, 18], priceVar: 0.05, daysBack: 42, expDays: -12 },
    { custIdx: 9, branchIdx: 5, origin: "Agility", status: "Won", itemIndices: [8, 10, 13, 14], qtyRange: [10, 35], priceVar: 0.06, txRef: "TX-556677", daysBack: 22, expDays: 8 },
    // Extra quotes to reach ~50
    { custIdx: 0, branchIdx: 1, origin: "H+", status: "Sent", itemIndices: [2, 5], qtyRange: [3, 10], priceVar: 0.04, daysBack: 15, expDays: 15 },
    { custIdx: 1, branchIdx: 2, origin: "H+", status: "Negotiating", itemIndices: [0, 7, 11], qtyRange: [12, 40], priceVar: 0.07, po: "PO-2024-1032", daysBack: 5, expDays: 25 },
    { custIdx: 2, branchIdx: 3, origin: "Agility", status: "Draft", itemIndices: [4, 9], qtyRange: [5, 15], priceVar: 0.03, daysBack: 2, expDays: 28 },
    { custIdx: 3, branchIdx: 4, origin: "H+", status: "Lost", itemIndices: [1, 6, 12], qtyRange: [8, 25], priceVar: 0.08, daysBack: 38, expDays: -8 },
    { custIdx: 4, branchIdx: 5, origin: "Both", status: "Sent", itemIndices: [3, 10, 14], qtyRange: [4, 12], priceVar: 0.05, daysBack: 9, expDays: 21 },
    { custIdx: 5, branchIdx: 0, origin: "H+", status: "Won", itemIndices: [5, 8], qtyRange: [1, 3], priceVar: 0.06, txRef: "TX-778899", daysBack: 16, expDays: 14 },
    { custIdx: 6, branchIdx: 1, origin: "Agility", status: "Expired", itemIndices: [2, 13], qtyRange: [10, 30], priceVar: 0.09, daysBack: 48, expDays: -18 },
    { custIdx: 7, branchIdx: 2, origin: "H+", status: "Negotiating", itemIndices: [0, 4, 9, 11], qtyRange: [6, 20], priceVar: 0.04, daysBack: 7, expDays: 23 },
    { custIdx: 8, branchIdx: 3, origin: "Both", status: "Draft", itemIndices: [7, 12], qtyRange: [3, 8], priceVar: 0.07, daysBack: 1, expDays: 29 },
    { custIdx: 9, branchIdx: 4, origin: "H+", status: "Sent", itemIndices: [1, 6, 10, 14], qtyRange: [15, 50], priceVar: 0.05, po: "PO-2024-1040", daysBack: 13, expDays: 17 },
    { custIdx: 0, branchIdx: 5, origin: "H+", status: "Lost", itemIndices: [3, 5, 8], qtyRange: [2, 8], priceVar: 0.06, daysBack: 32, expDays: -2 },
    { custIdx: 1, branchIdx: 0, origin: "Agility", status: "Negotiating", itemIndices: [9, 13], qtyRange: [10, 25], priceVar: 0.08, daysBack: 4, expDays: 26 },
    { custIdx: 2, branchIdx: 1, origin: "H+", status: "Won", itemIndices: [0, 2, 11, 14], qtyRange: [8, 30], priceVar: 0.1, txRef: "TX-001122", daysBack: 21, expDays: 9 },
    { custIdx: 3, branchIdx: 2, origin: "Both", status: "Expired", itemIndices: [4, 7], qtyRange: [5, 15], priceVar: 0.05, daysBack: 52, expDays: -22 },
    { custIdx: 4, branchIdx: 3, origin: "H+", status: "Draft", itemIndices: [6, 10, 12, 13], qtyRange: [3, 10], priceVar: 0.04, daysBack: 0, expDays: 30 },
    { custIdx: 5, branchIdx: 4, origin: "Agility", status: "Sent", itemIndices: [1, 5, 8], qtyRange: [6, 18], priceVar: 0.07, daysBack: 10, expDays: 20 },
    { custIdx: 6, branchIdx: 5, origin: "H+", status: "Negotiating", itemIndices: [3, 9, 14], qtyRange: [12, 35], priceVar: 0.06, po: "PO-2024-1047", job: "J-HBE-622", daysBack: 6, expDays: 24 },
    { custIdx: 7, branchIdx: 0, origin: "H+", status: "Won", itemIndices: [0, 2, 7, 10], qtyRange: [20, 60], priceVar: 0.08, txRef: "TX-334466", daysBack: 19, expDays: 11 },
    { custIdx: 8, branchIdx: 1, origin: "Both", status: "Lost", itemIndices: [4, 11, 13], qtyRange: [5, 12], priceVar: 0.03, daysBack: 28, expDays: 2 },
    { custIdx: 9, branchIdx: 2, origin: "Agility", status: "Expired", itemIndices: [6, 8, 12], qtyRange: [8, 22], priceVar: 0.09, daysBack: 46, expDays: -16 },
  ];

  return configs.map((c, idx) => {
    const items = makeItems(c.itemIndices, c.qtyRange, c.priceVar);
    const { totalAmount, totalCost, gmPercent } = quoteFromItems(items);
    const cust = customers[c.custIdx];
    const branch = branches[c.branchIdx];
    const created = randomDate(c.daysBack, 0);
    const exp = new Date(created);
    exp.setDate(exp.getDate() + 30 + c.expDays);

    return {
      id: `QT-${String(idx + 1001).padStart(4, "0")}`,
      customerId: cust.id,
      customerName: cust.name,
      branchId: branch.id,
      branchName: branch.name,
      origin: c.origin,
      status: c.status,
      createdDate: created,
      expirationDate: exp.toISOString().split("T")[0],
      poNumber: c.po,
      jobNumber: c.job,
      transactionRef: c.txRef,
      items,
      gmPercent,
      totalAmount,
      totalCost,
      pricingHistory: [],
      assignedTo: users[idx % users.length],
    };
  });
}

export const quotes: Quote[] = generateQuotes();

export const orders: Order[] = quotes
  .filter((q) => q.status === "Won")
  .map((q, i) => ({
    id: `ORD-${String(i + 5001).padStart(4, "0")}`,
    quoteId: q.id,
    purchaseTimestamp: q.expirationDate,
    totalAmount: q.totalAmount,
    itemCount: q.items.length,
  }));

// Helper functions
export function getGMColor(gm: number): string {
  if (gm >= 25) return "text-gm-good";
  if (gm >= 15) return "text-gm-ok";
  return "text-gm-bad";
}

export function getGMBgColor(gm: number): string {
  if (gm >= 25) return "bg-gm-good/10 text-gm-good";
  if (gm >= 15) return "bg-gm-ok/10 text-gm-ok";
  return "bg-gm-bad/10 text-gm-bad";
}

export function getStatusColor(status: QuoteStatus): string {
  const map: Record<QuoteStatus, string> = {
    Draft: "bg-muted text-muted-foreground",
    Sent: "bg-primary/10 text-primary",
    Negotiating: "bg-warning/10 text-warning",
    Won: "bg-success/10 text-success",
    Lost: "bg-muted text-muted-foreground line-through",
    Expired: "bg-destructive/10 text-destructive",
  };
  return map[status];
}

export function getOriginColor(origin: QuoteOrigin): string {
  const map: Record<QuoteOrigin, string> = {
    "H+": "bg-primary/10 text-primary border-primary/20",
    Agility: "bg-accent text-accent-foreground border-border",
    Both: "bg-warning/10 text-warning border-warning/20",
  };
  return map[origin];
}

export function getDaysUntilExpiration(expirationDate: string): number {
  const now = new Date();
  const exp = new Date(expirationDate);
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}
