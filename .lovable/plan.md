

## Plan: Narrow Icon-Label Sidebar

The screenshot shows a very narrow sidebar (~60px) where each item is displayed as a **vertically stacked icon + label** (no horizontal text). The sidebar is always in this compact "icon + label" format — it never expands to a wide text sidebar.

### Changes

**1. `src/components/ui/sidebar.tsx`** — Update width constants:
- Change `SIDEBAR_WIDTH` from `16rem` to `4.5rem` (~72px)
- Change `SIDEBAR_WIDTH_ICON` from `3rem` to `4.5rem` (same, since it's always narrow)

**2. `src/components/AppSidebar.tsx`** — Redesign to match the screenshot:
- Remove the logo/header section entirely (the top nav already has the Heritage logo)
- Remove the "Back to Home" footer
- Set `collapsible="none"` since the sidebar is always the same narrow width
- Each item renders as a vertical stack: icon on top, small label text below (centered)
- Active item gets a left blue highlight bar matching the screenshot
- Remove "Soon" badges — disabled items just appear muted
- Use smaller text (~10-11px) for labels

The result will be a slim, always-visible icon sidebar matching the Figma reference exactly.

### Files to Edit
| File | Change |
|------|--------|
| `src/components/ui/sidebar.tsx` | Update `SIDEBAR_WIDTH` to `4.5rem` |
| `src/components/AppSidebar.tsx` | Rewrite to vertical icon+label layout, remove header/footer |

