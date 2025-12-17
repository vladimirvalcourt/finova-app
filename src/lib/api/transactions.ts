// Example API functions using Supabase
// Use these in your components or API routes

import { supabase } from '@/lib/supabase'
import type { TransactionInsert, TransactionUpdate } from '@/types/transaction'

// Get all transactions for current user
export async function getTransactions(userId: string) {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
      *,
      category:categories(*),
      account:accounts(id, name, icon)
    `)
        .eq('user_id', userId)
        .order('date', { ascending: false })

    if (error) throw error
    return data
}

// Get single transaction
export async function getTransaction(id: string) {
    const { data, error } = await supabase
        .from('transactions')
        .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// Create new transaction
export async function createTransaction(transaction: TransactionInsert) {
    const { data, error } = await supabase
        .from('transactions')
        // @ts-ignore
        .insert(transaction)
        .select()
        .single()

    if (error) throw error
    return data
}

// Update transaction
export async function updateTransaction(id: string, updates: TransactionUpdate) {
    const { data, error } = await supabase
        .from('transactions')
        // @ts-ignore
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// Delete transaction
export async function deleteTransaction(id: string) {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Get transactions by date range
export async function getTransactionsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
) {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

    if (error) throw error
    return data
}

// Get transaction stats
export async function getTransactionStats(userId: string) {
    const { data, error } = await supabase
        .from('transactions')
        .select('amount, type')
        .eq('user_id', userId)

    if (error) throw error

    const stats = (data as any[]).reduce(
        (acc, t) => {
            if (t.type === 'INCOME') {
                acc.totalIncome += Number(t.amount)
            } else if (t.type === 'EXPENSE') {
                acc.totalExpense += Number(t.amount)
            }
            acc.transactionCount++
            return acc
        },
        { totalIncome: 0, totalExpense: 0, transactionCount: 0 }
    )

    return {
        ...stats,
        netIncome: stats.totalIncome - stats.totalExpense,
        averageTransaction: stats.transactionCount > 0
            ? (stats.totalIncome + stats.totalExpense) / stats.transactionCount
            : 0,
    }
}

// Subscribe to real-time transaction changes
export function subscribeToTransactions(
    userId: string,
    callback: (payload: any) => void
) {
    const channel = supabase
        .channel('transactions')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'transactions',
                filter: `user_id=eq.${userId}`,
            },
            callback
        )
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
