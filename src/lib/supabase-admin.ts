import { getServerSession } from 'next-auth'
import { createClient } from '@supabase/supabase-js'
import { authOptions } from '@/lib/auth'
import { ApiError } from '@/lib/api-error'

export async function getAuthenticatedUser() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        throw ApiError.unauthorized()
    }

    const supabase = getSupabaseAdmin()

    const { data: user, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

    if (error || !user) {
        throw ApiError.notFound('User not found')
    }

    return { user, supabase, session }
}

export function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw ApiError.internal('Supabase configuration missing')
    }

    return createClient(supabaseUrl, supabaseKey)
}
