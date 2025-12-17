import React from 'react'
import { cn } from '@/lib/utils'
import styles from './DashboardCard.module.css'

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    hoverEffect?: boolean
}

export const DashboardCard = ({ children, className, hoverEffect = true, ...props }: DashboardCardProps) => {
    return (
        <div
            className={cn(styles.card, hoverEffect && styles.hoverEffect, className)}
            {...props}
        >
            {children}
        </div>
    )
}
