'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import styles from './GlassCard.module.css'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface GlassCardProps {
    children: ReactNode
    className?: string
    hoverEffect?: boolean
    onClick?: () => void
}

export function GlassCard({
    children,
    className,
    hoverEffect = false,
    onClick
}: GlassCardProps) {
    return (
        <motion.div
            className={cn(styles.card, className)}
            whileHover={hoverEffect ? {
                y: -5,
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                borderColor: 'rgba(255,255,255,0.2)'
            } : {}}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={onClick}
        >
            <div className={styles.shine} />
            {children}
        </motion.div>
    )
}

export function GlassHeader({ title, subtitle, action }: { title: string, subtitle?: string, action?: ReactNode }) {
    return (
        <div className={styles.header}>
            <div>
                <h3 className={styles.title}>{title}</h3>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {action && <div className={styles.action}>{action}</div>}
        </div>
    )
}

export function GlassBody({ children, className }: { children: ReactNode, className?: string }) {
    return <div className={cn(styles.body, className)}>{children}</div>
}
