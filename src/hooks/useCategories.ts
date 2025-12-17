// Categories hook using Supabase

import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

export interface Category {
    id: string
    user_id: string | null
    name: string
    type: 'INCOME' | 'EXPENSE'
    icon: string
    color: string
    parent_id: string | null
    created_at: string
    updated_at: string
}

// Fetcher function for SWR
const fetchCategories = async (): Promise<Category[]> => {
    const res = await fetch('/api/data/categories')
    if (!res.ok) {
        throw new Error('Failed to fetch categories')
    }
    return res.json()
}

// Hook to get all categories
export function useCategories() {
    const { data, error, isLoading, mutate } = useSWR<Category[]>(
        'categories',
        fetchCategories,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    )

    return {
        categories: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}

// Hook to get categories by type
export function useCategoriesByType(type: 'INCOME' | 'EXPENSE') {
    const { categories, isLoading, isError } = useCategories()

    const filteredCategories = categories.filter((cat) => cat.type === type)

    return {
        categories: filteredCategories,
        isLoading,
        isError,
    }
}

// Hook to get expense categories
export function useExpenseCategories() {
    return useCategoriesByType('EXPENSE')
}

// Hook to get income categories
export function useIncomeCategories() {
    return useCategoriesByType('INCOME')
}

// Mutation functions for CRUD operations
export function useCategoryMutations() {
    const { mutate } = useCategories()

    const createCategory = async (category: {
        name: string
        type: 'INCOME' | 'EXPENSE'
        icon?: string
        color?: string
        parent_id?: string | null
    }) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { data, error } = await supabase
            .from('categories')
            // @ts-ignore - Types will resolve when Supabase is connected
            .insert({
                ...category,
                user_id: user.id,
                icon: category.icon || '📁',
                color: category.color || '#6366f1',
            })
            .select()
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const updateCategory = async (id: string, updates: {
        name?: string
        icon?: string
        color?: string
    }) => {
        const { data, error } = await supabase
            .from('categories')
            // @ts-ignore - Types will resolve when Supabase is connected
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        await mutate()
        return data
    }

    const deleteCategory = async (id: string) => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) throw error

        await mutate()
    }

    return {
        createCategory,
        updateCategory,
        deleteCategory,
    }
}
