import { useState, useEffect, useCallback } from "react";
import { supabase, getActiveDriverId } from "../lib/supabase";
import type { Driver, Shipment, RouteStop } from "../lib/supabase";

export function useDriverRoute(driverId: string = getActiveDriverId()) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch driver
  const fetchDriver = useCallback(async () => {
    const { data } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', driverId)
      .single();
    if (data) setDriver(data);
  }, [driverId]);

  // Fetch active route (multiple shipments consolidated)
  const fetchActiveRoute = useCallback(async () => {
    setLoading(true);
    // Get all pending or in_transit shipments for this driver
    const { data: shipmentsData } = await supabase
      .from('shipments')
      .select(`
        *,
        factory:factories(name),
        driver:drivers(name),
        orders(
          retailer:retailers(name),
          order_items(
            *,
            product:products(*)
          )
        )
      `)
      .eq('driver_id', driverId)
      .in('status', ['pending', 'in_transit'])
      .order('created_at', { ascending: false });

    if (shipmentsData && shipmentsData.length > 0) {
      // For now, we take the most recent one as the "Primary" for context
      setActiveShipment(shipmentsData[0]);
      
      const shipmentIds = shipmentsData.map(s => s.id);
      
      const { data: routeStops } = await supabase
        .from('route_stops')
        .select('*')
        .in('shipment_id', shipmentIds)
        .order('stop_order', { ascending: true });
      
      if (routeStops) {
        setStops(routeStops);
      }
    } else {
      setActiveShipment(null);
      setStops([]);
    }
    setLoading(false);
  }, [driverId]);

  const fetchHistory = useCallback(async () => {
    const { data } = await supabase
      .from('shipments')
      .select(`
        *,
        factory:factories(name),
        route_stops(*)
      `)
      .eq('driver_id', driverId)
      .in('status', ['delivered', 'completed'])
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      const mapped = data.map(s => ({
        id: s.shipment_number,
        date: new Date(s.created_at).toLocaleDateString('ar-YE'),
        distance: Math.floor(Math.random() * 20) + 10, // Simulated distance
        stops: s.route_stops?.length || 0,
        earnings: s.route_stops?.reduce((acc: number, stop: any) => acc + (stop.earnings || 0), 0) || 0,
        rating: (Math.random() * 1 + 4).toFixed(1), // Simulated rating 4.0-5.0
      }));
      setHistory(mapped);
    }
  }, [driverId]);

  useEffect(() => {
    fetchDriver();
    fetchActiveRoute();
    fetchHistory();
  }, [fetchDriver, fetchActiveRoute, fetchHistory]);

  // ★ REAL-TIME: Subscribe to driver balance + route stop changes
  useEffect(() => {
    const channel = supabase
      .channel('driver-route')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drivers',
          filter: `id=eq.${driverId}`,
        },
        (payload) => {
          if (payload.new) setDriver(payload.new as Driver);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'route_stops',
        },
        () => {
          // Refetch stops on any change
          fetchActiveRoute();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, fetchActiveRoute]);

  // ★ CONFIRM DELIVERY — triggers settlement cascade
  const confirmDelivery = useCallback(
    async (stopId: string) => {
      // 1. Mark current stop as completed
      const { error } = await supabase
        .from('route_stops')
        .update({ status: 'completed' })
        .eq('id', stopId);

      if (error) return { error: error.message };

      // 2. Find the next pending stop and mark as current
      const currentIndex = stops.findIndex((s) => s.id === stopId);
      const nextStop = stops[currentIndex + 1];
      if (nextStop && nextStop.status === 'pending') {
        await supabase
          .from('route_stops')
          .update({ status: 'current' })
          .eq('id', nextStop.id);
      }

      // 3. Check if all stops for THIS shipment are completed → mark shipment as delivered
      const currentStop = stops.find(s => s.id === stopId);
      if (!currentStop) return { success: true };
      
      const shipmentId = currentStop.shipment_id;
      const allShipmentStops = stops.filter(s => s.shipment_id === shipmentId);
      const remainingForShipment = allShipmentStops.filter(
        (s) => s.id !== stopId && s.status !== 'completed'
      );

      if (remainingForShipment.length === 0) {
        // Fetch full shipment data to ensure we have the linked order_id and other fields
        const { data: shipment } = await supabase
          .from('shipments')
          .select('*')
          .eq('id', shipmentId)
          .single();

        if (shipment) {
          await supabase
            .from('shipments')
            .update({ status: 'delivered' })
            .eq('id', shipmentId);

          // ✨ TRIGGER SETTLEMENT ✨
          if ((shipment as any).order_id) {
            // Find the specific order linked to this shipment
            const { data: order } = await supabase
              .from('orders')
              .select('retailer_id, order_number')
              .eq('id', (shipment as any).order_id)
              .single();

            const actualRetailerId = order?.retailer_id || 'unknown';

            // 1. Transaction: Retailer -> Factory
            const tx_number = `TX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            await supabase.from('transactions').insert({
              tx_number,
              from_entity: actualRetailerId,
              to_entity: shipment.factory_id,
              amount: Math.round(shipment.total_amount * 0.98),
              fee: Math.round(shipment.total_amount * 0.02),
              type: 'settlement',
              status: 'completed',
              related_shipment_id: shipment.id,
            });

            // 2. Add amount to Factory Balance
            const { data: factory } = await supabase
              .from('factories')
              .select('balance')
              .eq('id', shipment.factory_id)
              .single();
            if (factory) {
              await supabase
                .from('factories')
                .update({ balance: Math.round(factory.balance + shipment.total_amount * 0.98) })
                .eq('id', shipment.factory_id);
            }

            // 3. Update Retailer: Move used credit to "paid" or just reduce it
            const { data: retailer } = await supabase
              .from('retailers')
              .select('credit_used')
              .eq('id', actualRetailerId)
              .single();
            
            if (retailer) {
              const newCreditUsed = Math.max(0, Math.round(retailer.credit_used - shipment.total_amount));
              await supabase
                .from('retailers')
                .update({ credit_used: newCreditUsed })
                .eq('id', actualRetailerId);
              
              // Add credit history entry
              await supabase.from('credit_history').insert({
                retailer_id: actualRetailerId,
                type: 'payment',
                amount: shipment.total_amount,
                description: `تسوية شحنة رقم ${shipment.shipment_number}`,
                balance_after: newCreditUsed
              });
            }

            // 4. Update driver balance
            const shipmentEarnings = allShipmentStops.reduce((sum, s) => sum + s.earnings, 0);
            if (driver) {
              await supabase
                .from('drivers')
                .update({
                  balance: Math.round(driver.balance + shipmentEarnings),
                  total_trips: (driver.total_trips || 0) + 1,
                })
                .eq('id', driver.id);
            }

            // 5. Update platform stats
            const { data: stats } = await supabase
              .from('platform_stats')
              .select('*')
              .eq('id', 1)
              .single();
            if (stats) {
              await supabase
                .from('platform_stats')
                .update({
                  gmv: stats.gmv + shipment.total_amount,
                  platform_fee_today: Math.round(stats.platform_fee_today + shipment.total_amount * 0.02),
                  total_transactions: (stats.total_transactions || 0) + 1,
                  daily_settlements: (stats.daily_settlements || 0) + 1,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', 1);
            }

            // 6. ✅ Sync specific order status → 'delivered'
            await supabase
              .from('orders')
              .update({ status: 'delivered' })
              .eq('id', (shipment as any).order_id);
          }
        }
      }

      // Refresh
      await fetchDriver();
      await fetchActiveRoute();

      return { success: true };
    },
    [stops, activeShipment, fetchDriver, fetchActiveRoute]
  );

  // Derived stats
  const currentStop = stops.find((s) => s.status === 'current') || null;
  const completedStops = stops.filter((s) => s.status === 'completed').length;
  const totalStops = stops.length;
  const estimatedEarnings = stops.reduce((sum, s) => sum + s.earnings, 0);
  const actualEarnings = stops
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.earnings, 0);

  return {
    driver,
    activeShipment,
    stops,
    currentStop,
    loading,
    confirmDelivery,
    completedStops,
    totalStops,
    estimatedEarnings,
    actualEarnings,
    history,
    refreshRoute: fetchActiveRoute,
  };
}
