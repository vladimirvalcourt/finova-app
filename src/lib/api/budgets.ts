// Budget API functions using Supabase

import { supabase } from '@/lib/supabase'

export interface BudgetInsert {
    user_id: string
    category_id: string
    amount: number
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    start_date: string
    end_date?: string | null
}

export interface BudgetUpdate {
    amount?: number
    period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    start_date?: string
    end_date?: string | null
}

// Get all budgets for current user
export async function getBudgets(userId: string) {
    const { data, error } = await supabase
        .from('budgets')
        .select(`
      *,
      category:categories(id, name, icon, color)
    `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Get single budget
export async function getBudget(id: string) {
    const { data, error } = await supabase
        .from('budgets')
        .select(`
      *,
      category:categories(*)
    `)
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// Create new budget
export async function createBudget(budget: BudgetInsert) {
    const { data, error } = await supabase
        .from('budgets')
        // @ts-ignore
        .insert(budget)
        .select(`
      *,
      category:categories(id, name, icon, color)
    `)
        .single()

    if (error) throw error
    return data
}

// Update budget
export async function updateBudget(id: string, updates: BudgetUpdate) {
    const { data, error } = await supabase
        .from('budgets')
        // @ts-ignore
        .update(updates)
        .eq('id', id)
        .select(`
      *,
      category:categories(id, name, icon, color)
    `)
        .single()

    if (error) throw error
    return data
}

// Delete budget
export async function deleteBudget(id: string) {
    const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Get budget with spent amount calculation
export async function getBudgetWithSpent(budgetId: string, userId: string) {
    const budget = await getBudget(budgetId) as any

    if (!budget) return null

    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('category_id', budget.category_id)
        .eq('type', 'EXPENSE')
        .gte('date', budget.start_date)
        .lte('date', budget.end_date || new Date().toISOString())

    const spent = (transactions as any[] || []).reduce(
        (sum, t) => sum + Math.abs(Number(t.amount)),
        0
    )

    return {
        ...budget,
        spent,
        remaining: Number(budget.amount) - spent,
        percentage: (spent / Number(budget.amount)) * 100,
    }
}

