import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Factory } from '../lib/supabase';

export interface MarketplaceItem extends Product {
  factory_name: string;
}

export function useMarketplace() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketplace = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch products with factory info in one query
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          factories:factory_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const enrichedItems = data.map((p: any) => ({
          ...p,
          factory_name: p.factories?.name || 'مصنع غير معروف',
        }));
        setItems(enrichedItems);
      }
    } catch (err) {
      console.error('Error fetching marketplace:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketplace();
  }, [fetchMarketplace]);

  return {
    items,
    loading,
    refreshMarketplace: fetchMarketplace,
  };
}
