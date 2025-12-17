'use client'

import { useMemo } from 'react'
import { Repeat, Plus, ChevronRight } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import styles from './RecurringWidget.module.css'

export function RecurringWidget() {
    const { transactions, isLoading } = useTransactions()

    // Filter recurring transactions
    const recurringItems = useMemo(() => {
        return transactions
            .filter(t => t.recurring)
            .map(t => ({
                id: t.id,
                description: t.description || 'Recurring Payment',
                amount: Math.abs(Number(t.amount)),
                type: t.type,
                category: t.category?.name || 'Uncategorized',
                icon: t.category?.icon || '💳',
            }))
            .slice(0, 5)
    }, [transactions])

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    // Calculate monthly totals
    const monthlySubscriptions = recurringItems
        .filter(i => i.type === 'expense')
        .reduce((sum, i) => sum + i.amount, 0)

    const monthlyIncome = recurringItems
        .filter(i => i.type === 'income')
        .reduce((sum, i) => sum + i.amount, 0)

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Repeat size={18} />
                        Recurring
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
                    <Repeat size={18} />
                    Recurring
                </h3>
                <button className={styles.addBtn}>
                    <Plus size={16} />
                </button>
            </div>

            <div className={styles.summary}>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Monthly Bills</span>
                    <span className={styles.summaryValue}>{formatCurrency(monthlySubscriptions)}</span>
                </div>
                <div className={styles.summaryCard}>
                    <span className={styles.summaryLabel}>Monthly Income</span>
                    <span className={`${styles.summaryValue} ${styles.income}`}>{formatCurrency(monthlyIncome)}</span>
                </div>
            </div>

            {recurringItems.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🔄</div>
                    <p className={styles.emptyText}>No recurring transactions</p>
                    <span className={styles.emptyHint}>Add subscriptions and bills to track them</span>
                </div>
            ) : (
                <div className={styles.list}>
                    {recurringItems.map(item => (
                        <div key={item.id} className={styles.item}>
                            <div className={styles.itemLeft}>
                                <span className={styles.itemIcon}>{item.icon}</span>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemDesc}>{item.description}</span>
                                    <span className={styles.itemCategory}>{item.category}</span>
                                </div>
                            </div>
                            <span className={`${styles.itemAmount} ${item.type === 'income' ? styles.income : ''}`}>
                                {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}/mo
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {recurringItems.length > 0 && (
                <button className={styles.viewAll}>
                    Manage subscriptions
                    <ChevronRight size={14} />
                </button>
            )}
        </div>
    )
}
