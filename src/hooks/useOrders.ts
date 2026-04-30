import { useState, useEffect, useCallback } from "react";
import {
  supabase,
  getActiveFactoryId,
  getActiveRetailerId,
} from "../lib/supabase";
import type { Order, OrderItem } from "../lib/supabase";

export function useOrders(factoryId?: string, retailerId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `);
    
    if (factoryId) {
      query = query.eq("factory_id", factoryId).eq("status", "pending_factory");
    } else if (retailerId) {
      query = query.eq("retailer_id", retailerId);
    } else {
      // Default to dynamic active ID
      query = query.eq("retailer_id", getActiveRetailerId());
    }

    const { data } = await query.order('created_at', { ascending: false });
    
    if (data) {
      setOrders(data as any[]);
    }
    setLoading(false);
  }, [factoryId, retailerId]);

  useEffect(() => {
    fetchOrders();

    const filter = factoryId
      ? `factory_id=eq.${factoryId}`
      : `retailer_id=eq.${retailerId || getActiveRetailerId()}`;

    const channel = supabase
      .channel('schema-db-changes-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: filter,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, factoryId, retailerId]);

  // For Retailer: Submit a new order
  const createOrder = async (orderData: Partial<Order>, items: Partial<OrderItem>[]) => {
    const order_number = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        ...orderData,
        order_number,
        retailer_id: orderData.retailer_id || getActiveRetailerId(),
        status: "pending_factory",
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // 2. Insert items
    if (items && items.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items.map(item => ({ ...item, order_id: order.id })));
      
      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw itemsError;
      }
    }
    
    return order;
  };

  // For Factory: Update order status
  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
      throw error;
    }
    
    fetchOrders();
  };

  return { 
    orders, 
    incomingOrders: orders, // Alias for backward compatibility
    loading, 
    createOrder, 
    updateOrderStatus, 
    refetch: fetchOrders 
  };
}
