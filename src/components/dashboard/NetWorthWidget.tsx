'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { useTotalBalance } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns'
import styles from './NetWorthWidget.module.css'

export function NetWorthWidget() {
    const { totalBalance, isLoading: balanceLoading } = useTotalBalance()
    const { transactions, isLoading: txLoading } = useTransactions()

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    // Calculate net worth over last 6 months
    const netWorthData = useMemo(() => {
        const now = new Date()
        const months: { month: string; value: number }[] = []
        let runningBalance = totalBalance

        // Work backwards from current balance
        for (let i = 0; i < 6; i++) {
            const monthDate = subMonths(now, i)
            const monthStart = startOfMonth(monthDate)
            const monthEnd = endOfMonth(monthDate)

            if (i === 0) {
                months.unshift({ month: format(monthDate, 'MMM'), value: totalBalance })
            } else {
                // Subtract this month's net change to get previous month's balance
                const monthTransactions = transactions.filter(t => {
                    const txDate = new Date(t.date)
                    return txDate >= monthStart && txDate <= monthEnd
                })

                const monthNet = monthTransactions.reduce((sum, t) => {
                    const amount = Math.abs(Number(t.amount))
                    return sum + (t.type === 'income' ? amount : -amount)
                }, 0)

                runningBalance -= monthNet
                months.unshift({ month: format(monthDate, 'MMM'), value: runningBalance })
            }
        }

        return months
    }, [totalBalance, transactions])

    // Calculate change from last month
    const lastMonth = netWorthData[netWorthData.length - 2]?.value || 0
    const change = totalBalance - lastMonth
    const changePercent = lastMonth !== 0 ? ((change / lastMonth) * 100).toFixed(1) : '0'
    const isPositive = change >= 0

    const isLoading = balanceLoading || txLoading

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Net Worth</h3>
                </div>
                <div className={styles.loading}>Loading...</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Net Worth</h3>
                <div className={`${styles.badge} ${isPositive ? styles.positive : styles.negative}`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? '+' : ''}{changePercent}%
                </div>
            </div>

            <div className={styles.value}>{formatCurrency(totalBalance)}</div>

            <div className={styles.change}>
                <span className={isPositive ? styles.positive : styles.negative}>
                    {isPositive ? '+' : ''}{formatCurrency(change)}
                </span>
                <span className={styles.period}>vs last month</span>
            </div>

            <div className={styles.chart}>
                <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={netWorthData}>
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(24, 24, 27, 0.9)',
                                border: '1px solid rgba(63, 63, 70, 0.5)',
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                            formatter={(value) => [formatCurrency(Number(value) || 0), 'Net Worth']}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? '#22C55E' : '#EF4444'}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
