/**
 * FinancialDataService (SOLID: SRP + DIP)
 * 
 * SRP: Responsável APENAS por operações de dados financeiros.
 * DIP: Implementa a interface IFinancialDataService.
 * OCP: Extensível sem modificar código existente.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Transaction, MonthlyFinancialData, IFinancialDataService } from '@/types/farm';

// ============= Helper (SRP: cálculo isolado) =============
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function calculateMonthlyData(transactions: Transaction[]): MonthlyFinancialData[] {
  const monthlyMap = new Map<string, { receita: number; custos: number }>();

  MONTH_NAMES.forEach(month => {
    monthlyMap.set(month, { receita: 0, custos: 0 });
  });

  transactions.forEach(t => {
    const date = new Date(t.transaction_date);
    const monthName = MONTH_NAMES[date.getMonth()];
    const current = monthlyMap.get(monthName) || { receita: 0, custos: 0 };

    if (t.type === 'income') {
      current.receita += Number(t.amount);
    } else {
      current.custos += Number(t.amount);
    }

    monthlyMap.set(monthName, current);
  });

  return MONTH_NAMES.map(month => {
    const data = monthlyMap.get(month) || { receita: 0, custos: 0 };
    return {
      month,
      receita: data.receita,
      custos: data.custos,
      lucro: data.receita - data.custos,
    };
  });
}

/**
 * Implementação concreta usando Supabase.
 * Liskov: Qualquer implementação de IFinancialDataService pode substituir esta.
 */
export class SupabaseFinancialService implements IFinancialDataService {
  async fetchTransactions(userId: string): Promise<Transaction[]> {
    const { data: transactions, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;

    return (transactions || []).map(t => ({
      id: t.id,
      type: t.type as 'income' | 'expense',
      category: t.category,
      amount: Number(t.amount),
      description: t.description,
      transaction_date: t.transaction_date,
      payment_method: t.payment_method,
      status: t.status,
      created_at: t.created_at,
    }));
  }

  async addTransaction(userId: string, transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('financial_transactions')
      .insert({
        user_id: userId,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        transaction_date: transaction.transaction_date,
        payment_method: transaction.payment_method,
        status: transaction.status || 'completed',
      });

    if (error) throw error;
  }

  subscribeToChanges(userId: string, callback: () => void): () => void {
    const channel = supabase
      .channel(`transactions-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_transactions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }
}

// Singleton (OCP: substituível via injeção)
export const financialService: IFinancialDataService = new SupabaseFinancialService();
