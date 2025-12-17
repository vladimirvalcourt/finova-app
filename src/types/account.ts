import type { Database } from './database.types'

export type Account = Database['public']['Tables']['accounts']['Row']
export type AccountInsert = Database['public']['Tables']['accounts']['Insert']
export type AccountUpdate = Database['public']['Tables']['accounts']['Update']

export interface AccountWithTransactions extends Account {
    transaction_count?: number
}

export interface AccountStats {
    totalBalance: number
    accountCount: number
    byType: Record<string, number>
}
