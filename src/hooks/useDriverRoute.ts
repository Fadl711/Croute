import { useState, useEffect, useCallback } from 'react';
import { supabase, DEMO_DRIVER_ID } from '../lib/supabase';
import type { Driver, Shipment, RouteStop } from '../lib/supabase';

export function useDriverRoute(driverId: string = DEMO_DRIVER_ID) {
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

  // Fetch active shipment + stops
  const fetchActiveRoute = useCallback(async () => {
    setLoading(true);
    // Get the most recent in_transit shipment for this driver
    const { data: shipment } = await supabase
      .from('shipments')
      .select('*')
      .eq('driver_id', driverId)
      .eq('status', 'in_transit')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (shipment) {
      setActiveShipment(shipment);
      const { data: routeStops } = await supabase
        .from('route_stops')
        .select('*')
        .eq('shipment_id', shipment.id)
        .order('stop_order', { ascending: true });
      if (routeStops) setStops(routeStops);
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
