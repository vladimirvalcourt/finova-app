'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnectionPage() {
    const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing')
    const [tables, setTables] = useState<string[]>([])
    const [error, setError] = useState<string>('')

    useEffect(() => {
        testConnection()
    }, [])

    async function testConnection() {
        try {
            // Test 1: Check connection
            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('count')
                .limit(1)

            if (usersError) throw usersError

            // List of all expected tables
            const tableNames = [
                'users',
                'accounts',
                'transactions',
                'categories',
                'budgets',
                'goals',
                'nationality_configs',
                'remittances',
                'category_translations',
                'ai_insights',
                'category_corrections',
                'ai_category_cache',
                'receipts',
                'ai_coaching_sessions',
                'spending_patterns',
                'ai_feature_usage',
            ]

            setTables(tableNames)
            setStatus('success')
        } catch (err: any) {
            setError(err.message)
            setStatus('error')
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                🔌 Supabase Connection Test
            </h1>

            {status === 'testing' && (
                <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                    <p>⏳ Testing connection...</p>
                </div>
            )}

            {status === 'success' && (
                <div style={{ padding: '1rem', background: '#d1fae5', borderRadius: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        ✅ Connection Successful!
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Your Supabase database is connected and ready to use.
                    </p>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Tables Found ({tables.length}):
                    </h3>
                    <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
                        {tables.map((table) => (
                            <li key={table} style={{ marginBottom: '0.25rem' }}>
                                {table}
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: '2rem', padding: '1rem', background: '#e0e7ff', borderRadius: '0.5rem' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            🎉 Next Steps:
                        </h3>
                        <ol style={{ listStyle: 'decimal', paddingLeft: '2rem' }}>
                            <li>Create a test user at /auth-example</li>
                            <li>Start adding real data to the dashboard</li>
                            <li>Build authentication pages</li>
                            <li>Add charts and visualizations</li>
                        </ol>
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#dc2626' }}>
                        ❌ Connection Error
                    </h2>
                    <p style={{ marginBottom: '1rem' }}>
                        There was an error connecting to Supabase:
                    </p>
                    <pre style={{ padding: '1rem', background: '#1f2937', color: '#f3f4f6', borderRadius: '0.25rem', overflow: 'auto' }}>
                        {error}
                    </pre>
                    <div style={{ marginTop: '1rem' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Troubleshooting:
                        </h3>
                        <ul style={{ listStyle: 'disc', paddingLeft: '2rem' }}>
                            <li>Check your .env.local file has correct credentials</li>
                            <li>Verify you ran all 3 SQL migration files</li>
                            <li>Check Supabase dashboard for errors</li>
                            <li>Restart your dev server (npm run dev)</li>
                        </ul>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Connection Details:
                </h3>
                <p style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
                </p>
                <p style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...
                </p>
            </div>
        </div>
    )
}
