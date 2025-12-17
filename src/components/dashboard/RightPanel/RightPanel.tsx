'use client'

import styles from './RightPanel.module.css'
import { MoreHorizontal, Edit2, ShoppingBag, Apple, Plane, CreditCard, Mail, Bell, ChevronDown } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRecentTransactions } from '@/hooks/useTransactions'
import { format } from 'date-fns'
import { useModals } from '@/components/providers/ModalProvider'
import { QuickAddTransaction } from '@/components/ai/QuickAddTransaction'

export function RightPanel() {
    const { data: session } = useSession()
    const { transactions } = useRecentTransactions(4)
    const { openTransactionModal } = useModals()
    
    // Get user info or fallbacks
    const userName = session?.user?.name || 'Guest User'
    const userEmail = session?.user?.email || 'guest@example.com'
    // Generate avatar seed from name to ensure consistency
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName.replace(' ', '')}`

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(amount))

    return (
        <div className={styles.panel}>
            {/* Top Header Actions */}
            <div className={styles.topHeader}>
                <div className={styles.iconButton}>
                    <Mail size={20} />
                </div>
                <div className={styles.iconButton}>
                    <Bell size={20} />
                </div>
                <div className={styles.miniProfile}>
                    <img 
                        src={avatarUrl}
                        alt="Profile" 
                        className={styles.miniAvatar} 
                    />
                    <span className={styles.miniName}>{userName}</span>
                    <ChevronDown size={16} />
                </div>
            </div>

            {/* Profile Section */}
            <div className={styles.profile}>
                <div className={styles.avatarContainer}>
                    <img 
                        src={avatarUrl}
                        alt="Profile" 
                        className={styles.avatar} 
                    />
                    <div className={styles.editBadge}>
                        <Edit2 size={12} />
                    </div>
                </div>
                <h2 className={styles.name}>{userName}</h2>
                <span className={styles.username}>{userEmail}</span>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button 
                    className={`${styles.actionBtn} ${styles.sendBtn}`}
                    onClick={openTransactionModal}
                >
                    Send
                </button>
                <button 
                    className={`${styles.actionBtn} ${styles.requestBtn}`}
                    onClick={openTransactionModal}
                >
                    Request
                </button>
            </div>

            {/* AI Quick Add */}
            <div className={styles.section}>
                <QuickAddTransaction />
            </div>

            {/* Quick Send */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Send again</h3>
                    <MoreHorizontal size={20} className={styles.moreOptions} />
                </div>
                <div className={styles.quickSendList}>
                    {[
                        { name: 'Adam Doe', initials: 'AD' },
                        { name: 'Danial Doe', initials: 'DD' },
                        { name: 'Will Smith', initials: 'WS' },
                        { name: 'Sean Paul', initials: 'SP' },
                        { name: 'Ricky Martin', initials: 'RM' },
                    ].map((person, i) => (
                        <div key={i} className={styles.quickSendItem}>
                            <div className={styles.quickSendAvatar}>{person.initials}</div>
                            <span className={styles.quickSendName}>{person.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Recent Transaction</h3>
                    <MoreHorizontal size={20} className={styles.moreOptions} />
                </div>
                <div className={styles.transactionList}>
                    {transactions && transactions.length > 0 ? (
                        transactions.map(tx => (
                            <div key={tx.id} className={styles.transactionItem}>
                                <div className={styles.txIcon}>
                                    {tx.type === 'income' ? <CreditCard size={20} /> : <ShoppingBag size={20} />}
                                </div>
                                <div className={styles.txInfo}>
                                    <span className={styles.txName}>{tx.description || 'Unknown'}</span>
                                    <span className={styles.txType}>{tx.category?.name || 'Uncategorized'}</span>
                                </div>
                                <span className={styles.txAmount} style={{ color: tx.type === 'income' ? '#22C55E' : '#18181B' }}>
                                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={{color: '#71717A', fontSize: '0.875rem', textAlign: 'center'}}>No recent transactions</div>
                    )}
                </div>
            </div>
        </div>
    )
}
