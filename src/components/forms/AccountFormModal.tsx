'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAccounts } from '@/hooks/useAccounts'
import styles from './TransactionFormModal.module.css'

interface AccountFormData {
    id?: string
    name: string
    type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT' | 'CASH'
    balance: string
    color: string
    icon: string
}

interface AccountFormModalProps {
    isOpen: boolean
    onClose: () => void
    account?: AccountFormData | null
    onSuccess?: () => void
}

const emptyForm: AccountFormData = {
    name: '',
    type: 'CHECKING',
    balance: '',
    color: '#6366f1',
    icon: '💳',
}

const accountIcons = ['💳', '🏦', '💰', '📈', '💵', '🪙', '💎', '🏠']
const accountColors = ['#6366f1', '#22C55E', '#EAB308', '#EF4444', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316']

export function AccountFormModal({ isOpen, onClose, account, onSuccess }: AccountFormModalProps) {
    const { mutate: refreshAccounts } = useAccounts()
    const [form, setForm] = useState<AccountFormData>(emptyForm)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!account?.id

    useEffect(() => {
        if (account) {
            setForm({
                ...account,
                balance: account.balance?.toString() || '',
            })
        } else {
            setForm(emptyForm)
        }
    }, [account, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const payload = {
                user_id: user.id,
                name: form.name,
                type: form.type,
                balance: parseFloat(form.balance) || 0,
                color: form.color,
                icon: form.icon,
            }

            if (isEditMode && account?.id) {
                const { error } = await supabase
                    .from('accounts')
                    .update(payload as never)
                    .eq('id', account.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('accounts')
                    .insert(payload as never)
                if (error) throw error
            }

            refreshAccounts()
            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save account')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!account?.id || !confirm('Delete this account? All transactions will be deleted.')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('accounts')
                .delete()
                .eq('id', account.id)
            if (error) throw error

            refreshAccounts()
            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className={styles.header}>
                            <h2>{isEditMode ? 'Edit Account' : 'Add Account'}</h2>
                            <button className={styles.closeBtn} onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.field}>
                                <label>Account Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g., Chase Checking"
                                    required
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Type</label>
                                    <select
                                        value={form.type}
                                        onChange={e => setForm({ ...form, type: e.target.value as AccountFormData['type'] })}
                                    >
                                        <option value="CHECKING">Checking</option>
                                        <option value="SAVINGS">Savings</option>
                                        <option value="CREDIT">Credit Card</option>
                                        <option value="INVESTMENT">Investment</option>
                                        <option value="CASH">Cash</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Balance</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.balance}
                                        onChange={e => setForm({ ...form, balance: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Icon</label>
                                <div className={styles.iconGrid}>
                                    {accountIcons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`${styles.iconBtn} ${form.icon === icon ? styles.selected : ''}`}
                                            onClick={() => setForm({ ...form, icon })}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Color</label>
                                <div className={styles.colorGrid}>
                                    {accountColors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`${styles.colorBtn} ${form.color === color ? styles.selected : ''}`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setForm({ ...form, color })}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.actions}>
                                {isEditMode && (
                                    <button
                                        type="button"
                                        className={styles.deleteBtn}
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? <Loader2 size={16} className={styles.spin} /> : <Trash2 size={16} />}
                                        Delete
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className={styles.saveBtn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 size={16} className={styles.spin} /> : <Save size={16} />}
                                    {isEditMode ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
