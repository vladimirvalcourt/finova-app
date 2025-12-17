import useSWR from 'swr'

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
        const res = await fetch('/api/data/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to create category')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const updateCategory = async (id: string, updates: {
        name?: string
        icon?: string
        color?: string
    }) => {
        const res = await fetch('/api/data/categories', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to update category')
        }

        const data = await res.json()
        await mutate()
        return data
    }

    const deleteCategory = async (id: string) => {
        const res = await fetch(`/api/data/categories?id=${id}`, {
            method: 'DELETE',
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || 'Failed to delete category')
        }

        await mutate()
    }

    return {
        createCategory,
        updateCategory,
        deleteCategory,
    }
}
