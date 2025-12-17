// Goals API functions using Supabase

import { supabase } from '@/lib/supabase'

export interface GoalInsert {
    user_id: string
    name: string
    target_amount: number
    current_amount?: number
    deadline?: string | null
    icon?: string
    color?: string
}

export interface GoalUpdate {
    name?: string
    target_amount?: number
    current_amount?: number
    deadline?: string | null
    icon?: string
    color?: string
}

// Get all goals for current user
export async function getGoals(userId: string) {
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('deadline', { ascending: true, nullsFirst: false })

    if (error) throw error
    return data
}

// Get single goal
export async function getGoal(id: string) {
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// Create new goal
export async function createGoal(goal: GoalInsert) {
    const { data, error } = await supabase
        .from('goals')
        // @ts-ignore
        .insert({
            ...goal,
            current_amount: goal.current_amount || 0,
        })
        .select()
        .single()

    if (error) throw error
    return data
}

// Update goal
export async function updateGoal(id: string, updates: GoalUpdate) {
    const { data, error } = await supabase
        .from('goals')
        // @ts-ignore
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// Delete goal
export async function deleteGoal(id: string) {
    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Add contribution to goal
export async function addGoalContribution(id: string, amount: number) {
    const goal = await getGoal(id) as any

    if (!goal) throw new Error('Goal not found')

    const newAmount = Number(goal.current_amount) + amount

    const { data, error } = await supabase
        .from('goals')
        // @ts-ignore
        .update({ current_amount: newAmount })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// Get goal progress
export async function getGoalProgress(id: string) {
    const goal = await getGoal(id) as any

    if (!goal) return null

    const percentage = goal.target_amount > 0
        ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
        : 0

    const remaining = goal.target_amount - goal.current_amount
    const isCompleted = goal.current_amount >= goal.target_amount

    return {
        ...goal,
        percentage,
        remaining,
        isCompleted,
    }
}

