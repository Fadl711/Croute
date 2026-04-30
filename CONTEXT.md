# 🧠 C-Route — Current Session Context (CONTEXT.md)

> **FOR AI:** This file captures WHERE WE ARE RIGHT NOW. Read `README-AI.md` first for project architecture, then this file for current state. Updated: 2026-04-30.

---

## ✅ COMPLETED WORK (What Has Been Built)

### Phase 1: Core Dashboards (DONE ✅)
All four role dashboards are fully built with premium enterprise UI:

- **RoleSelection** — Animated landing page with 4 role cards (Retailer, Factory, Driver, Admin)
- **RetailerDashboard** — Marketplace browser, product filters, cart system, checkout, order tracking, credit analytics, wallet
- **FactoryDashboard** — Product CRUD, incoming order management, shipment tracking, wallet with cashout
- **DriverDashboard** — Active route map, stop-by-stop navigation, barcode scanning UI, earnings dashboard, trip history
- **AdminDashboard** — GMV overview, live transaction feed, risk management, analytics charts, audit log

### Phase 2: Refactoring (DONE ✅)
All dashboards have been decomposed into modular sub-components:
- `components/retailer/` → MarketTab, OrdersTab, AnalyticsTab, WalletTab, CartDialog, FilterSidebar, ProductCard, utils.ts
- `components/factory/` → AnalyticsTab, ProductsTab, ShipmentsTab, WalletTab, AddProductModal, CashoutModal, constants.ts
- `components/driver/` → RouteTab, EarningsTab, HistoryTab
- `components/admin/` → OverviewTab, TransactionsTab, RiskTab, AdminAnalyticsTab, AuditTab

### Phase 3: The Golden Path — End-to-End Flow (DONE ✅)
The complete automated lifecycle is wired:

1. **Retailer** adds products to cart → checks out → `useOrders.createOrder()` inserts into `orders` + `order_items` tables
2. **Factory** sees incoming order in real-time → clicks "اعتماد الطلب" → `handleAcceptOrder()` in `FactoryDashboard.tsx`:
   - Updates order status to `approved`
   - Creates a `shipments` row (status: `pending`, linked to `DEMO_DRIVER_ID`)
   - Creates 2 `route_stops`: pickup (status: `current`) + dropoff (status: `pending`)
3. **Driver** sees active shipment in real-time → navigates stops → scans barcode → `confirmDelivery()` in `useDriverRoute.ts`:
   - Marks current stop as `completed`
   - Promotes next stop to `current`
   - When ALL stops completed → **Settlement Cascade** fires:
     - Creates `transactions` row (retailer → factory, 2% platform fee deducted)
     - Updates `factories.balance` (+98% of order total)
     - Updates `drivers.balance` (+earnings from stops)
     - Updates `drivers.total_trips` (+1)
     - Updates `platform_stats` (GMV, platform_fee_today, total_transactions, daily_settlements)
4. **Admin** sees updated GMV, new transaction in feed, all in real-time

---

## 🔑 CRITICAL CODE LOCATIONS

### The Settlement Engine (Most Important Function)
**File:** `src/hooks/useDriverRoute.ts` → `confirmDelivery()` (lines ~87-170)
- This is the heart of the system. When a driver confirms the final delivery stop, this function triggers the entire financial settlement cascade.
- It handles: stop completion → shipment status → transaction creation → factory payment → driver payment → platform stats update.

### Order-to-Shipment Bridge
**File:** `src/app/components/FactoryDashboard.tsx` → `handleAcceptOrder()` (lines ~110-178)
- Converts an approved order into a shipment with route stops for the driver.

### Dual-Mode Orders Hook
**File:** `src/hooks/useOrders.ts`
- When called with `factoryId`: fetches only `pending_factory` orders for that factory.
- When called without args: fetches ALL orders for `DEMO_RETAILER_ID`.
- Returns both `orders` and `incomingOrders` (alias for backward compatibility).

### Retailer Data Source
**File:** `src/hooks/useCreditScore.ts`
- The retailer dashboard gets `orders`, `creditHistory`, `creditAvailable`, `utilizationPct`, `scoreBreakdown`, `riskLevel`, `riskColor` from this hook.
- **DO NOT** try to get retailer orders from `useOrders` — they come from `useCreditScore`.

---

## ⚠️ KNOWN BUGS & GOTCHAS (AVOID THESE)

1. **`react-leaflet` is BANNED** — Causes Vite build failures. All map UI uses SVG-based simulations. Never install or import it.
2. **`useOrders` return shape changed** — It now returns `{ orders, incomingOrders, createOrder, updateOrderStatus }`. The `incomingOrders` is an alias for `orders` for backward compat with `FactoryDashboard`.
3. **Missing imports crash** — When adding new sub-components, always check that ALL icons used in JSX are imported from `lucide-react`. Past crashes: `TrendingUp`, `Calendar`, `Truck` icons were missing.
4. **Undefined `.map()` crashes** — Always provide default values for array props: `{ orders = [] }` not `{ orders }`.
5. **`platform_stats` table** — Single row with `id = 1`. Must use `.eq('id', 1).single()` to query. Fields: `gmv`, `daily_settlements`, `active_users`, `active_shipments`, `total_transactions`, `avg_settlement_hours`, `platform_fee_today`.
6. **`AuditLogEntry` interface** — Has fields `actor_id` and `target_id` in the database but `actor` and `target` in the TypeScript interface. Watch for mismatches.
7. **Admin `OverviewTab.tsx`** — Uses `Activity`, `Clock`, `DollarSign` icons imported at the BOTTOM of the file (line 116). Unconventional but working.

---

## 🎯 NEXT STEPS (What To Build Next)

Priority order for the next session:

### 1. 🔔 Live Notification System
- Toast notifications when events fire (order received, shipment created, delivery confirmed, settlement completed)
- Each dashboard shows relevant notifications
- Consider using Supabase Realtime to trigger toasts

### 2. 📈 Dynamic Credit Scoring
- After each successful delivery, automatically increase the retailer's `credit_score` 
- Higher score → higher `credit_limit` → retailer can order more
- Add logic in the settlement cascade (inside `confirmDelivery`)

### 3. 📸 Proof of Delivery
- The driver's "توثيق" (documentation) dialog currently has a camera placeholder
- Store proof image URL in `route_stops.proof_image_url`
- Display in admin's audit log

### 4. 📝 Audit Log Automation
- Every major action should auto-insert into `audit_log` table
- Actions: order_created, order_approved, shipment_created, delivery_confirmed, settlement_completed
- Currently the audit log exists but isn't being populated automatically

### 5. 🎨 UI Polish
- Mobile responsiveness for all dashboards
- Loading skeletons instead of blank screens
- Error boundaries for graceful failure

---

## 🧪 HOW TO TEST THE GOLDEN PATH

1. Run `npm run dev` → open `http://localhost:5173`
2. **As Retailer:** Browse market → Add to cart → Checkout
3. **As Factory:** Go to "الطلبات والشحنات" tab → See new order → Click "اعتماد الطلب وتجهيز الشحنة"
4. **As Driver:** Go to "المسار الحالي" tab → See pickup stop → Click "مسح باركود الاستلام" → "تأكيد العملية يدوياً" → Then confirm dropoff
5. **As Admin:** Go to "نظرة عامة" → GMV should increase. Go to "المعاملات" → New settlement should appear.

---

## 📊 Supabase Project Details

- **URL:** `https://dtojuymgrlwbzmzltezj.supabase.co`
- **Anon Key:** Defined in `src/lib/supabase.ts` (line 4)
- **Realtime:** Enabled with `eventsPerSecond: 10`
- **RLS:** Currently disabled for demo mode (all tables accessible via anon key)

---

## 🔧 Dev Environment

- **OS:** Windows
- **Local Server:** Laragon
- **Path:** `d:\laragon\www\c-route\`
- **Dev Command:** `npm run dev` (Vite dev server on `localhost:5173`)
- **Package Manager:** npm
