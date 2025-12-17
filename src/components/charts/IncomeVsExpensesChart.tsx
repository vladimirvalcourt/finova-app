'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface IncomeVsExpensesChartProps {
    data: Array<{
        date: string
        income: number
        expenses: number
    }>
}

export function IncomeVsExpensesChart({ data }: IncomeVsExpensesChartProps) {
    if (!data || data.length === 0) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)'
            }}>
                No transaction data available
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                    dataKey="date"
                    stroke="var(--color-text-secondary)"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="var(--color-text-secondary)"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '$0.00'}
                    contentStyle={{
                        background: 'var(--color-surface-elevated)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-3)',
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
