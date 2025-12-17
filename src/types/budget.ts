import type { Database } from './database.types'

export type Budget = Database['public']['Tables']['budgets']['Row']
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert']
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update']

export interface BudgetWithCategory extends Budget {
    category: {
        id: string
        name: string
        icon: string
        color: string
    }
    spent: number
    remaining: number
    percentage: number
}

export interface BudgetStats {
    totalBudget: number
    totalSpent: number
    totalRemaining: number
    budgetCount: number
    overBudgetCount: number
}
