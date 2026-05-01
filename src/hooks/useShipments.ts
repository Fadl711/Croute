import { useState, useEffect, useCallback } from "react";
import { supabase, getActiveFactoryId } from "../lib/supabase";
import type { Shipment } from "../lib/supabase";

/**
 * @param factoryId - Filter shipments by factory. Defaults to active factory.
 * @param fetchAll  - If true, fetches ALL shipments (for Admin dashboard).
 */
export function useShipments(
  factoryId: string = getActiveFactoryId(),
  fetchAll: boolean = false
) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = useCallback(async () => {
    // Admin sees everything; Factory sees only its own
    if (!fetchAll && !factoryId) {
      setShipments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase
      .from("shipments")
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
      .order("created_at", { ascending: false });

    if (!fetchAll && factoryId) {
      query = query.eq("factory_id", factoryId);
    }

    const { data } = await query;

    if (data) {
      setShipments(data);
    }
    setLoading(false);
  }, [factoryId, fetchAll]);

  const updateShipment = async (id: string, patch: Partial<Shipment>) => {
    const { error } = await supabase
      .from("shipments")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error("Error updating shipment:", error);
      throw error;
    }
    fetchShipments();
  };

  useEffect(() => {
    fetchShipments();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("schema-db-changes-shipments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shipments",
          filter:
            !fetchAll && factoryId
              ? `factory_id=eq.${factoryId}`
              : undefined,
        },
        () => {
          fetchShipments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchShipments, factoryId, fetchAll]);

  return { shipments, loading, updateShipment, refetch: fetchShipments };
}
