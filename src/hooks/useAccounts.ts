import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

export interface Account {
    id: string
    user_id: string
    name: string
    type: 'checking' | 'savings' | 'credit' | 'investment'
    balance: number
    currency: string
    color: string
    created_at: string
    updated_at: string
}

// Fetcher function for SWR
const fetchAccounts = async (): Promise<Account[]> => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
}

// Hook to get all accounts
export function useAccounts() {
    const { data, error, isLoading, mutate } = useSWR<Account[]>(
        'accounts',
        fetchAccounts,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    )

    return {
        accounts: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}

// Hook to get total balance across all accounts
export function useTotalBalance() {
    const { accounts, isLoading } = useAccounts()

    const totalBalance = accounts.reduce((sum, account) => {
        return sum + Number(account.balance)
    }, 0)

    return {
        totalBalance,
        isLoading,
    }
}

// Hook to get account by ID
export function useAccount(accountId: string | null) {
    const { accounts, isLoading, isError } = useAccounts()

    const account = accounts.find((acc) => acc.id === accountId)

    return {
        account,
        isLoading,
        isError,
    }
}
