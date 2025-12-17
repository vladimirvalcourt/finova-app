'use client'

import { useState } from 'react'
import styles from './Modern.module.css'
import { TransactionWithDetails } from '@/hooks/useTransactions'

interface TransactionTableProps {
    transactions?: TransactionWithDetails[]
}

const mockTransactions = [
    {
        id: 1,
        name: 'Royal Arkin',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Royal',
        status: 'In progress',
        date: '22 Jan, 2023',
        amount: '$12,334',
        statusColor: 'yellow'
    },
    {
        id: 2,
        name: 'Saimon Tanvir',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Saimon',
        status: 'Completed',
        date: '28 Dec, 2023',
        amount: '$20,334',
        statusColor: 'green'
    },
    {
        id: 3,
        name: 'Washi Bin',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Washi',
        status: 'Completed',
        date: '12 Dec, 2023',
        amount: '$42,334',
        statusColor: 'green'
    },
    {
        id: 4,
        name: 'Zulia Andre',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zulia',
        status: 'Completed',
        date: '12 Dec, 2023',
        amount: '$42,334',
        statusColor: 'green'
    }
]

export function TransactionTable({ transactions }: TransactionTableProps) {
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

    // Helper to format real transactions
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    // Use passed transactions or fallback to mock
    const rawTransactions = transactions && transactions.length > 0 
        ? transactions.map(tx => ({
            id: tx.id,
            name: tx.description || 'Unknown',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tx.id}`,
            status: 'Completed',
            date: new Date(tx.date).toLocaleDateString(), // String for display
            dateObj: new Date(tx.date), // Date object for sorting
            amount: formatCurrency(Number(tx.amount)),
            statusColor: tx.type === 'income' ? 'green' : 'yellow'
        }))
        : mockTransactions.map(tx => ({
            ...tx,
            dateObj: new Date(tx.date)
        }))

    // Sort transactions
    const displayTransactions = [...rawTransactions].sort((a, b) => {
        if (sortOrder === 'newest') {
            return b.dateObj.getTime() - a.dateObj.getTime()
        } else {
            return a.dateObj.getTime() - b.dateObj.getTime()
        }
    })

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Transactions</h3>
                <div className={styles.filterTabs}>
                    <button 
                        className={`${styles.filterTab} ${sortOrder === 'newest' ? styles.active : ''}`}
                        onClick={() => setSortOrder('newest')}
                    >
                        Newest
                    </button>
                    <button 
                        className={`${styles.filterTab} ${sortOrder === 'oldest' ? styles.active : ''}`}
                        onClick={() => setSortOrder('oldest')}
                    >
                        Oldest
                    </button>
                </div>
            </div>
            
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className={styles.textRight}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {displayTransactions.map((tx: any) => (
                        <tr key={tx.id}>
                            <td>
                                <div className={styles.txUser}>
                                    <img src={tx.image} alt={tx.name} className={styles.txAvatar} />
                                    <span>{tx.name}</span>
                                </div>
                            </td>
                            <td>
                                <span className={`${styles.statusBadge} ${styles[tx.statusColor]}`}>
                                    {tx.status}
                                </span>
                            </td>
                            <td className={styles.textGray}>{tx.date}</td>
                            <td className={`${styles.textRight} ${styles.amount}`}>{tx.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
