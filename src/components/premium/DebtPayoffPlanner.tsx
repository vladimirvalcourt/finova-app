'use client'

import { useState, useMemo } from 'react'
import { useAccounts } from '@/hooks/useAccounts'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './DebtPayoffPlanner.module.css'

export function DebtPayoffPlanner() {
    const { accounts, isLoading } = useAccounts()
    const [extraPayment, setExtraPayment] = useState(100)

    // Identify debts (negative balance or CREDIT type)
    const debts = useMemo(() => {
        return accounts.filter(acc =>
            (acc.type === 'CREDIT' && acc.balance < 0) ||
            (acc.balance < 0)
        ).map(acc => ({
            ...acc,
            balance: Math.abs(acc.balance), // Work with positive numbers for debt
            interestRate: 0.18 // Assumed average APR for credit cards (18%)
        }))
    }, [accounts])

    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0)

    // Calculate payoff timeline
    const timeline = useMemo(() => {
        if (totalDebt === 0) return []

        const data = []
        let currentBalance = totalDebt
        let months = 0
        const today = new Date()

        // Minimum payment assumption (e.g., 2% of balance + interest)
        // plus the user-defined extra payment

        while (currentBalance > 0 && months < 120) { // Cap at 10 years prediction
            const date = new Date(today)
            date.setMonth(today.getMonth() + months)

            data.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                balance: Math.round(currentBalance)
            })

            // Monthly Interest
            const interest = currentBalance * (0.18 / 12)

            // Monthly Payment (Min 2% + extra)
            const minPayment = Math.max(currentBalance * 0.02, 25)
            const totalPayment = minPayment + extraPayment

            // Principle reduction
            const principalPayment = totalPayment - interest

            if (principalPayment <= 0) {
                // Debt trap warning in UI maybe?
                currentBalance += interest // Balance grows if payment too low!
            } else {
                currentBalance -= principalPayment
            }

            if (currentBalance < 0) currentBalance = 0
            months++
        }

        // Add final zero point
        if (currentBalance === 0) {
            const date = new Date(today)
            date.setMonth(today.getMonth() + months)
            data.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
                balance: 0
            })
        }

        return data
    }, [totalDebt, extraPayment])

    const payoffDate = timeline.length > 0 ? timeline[timeline.length - 1].month : 'N/A'

    if (isLoading) {
        return (
            <Card>
                <CardHeader title="🏔️ Debt Payoff Planner" />
                <CardBody>
                    <div className={styles.loading}>Analyzing debts...</div>
                </CardBody>
            </Card>
        )
    }

    if (totalDebt === 0) {
        return (
            <Card>
                <CardHeader title="🏔️ Debt Payoff Planner" />
                <CardBody>
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>🎉</div>
                        <h3>Debt Free!</h3>
                        <p>You have no tracked debts. Congratulations!</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader title="🏔️ Debt Payoff Planner" subtitle={`Total Debt: $${totalDebt.toLocaleString()}`} />
            <CardBody>
                <div className={styles.controls}>
                    <label className={styles.label}>
                        Monthly Extra Payment: <span className={styles.highlight}>${extraPayment}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={extraPayment}
                        onChange={(e) => setExtraPayment(Number(e.target.value))}
                        className={styles.slider}
                    />
                </div>

                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={timeline} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis
                                dataKey="month"
                                stroke="var(--color-text-secondary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="var(--color-text-secondary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `$${val / 1000}k`}
                            />
                            <Tooltip
                                formatter={(val: number | undefined) => val !== undefined ? `$${val.toLocaleString()}` : ''}
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface-elevated)',
                                    borderColor: 'var(--color-border)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="balance"
                                stroke="var(--color-primary-600)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.prediction}>
                    <div className={styles.predictionItem}>
                        <span className={styles.predictionLabel}>Debt Free By</span>
                        <span className={styles.predictionValue}>{payoffDate}</span>
                    </div>
                    <div className={styles.predictionItem}>
                        <span className={styles.predictionLabel}>Months to go</span>
                        <span className={styles.predictionValue}>{timeline.length - 1}</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
