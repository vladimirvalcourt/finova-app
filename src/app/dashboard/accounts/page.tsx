'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAccounts, useTotalBalance, Account } from '@/hooks/useAccounts'
import { AccountModal } from '@/components/forms/modals/AccountModal'
import { Loader2 } from 'lucide-react'
import styles from '../page.module.css'

export default function AccountsPage() {
    const { accounts, isLoading, isError, mutate } = useAccounts()
    const { totalBalance } = useTotalBalance()

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

    const openCreateModal = () => {
        setSelectedAccount(null)
        setIsModalOpen(true)
    }

    const openEditModal = (account: Account) => {
        setSelectedAccount(account)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedAccount(null)
    }

    const handleModalSuccess = () => {
        mutate()
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    // Calculate totals
    const totalAssets = accounts
        .filter(a => Number(a.balance) > 0)
        .reduce((sum, a) => sum + Number(a.balance), 0)

    const totalLiabilities = accounts
        .filter(a => Number(a.balance) < 0)
        .reduce((sum, a) => sum + Math.abs(Number(a.balance)), 0)

    // Icon/color mapping for account types
    const getAccountStyle = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'checking':
                return { icon: '🏦', color: '#6366F1' }
            case 'savings':
                return { icon: '💰', color: '#10B981' }
            case 'credit':
                return { icon: '💳', color: '#F43F5E' }
            case 'investment':
                return { icon: '📈', color: '#F59E0B' }
            case 'cash':
                return { icon: '💵', color: '#22C55E' }
            default:
                return { icon: '🏦', color: '#6366F1' }
        }
    }

    return (
        <div className={styles.pageContent}>
            {/* Page Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Accounts</h1>
                <Button variant="primary" onClick={openCreateModal}>
                    ➕ Add Account
                </Button>
            </header>

            {/* Main Content */}
            {isLoading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={48} className={styles.spinner} />
                </div>
            ) : isError ? (
                <div className={styles.errorState}>
                    Failed to load accounts. Please try again.
                </div>
            ) : accounts.length === 0 ? (
                <div className={styles.emptyState}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
                    <h3 style={{ marginBottom: '0.5rem', color: '#18181B', fontWeight: 600 }}>No accounts yet</h3>
                    <p style={{ marginBottom: '1.5rem' }}>
                        Add your first account to start tracking your finances.
                    </p>
                    <Button variant="primary" onClick={openCreateModal}>➕ Add Your First Account</Button>
                </div>
            ) : (
                <>
                    {/* Total Balance Card */}
                    <Card variant="gradient" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', color: 'white' }}>
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
                            <div style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                                Total Net Worth
                            </div>
                            <div style={{ fontSize: '3rem', fontWeight: 800 }}>
                                {formatCurrency(totalBalance)}
                            </div>
                        </div>
                    </Card>

                    {/* Account Summary Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <Card className={styles.tableCard}>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#71717A', marginBottom: '0.5rem' }}>
                                    Total Assets
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>
                                    {formatCurrency(totalAssets)}
                                </div>
                            </div>
                        </Card>
                        <Card className={styles.tableCard}>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#71717A', marginBottom: '0.5rem' }}>
                                    Total Liabilities
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#DC2626' }}>
                                    {formatCurrency(totalLiabilities)}
                                </div>
                            </div>
                        </Card>
                        <Card className={styles.tableCard}>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#71717A', marginBottom: '0.5rem' }}>
                                    Active Accounts
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#18181B' }}>
                                    {accounts.length}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Accounts Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {accounts.map((account) => {
                            const style = getAccountStyle(account.type)
                            const balance = Number(account.balance)

                            return (
                                <Card
                                    key={account.id}
                                    hoverable
                                    clickable
                                    className={styles.tableCard}
                                    style={{
                                        borderLeft: `4px solid ${style.color}`,
                                    }}
                                    onClick={() => openEditModal(account)}
                                >
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    fontSize: '1.5rem',
                                                    width: '48px',
                                                    height: '48px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: `${style.color}15`,
                                                    borderRadius: '12px',
                                                }}>
                                                    {style.icon}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#18181B', marginBottom: '0.25rem' }}>
                                                        {account.name}
                                                    </h3>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        color: '#71717A',
                                                        background: '#F4F4F5',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '100px',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {account.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#71717A', marginBottom: '0.5rem' }}>
                                                Current Balance
                                            </div>
                                            <div style={{
                                                fontSize: '1.875rem',
                                                fontWeight: 800,
                                                color: balance < 0 ? '#DC2626' : '#18181B',
                                            }}>
                                                {balance < 0 ? '-' : ''}{formatCurrency(Math.abs(balance))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <Button variant="secondary" size="small" fullWidth onClick={(e) => { e.stopPropagation(); openEditModal(account); }}>
                                                Edit Account
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </>
            )}

            {/* Account Modal */}
            <AccountModal
                isOpen={isModalOpen}
                onClose={closeModal}
                account={selectedAccount}
                onSuccess={handleModalSuccess}
            />
        </div>
    )
}
