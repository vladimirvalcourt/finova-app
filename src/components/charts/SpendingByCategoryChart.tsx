'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface SpendingByCategoryChartProps {
    data: Array<{
        name: string
        value: number
        color: string
    }>
}

const COLORS = [
    '#6366f1', // Primary
    '#10b981', // Success
    '#f59e0b', // Warning
    '#ef4444', // Danger
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#f97316', // Orange
]

export function SpendingByCategoryChart({ data }: SpendingByCategoryChartProps) {
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
                No spending data available
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => percent ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color || COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '$0.00'}
                    contentStyle={{
                        background: 'var(--color-surface-elevated)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-3)',
                    }}
                />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                />
            </PieChart>
        </ResponsiveContainer>
    )
}
