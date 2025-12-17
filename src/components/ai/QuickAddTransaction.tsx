'use client'

import { useState, useEffect } from 'react'
import { Send, Loader2, Sparkles, Check, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAccounts } from '@/hooks/useAccounts'
import { useTransactions } from '@/hooks/useTransactions'
import styles from './QuickAddTransaction.module.css'

interface ParsedTransaction {
    amount: number
    description: string
    category?: string
    date?: string
    type: 'income' | 'expense' | 'transfer'
}

interface Category {
    id: string
    name: string
    type: string
}

export function QuickAddTransaction() {
    const { accounts } = useAccounts()
    const { mutate: refreshTransactions } = useTransactions()
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [parsedResult, setParsedResult] = useState<ParsedTransaction | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [selectedAccountId, setSelectedAccountId] = useState('')
    const [categories, setCategories] = useState<Category[]>([])

    // Load categories on mount
    useEffect(() => {
        async function loadCategories() {
            const { data } = await supabase.from('categories').select('id, name, type')
            if (data) setCategories(data)
        }
        loadCategories()
    }, [])

    // Set default account
    useEffect(() => {
        if (accounts.length > 0 && !selectedAccountId) {
            setSelectedAccountId(accounts[0].id)
        }
    }, [accounts, selectedAccountId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        setIsLoading(true)
        setError(null)
        setParsedResult(null)
        setSuccess(false)

        try {
            const response = await fetch('/api/ai/parse-transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: input.trim() }),
            })

            if (!response.ok) {
                throw new Error('Failed to parse transaction')
            }

            const data = await response.json()
            setParsedResult(data.transaction)
        } catch (err) {
            console.error('Failed to parse transaction:', err)
            setError('Could not understand that. Try something like "Spent $50 at Whole Foods"')
        } finally {
            setIsLoading(false)
        }
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    const handleConfirm = async () => {
        if (!parsedResult || !selectedAccountId) return

        setIsSaving(true)
        setError(null)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // Find matching category
            const matchedCategory = categories.find(c =>
                c.name.toLowerCase() === parsedResult.category?.toLowerCase() &&
                c.type === parsedResult.type.toUpperCase()
            )

            const payload = {
                user_id: user.id,
                account_id: selectedAccountId,
                category_id: matchedCategory?.id || null,
                description: parsedResult.description,
                amount: parsedResult.amount,
                type: parsedResult.type.toUpperCase(),
                date: parsedResult.date || new Date().toISOString().split('T')[0],
                recurring: false,
            }

            const { error: saveError } = await supabase
                .from('transactions')
                .insert(payload as never)

            if (saveError) throw saveError

            setSuccess(true)
            setParsedResult(null)
            setInput('')
            refreshTransactions()

            // Reset success after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.error('Failed to save transaction:', err)
            setError('Failed to save. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setParsedResult(null)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Sparkles size={16} className={styles.sparkle} />
                <span>Quick Add with AI</span>
            </div>

            {success && (
                <div className={styles.success}>
                    <Check size={16} />
                    Transaction added!
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., Spent $45 on groceries at Whole Foods"
                    className={styles.input}
                    disabled={isLoading || !!parsedResult}
                />
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={!input.trim() || isLoading || !!parsedResult}
                >
                    {isLoading ? <Loader2 size={18} className={styles.spinner} /> : <Send size={18} />}
                </button>
            </form>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            {parsedResult && (
                <div className={styles.result}>
                    <div className={styles.resultHeader}>
                        <span className={styles.resultLabel}>Parsed Transaction</span>
                    </div>
                    <div className={styles.resultBody}>
                        <div className={styles.resultRow}>
                            <span className={styles.resultKey}>Amount</span>
                            <span className={styles.resultValue} data-type={parsedResult.type}>
                                {parsedResult.type === 'income' ? '+' : '-'}{formatCurrency(parsedResult.amount)}
                            </span>
                        </div>
                        <div className={styles.resultRow}>
                            <span className={styles.resultKey}>Description</span>
                            <span className={styles.resultValue}>{parsedResult.description}</span>
                        </div>
                        {parsedResult.category && (
                            <div className={styles.resultRow}>
                                <span className={styles.resultKey}>Category</span>
                                <span className={styles.resultCategory}>{parsedResult.category}</span>
                            </div>
                        )}
                        <div className={styles.resultRow}>
                            <span className={styles.resultKey}>Account</span>
                            <select
                                value={selectedAccountId}
                                onChange={(e) => setSelectedAccountId(e.target.value)}
                                className={styles.accountSelect}
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.resultActions}>
                        <button onClick={handleCancel} className={styles.cancelBtn} disabled={isSaving}>
                            <X size={14} />
                            Cancel
                        </button>
                        <button onClick={handleConfirm} className={styles.confirmBtn} disabled={isSaving}>
                            {isSaving ? <Loader2 size={14} className={styles.spinner} /> : <Check size={14} />}
                            Save
                        </button>
                    </div>
                </div>
            )}

            {!parsedResult && (
                <div className={styles.hint}>
                    💡 Try: "Got paid $3000 salary" or "Netflix subscription $15.99"
                </div>
            )}
        </div>
    )
}

