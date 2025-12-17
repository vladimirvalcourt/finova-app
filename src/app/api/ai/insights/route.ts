import { NextRequest, NextResponse } from 'next/server'
import { generateSpendingInsights } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { transactions, previousTransactions, locale = 'en-US' } = body

        if (!transactions || !Array.isArray(transactions)) {
            return NextResponse.json(
                { error: 'transactions array is required' },
                { status: 400 }
            )
        }

        const insights = await generateSpendingInsights(
            transactions,
            previousTransactions || [],
            locale
        )

        return NextResponse.json({ insights })
    } catch (error: any) {
        console.error('AI Insights API error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate insights' },
            { status: 500 }
        )
    }
}
