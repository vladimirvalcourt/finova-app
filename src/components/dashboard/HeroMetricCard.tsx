'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ChevronDown } from 'lucide-react'
import { useTotalBalance } from '@/hooks/useAccounts'
import { useMonthlyStats } from '@/hooks/useTransactions'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import styles from './HeroMetricCard.module.css'

type MetricMode = 'netWorth' | 'moneyLeft'

export function HeroMetricCard() {
    const [mode, setMode] = useState<MetricMode>('netWorth')
    const { totalBalance, isLoading: balanceLoading } = useTotalBalance()
    const { income, expenses, isLoading: statsLoading } = useMonthlyStats()

    const moneyLeft = income - expenses
    const isLoading = balanceLoading || statsLoading

    // Simple sparkline data
    const sparkData = [
        { v: 100 }, { v: 105 }, { v: 102 }, { v: 110 }, { v: 108 }, { v: totalBalance ? 115 : 100 }
    ]

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    const value = mode === 'netWorth' ? totalBalance : moneyLeft
    const isPositive = value >= 0
    const label = mode === 'netWorth' ? 'Net Worth' : 'Money Left This Month'
    const Icon = mode === 'netWorth' ? Wallet : PiggyBank

    if (isLoading) {
        return (
            <div className={styles.card}>
                <div className={styles.loading}>Loading...</div>
            </div>
        )
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <button className={styles.modeToggle} onClick={() => setMode(mode === 'netWorth' ? 'moneyLeft' : 'netWorth')}>
                    <span className={styles.modeLabel}>{label}</span>
                    <ChevronDown size={14} />
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.iconWrapper}>
                        <Icon size={24} />
                    </div>
                    <div className={styles.valueContainer}>
                        <span className={`${styles.value} ${!isPositive ? styles.negative : ''}`}>
                            {formatCurrency(value)}
                        </span>
                        <span className={`${styles.trend} ${isPositive ? styles.up : styles.down}`}>
                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{isPositive ? 'Looking good' : 'Over budget'}</span>
                        </span>
                    </div>
                </div>

                <div className={styles.sparkline}>
                    <ResponsiveContainer width="100%" height={50}>
                        <LineChart data={sparkData}>
                            <Line
                                type="monotone"
                                dataKey="v"
                                stroke={isPositive ? '#22C55E' : '#EF4444'}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {mode === 'moneyLeft' && (
                <div className={styles.breakdown}>
                    <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Income</span>
                        <span className={styles.breakdownValue}>{formatCurrency(income)}</span>
                    </div>
                    <div className={styles.breakdownDivider} />
                    <div className={styles.breakdownItem}>
                        <span className={styles.breakdownLabel}>Spent</span>
                        <span className={styles.breakdownValue}>{formatCurrency(expenses)}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
