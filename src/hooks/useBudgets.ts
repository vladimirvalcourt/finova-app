import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

export interface Budget {
    id: string
    user_id: string
    category_id: string
    amount: number
    period: 'weekly' | 'monthly' | 'yearly'
    start_date: string
    end_date: string | null
    created_at: string
    updated_at: string
}

export interface BudgetWithDetails extends Budget {
    category?: {
        name: string
        icon: string
        color: string
    }
    spent?: number
    remaining?: number
    percentage?: number
}

// Fetcher function for SWR
const fetchBudgets = async (): Promise<BudgetWithDetails[]> => {
    const res = await fetch('/api/data/budgets')
    if (!res.ok) {
        throw new Error('Failed to fetch budgets')
    }
    return res.json()
}

// Hook to get all budgets
export function useBudgets() {
    const { data, error, isLoading, mutate } = useSWR<BudgetWithDetails[]>(
        'budgets',
        fetchBudgets,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    )

    return {
        budgets: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}

// Hook to get current month budgets
export function useCurrentMonthBudgets() {
    const { budgets, isLoading, isError } = useBudgets()

    const now = new Date()
    const currentMonthBudgets = budgets.filter((budget) => {
        const startDate = new Date(budget.start_date)
        return (
            budget.period === 'monthly' &&
            startDate.getMonth() === now.getMonth() &&
            startDate.getFullYear() === now.getFullYear()
        )
    })

    return {
        budgets: currentMonthBudgets,
        isLoading,
        isError,
    }
}

// Hook to get budget status
export function useBudgetStatus() {
    const { budgets, isLoading } = useCurrentMonthBudgets()

    const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0)
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0)
    const totalRemaining = totalBudget - totalSpent
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

    const onTrack = budgets.filter((b) => (b.percentage || 0) <= 100).length
    const overBudget = budgets.filter((b) => (b.percentage || 0) > 100).length

    return {
        totalBudget,
        totalSpent,
        totalRemaining,
        overallPercentage,
        onTrack,
        overBudget,
        isLoading,
    }
}

// Mutation functions for CRUD operations
export function useBudgetMutations() {
    const { mutate } = useBudgets()

    const createBudget = async (budget: {
        category_id: string
        amount: number
        period: 'weekly' | 'monthly' | 'yearly'
        start_date: string
        end_date?: string | null
    }) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('budgets')
            // @ts-ignore - Types will resolve when Supabase is connected
            .insert({
                ...budget,
                user_id: user.id,
            })
            .select(`
                *,
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const updateBudget = async (id: string, updates: {
        amount?: number
        period?: 'weekly' | 'monthly' | 'yearly'
        start_date?: string
        end_date?: string | null
    }) => {
        const { data, error } = await supabase
            .from('budgets')
            // @ts-ignore - Types will resolve when Supabase is connected
            .update(updates)
            .eq('id', id)
            .select(`
                *,
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const deleteBudget = async (id: string) => {
        const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', id)

        if (error) throw error

        await mutate()
    }

    return {
        createBudget,
        updateBudget,
        deleteBudget,
    }
}

