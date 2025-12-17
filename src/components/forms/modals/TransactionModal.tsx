'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useTransactionMutations, Transaction } from '@/hooks/useTransactions'

interface TransactionModalProps {
    isOpen: boolean
    onClose: () => void
    transaction?: Transaction | null // For edit mode
    onSuccess?: () => void
}

export function TransactionModal({
    isOpen,
    onClose,
    transaction,
    onSuccess,
}: TransactionModalProps) {
    const { accounts } = useAccounts()
    const { categories } = useCategories()
    const { createTransaction, updateTransaction, deleteTransaction } = useTransactionMutations()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense' as 'income' | 'expense',
        account_id: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
    })

    // Reset form when modal opens/closes or transaction changes
    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                // Edit mode - populate form
                setFormData({
                    description: transaction.description || '',
                    amount: String(Math.abs(transaction.amount)),
                    type: transaction.type as 'income' | 'expense',
                    account_id: transaction.account_id || '',
                    category_id: transaction.category_id || '',
                    date: transaction.date?.split('T')[0] || new Date().toISOString().split('T')[0],
                })
            } else {
                // Create mode - reset form
                setFormData({
                    description: '',
                    amount: '',
                    type: 'expense',
                    account_id: accounts[0]?.id || '',
                    category_id: '',
                    date: new Date().toISOString().split('T')[0],
                })
            }
            setError(null)
        }
    }, [isOpen, transaction, accounts])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const transactionData = {
                description: formData.description,
                amount: parseFloat(formData.amount),
                type: formData.type,
                account_id: formData.account_id,
                category_id: formData.category_id || null,
                date: new Date(formData.date).toISOString(),
                recurring: false,
                notes: null,
                receipt_url: null,
            }

            if (transaction) {
                // Update existing
                await updateTransaction(transaction.id, transactionData)
            } else {
                // Create new
                await createTransaction(transactionData as any)
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
        if (!transaction) return

        if (!confirm('Are you sure you want to delete this transaction?')) return

        setIsSubmitting(true)
        try {
            await deleteTransaction(transaction.id)
            onSuccess?.()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setIsSubmitting(false)
        }
    }

    const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')
    const incomeCategories = categories.filter((c) => c.type === 'INCOME')
    const filteredCategories = formData.type === 'expense' ? expenseCategories : incomeCategories

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={transaction ? 'Edit Transaction' : 'Add Transaction'}
            footer={
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', width: '100%', justifyContent: 'space-between' }}>
                    {transaction && (
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            Delete
                        </Button>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginLeft: 'auto' }}>
                        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            loading={isSubmitting}
                        >
                            {transaction ? 'Update' : 'Add'} Transaction
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

                {/* Type Toggle */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        Type
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button
                            type="button"
                            onClick={() => setFormData((f) => ({ ...f, type: 'expense', category_id: '' }))}
                            style={{
                                flex: 1,
                                padding: 'var(--spacing-3)',
                                border: `2px solid ${formData.type === 'expense' ? 'var(--color-danger-500)' : 'var(--color-border)'}`,
                                background: formData.type === 'expense' ? 'var(--color-danger-50)' : 'transparent',
                                borderRadius: 'var(--radius-lg)',
                                cursor: 'pointer',
                                fontWeight: 'var(--font-weight-medium)',
                                color: formData.type === 'expense' ? 'var(--color-danger-700)' : 'var(--color-text-secondary)',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            💸 Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData((f) => ({ ...f, type: 'income', category_id: '' }))}
                            style={{
                                flex: 1,
                                padding: 'var(--spacing-3)',
                                border: `2px solid ${formData.type === 'income' ? 'var(--color-success-500)' : 'var(--color-border)'}`,
                                background: formData.type === 'income' ? 'var(--color-success-50)' : 'transparent',
                                borderRadius: 'var(--radius-lg)',
                                cursor: 'pointer',
                                fontWeight: 'var(--font-weight-medium)',
                                color: formData.type === 'income' ? 'var(--color-success-700)' : 'var(--color-text-secondary)',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            💰 Income
                        </button>
                    </div>
                </div>

                {/* Amount */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        Amount *
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

                {/* Description */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        Description *
                    </label>
                    <Input
                        placeholder="e.g., Coffee at Starbucks"
                        value={formData.description}
                        onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                        required
                    />
                </div>

                {/* Account */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        Account *
                    </label>
                    <select
                        value={formData.account_id}
                        onChange={(e) => setFormData((f) => ({ ...f, account_id: e.target.value }))}
                        required
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
                        <option value="">Select account...</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                                {acc.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        Category
                    </label>
                    <select
                        value={formData.category_id}
                        onChange={(e) => setFormData((f) => ({ ...f, category_id: e.target.value }))}
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
                        <option value="">Uncategorized</option>
                        {filteredCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        Date *
                    </label>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData((f) => ({ ...f, date: e.target.value }))}
                        required
                    />
                </div>
            </form>
        </Modal>
    )
}
