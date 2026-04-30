import { useState, useEffect, useCallback } from 'react';
import { supabase, DEMO_FACTORY_ID } from '../lib/supabase';
import type { Shipment } from '../lib/supabase';

export function useShipments(factoryId?: string) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (factoryId) {
      query = query.eq('factory_id', factoryId);
    }

    const { data } = await query;
    
    if (data) {
      setShipments(data);
    }
    setLoading(false);
  }, [factoryId]);

  const updateShipment = async (id: string, patch: Partial<Shipment>) => {
    const { error } = await supabase
      .from('shipments')
      .update(patch)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating shipment:', error);
      throw error;
    }
    fetchShipments();
  };

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
          filter: factoryId ? `factory_id=eq.${factoryId}` : undefined,
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

  return { shipments, loading, updateShipment, refetch: fetchShipments };
}
