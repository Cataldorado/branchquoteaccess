

## Plan: Dashboard Grid Screen with Sidebar Integration

### What Changes

**1. New Dashboard Grid Page (`src/pages/ToolDashboard.tsx`)**
A full-page grid of clickable tool cards matching the screenshot style — placeholder images with dark gradient overlays and centered white text labels. Tools from the screenshot: Dashboard, Products, Quotes, Orders, Deliveries, Pickup, Invoices, Inbox, Notepad. Non-functional tools show a "Coming Soon" badge overlay; clicking them does nothing.

Each card uses a placeholder image (from `public/placeholder.svg` or Unsplash-style gradient backgrounds) with a dark overlay and large white label text, arranged in a responsive 4-column grid.

**2. Updated App Flow (`src/App.tsx`)**
- The **first screen** (when no tool is active) renders `ToolDashboard` instead of `CustomerSearch` and `ModuleSelection`.
- Clicking **Quotes** on the dashboard opens the existing `CustomerSearch` flow. After selecting a customer, it proceeds to `QuoteSearch` as it does today.
- Clicking **Dashboard** navigates directly to the existing `Dashboard` page (no customer needed).
- Other tools show as disabled/coming soon.

**3. Sidebar Visibility (`src/components/AppLayout.tsx`)**
- Integrate `AppSidebar` (already exists, currently unused) using `SidebarProvider` from shadcn.
- The sidebar is rendered **only when the user is inside a tool** (not on the grid dashboard).
- `AppLayout` wraps content with the sidebar; the dashboard grid page renders **without** `AppLayout`.

**4. Updated Sidebar (`src/components/AppSidebar.tsx`)**
- Match the screenshot's sidebar items: Dashboard, Products, Quotes, Orders, Deliveries, Pickup, Invoices, Inbox, Notepad.
- Add a "Home" or logo click that returns to the dashboard grid.
- Keep the icon-based collapsed sidebar style.

### Flow Summary

```text
App Start → ToolDashboard (grid, no sidebar)
  ├─ Click "Quotes" → CustomerSearch → Select Customer → QuoteSearch (with sidebar)
  ├─ Click "Dashboard" → Dashboard page (with sidebar)
  └─ Click others → Coming Soon (no navigation)
```

### Technical Details

- **No existing pages modified** — QuoteSearch, QuoteDetail, Dashboard, CustomerSearch all remain as-is.
- The `CustomerContext` flow remains intact; clicking Quotes on the grid triggers `openSearch()` to show customer search, then flows into quote tools as before.
- Add a new state to track whether the user is on the "home" dashboard grid vs. inside a tool, to control sidebar visibility.
- Placeholder images: use colored gradient backgrounds with CSS (no external image dependencies) to mimic the screenshot's card aesthetic.
- Sidebar items use lucide-react icons: `LayoutDashboard`, `Package`, `FileText`, `ShoppingCart`, `Truck`, `ClipboardList`, `Receipt`, `Inbox`, `StickyNote`.

### Files to Create/Edit

| File | Action |
|------|--------|
| `src/pages/ToolDashboard.tsx` | **Create** — Grid of tool cards |
| `src/App.tsx` | **Edit** — Add dashboard as first screen, route tools |
| `src/components/AppLayout.tsx` | **Edit** — Integrate SidebarProvider + AppSidebar |
| `src/components/AppSidebar.tsx` | **Edit** — Update items to match screenshot, add home nav |
| `src/contexts/CustomerContext.tsx` | **Minor edit** — Add state to distinguish dashboard vs tool mode |

