import React from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'link'
    size?: 'small' | 'medium' | 'large'
    fullWidth?: boolean
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'medium',
            fullWidth = false,
            loading = false,
            leftIcon,
            rightIcon,
            children,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const classNames = [
            styles.button,
            styles[variant],
            styles[size],
            fullWidth && styles.fullWidth,
            loading && styles.loading,
            className,
        ]
            .filter(Boolean)
            .join(' ')

        return (
            <button
                ref={ref}
                className={classNames}
                disabled={disabled || loading}
                {...props}
            >
                {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
                {children}
                {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
            </button>
        )
    }
)

Button.displayName = 'Button'
