'use client'

import { useMemo } from 'react'
import { useTotalBalance } from '@/hooks/useAccounts'
import { useMonthlyStats } from '@/hooks/useTransactions'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './CashFlowForecast.module.css'

interface ForecastData {
    date: string
    balance: number
    type: 'actual' | 'projected'
}

export function CashFlowForecast() {
    const { totalBalance, isLoading: balanceLoading } = useTotalBalance()
    const { income, expenses, isLoading: statsLoading } = useMonthlyStats()

    const forecastData = useMemo(() => {
        if (balanceLoading || statsLoading) return []

        const data: ForecastData[] = []
        const today = new Date()

        // Daily average net change
        // Assuming income/expense are monthly totals
        const dailyIncome = income / 30
        const dailyExpense = expenses / 30
        const netDailyChange = dailyIncome - dailyExpense

        let currentBalance = totalBalance

        // Generate 30 days of data
        for (let i = 0; i < 30; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)

            currentBalance += netDailyChange

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                balance: Math.round(currentBalance),
                type: 'projected'
            })
        }

        return data
    }, [totalBalance, income, expenses, balanceLoading, statsLoading])

    const endBalance = forecastData.length > 0 ? forecastData[forecastData.length - 1].balance : 0
    const netChange = endBalance - totalBalance
    const isPositive = netChange >= 0

    if (balanceLoading || statsLoading) {
        return (
            <Card>
                <CardHeader title="📈 Cash Flow Forecast" />
                <CardBody>
                    <div className={styles.loading}>Generating forecast...</div>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader title="📈 Cash Flow Forecast" subtitle="30-day balance projection" />
            <CardBody>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                            <XAxis
                                dataKey="date"
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
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--color-surface-elevated)',
                                    borderColor: 'var(--color-border)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                                formatter={(value: number | undefined) => [value !== undefined ? `$${value.toLocaleString()}` : '', 'Projected Balance']}
                            />
                            <Area
                                type="monotone"
                                dataKey="balance"
                                stroke="var(--color-primary-600)"
                                fillOpacity={1}
                                fill="url(#colorBalance)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.summary}>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>Current</span>
                        <span className={styles.value}>${totalBalance.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>30-Day Projection</span>
                        <span className={`${styles.value} ${isPositive ? styles.positive : styles.negative}`}>
                            ${endBalance.toLocaleString()}
                        </span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>Net Change</span>
                        <span className={`${styles.value} ${isPositive ? styles.positive : styles.negative}`}>
                            {isPositive ? '+' : ''}${netChange.toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
