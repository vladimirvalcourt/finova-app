'use client'

import { useMemo } from 'react'
import { Bell, AlertTriangle, Clock } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { addDays, format, differenceInDays, isBefore, isAfter, startOfDay } from 'date-fns'
import styles from './BillAlertsWidget.module.css'

interface BillAlert {
    id: string
    description: string
    amount: number
    dueDate: Date
    daysUntil: number
    isOverdue: boolean
    icon: string
}

export function BillAlertsWidget() {
    const { transactions, isLoading } = useTransactions()

    const alerts = useMemo(() => {
        const now = startOfDay(new Date())
        const weekFromNow = addDays(now, 7)

        // Get recurring expense transactions
        const recurringBills = transactions.filter(t => t.recurring && t.type === 'expense')

        // Project bills to this month
        const items: BillAlert[] = []

        recurringBills.forEach(t => {
            const txDate = new Date(t.date)
            const projectedDate = new Date(now.getFullYear(), now.getMonth(), txDate.getDate())

            // Check if due in the next 7 days or overdue
            const daysUntil = differenceInDays(projectedDate, now)
            const isOverdue = isBefore(projectedDate, now) && daysUntil > -7
            const isUpcoming = isAfter(projectedDate, now) && isBefore(projectedDate, weekFromNow)

            if (isOverdue || isUpcoming) {
                items.push({
                    id: t.id,
                    description: t.description || 'Bill Payment',
                    amount: Math.abs(Number(t.amount)),
                    dueDate: projectedDate,
                    daysUntil,
                    isOverdue,
                    icon: t.category?.icon || '📄',
                })
            }
        })

        // Sort by urgency (overdue first, then by days until due)
        return items.sort((a, b) => {
            if (a.isOverdue && !b.isOverdue) return -1
            if (!a.isOverdue && b.isOverdue) return 1
            return a.daysUntil - b.daysUntil
        }).slice(0, 4)
    }, [transactions])

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    const getDueLabel = (daysUntil: number, isOverdue: boolean) => {
        if (isOverdue) return `${Math.abs(daysUntil)} days overdue`
        if (daysUntil === 0) return 'Due today'
        if (daysUntil === 1) return 'Due tomorrow'
        return `Due in ${daysUntil} days`
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Bell size={18} />
                        Bill Alerts
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
                    <Bell size={18} />
                    Bill Alerts
                </h3>
                {alerts.some(a => a.isOverdue) && (
                    <div className={styles.overdueBadge}>
                        <AlertTriangle size={12} />
                        Overdue
                    </div>
                )}
            </div>

            {alerts.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>✅</div>
                    <p>No upcoming bills</p>
                    <span className={styles.emptyHint}>You're all caught up!</span>
                </div>
            ) : (
                <div className={styles.list}>
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className={`${styles.item} ${alert.isOverdue ? styles.overdue : ''} ${alert.daysUntil <= 2 && !alert.isOverdue ? styles.urgent : ''}`}
                        >
                            <div className={styles.itemLeft}>
                                <span className={styles.itemIcon}>{alert.icon}</span>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemDesc}>{alert.description}</span>
                                    <span className={styles.itemDue}>
                                        <Clock size={10} />
                                        {getDueLabel(alert.daysUntil, alert.isOverdue)}
                                    </span>
                                </div>
                            </div>
                            <span className={styles.itemAmount}>{formatCurrency(alert.amount)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
