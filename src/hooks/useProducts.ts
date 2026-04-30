import { useState, useEffect, useCallback } from "react";
import { supabase, getActiveFactoryId } from "../lib/supabase";
import type { Product } from "../lib/supabase";

export function useProducts(factoryId: string = getActiveFactoryId()) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('factory_id', factoryId)
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }, [factoryId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(
    async (product: Omit<Product, 'id' | 'factory_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert({ ...product, factory_id: factoryId })
        .select()
        .single();
      if (data) setProducts((prev) => [data, ...prev]);
      return { data, error };
    },
    [factoryId]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (data) {
        setProducts((prev) => prev.map((p) => (p.id === id ? data : p)));
      }
      return { data, error };
    },
    []
  );

  const deleteProduct = useCallback(async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    return { error };
  }, []);

  // Stats derived from live data
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
  const lowStockProducts = products.filter((p) => p.quantity <= p.min_stock).length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
    totalProducts,
    totalValue,
    lowStockProducts,
    totalQuantity,
  };
}
