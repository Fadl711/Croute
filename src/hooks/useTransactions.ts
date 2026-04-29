import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Transaction, AuditLogEntry, PlatformStats, Retailer } from '../lib/supabase';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [txRes, auditRes, statsRes, retRes] = await Promise.all([
      supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('platform_stats').select('*').eq('id', 1).single(),
      supabase.from('retailers').select('*').order('credit_score', { ascending: false }),
    ]);
    if (txRes.data) setTransactions(txRes.data);
    if (auditRes.data) setAuditLog(auditRes.data);
    if (statsRes.data) setPlatformStats(statsRes.data);
    if (retRes.data) setRetailers(retRes.data);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  // Real-time
  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchAll())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'platform_stats' }, (p) => {
        if (p.new) setPlatformStats(p.new as PlatformStats);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  return { transactions, auditLog, platformStats, retailers, loading, refreshAll: fetchAll };
}
