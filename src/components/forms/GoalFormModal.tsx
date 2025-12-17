'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useGoals } from '@/hooks/useGoals'
import styles from './TransactionFormModal.module.css'

interface GoalFormData {
    id?: string
    name: string
    target_amount: string
    current_amount: string
    deadline: string
    icon: string
    color: string
}

interface GoalFormModalProps {
    isOpen: boolean
    onClose: () => void
    goal?: GoalFormData | null
    onSuccess?: () => void
}

const emptyForm: GoalFormData = {
    name: '',
    target_amount: '',
    current_amount: '0',
    deadline: '',
    icon: '🎯',
    color: '#6366f1',
}

const goalIcons = ['🎯', '🏠', '✈️', '🚗', '💍', '🎓', '💊', '🏖️', '💻', '🎮']
const goalColors = ['#6366f1', '#22C55E', '#EAB308', '#EF4444', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316']

export function GoalFormModal({ isOpen, onClose, goal, onSuccess }: GoalFormModalProps) {
    const { mutate: refreshGoals } = useGoals()
    const [form, setForm] = useState<GoalFormData>(emptyForm)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState('')

    const isEditMode = !!goal?.id

    useEffect(() => {
        if (goal) {
            setForm({
                ...goal,
                target_amount: goal.target_amount?.toString() || '',
                current_amount: goal.current_amount?.toString() || '0',
                deadline: goal.deadline?.split('T')[0] || '',
            })
        } else {
            setForm(emptyForm)
        }
    }, [goal, isOpen])

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
                target_amount: parseFloat(form.target_amount) || 0,
                current_amount: parseFloat(form.current_amount) || 0,
                deadline: form.deadline || null,
                icon: form.icon,
                color: form.color,
            }

            if (isEditMode && goal?.id) {
                const { error } = await supabase
                    .from('goals')
                    .update(payload as never)
                    .eq('id', goal.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('goals')
                    .insert(payload as never)
                if (error) throw error
            }

            refreshGoals()
            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save goal')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!goal?.id || !confirm('Delete this goal?')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', goal.id)
            if (error) throw error

            refreshGoals()
            onSuccess?.()
            onClose()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setIsDeleting(false)
        }
    }

    const progress = form.target_amount && form.current_amount
        ? Math.min((parseFloat(form.current_amount) / parseFloat(form.target_amount)) * 100, 100)
        : 0

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
                            <h2>{isEditMode ? 'Edit Goal' : 'New Goal'}</h2>
                            <button className={styles.closeBtn} onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.field}>
                                <label>Goal Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g., Vacation to Hawaii"
                                    required
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>Target Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.target_amount}
                                        onChange={e => setForm({ ...form, target_amount: e.target.value })}
                                        placeholder="5000"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Saved So Far</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.current_amount}
                                        onChange={e => setForm({ ...form, current_amount: e.target.value })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {form.target_amount && (
                                <div className={styles.progressPreview}>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${progress}%`, backgroundColor: form.color }}
                                        />
                                    </div>
                                    <span className={styles.progressLabel}>{progress.toFixed(0)}% complete</span>
                                </div>
                            )}

                            <div className={styles.field}>
                                <label>Target Date (Optional)</label>
                                <input
                                    type="date"
                                    value={form.deadline}
                                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Icon</label>
                                <div className={styles.iconGrid}>
                                    {goalIcons.map(icon => (
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
                                    {goalColors.map(color => (
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
                                    {isEditMode ? 'Update' : 'Create Goal'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
