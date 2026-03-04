

## Commercial Quoting System — Interactive Prototype (MVP + V1)

### Layout & Navigation
- **Sidebar navigation** (enterprise dashboard style) with sections: Quotes, Customers, Branches, Reports
- **Top header bar** with branch selector, user avatar, and global search
- Dense, data-focused design with tables, status badges, and compact spacing

### Pages & Features

#### 1. Quote Search (Homepage)
- Search bar front-and-center with filters: date range, branch, customer, status, expired, keyword, PO#, Job#, Transaction Ref
- Results table showing: Quote ID, Customer, Branch, Origin (H+/Agility/Both badge), Status badge, Expiration, GM%, Actions
- Quick-action buttons: Open, Copy, Convert to Order

#### 2. Quote Detail / Management
- Quote header: customer info, branch, origin badge, status, expiration countdown
- Line items table with inline editing: product, qty, price, GM% (always visible, color-coded red/yellow/green)
- Real-time GM% rollup at quote level
- Actions: Save, Share, Convert to Order, Re-quote
- Pricing edit history sidebar

#### 3. Quote Creation
- Step flow: Select Customer → Add Items → Review Pricing → Save/Submit
- Product search with autocomplete (mock catalog)
- GM% visibility as items are added

#### 4. Quote-to-Sale Execution
- From quote detail, one-click "Convert to Order" flow
- Select items to purchase, confirm, complete — 3 clicks max
- Success confirmation with order reference

#### 5. Cross-Branch Quote Handling (V1)
- Transfer quote to another branch workflow
- Copy quote workflow
- Visual indicator when quote branch ≠ operating branch
- Qty Released tracking

#### 6. Expired Quote Resolution (V1)
- Expired quotes highlighted in search results
- Guided resolution: Refresh Pricing, Re-quote, Notify Territory Manager
- Resolution status tracking

#### 7. Dashboard / Reports
- Cards: quotes created today, pending conversion, expiring soon, avg GM%
- Quote conversion funnel chart
- Branch activity table
- GM% trend chart

### Mock Data
- ~50 sample quotes across multiple branches, customers, and statuses
- Mix of H+, Agility, and dual-origin quotes
- Some expired, some near-expiration

### Design Details
- Monochrome base with blue accent for actions, red/yellow/green for GM% indicators
- Status badges: Draft, Sent, Negotiating, Won, Lost, Expired
- Compact tables with hover states and row actions
- Keyboard shortcuts hint bar at bottom

