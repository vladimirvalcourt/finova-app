'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useGoalMutations } from '@/hooks/useGoals'

interface Goal {
    id: string
    name: string
    target_amount: number
    current_amount: number
    deadline: string | null
    icon: string
    color: string
}

interface GoalModalProps {
    isOpen: boolean
    onClose: () => void
    goal?: Goal | null
    onSuccess?: () => void
}

const goalIcons = ['🎯', '🏠', '✈️', '🚗', '💍', '🎓', '💰', '🏝️', '💻', '🎁']

export function GoalModal({
    isOpen,
    onClose,
    goal,
    onSuccess,
}: GoalModalProps) {
    const { createGoal, updateGoal, deleteGoal, addContribution } = useGoalMutations()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showContribution, setShowContribution] = useState(false)
    const [contribution, setContribution] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
        icon: '🎯',
        color: '#6366f1',
    })

    useEffect(() => {
        if (isOpen) {
            if (goal) {
                setFormData({
                    name: goal.name,
                    target_amount: String(goal.target_amount),
                    current_amount: String(goal.current_amount),
                    deadline: goal.deadline?.split('T')[0] || '',
                    icon: goal.icon || '🎯',
                    color: goal.color || '#6366f1',
                })
            } else {
                setFormData({
                    name: '',
                    target_amount: '',
                    current_amount: '0',
                    deadline: '',
                    icon: '🎯',
                    color: '#6366f1',
                })
            }
            setError(null)
            setShowContribution(false)
            setContribution('')
        }
    }, [isOpen, goal])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const goalData = {
                name: formData.name,
                target_amount: parseFloat(formData.target_amount),
                current_amount: parseFloat(formData.current_amount) || 0,
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
                icon: formData.icon,
                color: formData.color,
            }

            if (goal) {
                await updateGoal(goal.id, goalData)
            } else {
                await createGoal(goalData)
            }

            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleContribution = async () => {
        if (!goal || !contribution) return

        setIsSubmitting(true)
        try {
            await addContribution(goal.id, parseFloat(contribution))
            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add contribution')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!goal) return
        if (!confirm('Are you sure you want to delete this goal?')) return

        setIsSubmitting(true)
        try {
            await deleteGoal(goal.id)
            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={goal ? 'Edit Goal' : 'Create Goal'}
            footer={
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', width: '100%', justifyContent: 'space-between' }}>
                    {goal && (
                        <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                            Delete
                        </Button>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginLeft: 'auto' }}>
                        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        {showContribution && goal ? (
                            <Button variant="success" onClick={handleContribution} loading={isSubmitting}>
                                Add Funds
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
                                {goal ? 'Update' : 'Create'} Goal
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            {showContribution && goal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>{goal.icon}</div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{goal.name}</div>
                        <div style={{ color: 'var(--color-text-secondary)' }}>
                            ${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
                        </div>
                    </div>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Amount to add..."
                        value={contribution}
                        onChange={(e) => setContribution(e.target.value)}
                    />
                    <Button variant="ghost" onClick={() => setShowContribution(false)}>
                        ← Back to Edit
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {error && (
                        <div style={{
                            padding: 'var(--spacing-3)',
                            background: 'var(--color-danger-50)',
                            color: 'var(--color-danger-700)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: 'var(--font-size-sm)',
                        }}>
                            {error}
                        </div>
                    )}

                    {goal && (
                        <Button type="button" variant="success" onClick={() => setShowContribution(true)}>
                            💵 Add Contribution
                        </Button>
                    )}

                    {/* Icon */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                            Icon
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                            {goalIcons.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setFormData((f) => ({ ...f, icon }))}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        fontSize: '1.25rem',
                                        border: `2px solid ${formData.icon === icon ? 'var(--color-primary-500)' : 'var(--color-border)'}`,
                                        background: formData.icon === icon ? 'var(--color-primary-50)' : 'transparent',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                            Goal Name *
                        </label>
                        <Input
                            placeholder="e.g., Emergency Fund"
                            value={formData.name}
                            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Target Amount */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                            Target Amount *
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={formData.target_amount}
                            onChange={(e) => setFormData((f) => ({ ...f, target_amount: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Current Amount */}
                    {!goal && (
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                                Starting Amount
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={formData.current_amount}
                                onChange={(e) => setFormData((f) => ({ ...f, current_amount: e.target.value }))}
                            />
                        </div>
                    )}

                    {/* Deadline */}
                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                            Target Date (optional)
                        </label>
                        <Input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData((f) => ({ ...f, deadline: e.target.value }))}
                        />
                    </div>
                </form>
            )}
        </Modal>
    )
}
