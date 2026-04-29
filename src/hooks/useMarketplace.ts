import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Factory } from '../lib/supabase';

export interface MarketplaceItem extends Product {
  factory_name: string;
}

export function useMarketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    // Fetch products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    // Fetch factories for names
    const { data: factoriesData } = await supabase
      .from('factories')
      .select('*');

    if (productsData && factoriesData) {
      setFactories(factoriesData);
      
      const factoryMap = new Map(factoriesData.map(f => [f.id, f.name]));
      
      const enrichedItems = productsData.map(p => ({
        ...p,
        factory_name: factoryMap.get(p.factory_id) || 'مصنع غير معروف',
      }));
      setItems(enrichedItems);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  return {
    items,
    factories,
    loading,
    refreshMarketplace: fetchMarketplace,
  };
}
