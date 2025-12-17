'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { useBudgets, useBudgetStatus } from '@/hooks/useBudgets'
import { Loader2 } from 'lucide-react'
import styles from '../page.module.css'

export default function BudgetsPage() {
    const { budgets, isLoading, isError } = useBudgets()
    const { totalBudget, totalSpent, overallPercentage, onTrack, overBudget } = useBudgetStatus()

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'var(--color-danger-500)'
        if (percentage >= 75) return 'var(--color-warning-500)'
        return 'var(--color-success-500)'
    }

    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>
                        <span>💰</span>
                        <span>Finova</span>
                    </div>
                    <nav className={styles.nav}>
                        <Link href="/dashboard" className={styles.navLink}>
                            Dashboard
                        </Link>
                        <Link href="/dashboard/transactions" className={styles.navLink}>
                            Transactions
                        </Link>
                        <Link href="/dashboard/budgets" className={`${styles.navLink} ${styles.navLinkActive}`}>
                            Budgets
                        </Link>
                        <Link href="/dashboard/accounts" className={styles.navLink}>
                            Accounts
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className={styles.pageTitle}>Budgets</h1>
                            <p className={styles.pageSubtitle}>Track your spending against budgets</p>
                        </div>
                        <Button variant="primary">➕ Create Budget</Button>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : isError ? (
                    <Card>
                        <CardBody>
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-danger-500)' }}>
                                Failed to load budgets. Please try again.
                            </div>
                        </CardBody>
                    </Card>
                ) : budgets.length === 0 ? (
                    <Card>
                        <CardBody>
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>No budgets yet</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                    Create your first budget to start tracking your spending.
                                </p>
                                <Button variant="primary">➕ Create Your First Budget</Button>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <>
                        {/* Overall Budget Summary */}
                        <Card variant="gradient" style={{ marginBottom: 'var(--spacing-8)' }}>
                            <div style={{ padding: 'var(--spacing-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                                    <div>
                                        <div style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9, marginBottom: 'var(--spacing-2)' }}>
                                            {currentMonth} Budget
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-extrabold)' }}>
                                            {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-extrabold)' }}>
                                            {overallPercentage.toFixed(1)}%
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                                            of budget used
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '12px',
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    borderRadius: 'var(--radius-full)',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${Math.min(overallPercentage, 100)}%`,
                                        height: '100%',
                                        background: 'white',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width var(--transition-base)',
                                    }} />
                                </div>
                                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                                    <span>✅ {onTrack} on track</span>
                                    {overBudget > 0 && <span>⚠️ {overBudget} over budget</span>}
                                </div>
                            </div>
                        </Card>

                        {/* Budget Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-6)' }}>
                            {budgets.map((budget) => {
                                const percentage = budget.percentage || 0
                                const remaining = (budget.remaining || 0)

                                return (
                                    <Card key={budget.id} hoverable>
                                        <div style={{ marginBottom: 'var(--spacing-4)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                                                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                                                    {budget.category?.name || 'Budget'}
                                                </h3>
                                                <div style={{
                                                    fontSize: 'var(--font-size-lg)',
                                                    fontWeight: 'var(--font-weight-bold)',
                                                    color: getProgressColor(percentage),
                                                }}>
                                                    {percentage.toFixed(0)}%
                                                </div>
                                            </div>

                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                background: 'var(--color-neutral-200)',
                                                borderRadius: 'var(--radius-full)',
                                                overflow: 'hidden',
                                                marginBottom: 'var(--spacing-3)',
                                            }}>
                                                <div style={{
                                                    width: `${Math.min(percentage, 100)}%`,
                                                    height: '100%',
                                                    background: budget.category?.color || getProgressColor(percentage),
                                                    borderRadius: 'var(--radius-full)',
                                                    transition: 'width var(--transition-base)',
                                                }} />
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                <span>Spent: {formatCurrency(budget.spent || 0)}</span>
                                                <span>Budget: {formatCurrency(Number(budget.amount))}</span>
                                            </div>
                                        </div>

                                        <div style={{
                                            padding: 'var(--spacing-3)',
                                            background: remaining >= 0 ? 'var(--color-success-50)' : 'var(--color-danger-50)',
                                            borderRadius: 'var(--radius-lg)',
                                            textAlign: 'center',
                                        }}>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>
                                                {remaining >= 0 ? 'Remaining' : 'Over Budget'}
                                            </div>
                                            <div style={{
                                                fontSize: 'var(--font-size-xl)',
                                                fontWeight: 'var(--font-weight-bold)',
                                                color: remaining >= 0 ? 'var(--color-success-700)' : 'var(--color-danger-700)',
                                            }}>
                                                {formatCurrency(Math.abs(remaining))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)' }}>
                                            <Button variant="secondary" size="small" fullWidth>
                                                View Details
                                            </Button>
                                            <Button variant="ghost" size="small" fullWidth>
                                                Edit
                                            </Button>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
