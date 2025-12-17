'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useTransactions, Transaction } from '@/hooks/useTransactions'
import { useAccounts } from '@/hooks/useAccounts'
import { TransactionModal } from '@/components/forms/modals/TransactionModal'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import styles from '../page.module.css'

export default function TransactionsPage() {
    const { transactions, isLoading, isError, mutate } = useTransactions()
    const { accounts } = useAccounts()
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [accountFilter, setAccountFilter] = useState('all')

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    const openCreateModal = () => {
        setSelectedTransaction(null)
        setIsModalOpen(true)
    }

    const openEditModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedTransaction(null)
    }

    const handleModalSuccess = () => {
        mutate() // Refresh data
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount))

    // Get unique categories from transactions
    const categories = [...new Set(transactions.map(t => t.category?.name).filter(Boolean))]

    // Filter transactions
    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'all' || tx.category?.name === categoryFilter
        const matchesAccount = accountFilter === 'all' || tx.account_id === accountFilter
        return matchesSearch && matchesCategory && matchesAccount
    })

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.logo}>
                        <span>💰</span>
                        <span>Finova</span>
                    </div>
                    <nav className={styles.nav}>
                        <Link href="/dashboard" className={styles.navLink}>
                            Dashboard
                        </Link>
                        <Link href="/dashboard/transactions" className={`${styles.navLink} ${styles.navLinkActive}`}>
                            Transactions
                        </Link>
                        <Link href="/dashboard/budgets" className={styles.navLink}>
                            Budgets
                        </Link>
                        <Link href="/dashboard/accounts" className={styles.navLink}>
                            Accounts
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 className={styles.pageTitle}>Transactions</h1>
                            <p className={styles.pageSubtitle}>Track and manage all your transactions</p>
                        </div>
                        <Button variant="primary" onClick={openCreateModal}>➕ Add Transaction</Button>
                    </div>
                </div>

                {/* Filters */}
                <Card style={{ marginBottom: 'var(--spacing-6)' }}>
                    <CardBody>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
                            <Input
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{
                                    padding: 'var(--spacing-3) var(--spacing-4)',
                                    fontSize: 'var(--font-size-base)',
                                    fontFamily: 'var(--font-sans)',
                                    color: 'var(--color-text-primary)',
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    outline: 'none',
                                }}>
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select
                                value={accountFilter}
                                onChange={(e) => setAccountFilter(e.target.value)}
                                style={{
                                    padding: 'var(--spacing-3) var(--spacing-4)',
                                    fontSize: 'var(--font-size-base)',
                                    fontFamily: 'var(--font-sans)',
                                    color: 'var(--color-text-primary)',
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    outline: 'none',
                                }}>
                                <option value="all">All Accounts</option>
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>
                        </div>
                    </CardBody>
                </Card>

                {/* Transactions List */}
                <Card>
                    <CardHeader
                        title="All Transactions"
                        subtitle={isLoading ? 'Loading...' : `${filteredTransactions.length} transactions`}
                    />
                    <CardBody>
                        {isLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                            </div>
                        ) : isError ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-danger-500)' }}>
                                Failed to load transactions. Please try again.
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                                No transactions found.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                                {filteredTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        onClick={() => openEditModal(transaction)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--spacing-4)',
                                            background: 'var(--color-surface)',
                                            borderRadius: 'var(--radius-lg)',
                                            transition: 'all var(--transition-fast)',
                                            cursor: 'pointer',
                                            border: '1px solid transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--color-neutral-100)'
                                            e.currentTarget.style.borderColor = 'var(--color-primary-300)'
                                            e.currentTarget.style.transform = 'translateX(4px)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--color-surface)'
                                            e.currentTarget.style.borderColor = 'transparent'
                                            e.currentTarget.style.transform = 'translateX(0)'
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                                                {transaction.description}
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                {transaction.category?.name || 'Uncategorized'} • {transaction.account?.name || 'Unknown'} • {format(new Date(transaction.date), 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 'var(--font-size-xl)',
                                                fontWeight: 'var(--font-weight-bold)',
                                                color: transaction.type === 'income' ? 'var(--color-success-600)' : 'var(--color-text-primary)',
                                            }}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                transaction={selectedTransaction}
                onSuccess={handleModalSuccess}
            />
        </div>
    )
}
