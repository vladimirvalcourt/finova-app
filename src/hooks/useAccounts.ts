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
    const res = await fetch('/api/data/accounts')
    if (!res.ok) {
        throw new Error('Failed to fetch accounts')
    }
    return res.json()
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

// Mutation functions for CRUD operations
export function useAccountMutations() {
    const { mutate } = useAccounts()

    const createAccount = async (account: Omit<Account, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('accounts')
            // @ts-ignore - Types will resolve when Supabase is connected
            .insert({
                ...account,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const updateAccount = async (id: string, updates: Partial<Account>) => {
        const { data, error } = await supabase
            .from('accounts')
            // @ts-ignore - Types will resolve when Supabase is connected
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const deleteAccount = async (id: string) => {
        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', id)

        if (error) throw error

        await mutate()
    }

    return {
        createAccount,
        updateAccount,
        deleteAccount,
    }
}

