import { NextRequest, NextResponse } from 'next/server'
import { parseNaturalLanguageTransaction } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { input, locale = 'en-US' } = body

        if (!input) {
            return NextResponse.json(
                { error: 'input text is required' },
                { status: 400 }
            )
        }

        const transaction = await parseNaturalLanguageTransaction(input, locale)

        return NextResponse.json({ transaction })
    } catch (error: any) {
        console.error('AI NL Parse API error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to parse transaction' },
            { status: 500 }
        )
    }
}
