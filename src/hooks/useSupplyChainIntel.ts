import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface CityDemand {
  city: string;
  order_count: number;
  total_revenue: number;
  retailer_count: number;
}

export function useSupplyChainIntel() {
  const [cityDemand, setCityDemand] = useState<CityDemand[]>([]);
  const [activeShipments, setActiveShipments] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    // Get retailers grouped by city
    const { data: retailers } = await supabase.from('retailers').select('*');
    // Get orders for revenue
    const { data: orders } = await supabase.from('orders').select('*');
    // Count active shipments
    const { data: shipments } = await supabase
      .from('shipments')
      .select('id')
      .eq('status', 'in_transit');

    if (retailers && orders) {
      const cityMap: Record<string, CityDemand> = {};
      retailers.forEach((r) => {
        const city = r.city.split(' - ')[0] || r.city;
        if (!cityMap[city]) {
          cityMap[city] = { city, order_count: 0, total_revenue: 0, retailer_count: 0 };
        }
        cityMap[city].retailer_count++;
        const retailerOrders = orders.filter((o) => o.retailer_id === r.id);
        cityMap[city].order_count += retailerOrders.length;
        cityMap[city].total_revenue += retailerOrders.reduce((s, o) => s + o.total, 0);
      });
      setCityDemand(Object.values(cityMap));
    }

    setActiveShipments(shipments?.length ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { cityDemand, activeShipments, loading, refresh: fetchData };
}
