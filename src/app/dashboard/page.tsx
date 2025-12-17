'use client'

import React from 'react'
import { SummaryCard } from '@/components/dashboard/Modern/SummaryCard'
import { SpendingCard } from '@/components/dashboard/Modern/SpendingCard'
import { TransactionTable } from '@/components/dashboard/Modern/TransactionTable'
import { Home, Smartphone, Zap, Wifi, Fuel } from 'lucide-react'
import { useRecentTransactions, useMonthlyStats } from '@/hooks/useTransactions'
import { useTotalBalance } from '@/hooks/useAccounts'
import { useInvestments } from '@/hooks/useInvestments'
import styles from './page.module.css'

export default function DashboardPage() {
    // Fetch real data
    const { totalBalance, isLoading: balanceLoading } = useTotalBalance()
    const { income, expenses, savingsRate, isLoading: statsLoading } = useMonthlyStats()
    const { transactions, isLoading: txLoading } = useRecentTransactions(5)
    const { totalValue: investmentValue, overallReturn: investmentReturn, isLoading: invLoading } = useInvestments()

    const isLoading = balanceLoading || statsLoading || txLoading || invLoading

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    // Prepare spending data from transactions
    const spendingCategories = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const cat = t.category?.name || 'Uncategorized'
            acc[cat] = (acc[cat] || 0) + Math.abs(Number(t.amount))
            return acc
        }, {} as Record<string, number>)

    return (
        <div className={styles.mainContent}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
            </header>

            {/* Summary Cards */}
            <div className={styles.summarySection}>
                <SummaryCard 
                    title="Balance" 
                    amount={formatCurrency(totalBalance)} 
                    trend={savingsRate > 0 ? `+${savingsRate.toFixed(1)}% vs last month` : `${savingsRate.toFixed(1)}% vs last month`}
                    color="blue"
                />
                <SummaryCard 
                    title="Spending" 
                    amount={formatCurrency(expenses)} 
                    trend={`${((expenses / (income || 1)) * 100).toFixed(1)}% of income`}
                    color="yellow"
                />
                <SummaryCard 
                    title="Investment" 
                    amount={formatCurrency(investmentValue)} 
                    trend={`${investmentReturn >= 0 ? '+' : ''}${investmentReturn.toFixed(1)}% return`}
                    color="green"
                />
            </div>

            {/* Spending Section */}
            <div className={styles.spendingSection}>
                <h2 className={styles.sectionTitle}>Spending</h2>
                <div className={styles.spendingGrid}>
                    {Object.entries(spendingCategories).length > 0 ? (
                        Object.entries(spendingCategories).map(([cat, amount], i) => (
                            <SpendingCard 
                                key={cat}
                                icon={i % 2 === 0 ? Home : Zap} // Fallback icons
                                label={cat}
                                amount={formatCurrency(amount)}
                                color={i % 2 === 0 ? 'blue' : i % 3 === 0 ? 'purple' : 'yellow'}
                            />
                        ))
                    ) : (
                        <div className={styles.emptyState} style={{ padding: '1rem', width: '100%', textAlign: 'left' }}>
                            No spending data this month
                        </div>
                    )}
                </div>
            </div>

            {/* Transactions Table */}
            <TransactionTable transactions={transactions} />
        </div>
    )
}
