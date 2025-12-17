'use client'

import { ArrowUpRight } from 'lucide-react'
import styles from './Modern.module.css'

interface CardProps {
    title: string
    amount: string
    trend: string
    color: 'blue' | 'yellow' | 'green'
}

export function SummaryCard({ title, amount, trend, color }: CardProps) {
    return (
        <div className={`${styles.summaryCard} ${styles[color]}`}>
            <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{title}</span>
                <div className={styles.iconWrapper}>
                    <ArrowUpRight size={18} />
                </div>
            </div>
            <div className={styles.cardAmount}>{amount}</div>
            <div className={styles.cardTrend}>{trend}</div>
        </div>
    )
}
