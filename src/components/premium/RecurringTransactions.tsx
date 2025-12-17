'use client'

import { useMemo } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'

import styles from './RecurringTransactions.module.css'

interface RecurringTransaction {
    merchant: string
    amount: number
    frequency: 'weekly' | 'monthly' | 'yearly'
    nextDate: string
    annualCost: number
    category?: string
}

export function RecurringTransactions() {
    const { transactions, isLoading } = useTransactions()

    const recurringTransactions = useMemo((): RecurringTransaction[] => {
        if (!transactions.length) return []

        // Simple heuristic for recurring transactions:
        // Group by description/merchant, look for similar amounts and regular intervals
        // For MVP, we'll demonstrate detection logic

        const merchantGroups: Record<string, typeof transactions> = {}

        transactions.forEach(t => {
            // Normalize merchant name
            const merchant = t.description.split(' ').slice(0, 2).join(' ')
            if (!merchantGroups[merchant]) merchantGroups[merchant] = []
            merchantGroups[merchant].push(t)
        })

        const recurring: RecurringTransaction[] = []

        Object.entries(merchantGroups).forEach(([merchant, txs]) => {
            if (txs.length < 2) return

            // Check if amounts are similar (within 5%)
            const amounts = txs.map(t => Math.abs(Number(t.amount)))
            const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length
            const isConsistentAmount = amounts.every(a => Math.abs(a - avgAmount) < avgAmount * 0.05)

            if (isConsistentAmount && merchant.length > 2) {
                // Estimate frequency based on date diffs
                const sortedDates = txs.map(t => new Date(t.date).getTime()).sort((a, b) => b - a)
                const diffs = []
                for (let i = 0; i < sortedDates.length - 1; i++) {
                    diffs.push((sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24))
                }

                const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length

                let frequency: 'weekly' | 'monthly' | 'yearly' | null = null
                if (Math.abs(avgDiff - 7) < 3) frequency = 'weekly'
                else if (Math.abs(avgDiff - 30) < 5) frequency = 'monthly'
                else if (Math.abs(avgDiff - 365) < 10) frequency = 'yearly'

                if (frequency) {
                    // Determine category from latest transaction
                    const latestTx = txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

                    const annualCost = frequency === 'weekly' ? avgAmount * 52
                        : frequency === 'monthly' ? avgAmount * 12
                            : avgAmount

                    // Next date estimate
                    const lastDate = new Date(sortedDates[0])
                    const nextDate = new Date(lastDate)
                    if (frequency === 'weekly') nextDate.setDate(lastDate.getDate() + 7)
                    if (frequency === 'monthly') nextDate.setMonth(lastDate.getMonth() + 1)
                    if (frequency === 'yearly') nextDate.setFullYear(lastDate.getFullYear() + 1)

                    recurring.push({
                        merchant: merchant,
                        amount: avgAmount,
                        frequency,
                        nextDate: nextDate.toISOString(),
                        annualCost,
                        category: latestTx.category?.name
                    })
                }
            }
        })

        // If no real recurring transactions found in limited history (common in demos), 
        // we can return empty or mock data if specifically requested. 
        // For now, let's stick to real detection logic.
        return recurring.sort((a, b) => b.annualCost - a.annualCost)
    }, [transactions])

    const totalAnnualCost = recurringTransactions.reduce((acc, curr) => acc + curr.annualCost, 0)

    if (isLoading) {
        return (
            <Card>
                <CardHeader title="🔄 Recurring Expenses" />
                <CardBody>
                    <div className={styles.loading}>Processing transactions...</div>
                </CardBody>
            </Card>
        )
    }

    if (recurringTransactions.length === 0) {
        return (
            <Card>
                <CardHeader title="🔄 Recurring Expenses" />
                <CardBody>
                    <div className={styles.empty}>
                        <p>No recurring subscriptions detected yet.</p>
                        <p className={styles.emptySub}>Add more transaction history to unlock insights.</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader title="🔄 Recurring Expenses" subtitle={`Projected Annual Cost: $${totalAnnualCost.toFixed(2)}`} />
            <CardBody>
                <div className={styles.list}>
                    {recurringTransactions.map((sub, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div className={styles.merchantInfo}>
                                    <span className={styles.merchant}>{sub.merchant}</span>
                                    <span className={styles.frequency}>{sub.frequency}</span>
                                </div>
                                <div className={styles.amountInfo}>
                                    <span className={styles.amount}>${sub.amount.toFixed(2)}</span>
                                    <button className={styles.manageBtn}>Manage</button>
                                </div>
                            </div>
                            <div className={styles.details}>
                                <span>Next due: {new Date(sub.nextDate).toLocaleDateString()}</span>
                                <span className={styles.annualCost}>${sub.annualCost.toFixed(0)}/yr</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.actions}>
                    <button className={styles.scanBtn}>Scan for Unused Subscriptions</button>
                </div>
            </CardBody>
        </Card>
    )
}
