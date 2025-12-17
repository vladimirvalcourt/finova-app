'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { useAccounts, useTotalBalance } from '@/hooks/useAccounts'
import { Loader2 } from 'lucide-react'
import styles from '../page.module.css'

export default function AccountsPage() {
    const { accounts, isLoading, isError } = useAccounts()
    const { totalBalance } = useTotalBalance()

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
                return { icon: '🏦', color: '#4f46e5' }
            case 'savings':
                return { icon: '💰', color: '#10b981' }
            case 'credit':
                return { icon: '💳', color: '#e11d48' }
            case 'investment':
                return { icon: '📈', color: '#f59e0b' }
            case 'cash':
                return { icon: '💵', color: '#22c55e' }
            default:
                return { icon: '🏦', color: '#6366f1' }
        }
    }

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
                        <Link href="/dashboard/transactions" className={styles.navLink}>
                            Transactions
                        </Link>
                        <Link href="/dashboard/budgets" className={styles.navLink}>
                            Budgets
                        </Link>
                        <Link href="/dashboard/accounts" className={`${styles.navLink} ${styles.navLinkActive}`}>
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
                            <h1 className={styles.pageTitle}>Accounts</h1>
                            <p className={styles.pageSubtitle}>Manage your financial accounts</p>
                        </div>
                        <Button variant="primary">➕ Add Account</Button>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : isError ? (
                    <Card>
                        <CardBody>
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-danger-500)' }}>
                                Failed to load accounts. Please try again.
                            </div>
                        </CardBody>
                    </Card>
                ) : accounts.length === 0 ? (
                    <Card>
                        <CardBody>
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
                                <h3 style={{ marginBottom: '0.5rem' }}>No accounts yet</h3>
                                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                    Add your first account to start tracking your finances.
                                </p>
                                <Button variant="primary">➕ Add Your First Account</Button>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    <>
                        {/* Total Balance */}
                        <Card variant="gradient" style={{ marginBottom: 'var(--spacing-8)' }}>
                            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
                                <div style={{ fontSize: 'var(--font-size-lg)', opacity: 0.9, marginBottom: 'var(--spacing-2)' }}>
                                    Total Net Worth
                                </div>
                                <div style={{ fontSize: 'var(--font-size-5xl)', fontWeight: 'var(--font-weight-extrabold)' }}>
                                    {formatCurrency(totalBalance)}
                                </div>
                            </div>
                        </Card>

                        {/* Accounts Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--spacing-6)' }}>
                            {accounts.map((account) => {
                                const style = getAccountStyle(account.type)
                                const balance = Number(account.balance)

                                return (
                                    <Card
                                        key={account.id}
                                        hoverable
                                        clickable
                                        style={{
                                            borderLeft: `4px solid ${style.color}`,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                                                <div style={{
                                                    fontSize: '2rem',
                                                    width: '60px',
                                                    height: '60px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: `${style.color}20`,
                                                    borderRadius: 'var(--radius-xl)',
                                                }}>
                                                    {style.icon}
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                                                        {account.name}
                                                    </h3>
                                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                                        {account.type}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 'var(--spacing-4)' }}>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-1)' }}>
                                                Current Balance
                                            </div>
                                            <div style={{
                                                fontSize: 'var(--font-size-3xl)',
                                                fontWeight: 'var(--font-weight-extrabold)',
                                                color: balance < 0 ? 'var(--color-danger-600)' : 'var(--color-text-primary)',
                                            }}>
                                                {balance < 0 ? '-' : ''}{formatCurrency(Math.abs(balance))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                            <Button variant="secondary" size="small" fullWidth>
                                                View Details
                                            </Button>
                                            <Button variant="ghost" size="small" fullWidth>
                                                Edit
                                            </Button>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Account Summary */}
                        <Card style={{ marginTop: 'var(--spacing-8)' }}>
                            <CardHeader title="Account Summary" />
                            <CardBody>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-6)' }}>
                                    <div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                                            Total Assets
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-600)' }}>
                                            {formatCurrency(totalAssets)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                                            Total Liabilities
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger-600)' }}>
                                            {formatCurrency(totalLiabilities)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                                            Number of Accounts
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                                            {accounts.length}
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}
