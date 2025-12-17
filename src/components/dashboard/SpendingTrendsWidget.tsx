'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'
import styles from './SpendingTrendsWidget.module.css'

interface TrendItem {
    category: string
    icon: string
    currentAmount: number
    lastAmount: number
    change: number
    changePercent: number
}

export function SpendingTrendsWidget() {
    const { transactions, isLoading } = useTransactions()

    const trends = useMemo(() => {
        const now = new Date()
        const currentMonthStart = startOfMonth(now)
        const currentMonthEnd = endOfMonth(now)
        const lastMonthStart = startOfMonth(subMonths(now, 1))
        const lastMonthEnd = endOfMonth(subMonths(now, 1))

        // Get current month expense transactions
        const currentMonth = transactions.filter(t => {
            const date = new Date(t.date)
            return t.type === 'expense' && date >= currentMonthStart && date <= currentMonthEnd
        })

        // Get last month expense transactions
        const lastMonth = transactions.filter(t => {
            const date = new Date(t.date)
            return t.type === 'expense' && date >= lastMonthStart && date <= lastMonthEnd
        })

        // Group by category
        const categoryMap = new Map<string, TrendItem>()

        currentMonth.forEach(t => {
            const name = t.category?.name || 'Uncategorized'
            const icon = t.category?.icon || '📦'
            const existing = categoryMap.get(name) || {
                category: name,
                icon,
                currentAmount: 0,
                lastAmount: 0,
                change: 0,
                changePercent: 0,
            }
            existing.currentAmount += Math.abs(Number(t.amount))
            categoryMap.set(name, existing)
        })

        lastMonth.forEach(t => {
            const name = t.category?.name || 'Uncategorized'
            const icon = t.category?.icon || '📦'
            const existing = categoryMap.get(name) || {
                category: name,
                icon,
                currentAmount: 0,
                lastAmount: 0,
                change: 0,
                changePercent: 0,
            }
            existing.lastAmount += Math.abs(Number(t.amount))
            categoryMap.set(name, existing)
        })

        // Calculate changes
        const items: TrendItem[] = []
        categoryMap.forEach(item => {
            item.change = item.currentAmount - item.lastAmount
            item.changePercent = item.lastAmount > 0
                ? ((item.currentAmount - item.lastAmount) / item.lastAmount) * 100
                : item.currentAmount > 0 ? 100 : 0
            items.push(item)
        })

        // Sort by absolute change (biggest movers first)
        return items
            .filter(i => Math.abs(i.changePercent) > 5) // Only show significant changes
            .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
            .slice(0, 4)
    }, [transactions])

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Spending Trends</h3>
                </div>
                <div className={styles.loading}>Analyzing trends...</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Spending Trends</h3>
                <span className={styles.period}>vs last month</span>
            </div>

            {trends.length === 0 ? (
                <div className={styles.empty}>
                    <p>No significant changes yet</p>
                    <span className={styles.emptyHint}>Spend more to see trends</span>
                </div>
            ) : (
                <div className={styles.list}>
                    {trends.map(trend => {
                        const isUp = trend.changePercent > 0
                        const isDown = trend.changePercent < 0
                        const isNeutral = Math.abs(trend.changePercent) < 5

                        return (
                            <div key={trend.category} className={styles.item}>
                                <div className={styles.itemLeft}>
                                    <span className={styles.itemIcon}>{trend.icon}</span>
                                    <div className={styles.itemInfo}>
                                        <span className={styles.itemCategory}>{trend.category}</span>
                                        <span className={styles.itemAmount}>{formatCurrency(trend.currentAmount)}</span>
                                    </div>
                                </div>
                                <div className={`${styles.trend} ${isUp ? styles.up : ''} ${isDown ? styles.down : ''}`}>
                                    {isUp && <TrendingUp size={14} />}
                                    {isDown && <TrendingDown size={14} />}
                                    {isNeutral && <Minus size={14} />}
                                    <span>{Math.abs(trend.changePercent).toFixed(0)}%</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
