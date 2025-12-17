'use client'

import Link from 'next/link'
import { Target, Plus, ChevronRight, Sparkles } from 'lucide-react'
import { useGoals } from '@/hooks/useGoals'
import styles from './GoalsWidget.module.css'

function getCelebration(percentage: number): string | null {
    if (percentage >= 100) return '🎉 Goal reached!'
    if (percentage >= 75) return '🔥 Almost there!'
    if (percentage >= 50) return '💪 Halfway there!'
    if (percentage >= 25) return '🚀 Great start!'
    return null
}

export function GoalsWidget() {
    const { goals, isLoading } = useGoals()

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    // Show top 3 goals
    const displayGoals = goals.slice(0, 3)

    // Check for any wins to celebrate
    const completedGoals = goals.filter(g => g.percentage >= 100).length
    const nearlyComplete = goals.filter(g => g.percentage >= 75 && g.percentage < 100).length

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Target size={18} />
                        Goals
                    </h3>
                </div>
                <div className={styles.loading}>Loading goals...</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    <Target size={18} />
                    Goals
                </h3>
                <button className={styles.addBtn}>
                    <Plus size={16} />
                </button>
            </div>

            {completedGoals > 0 && (
                <div className={styles.celebration}>
                    <Sparkles size={14} />
                    <span>You've completed {completedGoals} goal{completedGoals > 1 ? 's' : ''}!</span>
                </div>
            )}

            {displayGoals.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🎯</div>
                    <p className={styles.emptyText}>No goals yet</p>
                    <button className={styles.emptyBtn}>Create your first goal</button>
                </div>
            ) : (
                <div className={styles.goalsList}>
                    {displayGoals.map(goal => {
                        const celebration = getCelebration(goal.percentage)
                        return (
                            <div key={goal.id} className={`${styles.goalItem} ${goal.percentage >= 100 ? styles.completed : ''}`}>
                                <div className={styles.goalHeader}>
                                    <span className={styles.goalIcon}>{goal.icon}</span>
                                    <span className={styles.goalName}>{goal.name}</span>
                                    <span className={styles.goalPercent}>{goal.percentage.toFixed(0)}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{
                                            width: `${Math.min(goal.percentage, 100)}%`,
                                            backgroundColor: goal.color,
                                        }}
                                    />
                                </div>
                                <div className={styles.goalFooter}>
                                    <span className={styles.goalCurrent}>{formatCurrency(goal.current_amount)}</span>
                                    {celebration ? (
                                        <span className={styles.goalCelebration}>{celebration}</span>
                                    ) : (
                                        <span className={styles.goalTarget}>of {formatCurrency(goal.target_amount)}</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {goals.length > 3 && (
                <Link href="/dashboard/goals" className={styles.viewAll}>
                    View all {goals.length} goals
                    <ChevronRight size={14} />
                </Link>
            )}
        </div>
    )
}

