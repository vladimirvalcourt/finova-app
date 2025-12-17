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
                // In a real app, this would fetch from an 'investments' table
                // For now, we'll simulate an API call or check if the table exists
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // Mock data for now since we don't have the table yet
                // Once backend is ready, replace with:
                // const { data, error } = await supabase.from('investments').select('*').eq('user_id', user.id)
                
                const mockInvestments: Investment[] = [
                    // Uncomment to test with data
                    // { id: '1', name: 'Apple Inc.', symbol: 'AAPL', amount: 10, value: 1850.50, change: 2.5, type: 'stock' },
                    // { id: '2', name: 'Bitcoin', symbol: 'BTC', amount: 0.5, value: 21000.00, change: -1.2, type: 'crypto' },
                ]

                setInvestments(mockInvestments)
                
                const total = mockInvestments.reduce((sum, inv) => sum + inv.value, 0)
                setTotalValue(total)
                
                // Calculate weighted return
                const weightedReturn = total > 0 
                    ? mockInvestments.reduce((acc, inv) => acc + (inv.change * (inv.value / total)), 0)
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
