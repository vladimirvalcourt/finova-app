import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-admin'
import { handleApiError, ApiError } from '@/lib/api-error'
import { createBudgetSchema, updateBudgetSchema } from '@/lib/validations/schemas'

// GET all budgets with spent calculation
export async function GET() {
    try {
        const { user, supabase } = await getAuthenticatedUser()

        const { data: budgets, error } = await supabase
            .from('budgets')
            .select(`
                *,
                category:categories(name, icon, color)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw ApiError.internal('Failed to fetch budgets')

        // Calculate spent for each budget
        const budgetsWithSpent = await Promise.all(
            (budgets || []).map(async (budget: any) => {
                const { data: transactions } = await supabase
                    .from('transactions')
                    .select('amount')
                    .eq('user_id', user.id)
                    .eq('category_id', budget.category_id)
                    .eq('type', 'EXPENSE')
                    .gte('date', budget.start_date)
                    .lte('date', budget.end_date || new Date().toISOString())

                const spent = (transactions as any[])?.reduce(
                    (sum, t) => sum + Math.abs(Number(t.amount)),
                    0
                ) || 0

                return {
                    ...budget,
                    spent,
                    remaining: Number(budget.amount) - spent,
                    percentage: (spent / Number(budget.amount)) * 100,
                }
            })
        )

        return NextResponse.json(budgetsWithSpent)
    } catch (error) {
        return handleApiError(error)
    }
}

// POST create budget
export async function POST(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const validated = createBudgetSchema.parse(body)

        const { data, error } = await supabase
            .from('budgets')
            .insert({
                ...validated,
                user_id: user.id,
            })
            .select(`
                *,
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw ApiError.internal('Failed to create budget')

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return handleApiError(error)
    }
}

// PUT update budget
export async function PUT(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const { id, ...updates } = body
        if (!id) throw ApiError.badRequest('Budget ID is required')

        const validated = updateBudgetSchema.parse(updates)

        const { data, error } = await supabase
            .from('budgets')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id)
            .select(`
                *,
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw ApiError.internal('Failed to update budget')
        if (!data) throw ApiError.notFound('Budget not found')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// DELETE budget
export async function DELETE(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) throw ApiError.badRequest('Budget ID is required')

        const { error } = await supabase
            .from('budgets')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw ApiError.internal('Failed to delete budget')

        return NextResponse.json({ success: true })
    } catch (error) {
        return handleApiError(error)
    }
}
