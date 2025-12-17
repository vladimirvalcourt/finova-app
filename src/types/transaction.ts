import type { Database } from './database.types'

export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export interface TransactionWithCategory extends Transaction {
    category: {
        id: string
        name: string
        icon: string
        color: string
    } | null
    account: {
        id: string
        name: string
        icon: string
    }
}

export interface TransactionFilters {
    accountId?: string
    categoryId?: string
    type?: 'INCOME' | 'EXPENSE' | 'TRANSFER'
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
    search?: string
}

export interface TransactionStats {
    totalIncome: number
    totalExpense: number
    netIncome: number
    transactionCount: number
    averageTransaction: number
}
