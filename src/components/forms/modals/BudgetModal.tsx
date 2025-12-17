'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useBudgetMutations, BudgetWithDetails } from '@/hooks/useBudgets'
import { useCategories } from '@/hooks/useCategories'

interface BudgetModalProps {
    isOpen: boolean
    onClose: () => void
    budget?: BudgetWithDetails | null
    onSuccess?: () => void
}

export function BudgetModal({
    isOpen,
    onClose,
    budget,
    onSuccess,
}: BudgetModalProps) {
    const { categories } = useCategories()
    const { createBudget, updateBudget, deleteBudget } = useBudgetMutations()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')

    const [formData, setFormData] = useState({
        category_id: '',
        amount: '',
        period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
    })

    useEffect(() => {
        if (isOpen) {
            if (budget) {
                setFormData({
                    category_id: budget.category_id,
                    amount: String(budget.amount),
                    period: budget.period,
                })
            } else {
                setFormData({
                    category_id: expenseCategories[0]?.id || '',
                    amount: '',
                    period: 'monthly',
                })
            }
            setError(null)
        }
    }, [isOpen, budget, expenseCategories])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const now = new Date()
            let startDate: Date
            let endDate: Date

            if (formData.period === 'weekly') {
                const day = now.getDay()
                startDate = new Date(now.setDate(now.getDate() - day))
                endDate = new Date(startDate)
                endDate.setDate(endDate.getDate() + 6)
            } else if (formData.period === 'yearly') {
                startDate = new Date(now.getFullYear(), 0, 1)
                endDate = new Date(now.getFullYear(), 11, 31)
            } else {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            }

            const budgetData = {
                category_id: formData.category_id,
                amount: parseFloat(formData.amount),
                period: formData.period,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            }

            if (budget) {
                await updateBudget(budget.id, budgetData)
            } else {
                await createBudget(budgetData)
            }

            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!budget) return
        if (!confirm('Are you sure you want to delete this budget?')) return

        setIsSubmitting(true)
        try {
            await deleteBudget(budget.id)
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
            title={budget ? 'Edit Budget' : 'Create Budget'}
            footer={
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', width: '100%', justifyContent: 'space-between' }}>
                    {budget && (
                        <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                            Delete
                        </Button>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginLeft: 'auto' }}>
                        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
                            {budget ? 'Update' : 'Create'} Budget
                        </Button>
                    </div>
                </div>
            }
        >
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

                {/* Category */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                        Category *
                    </label>
                    <select
                        value={formData.category_id}
                        onChange={(e) => setFormData((f) => ({ ...f, category_id: e.target.value }))}
                        required
                        disabled={!!budget}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-3) var(--spacing-4)',
                            fontSize: 'var(--font-size-base)',
                            color: 'var(--color-text-primary)',
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            outline: 'none',
                        }}
                    >
                        <option value="">Select category...</option>
                        {expenseCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Amount */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                        Budget Amount *
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData((f) => ({ ...f, amount: e.target.value }))}
                        required
                    />
                </div>

                {/* Period */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                        Period
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        {['weekly', 'monthly', 'yearly'].map((period) => (
                            <button
                                key={period}
                                type="button"
                                onClick={() => setFormData((f) => ({ ...f, period: period as any }))}
                                style={{
                                    flex: 1,
                                    padding: 'var(--spacing-3)',
                                    border: `2px solid ${formData.period === period ? 'var(--color-primary-500)' : 'var(--color-border)'}`,
                                    background: formData.period === period ? 'var(--color-primary-50)' : 'transparent',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    fontWeight: 'var(--font-weight-medium)',
                                    textTransform: 'capitalize',
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </form>
        </Modal>
    )
}
