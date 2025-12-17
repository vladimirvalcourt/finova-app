'use client'

import { useMemo } from 'react'
import { Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { addDays, format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns'
import styles from './CashFlowWidget.module.css'

export function CashFlowWidget() {
    const { transactions, isLoading } = useTransactions()

    // Get recurring transactions for the next 7 days
    const upcomingItems = useMemo(() => {
        const now = new Date()
        const weekFromNow = addDays(now, 7)

        // Filter recurring transactions
        const recurring = transactions.filter(t => t.recurring)

        // For demo purposes, we'll project recurring transactions into the future
        // In production, you'd have a separate scheduled_transactions table
        const items: Array<{
            id: string
            description: string
            amount: number
            type: string
            date: Date
            isPast: boolean
        }> = []

        recurring.forEach(t => {
            const txDate = new Date(t.date)
            // Project to this month
            const projectedDate = new Date(now.getFullYear(), now.getMonth(), txDate.getDate())

            if (isAfter(projectedDate, startOfDay(now)) && isBefore(projectedDate, endOfDay(weekFromNow))) {
                items.push({
                    id: t.id,
                    description: t.description || 'Recurring',
                    amount: Math.abs(Number(t.amount)),
                    type: t.type,
                    date: projectedDate,
                    isPast: false,
                })
            }
        })

        // Sort by date
        return items.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5)
    }, [transactions])

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    // Calculate totals
    const totalIncoming = upcomingItems
        .filter(i => i.type === 'income')
        .reduce((sum, i) => sum + i.amount, 0)

    const totalOutgoing = upcomingItems
        .filter(i => i.type === 'expense')
        .reduce((sum, i) => sum + i.amount, 0)

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Calendar size={18} />
                        Cash Flow
                    </h3>
                </div>
                <div className={styles.loading}>Loading...</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <Calendar size={18} />
                    Next 7 Days
                </h3>
            </div>

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <ArrowUpCircle size={16} className={styles.incomeIcon} />
                    <span className={styles.summaryLabel}>In</span>
                    <span className={styles.summaryValue}>{formatCurrency(totalIncoming)}</span>
                </div>
                <div className={styles.summaryItem}>
                    <ArrowDownCircle size={16} className={styles.expenseIcon} />
                    <span className={styles.summaryLabel}>Out</span>
                    <span className={styles.summaryValue}>{formatCurrency(totalOutgoing)}</span>
                </div>
            </div>

            {upcomingItems.length === 0 ? (
                <div className={styles.empty}>
                    <p>No upcoming transactions</p>
                    <span className={styles.emptyHint}>Add recurring transactions to see your cash flow</span>
                </div>
            ) : (
                <div className={styles.list}>
                    {upcomingItems.map(item => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemLeft}>
                                {item.type === 'income' ? (
                                    <ArrowUpCircle size={14} className={styles.incomeIcon} />
                                ) : (
                                    <ArrowDownCircle size={14} className={styles.expenseIcon} />
                                )}
                                <span className={styles.itemDesc}>{item.description}</span>
                            </div>
                            <div className={styles.itemRight}>
                                <span className={`${styles.itemAmount} ${item.type === 'income' ? styles.income : styles.expense}`}>
                                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                                </span>
                                <span className={styles.itemDate}>{format(item.date, 'MMM d')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
