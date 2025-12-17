import React from 'react'
import styles from './Input.module.css'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    icon?: React.ReactNode
    inputSize?: 'small' | 'medium' | 'large'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            icon,
            inputSize = 'medium',
            className = '',
            ...props
        },
        ref
    ) => {
        const inputClassNames = [
            styles.input,
            icon && styles.inputWithIcon,
            error && styles.error,
            inputSize !== 'medium' && styles[inputSize],
            className,
        ]
            .filter(Boolean)
            .join(' ')

        return (
            <div className={styles.wrapper}>
                {label && <label className={styles.label}>{label}</label>}
                <div style={{ position: 'relative' }}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <input ref={ref} className={inputClassNames} {...props} />
                </div>
                {error && <p className={styles.errorText}>{error}</p>}
                {!error && helperText && <p className={styles.helperText}>{helperText}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'
