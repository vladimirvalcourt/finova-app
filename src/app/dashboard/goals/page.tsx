'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useGoals } from '@/hooks/useGoals'
import { GoalModal } from '@/components/forms/modals/GoalModal'
import { Loader2, Pencil } from 'lucide-react'
import styles from '../page.module.css'

interface Goal {
    id: string
    name: string
    target_amount: number
    current_amount: number
    deadline: string | null
    icon: string
    color: string
    percentage: number
}

function getCelebration(percentage: number): string | null {
    if (percentage >= 100) return '🎉 Goal reached!'
    if (percentage >= 75) return '🔥 Almost there!'
    if (percentage >= 50) return '💪 Halfway!'
    if (percentage >= 25) return '🚀 Great start!'
    return null
}

export default function GoalsPage() {
    const { goals, isLoading, mutate } = useGoals()

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

    const openCreateModal = () => {
        setSelectedGoal(null)
        setIsModalOpen(true)
    }

    const openEditModal = (goal: Goal) => {
        setSelectedGoal(goal)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedGoal(null)
    }

    const handleModalSuccess = () => {
        mutate()
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0)
    const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0)
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

    return (
        <div className={styles.pageContent}>
            {/* Page Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Goals</h1>
                <Button variant="primary" onClick={openCreateModal}>
                    ➕ New Goal
                </Button>
            </header>

            {/* Main Content */}
            {isLoading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={48} className={styles.spinner} />
                </div>
            ) : goals.length === 0 ? (
                <div className={styles.emptyState}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                    <h3 style={{ marginBottom: '0.5rem', color: '#18181B', fontWeight: 600 }}>No goals yet</h3>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Start by creating your first savings goal
                    </p>
                    <Button variant="primary" onClick={openCreateModal}>➕ Create Goal</Button>
                </div>
            ) : (
                <>
                    {/* Summary Card */}
                    <Card variant="gradient" style={{ background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)', color: 'white' }}>
                        <div style={{ padding: 'var(--spacing-6)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Saved</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(totalSaved)}</div>
                                </div>
                                <div style={{ height: '40px', background: 'rgba(255,255,255,0.2)' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Target</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(totalTarget)}</div>
                                </div>
                                <div style={{ height: '40px', background: 'rgba(255,255,255,0.2)' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Overall Progress</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{overallProgress.toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Goals Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {goals.map(goal => {
                            const celebration = getCelebration(goal.percentage)
                            return (
                                <Card
                                    key={goal.id}
                                    hoverable
                                    className={styles.tableCard}
                                    style={{ borderTop: `4px solid ${goal.color}`, cursor: 'pointer' }}
                                    onClick={() => openEditModal(goal)}
                                >
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEditModal(goal); }}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    cursor: 'pointer',
                                                    color: '#71717A'
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        </div>

                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#18181B', marginBottom: '1rem' }}>{goal.name}</h3>

                                        <div style={{
                                            width: '100%',
                                            height: '8px',
                                            background: '#F4F4F5',
                                            borderRadius: '100px',
                                            overflow: 'hidden',
                                            marginBottom: '1rem',
                                        }}>
                                            <div style={{
                                                width: `${Math.min(goal.percentage, 100)}%`,
                                                height: '100%',
                                                background: goal.color,
                                                borderRadius: '100px',
                                                transition: 'width 0.3s ease',
                                            }} />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#18181B' }}>
                                                {formatCurrency(goal.current_amount)}
                                            </span>
                                            <span style={{ fontSize: '0.875rem', color: '#71717A' }}>
                                                of {formatCurrency(goal.target_amount)}
                                            </span>
                                        </div>

                                        {celebration && (
                                            <div style={{
                                                marginTop: '0.75rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                color: '#059669',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                {celebration}
                                            </div>
                                        )}

                                        {goal.deadline && (
                                            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#71717A' }}>
                                                Due: {new Date(goal.deadline).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </>
            )}

            {/* Goal Modal */}
            <GoalModal
                isOpen={isModalOpen}
                onClose={closeModal}
                goal={selectedGoal}
                onSuccess={handleModalSuccess}
            />
        </div>
    )
}
