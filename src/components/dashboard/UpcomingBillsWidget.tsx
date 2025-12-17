'use client'

import { useMemo } from 'react'
import { CalendarClock, AlertTriangle, Check, ArrowRight } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { format, addDays, isBefore, isAfter, startOfDay } from 'date-fns'
import styles from './UpcomingBillsWidget.module.css'

interface UpcomingItem {
    id: string
    description: string
    amount: number
    date: Date
    type: 'upcoming' | 'due_soon' | 'overdue'
}

export function UpcomingBillsWidget() {
    const { transactions, isLoading } = useTransactions()

    const upcomingItems = useMemo(() => {
        if (!transactions) return []

        const today = startOfDay(new Date())
        const nextWeek = addDays(today, 7)
        const threeDays = addDays(today, 3)

        // Get recurring expenses only
        const recurring = transactions.filter(t =>
            t.recurring &&
            t.type?.toUpperCase() === 'EXPENSE' &&
            new Date(t.date) >= today
        )

        const items: UpcomingItem[] = recurring
            .map(t => {
                const date = new Date(t.date)
                let type: UpcomingItem['type'] = 'upcoming'

                if (isBefore(date, today)) {
                    type = 'overdue'
                } else if (isBefore(date, threeDays)) {
                    type = 'due_soon'
                }

                return {
                    id: t.id,
                    description: t.description,
                    amount: t.amount,
                    date,
                    type,
                }
            })
            .filter(item => isBefore(item.date, nextWeek) || item.type === 'overdue')
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 5)

        return items
    }, [transactions])

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    const totalDue = upcomingItems.reduce((sum, item) => sum + item.amount, 0)
    const overdueCount = upcomingItems.filter(i => i.type === 'overdue').length

    if (isLoading) {
        return (
            <div className={styles.widget}>
                <div className={styles.loading}>Loading...</div>
            </div>
        )
    }

    return (
        <div className={styles.widget}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <CalendarClock size={18} className={styles.icon} />
                    <h3>Upcoming Bills</h3>
                </div>
                {overdueCount > 0 && (
                    <div className={styles.alert}>
                        <AlertTriangle size={14} />
                        <span>{overdueCount} overdue</span>
                    </div>
                )}
            </div>

            {upcomingItems.length === 0 ? (
                <div className={styles.empty}>
                    <Check size={20} />
                    <span>No upcoming bills this week!</span>
                </div>
            ) : (
                <>
                    <div className={styles.list}>
                        {upcomingItems.map(item => (
                            <div key={item.id} className={`${styles.item} ${styles[item.type]}`}>
                                <div className={styles.itemLeft}>
                                    <span className={styles.itemName}>{item.description}</span>
                                    <span className={styles.itemDate}>
                                        {item.type === 'overdue'
                                            ? 'Overdue'
                                            : format(item.date, 'MMM d')}
                                    </span>
                                </div>
                                <span className={styles.itemAmount}>{formatCurrency(item.amount)}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span className={styles.totalLabel}>Total Due</span>
                            <span className={styles.totalValue}>{formatCurrency(totalDue)}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
