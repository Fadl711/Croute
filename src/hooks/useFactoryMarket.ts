import { useState, useEffect, useCallback } from "react";
import { supabase, getActiveFactoryId } from "../lib/supabase";
import type { Retailer } from "../lib/supabase";

export interface MarketRetailer extends Retailer {
  order_count: number;
  total_spent: number;
  last_order_date: string;
}

export function useFactoryMarket(factoryId?: string) {
  const [retailers, setRetailers] = useState<MarketRetailer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = useCallback(async () => {
    const fid = factoryId || getActiveFactoryId();
    setLoading(true);

    try {
      // 1. Get all unique retailers who ordered from this factory
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          retailer_id,
          total,
          created_at,
          retailer:retailers(*)
        `)
        .eq('factory_id', fid);

      if (ordersError) throw ordersError;

      // 2. Aggregate data
      const marketMap = new Map<string, MarketRetailer>();

      orders.forEach((o: any) => {
        if (!o.retailer) return;
        const rid = o.retailer_id;
        if (!marketMap.has(rid)) {
          marketMap.set(rid, {
            ...o.retailer,
            order_count: 0,
            total_spent: 0,
            last_order_date: o.created_at
          });
        }
        const entry = marketMap.get(rid)!;
        entry.order_count += 1;
        entry.total_spent += o.total;
        if (new Date(o.created_at) > new Date(entry.last_order_date)) {
          entry.last_order_date = o.created_at;
        }
      });

      setRetailers(Array.from(marketMap.values()));
    } catch (err) {
      console.error("Error fetching factory market data:", err);
    } finally {
      setLoading(false);
    }
  }, [factoryId]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return { retailers, loading, refetch: fetchMarketData };
}
