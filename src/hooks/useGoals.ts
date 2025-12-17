import useSWR from 'swr'
import type { Database } from '@/types/database.types'

type Goal = Database['public']['Tables']['goals']['Row']

const fetcher = async (): Promise<Goal[]> => {
    const res = await fetch('/api/data/goals')
    if (!res.ok) {
        throw new Error('Failed to fetch goals')
    }
    return res.json()
}

export function useGoals() {
    const { data, error, isLoading, mutate } = useSWR<Goal[]>('goals', fetcher)

    const goals = data || []

    // Calculate progress for each goal
    const goalsWithProgress = goals.map(goal => ({
        ...goal,
        percentage: goal.target_amount > 0
            ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
            : 0,
        remaining: goal.target_amount - goal.current_amount,
    }))

    return {
        goals: goalsWithProgress,
        isLoading,
        isError: !!error,
        mutate,
    }
}

export function useGoalsSummary() {
    const { goals, isLoading } = useGoals()

    const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0)
    const totalCurrent = goals.reduce((sum, g) => sum + g.current_amount, 0)
    const overallPercentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0
    const activeGoals = goals.filter(g => g.current_amount < g.target_amount).length
    const completedGoals = goals.filter(g => g.current_amount >= g.target_amount).length

    return {
        totalTarget,
        totalCurrent,
        overallPercentage,
        activeGoals,
        completedGoals,
        isLoading,
    }
}

// Mutation functions for CRUD operations
export function useGoalMutations() {
    const { mutate } = useGoals()

    const createGoal = async (goal: {
        name: string
        target_amount: number
        current_amount?: number
        deadline?: string | null
        icon?: string
        color?: string
    }) => {
        const res = await fetch('/api/data/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goal),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to create goal')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const updateGoal = async (id: string, updates: {
        name?: string
        target_amount?: number
        current_amount?: number
        deadline?: string | null
        icon?: string
        color?: string
    }) => {
        const res = await fetch('/api/data/goals', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to update goal')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const deleteGoal = async (id: string) => {
        const res = await fetch(`/api/data/goals?id=${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to delete goal')
        }

        await mutate()
    }

    const addContribution = async (id: string, amount: number) => {
        const res = await fetch('/api/data/goals', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, amount }),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to add contribution')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    return {
        createGoal,
        updateGoal,
        deleteGoal,
        addContribution,
    }
}
