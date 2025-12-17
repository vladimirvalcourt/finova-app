'use client'

import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface CashFlowChartProps {
    data: any[]
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

export function CashFlowChart({ data }: CashFlowChartProps) {
    // Generate some mock data if empty for demo, smoothly curving
    const chartData = data.length > 0 ? data : [
        { name: 'Mon', income: 4000, expense: 2400 },
        { name: 'Tue', income: 3000, expense: 1398 },
        { name: 'Wed', income: 2000, expense: 9800 },
        { name: 'Thu', income: 2780, expense: 3908 },
        { name: 'Fri', income: 1890, expense: 4800 },
        { name: 'Sat', income: 2390, expense: 3800 },
        { name: 'Sun', income: 3490, expense: 4300 },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="h-[300px] w-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        hide
                        domain={['dataMin - 1000', 'dataMax + 1000']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                        formatter={(value: number | undefined) => formatCurrency(value || 0)}
                    />
                    <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="url(#colorIncome)"
                        animationDuration={2000}
                    />
                    <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        fill="url(#colorExpense)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    )
}
