'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { useTransactionsByDateRange } from '@/hooks/useTransactions'
import styles from './AIInsightsWidget.module.css'

interface Insight {
    type: 'positive' | 'warning' | 'neutral' | 'tip'
    title: string
    message: string
    category?: string
    amount?: number
}

export function AIInsightsWidget() {
    const [insights, setInsights] = useState<Insight[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Get current week and previous week transactions
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const prevWeekStart = new Date(weekStart)
    prevWeekStart.setDate(prevWeekStart.getDate() - 7)
    const prevWeekEnd = new Date(weekStart)

    const { transactions: currentWeek, isLoading: currentLoading } = useTransactionsByDateRange(weekStart, weekEnd)
    const { transactions: previousWeek, isLoading: prevLoading } = useTransactionsByDateRange(prevWeekStart, prevWeekEnd)

    const generateInsights = useCallback(async () => {
        try {
            setIsLoading(true)

            // Format transactions for AI
            const currentData = currentWeek.map(t => ({
                amount: Number(t.amount),
                category: t.category?.name || 'Uncategorized',
                date: t.date,
                description: t.description,
            }))

            const previousData = previousWeek.map(t => ({
                amount: Number(t.amount),
                category: t.category?.name || 'Uncategorized',
            }))

            // Call API route instead of direct AI function
            const response = await fetch('/api/ai/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transactions: currentData,
                    previousTransactions: previousData,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate insights')
            }

            const data = await response.json()
            setInsights(data.insights || [])
            setError(null)
        } catch (err: any) {
            console.error('Failed to generate insights:', err)
            setError('Unable to generate insights. Please try again later.')
            // Show fallback insights
            setInsights([
                {
                    type: 'neutral',
                    title: 'Track Your Spending',
                    message: 'Add more transactions to get personalized AI insights about your spending patterns.',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }, [currentWeek, previousWeek])

    useEffect(() => {
        if (!currentLoading && !prevLoading) {
            if (currentWeek.length > 0) {
                generateInsights()
            } else {
                setIsLoading(false)
            }
        }
    }, [currentWeek, previousWeek, currentLoading, prevLoading, generateInsights])

    const getIcon = (type: string) => {
        switch (type) {
            case 'positive': return '✅'
            case 'warning': return '⚠️'
            case 'tip': return '💡'
            default: return 'ℹ️'
        }
    }

    const getTypeClass = (type: string) => {
        switch (type) {
            case 'positive': return styles.insightPositive
            case 'warning': return styles.insightWarning
            case 'tip': return styles.insightTip
            default: return styles.insightNeutral
        }
    }

    if (isLoading || currentLoading || prevLoading) {
        return (
            <Card>
                <CardHeader title="💡 AI Insights" subtitle="Powered by OpenAI" />
                <CardBody>
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Analyzing your spending patterns...</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    if (error && insights.length === 0) {
        return (
            <Card>
                <CardHeader title="💡 AI Insights" subtitle="Powered by OpenAI" />
                <CardBody>
                    <div className={styles.error}>
                        <span className={styles.errorIcon}>⚠️</span>
                        <p>{error}</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    if (insights.length === 0) {
        return (
            <Card>
                <CardHeader title="💡 AI Insights" subtitle="Powered by OpenAI" />
                <CardBody>
                    <div className={styles.empty}>
                        <span className={styles.emptyIcon}>📊</span>
                        <h3>No insights yet</h3>
                        <p>Add more transactions to get personalized AI-powered insights about your spending.</p>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader
                title="💡 AI Insights"
                subtitle="Powered by OpenAI"
            />
            <CardBody>
                <div className={styles.insights}>
                    {insights.map((insight, index) => (
                        <div key={index} className={`${styles.insight} ${getTypeClass(insight.type)}`}>
                            <div className={styles.insightIcon}>{getIcon(insight.type)}</div>
                            <div className={styles.insightContent}>
                                <h4 className={styles.insightTitle}>{insight.title}</h4>
                                <p className={styles.insightMessage}>{insight.message}</p>
                                {insight.category && (
                                    <span className={styles.insightCategory}>{insight.category}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.footer}>
                    <button
                        className={styles.refreshButton}
                        onClick={generateInsights}
                        disabled={isLoading}
                    >
                        🔄 Refresh Insights
                    </button>
                </div>
            </CardBody>
        </Card>
    )
}
