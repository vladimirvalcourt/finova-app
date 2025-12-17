'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import styles from './TransactionFormModal.module.css'

interface Category {
    id: string
    name: string
    icon: string
    type: 'INCOME' | 'EXPENSE'
}

interface TransactionFormData {
    id?: string
    description: string
    amount: string
    type: 'income' | 'expense'
    category_id: string
    account_id: string
    date: string
    recurring: boolean
}

interface TransactionFormModalProps {
    isOpen: boolean
    onClose: () => void
    transaction?: TransactionFormData | null
    onSuccess?: () => void
}

const emptyForm: TransactionFormData = {
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    account_id: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
}

export function TransactionFormModal({ isOpen, onClose, transaction, onSuccess }: TransactionFormModalProps) {
    const { accounts } = useAccounts()
    const { mutate: refreshTransactions } = useTransactions()
    const [form, setForm] = useState<TransactionFormData>(emptyForm)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!transaction?.id

    // Load categories
    useEffect(() => {
        async function loadCategories() {
            const { data } = await supabase
                .from('categories')
                .select('id, name, icon, type')
                .order('name')
            if (data) setCategories(data)
        }
        loadCategories()
    }, [])

    // Populate form when editing
    useEffect(() => {
        if (transaction) {
            setForm({
                ...transaction,
                date: transaction.date?.split('T')[0] || new Date().toISOString().split('T')[0],
            })
        } else {
            setForm(emptyForm)
        }
    }, [transaction, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const payload = {
                user_id: user.id,
                account_id: form.account_id,
                category_id: form.category_id || null,
                description: form.description,
                amount: parseFloat(form.amount),
                type: form.type.toUpperCase(),
                date: form.date,
                recurring: form.recurring,
            }

            if (isEditMode && transaction?.id) {
                const { error } = await supabase
                    .from('transactions')
                    .update(payload as never)
                    .eq('id', transaction.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('transactions')
                    .insert(payload as never)
                if (error) throw error
            }

            refreshTransactions()
            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save transaction')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!transaction?.id || !confirm('Delete this transaction?')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', transaction.id)
            if (error) throw error

            refreshTransactions()
            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredCategories = categories.filter(
        c => c.type === form.type.toUpperCase()
    )

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
                            <h2>{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</h2>
                            <button className={styles.closeBtn} onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.typeToggle}>
                                <button
                                    type="button"
                                    className={`${styles.typeBtn} ${form.type === 'expense' ? styles.active : ''}`}
                                    onClick={() => setForm({ ...form, type: 'expense', category_id: '' })}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.typeBtn} ${form.type === 'income' ? styles.active : ''}`}
                                    onClick={() => setForm({ ...form, type: 'income', category_id: '' })}
                                >
                                    Income
                                </button>
                            </div>

                            <div className={styles.field}>
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="e.g., Grocery shopping"
                                    required
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Account</label>
                                    <select
                                        value={form.account_id}
                                        onChange={e => setForm({ ...form, account_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select account</option>
                                        {accounts.map(acc => (
                                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Category</label>
                                    <select
                                        value={form.category_id}
                                        onChange={e => setForm({ ...form, category_id: e.target.value })}
                                    >
                                        <option value="">Select category</option>
                                        {filteredCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={form.recurring}
                                    onChange={e => setForm({ ...form, recurring: e.target.checked })}
                                />
                                <span>Recurring transaction</span>
                            </label>

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
