import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

export interface Transaction {
    id: string
    user_id: string
    account_id: string
    category_id: string | null
    amount: number
    description: string
    type: 'income' | 'expense' | 'transfer'
    date: string
    recurring: boolean
    notes: string | null
    receipt_url: string | null
    created_at: string
    updated_at: string
}

export interface TransactionWithDetails extends Transaction {
    account?: {
        name: string
        color: string
    }
    category?: {
        name: string
        icon: string
        color: string
    }
}

// Fetcher function for SWR
const fetchTransactions = async (): Promise<TransactionWithDetails[]> => {
    const res = await fetch('/api/data/transactions')
    if (!res.ok) {
        throw new Error('Failed to fetch transactions')
    }
    return res.json()
}

// Hook to get all transactions
export function useTransactions() {
    const { data, error, isLoading, mutate } = useSWR<TransactionWithDetails[]>(
        'transactions',
        fetchTransactions,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    )

    return {
        transactions: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}

// Hook to get recent transactions
export function useRecentTransactions(limit: number = 5) {
    const { transactions, isLoading, isError } = useTransactions()

    const recentTransactions = transactions.slice(0, limit)

    return {
        transactions: recentTransactions,
        isLoading,
        isError,
    }
}

// Hook to get transactions by date range
export function useTransactionsByDateRange(startDate: Date, endDate: Date) {
    const { transactions, isLoading, isError } = useTransactions()

    const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= startDate && transactionDate <= endDate
    })

    return {
        transactions: filteredTransactions,
        isLoading,
        isError,
    }
}

// Hook to calculate monthly stats
export function useMonthlyStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const { transactions, isLoading } = useTransactionsByDateRange(startOfMonth, endOfMonth)

    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0

    return {
        income,
        expenses,
        savingsRate,
        isLoading,
    }
}

// Mutation functions for CRUD operations
export function useTransactionMutations() {
    const { mutate } = useTransactions()

    const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('transactions')
            // @ts-ignore - Types will resolve when Supabase is connected
            .insert({
                ...transaction,
                user_id: user.id,
            })
            .select(`
                *,
                account:accounts(name, color),
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw error

        // Revalidate the cache
        await mutate()
        return data
    }

    const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
        const { data, error } = await supabase
            .from('transactions')
            // @ts-ignore - Types will resolve when Supabase is connected
            .update(updates)
            .eq('id', id)
            .select(`
                *,
                account:accounts(name, color),
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const deleteTransaction = async (id: string) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        if (error) throw error

        await mutate()
    }

    return {
        createTransaction,
        updateTransaction,
        deleteTransaction,
    }
}

