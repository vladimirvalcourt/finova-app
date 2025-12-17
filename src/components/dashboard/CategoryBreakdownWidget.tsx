'use client'

import { useState, useMemo } from 'react'
import { ChevronRight, ChevronLeft, Layers } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import { startOfMonth, endOfMonth } from 'date-fns'
import styles from './CategoryBreakdownWidget.module.css'

interface CategoryItem {
    name: string
    icon: string
    color: string
    amount: number
    percentage: number
    transactions: number
    subcategories?: CategoryItem[]
}

export function CategoryBreakdownWidget() {
    const { transactions, isLoading } = useTransactions()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const { categories, subcategories } = useMemo(() => {
        const now = new Date()
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)

        // Get current month expenses
        const expenses = transactions.filter(t => {
            const date = new Date(t.date)
            return t.type === 'expense' && date >= monthStart && date <= monthEnd
        })

        const total = expenses.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)

        // Group by category
        const categoryMap = new Map<string, CategoryItem>()

        expenses.forEach(t => {
            const name = t.category?.name || 'Uncategorized'
            const icon = t.category?.icon || '📦'
            const color = t.category?.color || '#6366f1'

            const existing = categoryMap.get(name) || {
                name,
                icon,
                color,
                amount: 0,
                percentage: 0,
                transactions: 0,
            }

            existing.amount += Math.abs(Number(t.amount))
            existing.transactions += 1
            categoryMap.set(name, existing)
        })

        // Calculate percentages and sort
        const items: CategoryItem[] = []
        categoryMap.forEach(item => {
            item.percentage = total > 0 ? (item.amount / total) * 100 : 0
            items.push(item)
        })

        items.sort((a, b) => b.amount - a.amount)

        // Get subcategories for selected category (using transaction descriptions as proxy)
        let subs: CategoryItem[] = []
        if (selectedCategory) {
            const catExpenses = expenses.filter(t =>
                (t.category?.name || 'Uncategorized') === selectedCategory
            )

            const descMap = new Map<string, CategoryItem>()
            catExpenses.forEach(t => {
                const desc = t.description || 'Other'
                const existing = descMap.get(desc) || {
                    name: desc,
                    icon: '•',
                    color: '#6366f1',
                    amount: 0,
                    percentage: 0,
                    transactions: 0,
                }
                existing.amount += Math.abs(Number(t.amount))
                existing.transactions += 1
                descMap.set(desc, existing)
            })

            const catTotal = catExpenses.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
            descMap.forEach(item => {
                item.percentage = catTotal > 0 ? (item.amount / catTotal) * 100 : 0
                subs.push(item)
            })
            subs.sort((a, b) => b.amount - a.amount)
            subs = subs.slice(0, 5)
        }

        return { categories: items.slice(0, 5), subcategories: subs }
    }, [transactions, selectedCategory])

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Layers size={18} />
                        Category Breakdown
                    </h3>
                </div>
                <div className={styles.loading}>Loading...</div>
            </div>
        )
    }

    const displayItems = selectedCategory ? subcategories : categories
    const selectedCat = categories.find(c => c.name === selectedCategory)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {selectedCategory ? (
                    <button className={styles.backBtn} onClick={() => setSelectedCategory(null)}>
                        <ChevronLeft size={16} />
                        <span className={styles.selectedIcon}>{selectedCat?.icon}</span>
                        <span>{selectedCategory}</span>
                    </button>
                ) : (
                    <h3 className={styles.title}>
                        <Layers size={18} />
                        This Month
                    </h3>
                )}
            </div>

            {displayItems.length === 0 ? (
                <div className={styles.empty}>
                    <p>No spending data</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {displayItems.map(item => (
                        <button
                            key={item.name}
                            className={styles.item}
                            onClick={() => !selectedCategory && setSelectedCategory(item.name)}
                            disabled={!!selectedCategory}
                        >
                            <div className={styles.itemLeft}>
                                <span className={styles.itemIcon}>{item.icon}</span>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{
                                                width: `${item.percentage}%`,
                                                backgroundColor: item.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.itemRight}>
                                <span className={styles.itemAmount}>{formatCurrency(item.amount)}</span>
                                <span className={styles.itemPercent}>{item.percentage.toFixed(0)}%</span>
                                {!selectedCategory && <ChevronRight size={14} className={styles.chevron} />}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
