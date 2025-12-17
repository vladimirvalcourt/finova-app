'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { DashboardCard, GoalsWidget, HeroMetricCard, UpcomingBillsWidget, SpendingTrendsWidget, CategoryBreakdownWidget, NetWorthWidget, RecurringWidget, CashFlowWidget, BillAlertsWidget } from '@/components/dashboard'
import { TransactionFormModal, AccountFormModal, GoalFormModal, BudgetFormModal } from '@/components/forms'
import { Bell, Search, Command, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useRecentTransactions } from '@/hooks/useTransactions'
import { SpendingByCategoryChart } from '@/components/charts'
import { QuickAddTransaction } from '@/components/ai'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { WelcomeModal } from '@/components/onboarding'
import { format, formatDistanceToNow } from 'date-fns'
import styles from './page.module.css'

export default function DashboardPage() {
    // Real data hooks
    const { transactions: recentTransactions, isLoading: txLoading } = useRecentTransactions(5)

    // Modal states
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [showAccountModal, setShowAccountModal] = useState(false)
    const [showGoalModal, setShowGoalModal] = useState(false)
    const [showBudgetModal, setShowBudgetModal] = useState(false)

    // Insights visibility
    const [showMoreInsights, setShowMoreInsights] = useState(false)

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return formatDistanceToNow(date, { addSuffix: true })
        return format(date, 'MMM d')
    }

    // Prepare chart data from transactions
    const spendingByCategory = recentTransactions
        .filter(t => t.type?.toLowerCase() === 'expense')
        .reduce((acc, t) => {
            const categoryName = t.category?.name || 'Uncategorized'
            const existing = acc.find(item => item.name === categoryName)
            if (existing) {
                existing.value += Math.abs(Number(t.amount))
            } else {
                acc.push({
                    name: categoryName,
                    value: Math.abs(Number(t.amount)),
                    color: t.category?.color || '#71717A'
                })
            }
            return acc
        }, [] as { name: string; value: number; color: string }[])

    return (
        <div className={styles.dashboard}>
            {/* Professional Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <p className={styles.subtitle}>Your financial overview</p>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.searchBar}>
                        <Search size={14} className={styles.searchIcon} />
                        <span className={styles.searchText}>Search...</span>
                        <div className={styles.kbd}>
                            <Command size={10} />
                            <span>K</span>
                        </div>
                    </div>

                    <LanguageSwitcher />

                    <button className={styles.iconBtn} aria-label="Notifications">
                        <Bell size={16} />
                        <div className={styles.badge} />
                    </button>
                    <div className={styles.avatar}>VV</div>
                </div>
            </header>

            {/* Simplified Core Grid (6 Widgets) */}
            <div className={styles.coreGrid}>

                {/* 1. Hero Metric - Net Worth or Money Left */}
                <div className={styles.heroCard}>
                    <HeroMetricCard />
                </div>

                {/* 2. Goals with Celebrations */}
                <DashboardCard className={styles.goalsCard}>
                    <GoalsWidget />
                </DashboardCard>

                {/* 3. Spending Chart */}
                <DashboardCard className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <h3>Spending</h3>
                    </div>
                    <div className={styles.chartContent}>
                        <SpendingByCategoryChart data={spendingByCategory} />
                    </div>
                </DashboardCard>

                {/* 4. Quick Add (AI) */}
                <DashboardCard className={styles.quickAddCard}>
                    <QuickAddTransaction />
                </DashboardCard>

                {/* 5. Upcoming Bills (merged) */}
                <DashboardCard className={styles.billsCard}>
                    <UpcomingBillsWidget />
                </DashboardCard>

                {/* 6. Recent Transactions */}
                <DashboardCard className={styles.transactionsCard}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Activity</h3>
                        <Link href="/dashboard/transactions" className={styles.viewAllLink}>View all</Link>
                    </div>
                    {txLoading ? (
                        <div className={styles.loading}>Loading...</div>
                    ) : recentTransactions.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No transactions yet</p>
                            <button
                                className={styles.emptyBtn}
                                onClick={() => setShowTransactionModal(true)}
                            >
                                Add your first transaction
                            </button>
                        </div>
                    ) : (
                        <div className={styles.transactionsList}>
                            {recentTransactions.map(tx => (
                                <div key={tx.id} className={styles.txItem}>
                                    <div className={styles.txIcon}>
                                        {tx.category?.icon || '💳'}
                                    </div>
                                    <div className={styles.txInfo}>
                                        <span className={styles.txDesc}>{tx.description}</span>
                                        <span className={styles.txDate}>{formatDate(tx.date)}</span>
                                    </div>
                                    <span className={`${styles.txAmount} ${tx.type?.toLowerCase() === 'income' ? styles.income : styles.expense}`}>
                                        {tx.type?.toLowerCase() === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </DashboardCard>

            </div>

            {/* More Insights Toggle */}
            <button
                className={styles.insightsToggle}
                onClick={() => setShowMoreInsights(!showMoreInsights)}
            >
                {showMoreInsights ? (
                    <>
                        <ChevronUp size={18} />
                        <span>Hide Advanced Insights</span>
                    </>
                ) : (
                    <>
                        <ChevronDown size={18} />
                        <span>Show More Insights</span>
                    </>
                )}
            </button>

            {/* Expandable Advanced Insights */}
            {showMoreInsights && (
                <div className={styles.insightsGrid}>
                    <DashboardCard>
                        <SpendingTrendsWidget />
                    </DashboardCard>
                    <DashboardCard>
                        <CategoryBreakdownWidget />
                    </DashboardCard>
                    <DashboardCard>
                        <NetWorthWidget />
                    </DashboardCard>
                    <DashboardCard>
                        <CashFlowWidget />
                    </DashboardCard>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                className={styles.fab}
                onClick={() => setShowTransactionModal(true)}
                aria-label="Add transaction"
            >
                <Plus size={24} />
            </button>

            {/* Form Modals */}
            <TransactionFormModal
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
            />
            <AccountFormModal
                isOpen={showAccountModal}
                onClose={() => setShowAccountModal(false)}
            />
            <GoalFormModal
                isOpen={showGoalModal}
                onClose={() => setShowGoalModal(false)}
            />
            <BudgetFormModal
                isOpen={showBudgetModal}
                onClose={() => setShowBudgetModal(false)}
            />

            {/* Onboarding */}
            <WelcomeModal
                onComplete={() => { }}
                onAddAccount={() => setShowAccountModal(true)}
                onAddGoal={() => setShowGoalModal(true)}
                onAddTransaction={() => setShowTransactionModal(true)}
            />
        </div>
    )
}
