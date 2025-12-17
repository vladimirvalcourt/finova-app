'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useBudgets } from '@/hooks/useBudgets'
import styles from './TransactionFormModal.module.css'

interface Category {
    id: string
    name: string
    icon: string
}

interface BudgetFormData {
    id?: string
    category_id: string
    amount: string
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
    start_date: string
}

interface BudgetFormModalProps {
    isOpen: boolean
    onClose: () => void
    budget?: BudgetFormData | null
    onSuccess?: () => void
}

const emptyForm: BudgetFormData = {
    category_id: '',
    amount: '',
    period: 'MONTHLY',
    start_date: new Date().toISOString().split('T')[0],
}

export function BudgetFormModal({ isOpen, onClose, budget, onSuccess }: BudgetFormModalProps) {
    const { mutate: refreshBudgets } = useBudgets()
    const [form, setForm] = useState<BudgetFormData>(emptyForm)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!budget?.id

    useEffect(() => {
        async function loadCategories() {
            const { data } = await supabase
                .from('categories')
                .select('id, name, icon')
                .eq('type', 'EXPENSE')
                .order('name')
            if (data) setCategories(data)
        }
        loadCategories()
    }, [])

    useEffect(() => {
        if (budget) {
            setForm({
                ...budget,
                amount: budget.amount?.toString() || '',
                start_date: budget.start_date?.split('T')[0] || new Date().toISOString().split('T')[0],
            })
        } else {
            setForm(emptyForm)
        }
    }, [budget, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const payload = {
                user_id: user.id,
                category_id: form.category_id,
                amount: parseFloat(form.amount) || 0,
                period: form.period,
                start_date: form.start_date,
            }

            if (isEditMode && budget?.id) {
                const { error } = await supabase
                    .from('budgets')
                    .update(payload as never)
                    .eq('id', budget.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('budgets')
                    .insert(payload as never)
                if (error) throw error
            }

            refreshBudgets()
            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save budget')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!budget?.id || !confirm('Delete this budget?')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('budgets')
                .delete()
                .eq('id', budget.id)
            if (error) throw error

            refreshBudgets()
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
                            <h2>{isEditMode ? 'Edit Budget' : 'Create Budget'}</h2>
                            <button className={styles.closeBtn} onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.field}>
                                <label>Category</label>
                                <select
                                    value={form.category_id}
                                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Budget Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                        placeholder="500"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Period</label>
                                    <select
                                        value={form.period}
                                        onChange={e => setForm({ ...form, period: e.target.value as BudgetFormData['period'] })}
                                    >
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="YEARLY">Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={form.start_date}
                                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                                    required
                                />
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
                                    {isEditMode ? 'Update' : 'Create Budget'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
