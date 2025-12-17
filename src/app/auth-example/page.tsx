'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'

export default function AuthExample() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setMessage(`Error: ${error.message}`)
        } else {
            setMessage('Success! Check your email for confirmation.')
        }
        setLoading(false)
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(`Error: ${error.message}`)
        } else {
            setMessage('Signed in successfully!')
            // Redirect to dashboard
            window.location.href = '/dashboard'
        }
        setLoading(false)
    }

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        })

        if (error) {
            setMessage(`Error: ${error.message}`)
        }
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setMessage('Signed out successfully!')
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-background)',
            padding: 'var(--spacing-6)',
        }}>
            <Card style={{ maxWidth: '400px', width: '100%' }}>
                <CardHeader title="🔐 Sign In to Finova" />
                <CardBody>
                    <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {message && (
                            <div style={{
                                padding: 'var(--spacing-3)',
                                borderRadius: 'var(--radius-lg)',
                                background: message.includes('Error') ? 'var(--color-danger-50)' : 'var(--color-success-50)',
                                color: message.includes('Error') ? 'var(--color-danger-700)' : 'var(--color-success-700)',
                                fontSize: 'var(--font-size-sm)',
                            }}>
                                {message}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            <Button type="submit" variant="primary" fullWidth loading={loading}>
                                Sign In
                            </Button>
                            <Button type="button" variant="secondary" fullWidth onClick={handleSignUp} loading={loading}>
                                Sign Up
                            </Button>
                        </div>

                        <div style={{ position: 'relative', textAlign: 'center', margin: 'var(--spacing-2) 0' }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'var(--color-border)',
                            }} />
                            <span style={{
                                position: 'relative',
                                background: 'var(--color-surface-elevated)',
                                padding: '0 var(--spacing-3)',
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)',
                            }}>
                                or
                            </span>
                        </div>

                        <Button type="button" variant="secondary" fullWidth onClick={handleGoogleSignIn}>
                            <span style={{ fontSize: '1.2rem' }}>🔍</span>
                            Continue with Google
                        </Button>
                    </form>

                    <div style={{ marginTop: 'var(--spacing-6)', textAlign: 'center' }}>
                        <Button variant="link" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
