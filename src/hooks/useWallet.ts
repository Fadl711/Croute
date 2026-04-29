import { useState, useEffect, useCallback } from 'react';
import { supabase, DEMO_FACTORY_ID } from '../lib/supabase';
import type { Factory, Transaction, CashoutRequest } from '../lib/supabase';

export function useWallet(factoryId: string = DEMO_FACTORY_ID) {
  const [factory, setFactory] = useState<Factory | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashouts, setCashouts] = useState<CashoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch factory data
  const fetchFactory = useCallback(async () => {
    const { data } = await supabase
      .from('factories')
      .select('*')
      .eq('id', factoryId)
      .single();
    if (data) setFactory(data);
  }, [factoryId]);

  // Fetch recent transactions for this factory
  const fetchTransactions = useCallback(async () => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .or(`to_entity.eq.${factory?.name ?? ''},from_entity.eq.${factory?.name ?? ''}`)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setTransactions(data);
  }, [factory?.name]);

  // Fetch cashout requests
  const fetchCashouts = useCallback(async () => {
    const { data } = await supabase
      .from('cashout_requests')
      .select('*')
      .eq('factory_id', factoryId)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setCashouts(data);
  }, [factoryId]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchFactory();
      setLoading(false);
    };
    load();
  }, [fetchFactory]);

  // Load transactions once factory is loaded
  useEffect(() => {
    if (factory?.name) {
      fetchTransactions();
      fetchCashouts();
    }
  }, [factory?.name, fetchTransactions, fetchCashouts]);

  // ★ REAL-TIME: Subscribe to factory balance changes
  useEffect(() => {
    const channel = supabase
      .channel('factory-wallet')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'factories',
          filter: `id=eq.${factoryId}`,
        },
        (payload) => {
          if (payload.new) {
            setFactory(payload.new as Factory);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
        },
        () => {
          // Refetch transactions on new entries
          fetchTransactions();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cashout_requests',
          filter: `factory_id=eq.${factoryId}`,
        },
        () => {
          fetchCashouts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [factoryId, fetchTransactions, fetchCashouts]);

  // ★ CASH-OUT: Request instant withdrawal (3% fee)
  const requestCashout = useCallback(
    async (amount: number, bankName: string, bankAccount: string) => {
      if (!factory || factory.balance < amount) {
        return { error: 'رصيد غير كافٍ' };
      }

      const fee = Math.ceil(amount * 0.03);

      // 1. Create the cashout request
      const { data: cashout, error: insertError } = await supabase
        .from('cashout_requests')
        .insert({
          factory_id: factoryId,
          amount,
          fee,
          bank_name: bankName,
          bank_account: bankAccount,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) return { error: insertError.message };

      // 2. Immediately mark as completed (triggers the DB function)
      const { error: updateError } = await supabase
        .from('cashout_requests')
        .update({ status: 'completed' })
        .eq('id', cashout.id);

      if (updateError) return { error: updateError.message };

      // Refresh data
      await fetchFactory();
      await fetchTransactions();
      await fetchCashouts();

      return { success: true, net: amount - fee, fee };
    },
    [factory, factoryId, fetchFactory, fetchTransactions, fetchCashouts]
  );

  return {
    factory,
    transactions,
    cashouts,
    loading,
    requestCashout,
    refreshWallet: fetchFactory,
  };
}
