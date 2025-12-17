'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAccountMutations, Account } from '@/hooks/useAccounts'

interface AccountModalProps {
    isOpen: boolean
    onClose: () => void
    account?: Account | null
    onSuccess?: () => void
}

const accountTypes = [
    { value: 'CHECKING', label: '🏦 Checking', color: '#3b82f6' },
    { value: 'SAVINGS', label: '💰 Savings', color: '#10b981' },
    { value: 'CREDIT', label: '💳 Credit Card', color: '#f59e0b' },
    { value: 'INVESTMENT', label: '📈 Investment', color: '#8b5cf6' },
    { value: 'CASH', label: '💵 Cash', color: '#22c55e' },
]

export function AccountModal({
    isOpen,
    onClose,
    account,
    onSuccess,
}: AccountModalProps) {
    const { createAccount, updateAccount, deleteAccount } = useAccountMutations()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        type: 'CHECKING' as 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT' | 'CASH',
        balance: '',
        currency: 'USD',
        color: '#3b82f6',
    })

    useEffect(() => {
        if (isOpen) {
            if (account) {
                setFormData({
                    name: account.name,
                    type: account.type,
                    balance: String(account.balance),
                    currency: account.currency || 'USD',
                    color: account.color || '#3b82f6',
                })
            } else {
                setFormData({
                    name: '',
                    type: 'CHECKING',
                    balance: '',
                    currency: 'USD',
                    color: '#3b82f6',
                })
            }
            setError(null)
        }
    }, [isOpen, account])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const accountData = {
                name: formData.name,
                type: formData.type,
                balance: parseFloat(formData.balance) || 0,
                currency: formData.currency,
                color: formData.color,
            }

            if (account) {
                await updateAccount(account.id, accountData)
            } else {
                await createAccount(accountData)
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
        if (!account) return
        if (!confirm('Are you sure? This will also delete all transactions in this account.')) return

        setIsSubmitting(true)
        try {
            await deleteAccount(account.id)
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
            title={account ? 'Edit Account' : 'Add Account'}
            footer={
                <div style={{ display: 'flex', gap: 'var(--spacing-3)', width: '100%', justifyContent: 'space-between' }}>
                    {account && (
                        <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                            Delete
                        </Button>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginLeft: 'auto' }}>
                        <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
                            {account ? 'Update' : 'Add'} Account
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

                {/* Account Type */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                        Account Type
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)' }}>
                        {accountTypes.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setFormData((f) => ({ ...f, type: type.value as any, color: type.color }))}
                                style={{
                                    padding: 'var(--spacing-3)',
                                    border: `2px solid ${formData.type === type.value ? type.color : 'var(--color-border)'}`,
                                    background: formData.type === type.value ? `${type.color}15` : 'transparent',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    fontWeight: 'var(--font-weight-medium)',
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                        Account Name *
                    </label>
                    <Input
                        placeholder="e.g., Chase Checking"
                        value={formData.name}
                        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                        required
                    />
                </div>

                {/* Balance */}
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontWeight: 'var(--font-weight-medium)' }}>
                        Current Balance
                    </label>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.balance}
                        onChange={(e) => setFormData((f) => ({ ...f, balance: e.target.value }))}
                    />
                </div>
            </form>
        </Modal>
    )
}
