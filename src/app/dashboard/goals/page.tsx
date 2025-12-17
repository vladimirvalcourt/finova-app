'use client'

import { useState } from 'react'
import { Target, Plus, Loader2, Pencil } from 'lucide-react'
import { useGoals } from '@/hooks/useGoals'
import { GoalFormModal } from '@/components/forms'
import styles from './page.module.css'

function getCelebration(percentage: number): string | null {
    if (percentage >= 100) return '🎉 Goal reached!'
    if (percentage >= 75) return '🔥 Almost there!'
    if (percentage >= 50) return '💪 Halfway!'
    if (percentage >= 25) return '🚀 Great start!'
    return null
}

export default function GoalsPage() {
    const { goals, isLoading } = useGoals()
    const [showModal, setShowModal] = useState(false)
    const [editingGoal, setEditingGoal] = useState<any>(null)

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0)
    const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0)
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

    const handleEdit = (goal: any) => {
        setEditingGoal({
            id: goal.id,
            name: goal.name,
            target_amount: goal.target_amount.toString(),
            current_amount: goal.current_amount.toString(),
            deadline: goal.deadline || '',
            icon: goal.icon,
            color: goal.color,
        })
        setShowModal(true)
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>
                        <Target size={24} />
                        Goals
                    </h1>
                    <p className={styles.subtitle}>Track your savings targets</p>
                </div>
                <button className={styles.addBtn} onClick={() => { setEditingGoal(null); setShowModal(true) }}>
                    <Plus size={18} />
                    New Goal
                </button>
            </header>

            {/* Summary Card */}
            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Saved</span>
                    <span className={styles.summaryValue}>{formatCurrency(totalSaved)}</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Target</span>
                    <span className={styles.summaryValue}>{formatCurrency(totalTarget)}</span>
                </div>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Overall Progress</span>
                    <span className={styles.summaryValue}>{overallProgress.toFixed(0)}%</span>
                </div>
            </div>

            {/* Goals Grid */}
            {isLoading ? (
                <div className={styles.loading}>
                    <Loader2 size={24} className={styles.spinner} />
                    Loading goals...
                </div>
            ) : goals.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>🎯</div>
                    <h2>No goals yet</h2>
                    <p>Start by creating your first savings goal</p>
                    <button className={styles.emptyBtn} onClick={() => setShowModal(true)}>
                        Create Goal
                    </button>
                </div>
            ) : (
                <div className={styles.grid}>
                    {goals.map(goal => {
                        const celebration = getCelebration(goal.percentage)
                        return (
                            <div
                                key={goal.id}
                                className={`${styles.card} ${goal.percentage >= 100 ? styles.completed : ''}`}
                                style={{ borderTopColor: goal.color }}
                            >
                                <div className={styles.cardHeader}>
                                    <span className={styles.cardIcon}>{goal.icon}</span>
                                    <button className={styles.editBtn} onClick={() => handleEdit(goal)}>
                                        <Pencil size={14} />
                                    </button>
                                </div>
                                <h3 className={styles.cardTitle}>{goal.name}</h3>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${Math.min(goal.percentage, 100)}%`, backgroundColor: goal.color }}
                                    />
                                </div>
                                <div className={styles.cardStats}>
                                    <span className={styles.cardSaved}>{formatCurrency(goal.current_amount)}</span>
                                    <span className={styles.cardTarget}>of {formatCurrency(goal.target_amount)}</span>
                                </div>
                                {celebration && (
                                    <div className={styles.celebration}>{celebration}</div>
                                )}
                                {goal.deadline && (
                                    <div className={styles.deadline}>
                                        Due: {new Date(goal.deadline).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <GoalFormModal
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditingGoal(null) }}
                goal={editingGoal}
            />
        </div>
    )
}
