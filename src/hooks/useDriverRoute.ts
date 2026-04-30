import { useState, useEffect, useCallback } from "react";
import { supabase, getActiveDriverId } from "../lib/supabase";
import type { Driver, Shipment, RouteStop } from "../lib/supabase";

export function useDriverRoute(driverId: string = getActiveDriverId()) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
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
      .select('*')
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
        // Group stops: Pickups first, then Dropoffs? 
        // For the MVP, we just show them in the order they were created/ordered
        setStops(routeStops);
      }
    } else {
      setActiveShipment(null);
      setStops([]);
    }
    setLoading(false);
  }, [driverId]);

  useEffect(() => {
    fetchDriver();
    fetchActiveRoute();
  }, [fetchDriver, fetchActiveRoute]);

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

      // 3. Check if all stops are completed → mark shipment as delivered
      const remainingPending = stops.filter(
        (s) => s.id !== stopId && s.status !== 'completed'
      );
      if (remainingPending.length <= 1) {
        // Only the next stop or none left
        if (remainingPending.length === 0) {
          await supabase
            .from('shipments')
            .update({ status: 'delivered' })
            .eq('id', activeShipment?.id);

          // ✨ TRIGGER SETTLEMENT MAGIC ✨
          if (activeShipment) {
            // 1. Transaction: Retailer -> Factory
            const tx_number = `TX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            await supabase.from('transactions').insert({
              tx_number,
              from_entity: 'b1000000-0000-0000-0000-000000000001', // Retailer ID
              to_entity: activeShipment.factory_id, // Factory ID
              amount: activeShipment.total_amount * 0.98, // 2% platform fee
              fee: activeShipment.total_amount * 0.02,
              type: 'settlement',
              status: 'completed',
              related_shipment_id: activeShipment.id
            });

            // 2. Add amount to Factory Balance
            const { data: factory } = await supabase.from('factories').select('balance').eq('id', activeShipment.factory_id).single();
            if (factory) {
              await supabase.from('factories').update({ balance: factory.balance + (activeShipment.total_amount * 0.98) }).eq('id', activeShipment.factory_id);
            }

            // 3. Update driver balance (earnings from stops)
            const totalDriverEarnings = stops.reduce((sum, s) => sum + s.earnings, 0);
            if (driver) {
              await supabase.from('drivers').update({ 
                balance: driver.balance + totalDriverEarnings,
                total_trips: driver.total_trips + 1
              }).eq('id', driver.id);
            }

            // 4. Update platform stats (GMV, platform_fee, total_transactions)
            const { data: stats } = await supabase.from('platform_stats').select('*').eq('id', 1).single();
            if (stats) {
              await supabase.from('platform_stats').update({
                gmv: stats.gmv + activeShipment.total_amount,
                platform_fee_today: stats.platform_fee_today + (activeShipment.total_amount * 0.02),
                total_transactions: stats.total_transactions + 1,
                daily_settlements: stats.daily_settlements + 1,
                updated_at: new Date().toISOString()
              }).eq('id', 1);
            }
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
    refreshRoute: fetchActiveRoute,
  };
}
