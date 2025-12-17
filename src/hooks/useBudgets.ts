import useSWR from 'swr'

export interface Budget {
    id: string
    user_id: string
    category_id: string
    amount: number
    period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
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
            budget.period === 'MONTHLY' &&
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
        period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
        start_date: string
        end_date?: string | null
    }) => {
        const res = await fetch('/api/data/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to create budget')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const updateBudget = async (id: string, updates: {
        amount?: number
        period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
        start_date?: string
        end_date?: string | null
    }) => {
        const res = await fetch('/api/data/budgets', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to update budget')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const deleteBudget = async (id: string) => {
        const res = await fetch(`/api/data/budgets?id=${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to delete budget')
        }

        await mutate()
    }

    return {
        createBudget,
        updateBudget,
        deleteBudget,
    }
}
