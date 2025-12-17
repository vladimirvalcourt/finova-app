import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-admin'
import { handleApiError, ApiError } from '@/lib/api-error'
import { createCategorySchema, updateCategorySchema } from '@/lib/validations/schemas'

// GET all categories (user's + system defaults)
export async function GET() {
    try {
        const { user, supabase } = await getAuthenticatedUser()

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .order('name', { ascending: true })

        if (error) throw ApiError.internal('Failed to fetch categories')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// POST create category
export async function POST(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const validated = createCategorySchema.parse(body)

        const { data, error } = await supabase
            .from('categories')
            .insert({
                ...validated,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw ApiError.internal('Failed to create category')

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return handleApiError(error)
    }
}

// PUT update category
export async function PUT(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const body = await request.json()

        const { id, ...updates } = body
        if (!id) throw ApiError.badRequest('Category ID is required')

        const validated = updateCategorySchema.parse(updates)

        const { data, error } = await supabase
            .from('categories')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id) // Only user's own categories can be edited
            .select()
            .single()

        if (error) throw ApiError.internal('Failed to update category')
        if (!data) throw ApiError.notFound('Category not found or is a system category')

        return NextResponse.json(data)
    } catch (error) {
        return handleApiError(error)
    }
}

// DELETE category
export async function DELETE(request: Request) {
    try {
        const { user, supabase } = await getAuthenticatedUser()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) throw ApiError.badRequest('Category ID is required')

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id) // Only user's own categories can be deleted

        if (error) throw ApiError.internal('Failed to delete category')

        return NextResponse.json({ success: true })
    } catch (error) {
        return handleApiError(error)
    }
}
