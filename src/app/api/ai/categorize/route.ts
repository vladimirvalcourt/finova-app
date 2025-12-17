import { NextRequest, NextResponse } from 'next/server'
import { categorizeTransaction } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { description, amount, locale = 'en-US' } = body

        if (!description || amount === undefined) {
            return NextResponse.json(
                { error: 'description and amount are required' },
                { status: 400 }
            )
        }

        const category = await categorizeTransaction(description, amount, locale)

        return NextResponse.json({ category })
    } catch (error: any) {
        console.error('AI Categorization API error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to categorize transaction' },
            { status: 500 }
        )
    }
}
