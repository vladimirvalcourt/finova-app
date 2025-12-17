import React from 'react'
import styles from './Card.module.css'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'gradient' | 'bordered' | 'elevated'
    padding?: 'default' | 'compact' | 'comfortable'
    hoverable?: boolean
    clickable?: boolean
    loading?: boolean
    children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'default',
            padding = 'default',
            hoverable = false,
            clickable = false,
            loading = false,
            children,
            className = '',
            ...props
        },
        ref
    ) => {
        const classNames = [
            styles.card,
            variant !== 'default' && styles[variant],
            padding !== 'default' && styles[padding],
            hoverable && styles.hoverable,
            clickable && styles.clickable,
            loading && styles.loading,
            className,
        ]
            .filter(Boolean)
            .join(' ')

        return (
            <div ref={ref} className={classNames} {...props}>
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    subtitle?: string
    action?: React.ReactNode
    children?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subtitle,
    action,
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.header} ${className}`} {...props}>
            <div>
                {title && <h3 className={styles.title}>{title}</h3>}
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                {children}
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}

CardHeader.displayName = 'CardHeader'

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export const CardBody: React.FC<CardBodyProps> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.body} ${className}`} {...props}>
            {children}
        </div>
    )
}

CardBody.displayName = 'CardBody'

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export const CardFooter: React.FC<CardFooterProps> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={`${styles.footer} ${className}`} {...props}>
            {children}
        </div>
    )
}

CardFooter.displayName = 'CardFooter'
