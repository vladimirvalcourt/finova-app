import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
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
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('goals')
            // @ts-ignore - Types will resolve when Supabase is connected
            .insert({
                ...goal,
                user_id: user.id,
                current_amount: goal.current_amount || 0,
            })
            .select()
            .single()

        if (error) throw error

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
        const { data, error } = await supabase
            .from('goals')
            // @ts-ignore - Types will resolve when Supabase is connected
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const deleteGoal = async (id: string) => {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)

        if (error) throw error

        await mutate()
    }

    const addContribution = async (id: string, amount: number) => {
        // Get current goal
        const { data: goal } = await supabase
            .from('goals')
            .select('current_amount')
            .eq('id', id)
            .single()

        if (!goal) throw new Error('Goal not found')

        // @ts-ignore - Types will resolve when Supabase is connected
        const newAmount = Number(goal.current_amount) + amount

        const { data, error } = await supabase
            .from('goals')
            // @ts-ignore - Types will resolve when Supabase is connected
            .update({ current_amount: newAmount })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

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

