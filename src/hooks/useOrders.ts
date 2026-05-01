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
    // Determine the scope
    const activeRetailerId = getActiveRetailerId();
    
    // Safety check: If no scope is provided, don't fetch anything (unless it's an intentional global fetch)
    if (!factoryId && !retailerId && !activeRetailerId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let query = supabase
      .from('orders')
      .select(`
        *,
        retailer:retailers(name),
        factory:factories(name),
        order_items (
          *,
          product:products (*)
        )
      `);
    
    if (factoryId) {
      query = query.eq("factory_id", factoryId).eq("status", "pending_factory");
    } else if (retailerId) {
      query = query.eq("retailer_id", retailerId);
    } else {
      query = query.eq("retailer_id", activeRetailerId);
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
    const retailerId = orderData.retailer_id || getActiveRetailerId();
    
    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        ...orderData,
        order_number,
        retailer_id: retailerId,
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

    // 3. Update Retailer Credit Balance
    const totalOrder = Math.round(orderData.total || 0);
    const { data: retailer } = await supabase
      .from('retailers')
      .select('credit_used')
      .eq('id', retailerId)
      .single();
    
    if (retailer) {
      await supabase
        .from('retailers')
        .update({ credit_used: retailer.credit_used + totalOrder })
        .eq('id', retailerId);
      
      // Log in history
      await supabase.from('credit_history').insert({
        retailer_id: retailerId,
        type: 'order',
        amount: totalOrder,
        description: `طلب جديد رقم ${order_number}`,
        balance_after: retailer.credit_used + totalOrder
      });
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
