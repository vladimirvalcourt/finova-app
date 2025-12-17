import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-admin'
import { handleApiError, ApiError } from '@/lib/api-error'
import { createAccountSchema, updateAccountSchema } from '@/lib/validations/schemas'

// GET all accounts
export async function GET() {
    try {
        const { user, supabase } = await getAuthenticatedUser()

        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw ApiError.internal('Failed to fetch accounts')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// POST create account
export async function POST(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const validated = createAccountSchema.parse(body)

        const { data, error } = await supabase
            .from('accounts')
            .insert({
                ...validated,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw ApiError.internal('Failed to create account')

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return handleApiError(error)
    }
}

// PUT update account
export async function PUT(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const { id, ...updates } = body
        if (!id) throw ApiError.badRequest('Account ID is required')

        const validated = updateAccountSchema.parse(updates)

        const { data, error } = await supabase
            .from('accounts')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw ApiError.internal('Failed to update account')
        if (!data) throw ApiError.notFound('Account not found')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// DELETE account
export async function DELETE(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) throw ApiError.badRequest('Account ID is required')

        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw ApiError.internal('Failed to delete account')

        return NextResponse.json({ success: true })
    } catch (error) {
        return handleApiError(error)
    }
}
