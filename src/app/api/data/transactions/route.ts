import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-admin'
import { handleApiError, ApiError } from '@/lib/api-error'
import { createTransactionSchema, updateTransactionSchema } from '@/lib/validations/schemas'

// GET all transactions
export async function GET() {
    try {
        const { user, supabase } = await getAuthenticatedUser()

        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                account:accounts(name, color),
                category:categories(name, icon, color)
            `)
            .eq('user_id', user.id)
            .order('date', { ascending: false })

        if (error) throw ApiError.internal('Failed to fetch transactions')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// POST create transaction
export async function POST(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const validated = createTransactionSchema.parse(body)

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                ...validated,
                user_id: user.id,
                date: validated.date || new Date().toISOString(),
            })
            .select(`
                *,
                account:accounts(name, color),
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw ApiError.internal('Failed to create transaction')

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return handleApiError(error)
    }
}

// PUT update transaction
export async function PUT(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const { id, ...updates } = body
        if (!id) throw ApiError.badRequest('Transaction ID is required')

        const validated = updateTransactionSchema.parse(updates)

        const { data, error } = await supabase
            .from('transactions')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id) // Ensure user owns this transaction
            .select(`
                *,
                account:accounts(name, color),
                category:categories(name, icon, color)
            `)
            .single()

        if (error) throw ApiError.internal('Failed to update transaction')
        if (!data) throw ApiError.notFound('Transaction not found')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// DELETE transaction
export async function DELETE(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) throw ApiError.badRequest('Transaction ID is required')

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw ApiError.internal('Failed to delete transaction')

        return NextResponse.json({ success: true })
    } catch (error) {
        return handleApiError(error)
    }
}
