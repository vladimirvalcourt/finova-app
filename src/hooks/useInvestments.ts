import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Investment {
    id: string
    name: string
    symbol: string
    amount: number
    value: number
    change: number // Percentage change
    type: 'stock' | 'crypto' | 'etf' | 'bond'
}

export function useInvestments() {
    const [investments, setInvestments] = useState<Investment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalValue, setTotalValue] = useState(0)
    const [overallReturn, setOverallReturn] = useState(0)

    useEffect(() => {
        async function fetchInvestments() {
            try {
                const res = await fetch('/api/data/investments')
                if (!res.ok) {
                    throw new Error('Failed to fetch investments')
                }
                const data = await res.json()

                setInvestments(data)

                const total = data.reduce((sum: number, inv: Investment) => sum + inv.value, 0)
                setTotalValue(total)

                // Calculate weighted return
                const weightedReturn = total > 0
                    ? data.reduce((acc: number, inv: Investment) => acc + (inv.change * (inv.value / total)), 0)
                    : 0
                setOverallReturn(weightedReturn)

            } catch (error) {
                console.error('Error fetching investments:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchInvestments()
    }, [])

    return {
        investments,
        totalValue,
        overallReturn,
        isLoading
    }
}
