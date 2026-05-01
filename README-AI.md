# 🤖 C-Route Project Context (AI System Prompt)

> **CRITICAL FOR AI:** Read this file FIRST before ANY work. This document defines the project's core identity, overarching architecture, and non-negotiable technical rules. After reading this, read `CONTEXT.md` for the current session's progress.

---

## 📌 1. Project Identity & Vision

**C-Route (مسار الأعمال)** is a B2B **supply chain, clearinghouse, and logistics** platform specifically tailored for the Yemeni wholesale market.  
**Target:** Built to win the **Salam Hack 2026** hackathon. 
**Aesthetic Requirement:** The UI must look like a world-class enterprise SaaS (Stripe/Shopify tier). "Minimum Viable Product" does not mean ugly; use Glassmorphism, deep shadows, and fluid animations.

### The Four Core Actors
1. 🏭 **Factory (المصنع):** `FactoryDashboard.tsx`. Manages product catalog, receives incoming orders from retailers, approves them, and monitors outgoing shipments on a live radar.
2. 🛒 **Retailer (التاجر):** `RetailerDashboard.tsx`. Browses the B2B marketplace, adds products to cart, checks out using an internal credit line, and tracks order statuses.
3. 🚚 **Driver (السائق):** `DriverDashboard.tsx`. Follows active routes, scans barcodes at pickup (factory) and drop-off (retailer), and manages their earnings.
4. 🌐 **Admin (المدير):** `AdminDashboard.tsx`. The platform owner. Monitors real-time GMV, active fleet radar, transaction settlements, and system risk levels.

---

## 🛠 2. Technology Stack (DO NOT CHANGE)

| Layer | Technology | Notes |
|-------|------------|-------|
| **Core** | React 18 + Vite + TypeScript | Strict typing is enforced via `src/lib/supabase.ts`. |
| **Styling** | Tailwind CSS | Primary colors: Navy (`#0B1B3B`), Blue (`#1A73E8`). |
| **Animations** | `motion/react` | Use `AnimatePresence` for smooth tab switching. |
| **Icons** | `lucide-react` | Do not use other icon libraries. |
| **Maps** | `react-leaflet` + `leaflet` | **RESTRICTED USE:** Only in `FleetMapTab` and `FactoryMapTab`. |
| **Backend** | Supabase | PostgreSQL + Realtime WebSockets. |
| **Localization**| RTL (`dir="rtl"`) | The entire interface is in Arabic. |

---

## 🏗 3. Architectural Rules & Best Practices

1. **Modular UI:** Dashboards are entry points. All complex logic and UI must be broken down into sub-components inside `src/app/components/{role}/`. Never write 500+ line monolithic files.
2. **Hook-Driven Data:** ALL Supabase queries must reside in `src/hooks/use*.ts`. **Never** write raw `supabase.from()` calls inside UI components.
3. **Real-time Synchronization:** Every data hook must subscribe to Supabase Realtime (`postgres_changes`) to ensure the UI updates instantly across all users when the database changes.
4. **Financial Safety:** All financial columns in Supabase are `bigint`. Whenever doing math (e.g., deducting 2% platform fees), you MUST use `Math.round()` before inserting/updating to avoid decimal truncation errors that crash Postgres.
5. **Currency:** Always format numbers as Yemeni Rial using `.toLocaleString('ar-YE')` + ` ر.ي`.

---

## 🔄 4. The "Golden Path" (End-to-End Flow)

Understanding this flow is critical. It is the backbone of the application:
1. **Order Creation:** Retailer checks out → `useOrders.createOrder()` writes to `orders` and `order_items`.
2. **Order Approval:** Factory clicks "اعتماد" → `handleAcceptOrder()` updates order status to `approved`, creates a `shipments` row, and creates two `route_stops` (pickup & dropoff).
3. **Logistics Execution:** Driver completes the stops → triggers `confirmDelivery()` in `useDriverRoute.ts`.
4. **The Settlement Cascade:** When the final stop is completed, `confirmDelivery()` automatically:
   - Deducts from Retailer's credit line.
   - Credits the Factory (minus platform fee).
   - Credits the Driver's earnings.
   - Creates a formal `transactions` record.
   - Updates `platform_stats` (GMV, fees).

---

## 🪪 5. Identity Management (Demo Mode)

We do not use Supabase Auth yet. Instead, we use a robust `localStorage` system to allow seamless role-switching during demos.

**Helper Functions (Use these, do NOT hardcode IDs):**
Located in `src/lib/supabase.ts`:
- `getActiveAdminId()` / `setActiveAdminId(id)`
- `getActiveRetailerId()` / `setActiveRetailerId(id)`
- `getActiveFactoryId()` / `setActiveFactoryId(id)`
- `getActiveDriverId()` / `setActiveDriverId(id)`

*If a hook fails with "ReferenceError: getActiveX is not defined", you forgot to import it from `lib/supabase.ts`.*

---

## 🗄 6. Database Schema Summary

All TypeScript interfaces matching this schema are in `src/lib/supabase.ts`.
- `factories` (Includes `latitude`, `longitude`)
- `retailers` (Includes `latitude`, `longitude`, `credit_score`)
- `drivers`
- `products`
- `orders` & `order_items`
- `shipments` & `route_stops` (The logistics layer)
- `transactions` & `credit_history` (The financial ledger)
- `platform_stats` (Row ID=1, global KPIs)
- `audit_log`
