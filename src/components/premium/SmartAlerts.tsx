'use client'

import { useMemo, useState } from 'react'
import { useTransactions, useMonthlyStats } from '@/hooks/useTransactions'
import { useBudgetStatus, useBudgets } from '@/hooks/useBudgets'
import { useTotalBalance } from '@/hooks/useAccounts'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import styles from './SmartAlerts.module.css'

interface Alert {
    id: string
    type: 'warning' | 'danger' | 'info' | 'success'
    icon: string
    title: string
    message: string
    action?: string
    priority: number
}

export function SmartAlerts() {
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])
    const { transactions } = useTransactions()
    const { expenses, income } = useMonthlyStats()
    const { overallPercentage, overBudget } = useBudgetStatus()
    const { budgets } = useBudgets()
    const { totalBalance } = useTotalBalance()

    const alerts = useMemo((): Alert[] => {
        const alertList: Alert[] = []

        // 1. Low Balance Alert
        if (totalBalance < 500) {
            alertList.push({
                id: 'low-balance',
                type: 'danger',
                icon: '💰',
                title: 'Low Balance Warning',
                message: `Your total balance is $${totalBalance.toFixed(2)}. Consider reducing expenses.`,
                action: 'Review Expenses',
                priority: 1,
            })
        }

        // 2. Over Budget Alert
        if (overBudget > 0) {
            alertList.push({
                id: 'over-budget',
                type: 'warning',
                icon: '📊',
                title: `${overBudget} Budget${overBudget > 1 ? 's' : ''} Exceeded`,
                message: 'You\'ve gone over your budget limits. Time to adjust your spending.',
                action: 'View Budgets',
                priority: 2,
            })
        }

        // 3. High Spending Alert (unusual spending detection)
        const unusualThreshold = income * 0.8
        if (expenses > unusualThreshold && income > 0) {
            alertList.push({
                id: 'high-spending',
                type: 'warning',
                icon: '⚠️',
                title: 'Unusual Spending Detected',
                message: `You've spent ${((expenses / income) * 100).toFixed(0)}% of your income this month.`,
                action: 'Analyze Spending',
                priority: 3,
            })
        }

        // 4. Savings Rate Alert
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
        if (savingsRate < 10 && income > 0) {
            alertList.push({
                id: 'low-savings',
                type: 'info',
                icon: '🐷',
                title: 'Savings Opportunity',
                message: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20%.`,
                action: 'Set Savings Goal',
                priority: 4,
            })
        }

        // 5. Budget Near Limit
        budgets.forEach(budget => {
            if (budget.percentage && budget.percentage >= 80 && budget.percentage < 100) {
                alertList.push({
                    id: `budget-near-${budget.id}`,
                    type: 'info',
                    icon: '📈',
                    title: `${budget.category?.name || 'Budget'} Nearly Full`,
                    message: `You've used ${budget.percentage.toFixed(0)}% of your ${budget.category?.name || ''} budget.`,
                    priority: 5,
                })
            }
        })

        // 6. Positive Alerts
        if (savingsRate >= 20) {
            alertList.push({
                id: 'great-savings',
                type: 'success',
                icon: '🎉',
                title: 'Amazing Savings Rate!',
                message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`,
                priority: 10,
            })
        }

        if (overallPercentage <= 70 && overallPercentage > 0) {
            alertList.push({
                id: 'under-budget',
                type: 'success',
                icon: '✨',
                title: 'Under Budget',
                message: 'You\'re well within your budget limits. Great job!',
                priority: 10,
            })
        }

        // Sort by priority and filter dismissed
        return alertList
            .filter(a => !dismissedAlerts.includes(a.id))
            .sort((a, b) => a.priority - b.priority)
    }, [transactions, expenses, income, overallPercentage, overBudget, totalBalance, budgets, dismissedAlerts])

    const dismissAlert = (id: string) => {
        setDismissedAlerts(prev => [...prev, id])
    }

    if (alerts.length === 0) {
        return (
            <Card>
                <CardHeader title="🔔 Smart Alerts" />
                <CardBody>
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>✅</span>
                        <p>All caught up! No alerts to show.</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader title="🔔 Smart Alerts" subtitle={`${alerts.length} notification${alerts.length > 1 ? 's' : ''}`} />
            <CardBody>
                <div className={styles.alerts}>
                    {alerts.slice(0, 5).map((alert) => (
                        <div key={alert.id} className={`${styles.alert} ${styles[alert.type]}`}>
                            <div className={styles.alertIcon}>{alert.icon}</div>
                            <div className={styles.alertContent}>
                                <h4 className={styles.alertTitle}>{alert.title}</h4>
                                <p className={styles.alertMessage}>{alert.message}</p>
                                {alert.action && (
                                    <button className={styles.alertAction}>{alert.action} →</button>
                                )}
                            </div>
                            <button
                                className={styles.dismissBtn}
                                onClick={() => dismissAlert(alert.id)}
                                aria-label="Dismiss alert"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}
