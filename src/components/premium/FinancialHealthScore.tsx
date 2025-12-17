'use client'

import { useMemo } from 'react'
import { useTotalBalance, useAccounts } from '@/hooks/useAccounts'
import { useMonthlyStats, useTransactions } from '@/hooks/useTransactions'
import { useBudgetStatus } from '@/hooks/useBudgets'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import styles from './FinancialHealthScore.module.css'

interface HealthFactor {
    name: string
    score: number
    maxScore: number
    status: 'good' | 'warning' | 'danger'
    advice: string
}

export function FinancialHealthScore() {
    const { totalBalance, isLoading: balanceLoading } = useTotalBalance()
    const { accounts } = useAccounts()
    const { income, expenses, savingsRate, isLoading: statsLoading } = useMonthlyStats()
    const { overallPercentage, isLoading: budgetLoading } = useBudgetStatus()
    const { transactions } = useTransactions()

    const isLoading = balanceLoading || statsLoading || budgetLoading

    // Calculate health factors
    const healthFactors = useMemo((): HealthFactor[] => {
        // 1. Savings Rate (25 points)
        const savingsScore = Math.min(savingsRate * 1.25, 25) // 20% savings = full points
        const savingsStatus = savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'warning' : 'danger'
        const savingsAdvice = savingsRate >= 20
            ? 'Excellent! You\'re saving like a pro.'
            : savingsRate >= 10
                ? 'Good start! Aim for 20% savings rate.'
                : 'Try to save at least 10% of your income.'

        // 2. Budget Adherence (25 points)
        const budgetScore = Math.max(25 - (overallPercentage - 100) * 0.5, 0)
        const budgetStatus = overallPercentage <= 80 ? 'good' : overallPercentage <= 100 ? 'warning' : 'danger'
        const budgetAdvice = overallPercentage <= 80
            ? 'Great job staying within budget!'
            : overallPercentage <= 100
                ? 'You\'re close to your budget limits.'
                : 'You\'ve exceeded your budget. Let\'s fix this!'

        // 3. Emergency Fund (25 points) - 3 months expenses = full points
        const monthlyExpenses = expenses || 1
        const emergencyMonths = (totalBalance || 0) / monthlyExpenses
        const emergencyScore = Math.min(emergencyMonths * 8.33, 25) // 3 months = full points
        const emergencyStatus = emergencyMonths >= 3 ? 'good' : emergencyMonths >= 1 ? 'warning' : 'danger'
        const emergencyAdvice = emergencyMonths >= 3
            ? 'Your emergency fund is solid!'
            : emergencyMonths >= 1
                ? 'Build up to 3 months of expenses.'
                : 'Start building an emergency fund ASAP.'

        // 4. Income Stability (25 points)
        const incomeTransactions = transactions.filter(t => t.type === 'income')
        const hasConsistentIncome = incomeTransactions.length >= 1
        const incomeScore = hasConsistentIncome ? 25 : 10
        const incomeStatus = hasConsistentIncome ? 'good' : 'warning'
        const incomeAdvice = hasConsistentIncome
            ? 'You have consistent income sources.'
            : 'Track your income to improve your score.'

        return [
            { name: 'Savings Rate', score: savingsScore, maxScore: 25, status: savingsStatus, advice: savingsAdvice },
            { name: 'Budget Control', score: budgetScore, maxScore: 25, status: budgetStatus, advice: budgetAdvice },
            { name: 'Emergency Fund', score: emergencyScore, maxScore: 25, status: emergencyStatus, advice: emergencyAdvice },
            { name: 'Income Stability', score: incomeScore, maxScore: 25, status: incomeStatus, advice: incomeAdvice },
        ]
    }, [savingsRate, overallPercentage, totalBalance, expenses, transactions])

    const totalScore = useMemo(() => {
        return Math.round(healthFactors.reduce((sum, f) => sum + f.score, 0))
    }, [healthFactors])

    const scoreColor = totalScore >= 80 ? 'var(--color-success-500)' : totalScore >= 60 ? 'var(--color-warning-500)' : 'var(--color-danger-500)'
    const scoreLabel = totalScore >= 80 ? 'Excellent' : totalScore >= 60 ? 'Good' : totalScore >= 40 ? 'Fair' : 'Needs Work'

    if (isLoading) {
        return (
            <Card>
                <CardHeader title="💪 Financial Health Score" />
                <CardBody>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Calculating your financial health...</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader title="💪 Financial Health Score" subtitle="Your overall financial wellness" />
            <CardBody>
                {/* Score Gauge */}
                <div className={styles.gaugeContainer}>
                    <div className={styles.gauge}>
                        <svg viewBox="0 0 100 50" className={styles.gaugeSvg}>
                            <path
                                d="M 10 45 A 35 35 0 1 1 90 45"
                                fill="none"
                                stroke="var(--color-neutral-200)"
                                strokeWidth="8"
                                strokeLinecap="round"
                            />
                            <path
                                d="M 10 45 A 35 35 0 1 1 90 45"
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${totalScore * 1.1} 110`}
                                className={styles.gaugeProgress}
                            />
                        </svg>
                        <div className={styles.scoreDisplay}>
                            <span className={styles.scoreValue} style={{ color: scoreColor }}>{totalScore}</span>
                            <span className={styles.scoreLabel}>{scoreLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Health Factors */}
                <div className={styles.factors}>
                    {healthFactors.map((factor) => (
                        <div key={factor.name} className={styles.factor}>
                            <div className={styles.factorHeader}>
                                <span className={styles.factorName}>{factor.name}</span>
                                <span className={styles.factorScore}>{Math.round(factor.score)}/{factor.maxScore}</span>
                            </div>
                            <div className={styles.factorBar}>
                                <div
                                    className={`${styles.factorProgress} ${styles[factor.status]}`}
                                    style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                                />
                            </div>
                            <p className={styles.factorAdvice}>{factor.advice}</p>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}
