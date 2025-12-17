// Categories API functions using Supabase

import { supabase } from '@/lib/supabase'

export interface CategoryInsert {
    user_id: string
    name: string
    type: 'INCOME' | 'EXPENSE'
    icon?: string
    color?: string
    parent_id?: string | null
}

export interface CategoryUpdate {
    name?: string
    icon?: string
    color?: string
    parent_id?: string | null
}

// Get all categories (user's custom + system defaults)
export async function getCategories(userId: string) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('name', { ascending: true })

    if (error) throw error
    return data
}

// Get categories by type
export async function getCategoriesByType(userId: string, type: 'INCOME' | 'EXPENSE') {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .eq('type', type)
        .order('name', { ascending: true })

    if (error) throw error
    return data
}

// Get single category
export async function getCategory(id: string) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// Create new custom category
export async function createCategory(category: CategoryInsert) {
    const { data, error } = await supabase
        .from('categories')
        // @ts-ignore
        .insert({
            ...category,
            icon: category.icon || '📁',
            color: category.color || '#6366f1',
        })
        .select()
        .single()

    if (error) throw error
    return data
}

// Update category (only user's own categories)
export async function updateCategory(id: string, updates: CategoryUpdate) {
    const { data, error } = await supabase
        .from('categories')
        // @ts-ignore
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// Delete category (only user's own categories)
export async function deleteCategory(id: string) {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// Get category with transaction count
export async function getCategoryWithStats(id: string, userId: string) {
    const category = await getCategory(id) as any

    if (!category) return null

    const { count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('category_id', id)

    if (error) throw error

    return {
        ...category,
        transactionCount: count || 0,
    }
}

