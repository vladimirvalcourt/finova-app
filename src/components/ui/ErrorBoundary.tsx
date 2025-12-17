'use client'

import { Component, ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.icon}>⚠️</div>
                        <h2 className={styles.title}>Something went wrong</h2>
                        <p className={styles.message}>
                            We encountered an unexpected error. Please try again.
                        </p>
                        {this.state.error && (
                            <details className={styles.details}>
                                <summary>Technical details</summary>
                                <code>{this.state.error.message}</code>
                            </details>
                        )}
                        <div className={styles.actions}>
                            <button className={styles.retryBtn} onClick={this.handleRetry}>
                                Try Again
                            </button>
                            <button
                                className={styles.homeBtn}
                                onClick={() => window.location.href = '/'}
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
