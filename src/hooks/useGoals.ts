import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'

type Goal = Database['public']['Tables']['goals']['Row']

const fetcher = async (): Promise<Goal[]> => {
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('deadline', { ascending: true, nullsFirst: false })

    if (error) throw error
    return data || []
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
