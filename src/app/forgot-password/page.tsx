'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) throw error
            setSent(true)
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link href="/login" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to login
                </Link>

                {sent ? (
                    <div className={styles.success}>
                        <CheckCircle size={48} className={styles.successIcon} />
                        <h1>Check your email</h1>
                        <p>We sent a password reset link to <strong>{email}</strong></p>
                        <p className={styles.hint}>
                            Didn't receive the email? Check your spam folder or{' '}
                            <button onClick={() => setSent(false)} className={styles.retryLink}>
                                try again
                            </button>
                        </p>
                    </div>
                ) : (
                    <>
                        <div className={styles.header}>
                            <Mail size={32} className={styles.headerIcon} />
                            <h1>Forgot password?</h1>
                            <p>No worries, we'll send you reset instructions.</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.field}>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className={styles.spinner} />
                                        Sending...
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    )
}
