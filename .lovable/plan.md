

# POS-Style Redesign Plan

## Overview

Transform Heritage HQ from a back-office SaaS layout into a Point-of-Sale interface optimized for speed, scanability, and transaction flow. The redesign touches every screen: navigation, quote search, quote detail, dashboard, and quote creation.

## Current State vs. Target

```text
CURRENT                              TARGET (POS)
┌──────┬─────────────────┐          ┌─────────────────────────────┐
│      │                 │          │  [Logo] [Quotes] [Dashboard]│ ← slim top bar
│ Side │   Content       │          │  [Customers] [New Quote]    │
│ bar  │   (tables,      │          ├────────────────┬────────────┤
│      │    forms)       │          │                │            │
│      │                 │          │  Item List /   │  Order     │
│      │                 │          │  Search Panel  │  Summary   │
│      │                 │          │                │  Panel     │
│      │                 │          │                │ (sticky)   │
└──────┴─────────────────┘          └────────────────┴────────────┘
```

## Key Changes

### 1. Navigation: Sidebar → Top Bar
- Remove `AppSidebar` and `SidebarProvider` from `AppLayout`
- Create a new `TopNav` component: slim horizontal bar (h-14) with logo left, nav links center, user/role controls right
- Nav links as pill-style tabs: Quotes, New Quote, Dashboard, Customers
- Full-width content area below, maximizing horizontal space for the item grid

### 2. Quote Search (POS Register Lookup)
- Larger search input with prominent focus state — feels like a barcode scanner input
- Replace the dense table with quote cards in a grid (2-3 columns) showing key info: customer, amount, status, expiration
- Cards have large click targets for fast selection
- Filters move to horizontal pill toggles above the grid instead of dropdowns
- Active quote count displayed prominently

### 3. Quote Detail (The Core POS Screen)
- **Split-panel layout**: items on the left (~65%), order summary on the right (~35%)
- **Left panel**: Product groups shown as collapsible sections with larger row height, bigger touch targets for qty inputs, clearer item cards instead of dense grid columns
- Reduce visible columns — hide Cost, UOM, GM% behind a "details" toggle; surface only: Product, SKU, Quote Qty, Purchased Qty, Purchase Qty, Price, Ext Price
- **Right panel (sticky order summary)**: 
  - Quote header info (customer, branch, PO, job)
  - Running total with item count
  - GM% indicator
  - "Populate Remaining Qty" as a prominent action button
  - Large "Purchase Items" CTA button at the bottom (always visible)
- Checkout modal remains as-is (already well-structured)

### 4. Dashboard
- Keep mostly as-is but adapt to full-width layout (no sidebar constraint)
- KPI cards scale to fill the wider space

### 5. Quote Create
- Adapt to full-width layout

### 6. Visual System Updates
- Increase base spacing and touch targets (min 44px hit areas)
- Slightly larger font sizes for key data (prices, quantities)
- Cards over tables where appropriate
- Keep the existing color system (navy brand, GM color coding)
- Rounder corners, more generous padding

## Files to Modify

| File | Change |
|------|--------|
| `src/components/AppLayout.tsx` | Remove sidebar, add TopNav, full-width content |
| `src/components/AppSidebar.tsx` | Delete (replaced by TopNav) |
| `src/components/TopNav.tsx` | **New** — horizontal nav bar |
| `src/components/TopHeader.tsx` | Remove or merge into TopNav |
| `src/pages/QuoteSearch.tsx` | Card grid layout, pill filters, larger search |
| `src/pages/QuoteDetail.tsx` | Split-panel POS layout with sticky summary |
| `src/pages/Dashboard.tsx` | Adapt to full-width |
| `src/pages/QuoteCreate.tsx` | Adapt to full-width |
| `src/index.css` | Adjust spacing/sizing tokens if needed |

## Implementation Approach

This is a large change touching ~8 files. I recommend breaking it into 3 steps:

1. **Navigation swap** — Replace sidebar with top bar, update layout (3 files)
2. **Quote Detail POS layout** — Split-panel with sticky summary (1 file, largest change)
3. **Quote Search + polish** — Card grid, pill filters, visual density updates (2-3 files)

Each step produces a working app so you can review and adjust direction between steps.

