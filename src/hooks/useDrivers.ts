import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Driver } from '../lib/supabase';

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('drivers')
      .select('*')
      .order('name');
    
    if (data) {
      setDrivers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return { drivers, loading, refetch: fetchDrivers };
}
