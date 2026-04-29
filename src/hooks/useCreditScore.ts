import { useState, useEffect, useCallback } from 'react';
import { supabase, DEMO_RETAILER_ID } from '../lib/supabase';
import type { Retailer, Order, CreditHistoryEntry } from '../lib/supabase';

export function useCreditScore(retailerId: string = DEMO_RETAILER_ID) {
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [creditHistory, setCreditHistory] = useState<CreditHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRetailer = useCallback(async () => {
    const { data } = await supabase
      .from('retailers')
      .select('*')
      .eq('id', retailerId)
      .single();
    if (data) setRetailer(data);
  }, [retailerId]);

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('retailer_id', retailerId)
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  }, [retailerId]);

  const fetchCreditHistory = useCallback(async () => {
    const { data } = await supabase
      .from('credit_history')
      .select('*')
      .eq('retailer_id', retailerId)
      .order('created_at', { ascending: false });
    if (data) setCreditHistory(data);
  }, [retailerId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchRetailer(), fetchOrders(), fetchCreditHistory()]);
      setLoading(false);
    };
    load();
  }, [fetchRetailer, fetchOrders, fetchCreditHistory]);

  // Real-time subscription for retailer changes
  useEffect(() => {
    const channel = supabase
      .channel('retailer-credit')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'retailers',
          filter: `id=eq.${retailerId}`,
        },
        (payload) => {
          if (payload.new) setRetailer(payload.new as Retailer);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [retailerId]);

  // Derived credit metrics
  const creditAvailable = retailer
    ? retailer.credit_limit - retailer.credit_used
    : 0;
  const utilizationPct = retailer
    ? Math.round((retailer.credit_used / retailer.credit_limit) * 100)
    : 0;

  // Credit score breakdown (for the visualization)
  const scoreBreakdown = retailer
    ? {
        paymentTimeliness: Math.min(100, retailer.credit_score + 5), // Simulated
        utilizationHealth: Math.max(0, 100 - utilizationPct),
        orderFrequency: Math.min(100, orders.length * 15),
        accountAge: 85, // Simulated
        overall: retailer.credit_score,
      }
    : null;

  // Risk level
  const riskLevel =
    (retailer?.credit_score ?? 0) >= 80
      ? 'منخفض'
      : (retailer?.credit_score ?? 0) >= 60
        ? 'متوسط'
        : 'عالي';

  const riskColor =
    riskLevel === 'منخفض'
      ? 'green'
      : riskLevel === 'متوسط'
        ? 'yellow'
        : 'red';

  return {
    retailer,
    orders,
    creditHistory,
    loading,
    creditAvailable,
    utilizationPct,
    scoreBreakdown,
    riskLevel,
    riskColor,
    refreshCredit: fetchRetailer,
  };
}
