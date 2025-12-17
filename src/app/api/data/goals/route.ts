import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-admin'
import { handleApiError, ApiError } from '@/lib/api-error'
import { createGoalSchema, updateGoalSchema, addContributionSchema } from '@/lib/validations/schemas'

// GET all goals
export async function GET() {
    try {
        const { user, supabase } = await getAuthenticatedUser()

        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('deadline', { ascending: true, nullsFirst: false })

        if (error) throw ApiError.internal('Failed to fetch goals')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// POST create goal
export async function POST(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const validated = createGoalSchema.parse(body)

        const { data, error } = await supabase
            .from('goals')
            .insert({
                ...validated,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw ApiError.internal('Failed to create goal')

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return handleApiError(error)
    }
}

// PUT update goal
export async function PUT(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const { id, ...updates } = body
        if (!id) throw ApiError.badRequest('Goal ID is required')

        const validated = updateGoalSchema.parse(updates)

        const { data, error } = await supabase
            .from('goals')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw ApiError.internal('Failed to update goal')
        if (!data) throw ApiError.notFound('Goal not found')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// PATCH add contribution to goal
export async function PATCH(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const { id, amount } = body
        if (!id) throw ApiError.badRequest('Goal ID is required')

        const validated = addContributionSchema.parse({ amount })

        // Get current goal
        const { data: goal, error: fetchError } = await supabase
            .from('goals')
            .select('current_amount')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !goal) throw ApiError.notFound('Goal not found')

        const newAmount = Number(goal.current_amount) + validated.amount

        const { data, error } = await supabase
            .from('goals')
            .update({ current_amount: newAmount })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) throw ApiError.internal('Failed to add contribution')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// DELETE goal
export async function DELETE(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) throw ApiError.badRequest('Goal ID is required')

        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) throw ApiError.internal('Failed to delete goal')

        return NextResponse.json({ success: true })
    } catch (error) {
        return handleApiError(error)
    }
}
