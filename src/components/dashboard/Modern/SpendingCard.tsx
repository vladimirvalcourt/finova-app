'use client'

import { LucideIcon } from 'lucide-react'
import styles from './Modern.module.css'

interface SpendingItemProps {
    icon: LucideIcon
    label: string
    amount: string
    color: 'blue' | 'yellow' | 'purple' | 'green' | 'pink'
}

export function SpendingCard({ icon: Icon, label, amount, color }: SpendingItemProps) {
    return (
        <div className={`${styles.spendingCard} ${styles[`bg-${color}`]}`}>
            <div className={styles.spendingIconWrapper}>
                <Icon size={20} />
            </div>
            <div className={styles.spendingInfo}>
                <span className={styles.spendingLabel}>{label}</span>
                <span className={styles.spendingAmount}>{amount}</span>
            </div>
        </div>
    )
}
