import { useState, useEffect, useCallback } from 'react';
import { supabase, DEMO_FACTORY_ID } from '../lib/supabase';
import type { Shipment } from '../lib/supabase';

export function useShipments(factoryId: string = DEMO_FACTORY_ID) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('shipments')
      .select('*')
      .eq('factory_id', factoryId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setShipments(data);
    }
    setLoading(false);
  }, [factoryId]);

  useEffect(() => {
    fetchShipments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes-shipments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shipments',
          filter: `factory_id=eq.${factoryId}`,
        },
        () => {
          fetchShipments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchShipments, factoryId]);

  return { shipments, loading, refetch: fetchShipments };
}
