# 🤖 C-Route Project Context (AI Instructions)

> **CRITICAL FOR AI:** Read this file FIRST before ANY work. This defines the project identity, architecture, and non-negotiable rules. Then read `CONTEXT.md` for current progress and session-specific knowledge.

---

## 📌 Project Identity

**C-Route** is a B2B **supply chain + clearinghouse + logistics** platform for the Yemeni wholesale market.  
Built for **Salam Hack 2026** hackathon — the UI must look like a world-class enterprise SaaS (Stripe/Shopify tier).

### The Four Actors

| Actor | Arabic | Dashboard File | Description |
|-------|--------|----------------|-------------|
| **Factory** | المصنع | `FactoryDashboard.tsx` | Manages products, accepts orders, triggers shipments |
| **Retailer** | التاجر | `RetailerDashboard.tsx` | Browses marketplace, orders products, tracks deliveries |
| **Driver** | السائق | `DriverDashboard.tsx` | Picks up from factory, delivers to retailer, confirms delivery |
| **Admin** | المدير | `AdminDashboard.tsx` | Monitors GMV, settlements, risk, audit trail |

### The Golden Path (End-to-End Flow)
```
Retailer orders → Factory approves → Shipment + Route Stops created →
Driver picks up → Driver delivers → Settlement Cascade fires →
(Transaction created, Factory paid, Driver paid, Platform stats updated)
```

---

## 🛠 Tech Stack (DO NOT CHANGE)

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Language | TypeScript (`.tsx`, `.ts`) |
| Styling | Tailwind CSS |
| Animations | `motion/react` (Framer Motion) |
| Icons | `lucide-react` |
| Charts | `recharts` |
| UI Primitives | `@radix-ui/react-dialog` |
| Backend/DB | **Supabase** (PostgreSQL + Realtime) |
| Direction | RTL (`dir="rtl"`) — Arabic interface |

---

## 📁 Project Structure

```
d:\laragon\www\c-route\
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Root: role-based routing
│   │   └── components/
│   │       ├── RoleSelection.tsx      # Landing page / role picker
│   │       ├── RetailerDashboard.tsx  # 🛒 Retailer main
│   │       ├── FactoryDashboard.tsx   # 🏭 Factory main
│   │       ├── DriverDashboard.tsx    # 🚚 Driver main
│   │       ├── AdminDashboard.tsx     # 🌐 Admin main
│   │       ├── SupplyChainIntel.tsx   # Supply chain visualizations
│   │       ├── retailer/             # Retailer sub-components
│   │       │   ├── MarketTab.tsx
│   │       │   ├── OrdersTab.tsx
│   │       │   ├── AnalyticsTab.tsx
│   │       │   ├── WalletTab.tsx
│   │       │   ├── CartDialog.tsx
│   │       │   ├── FilterSidebar.tsx
│   │       │   ├── ProductCard.tsx
│   │       │   └── utils.ts
│   │       ├── factory/              # Factory sub-components
│   │       │   ├── AnalyticsTab.tsx
│   │       │   ├── ProductsTab.tsx
│   │       │   ├── ShipmentsTab.tsx
│   │       │   ├── WalletTab.tsx
│   │       │   ├── AddProductModal.tsx
│   │       │   ├── CashoutModal.tsx
│   │       │   └── constants.ts
│   │       ├── driver/               # Driver sub-components
│   │       │   ├── RouteTab.tsx
│   │       │   ├── EarningsTab.tsx
│   │       │   └── HistoryTab.tsx
│   │       └── admin/                # Admin sub-components
│   │           ├── OverviewTab.tsx
│   │           ├── TransactionsTab.tsx
│   │           ├── RiskTab.tsx
│   │           ├── AdminAnalyticsTab.tsx
│   │           └── AuditTab.tsx
│   ├── hooks/                        # All Supabase data hooks
│   │   ├── useCreditScore.ts         # Retailer credit metrics
│   │   ├── useDriverRoute.ts         # Driver route + settlement logic ⭐
│   │   ├── useMarketplace.ts         # Product listing for retailer
│   │   ├── useOrders.ts              # Order creation + fetching
│   │   ├── useProducts.ts            # Factory product CRUD
│   │   ├── useShipments.ts           # Factory shipment listing
│   │   ├── useSupplyChainIntel.ts    # Supply chain analytics
│   │   ├── useTransactions.ts        # Admin transaction feed
│   │   └── useWallet.ts              # Factory wallet operations
│   └── lib/
│       └── supabase.ts               # Supabase client + ALL TypeScript interfaces
```

---

## 🗄 Database Schema (Supabase)

All interfaces are defined in `src/lib/supabase.ts`. Key tables:

| Table | Purpose |
|-------|---------|
| `factories` | Factory profiles + balance |
| `retailers` | Retailer profiles + credit score/limit |
| `drivers` | Driver profiles + balance + stats |
| `products` | Factory product catalog |
| `orders` | Retailer → Factory orders |
| `order_items` | Line items for each order |
| `shipments` | Logistics shipments linking factory → driver |
| `route_stops` | Individual pickup/dropoff stops per shipment |
| `transactions` | Financial settlements (from → to + fee) |
| `credit_history` | Retailer credit usage log |
| `audit_log` | System-wide audit trail |
| `platform_stats` | Aggregated platform KPIs (single row, id=1) |
| `cashout_requests` | Factory withdrawal requests |

### Demo IDs (No Auth — Demo Mode)
```typescript
DEMO_FACTORY_ID  = 'a1000000-0000-0000-0000-000000000001'
DEMO_RETAILER_ID = 'b1000000-0000-0000-0000-000000000001'
DEMO_DRIVER_ID   = 'c1000000-0000-0000-0000-000000000001'
```

---

## 📐 Architecture Rules (NON-NEGOTIABLE)

1. **Modular Components:** Every dashboard is split into tab-level sub-components inside `components/{role}/`. Never create monolithic 500+ line components.
2. **Custom Hooks Only:** ALL Supabase queries go through `src/hooks/use*.ts`. Never write raw `supabase.from()` inside UI components.
3. **Real-time First:** Every hook that fetches data must also subscribe to Supabase Realtime channels for live updates.
4. **Enterprise Layouts:** Factory and Admin use **sidebar** navigation. Retailer uses top tabs with floating cart. Driver uses top tabs.
5. **RTL Always:** All root `<div>` elements must have `dir="rtl"`.

---

## ⚖️ "Hybrid Reality" Rule

- **Core Operations MUST be Real:** Shipments, Wallets, Settlements, Orders, Route Stops — all from Supabase.
- **Complex Charts CAN be Mocked:** Historical trend charts, pie breakdowns — mock data is acceptable.
- **Admin Stats:** `platform_stats` table (row id=1) is real and gets updated by the settlement cascade.

---

## 🎨 UI/UX Non-Negotiables

- Primary colors: `#0B1B3B` (Dark Navy), `#1A73E8` (Google Blue)
- Use `backdrop-blur`, glass borders, subtle shadows for premium feel
- `tabular-nums` on ALL numeric displays
- Currency: Yemeni Rial (`ر.ي`), format with `.toLocaleString('ar-YE')`
- Animations via `motion/react` (AnimatePresence for tab transitions)
- Icons exclusively from `lucide-react`

---

## 🚫 Known Constraints & Gotchas

1. **DO NOT use `react-leaflet`** — it causes build failures. Map visualizations use SVG-based simulations instead.
2. **`useOrders` is dual-mode:** Pass `factoryId` for factory view (pending orders only) or leave empty for retailer view (all orders).
3. **`useCreditScore`** is the source for retailer's `orders`, `creditHistory`, `creditAvailable`, etc. The retailer dashboard must use this hook, NOT `useOrders`, for displaying order data.
4. **Settlement logic lives in `useDriverRoute.ts` → `confirmDelivery()`** — this is the most critical function in the entire system.

---

## 🚀 Mission

Win **Salam Hack 2026**. The system must demonstrate a fully automated B2B supply chain with real-time financial settlement, beautiful enterprise UI, and a compelling live demo.
