import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dtojuymgrlwbzmzltezj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0b2p1eW1ncmx3Ynptemx0ZXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzEzMTEsImV4cCI6MjA5MzA0NzMxMX0.UJXztH2vjH_DC7rD_c71HhP6ud2Cx8k-AiiXQS9-ouI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ═══════════════════════════════════════════
// Type Definitions (inferred from schema)
// ═══════════════════════════════════════════

export interface Factory {
  id: string;
  name: string;
  city: string;
  balance: number;
  pending_balance: number;
  rating: number;
  tier: string;
  created_at: string;
}

export interface Retailer {
  id: string;
  name: string;
  city: string;
  credit_limit: number;
  credit_used: number;
  credit_score: number;
  grace_period_days: number;
  next_payment_date: string | null;
  next_payment_amount: number;
  created_at: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string | null;
  total_trips: number;
  total_distance: number;
  avg_rating: number;
  on_time_pct: number;
  balance: number;
  pending_earnings: number;
  rank: number;
  created_at: string;
}

export interface Product {
  id: string;
  factory_id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  price: number;
  barcode: string | null;
  expiry_date: string | null;
  description: string | null;
  min_stock: number;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  retailer_id: string;
  route: string | null;
  status: string;
  total: number;
  credit_used: number;
  delivery_date: string | null;
  created_at: string;
}

export interface Shipment {
  id: string;
  shipment_number: string;
  factory_id: string;
  driver_id: string;
  route: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export interface RouteStop {
  id: string;
  shipment_id: string;
  stop_order: number;
  type: 'pickup' | 'dropoff';
  location_name: string;
  address: string | null;
  city: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  items_description: string | null;
  status: 'pending' | 'current' | 'completed';
  earnings: number;
  completed_at: string | null;
  proof_image_url: string | null;
}

export interface Transaction {
  id: string;
  tx_number: string;
  from_entity: string;
  to_entity: string;
  amount: number;
  fee: number;
  type: string;
  status: string;
  related_shipment_id: string | null;
  created_at: string;
}

export interface CashoutRequest {
  id: string;
  factory_id: string;
  amount: number;
  fee: number;
  bank_name: string | null;
  bank_account: string | null;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export interface CreditHistoryEntry {
  id: string;
  retailer_id: string;
  type: string;
  amount: number;
  description: string | null;
  balance_after: number;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  target: string | null;
  type: string | null;
  created_at: string;
}

export interface PlatformStats {
  id: number;
  gmv: number;
  daily_settlements: number;
  active_users: number;
  active_shipments: number;
  total_transactions: number;
  avg_settlement_hours: number;
  platform_fee_today: number;
  updated_at: string;
}

// ═══════════════════════════════════════════
// Demo Factory ID (for Role Switcher)
// ═══════════════════════════════════════════
export const DEMO_FACTORY_ID = 'a1000000-0000-0000-0000-000000000001';
export const DEMO_RETAILER_ID = 'b1000000-0000-0000-0000-000000000001';
export const DEMO_DRIVER_ID = 'c1000000-0000-0000-0000-000000000001';
