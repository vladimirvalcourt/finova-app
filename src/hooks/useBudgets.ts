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
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
        .from('budgets')
        .select(`
      *,
      category:categories(name, icon, color)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
        (data || []).map(async (budget: any) => {
            const { data: transactions } = await supabase
                .from('transactions')
                .select('amount')
                .eq('user_id', user.id)
                .eq('category_id', budget.category_id)
                .eq('type', 'expense')
                .gte('date', budget.start_date)
                .lte('date', budget.end_date || new Date().toISOString())

            const spent = (transactions as any[])?.reduce(
                (sum, t) => sum + Math.abs(Number(t.amount)),
                0
            ) || 0

            const remaining = Number(budget.amount) - spent
            const percentage = (spent / Number(budget.amount)) * 100

            return {
                ...budget,
                spent,
                remaining,
                percentage,
            }
        })
    )

    return budgetsWithSpent
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
