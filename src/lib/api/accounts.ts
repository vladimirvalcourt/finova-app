// Example API functions for accounts using Supabase

import { supabase } from '@/lib/supabase'
import type { AccountInsert, AccountUpdate } from '@/types/account'

// Get all accounts for current user
export async function getAccounts(userId: string) {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Get single account
export async function getAccount(id: string) {
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// Create new account
export async function createAccount(account: AccountInsert) {
    const { data, error } = await supabase
        .from('accounts')
        // @ts-ignore
        .insert(account)
        .select()
        .single()

    if (error) throw error
    return data
}

// Update account
export async function updateAccount(id: string, updates: AccountUpdate) {
    const { data, error } = await supabase
        .from('accounts')
        // @ts-ignore
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// Delete account
export async function deleteAccount(id: string) {
    const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Get account balance
export async function getAccountBalance(accountId: string) {
    const { data, error } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single()

    if (error) throw error
    return (data as any).balance
}

// Update account balance
export async function updateAccountBalance(accountId: string, newBalance: number) {
    const { data, error } = await supabase
        .from('accounts')
        // @ts-ignore
        .update({ balance: newBalance })
        .eq('id', accountId)
        .select()
        .single()

    if (error) throw error
    return data
}

// Get total balance across all accounts
export async function getTotalBalance(userId: string) {
    const { data, error } = await supabase
        .from('accounts')
        .select('balance')
        .eq('user_id', userId)

    if (error) throw error

    return (data as any[]).reduce((total, account) => total + Number(account.balance), 0)
}
