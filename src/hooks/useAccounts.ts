import useSWR from 'swr'

export interface Account {
    id: string
    user_id: string
    name: string
    type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT' | 'CASH'
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

    const createAccount = async (account: {
        name: string
        type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT' | 'CASH'
        currency?: string
        balance?: number
        color?: string
        icon?: string
    }) => {
        const res = await fetch('/api/data/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(account),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to create account')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const updateAccount = async (id: string, updates: Partial<Account>) => {
        const res = await fetch('/api/data/accounts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to update account')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const deleteAccount = async (id: string) => {
        const res = await fetch(`/api/data/accounts?id=${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to delete account')
        }

        await mutate()
    }

    return {
        createAccount,
        updateAccount,
        deleteAccount,
    }
}
