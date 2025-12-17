'use client'

import React from 'react'
import { Bell, Eye, Plus, Send, TrendingUp, Car, Film, ShoppingCart, DollarSign } from 'lucide-react'
import { useRecentTransactions, useMonthlyStats } from '@/hooks/useTransactions'
import { useTotalBalance, useAccounts } from '@/hooks/useAccounts'
import { useInvestments } from '@/hooks/useInvestments'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { PremiumCard } from '@/components/dashboard/PremiumCard'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { CountUpCurrency } from '@/components/ui/CountUp'
import styles from './page.module.css'

export default function DashboardPage() {
    const { data: session } = useSession()
    const { totalBalance, isLoading: balanceLoading } = useTotalBalance()
    const { income, expenses } = useMonthlyStats()
    const { transactions } = useRecentTransactions(5)
    const { accounts } = useAccounts()
    const { totalValue: investmentValue, overallReturn: investmentReturn } = useInvestments()

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    const userName = session?.user?.name?.split(' ')[0] || 'User'
    const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'

    // Get transaction icon based on category
    const getTransactionIcon = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'transport': case 'transportation': return Car
            case 'entertainment': return Film
            case 'shopping': case 'groceries': return ShoppingCart
            default: return DollarSign
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    // Prepare chart data from monthly stats if available
    const chartData = [
        { name: 'Week 1', income: Number(income) * 0.25, expense: Number(expenses) * 0.2 },
        { name: 'Week 2', income: Number(income) * 0.25, expense: Number(expenses) * 0.3 },
        { name: 'Week 3', income: Number(income) * 0.25, expense: Number(expenses) * 0.25 },
        { name: 'Week 4', income: Number(income) * 0.25, expense: Number(expenses) * 0.25 },
    ]

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.dashboardContainer}
        >
            {/* Top Header */}
            <motion.header variants={itemVariants} className={styles.topHeader}>
                <div className={styles.headerLeft}>
                    <div>
                        <h1 className={styles.greeting}>{greeting}, {userName}</h1>
                        <p className={styles.subGreeting}>Here is your financial overview.</p>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.iconButton}>
                        <Bell size={20} />
                        <span className={styles.notificationDot}></span>
                    </button>
                    <div className={styles.profileSection}>
                        <div className={styles.profileInfo}>
                            <p className={styles.profileName}>{session?.user?.name || 'User'}</p>
                            <p className={styles.profileRole}>Premium Member</p>
                        </div>
                        <div className={styles.avatar}>
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Scrollable Content */}
            <div className={styles.scrollContent}>
                {/* Hero Stats Section */}
                <motion.div variants={itemVariants} className={styles.heroSection}>
                    <div className={styles.heroLeft}>
                        <div className={styles.balanceLabel}>
                            <span>Total Balance</span>
                            <button className={styles.visibilityBtn}>
                                <Eye size={16} />
                            </button>
                        </div>



                        <div className={styles.balanceRow}>
                            <h2 className={styles.balanceAmount}>
                                <CountUpCurrency amount={totalBalance} />
                            </h2>
                            <div className={styles.trendBadge}>
                                <TrendingUp size={14} />
                                <span>+2.4%</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.heroActions}>
                        <button className={styles.secondaryBtn}>
                            <Plus size={18} />
                            Add Money
                        </button>
                        <button className={styles.primaryBtn}>
                            <Send size={18} />
                            Send
                        </button>
                    </div>
                </motion.div>

                {/* Main Grid */}
                <div className={styles.mainGrid}>
                    {/* Left Column */}
                    <div className={styles.leftColumn}>
                        {/* My Cards Section */}
                        <motion.section variants={itemVariants} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>My Cards</h3>
                                <button className={styles.linkBtn}>Manage Cards</button>
                            </div>
                            <div className={styles.cardsGrid}>
                                {accounts.slice(0, 2).map((account, i) => (
                                    <PremiumCard key={account.id} account={account} index={i} />
                                ))}
                                {accounts.length === 0 && (
                                    <PremiumCard index={0} isEmpty />
                                )}
                            </div>
                        </motion.section>

                        {/* Cash Flow Section */}
                        <motion.section variants={itemVariants} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Cash Flow</h3>
                                <select className={styles.periodSelect}>
                                    <option>This Month</option>
                                    <option>Last Month</option>
                                    <option>Last 6 Months</option>
                                </select>
                            </div>
                            <div className={styles.chartCard}>
                                <div className={styles.chartLegend}>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDotBlue}></span>
                                        <span>Income</span>
                                    </div>
                                    <div className={styles.legendItem}>
                                        <span className={styles.legendDotGray}></span>
                                        <span>Expenses</span>
                                    </div>
                                </div>
                                <div className="h-[250px] w-full mt-4">
                                    <CashFlowChart data={chartData} />
                                </div>
                            </div>
                        </motion.section>

                        {/* Recent Activity */}
                        <motion.section variants={itemVariants} className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Recent Activity</h3>
                                <button className={styles.linkBtn}>View All</button>
                            </div>
                            <div className={styles.activityCard}>
                                {transactions.length > 0 ? transactions.map((tx) => {
                                    const Icon = getTransactionIcon(tx.category?.name || '')
                                    const isIncome = tx.type === 'income'
                                    return (
                                        <div key={tx.id} className={styles.activityItem}>
                                            <div className={styles.activityIcon}>
                                                <Icon size={20} />
                                            </div>
                                            <div className={styles.activityInfo}>
                                                <p className={styles.activityName}>{tx.description}</p>
                                                <p className={styles.activityDate}>
                                                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <span className={isIncome ? styles.amountPositive : styles.amountNegative}>
                                                {isIncome ? '+' : '-'}{formatCurrency(Math.abs(Number(tx.amount)))}
                                            </span>
                                        </div>
                                    )
                                }) : (
                                    <div className={styles.emptyActivity}>No recent transactions</div>
                                )}
                            </div>
                        </motion.section>
                    </div>

                    {/* Right Column */}
                    <div className={styles.rightColumn}>
                        {/* Upcoming Bills */}
                        <motion.section variants={itemVariants} className={styles.sideCard}>
                            <h3>Upcoming Bills</h3>
                            <div className={styles.billsList}>
                                <div className={styles.billItem}>
                                    <div className={styles.billIcon}>🏠</div>
                                    <div className={styles.billInfo}>
                                        <p className={styles.billName}>House Rent</p>
                                        <p className={styles.billDue}>Due in 2 days</p>
                                    </div>
                                    <span className={styles.billAmount}>$2,400</span>
                                </div>
                                <button className={styles.payNowBtn}>Pay Now</button>

                                <div className={styles.billItem}>
                                    <div className={styles.billIcon}>⚡</div>
                                    <div className={styles.billInfo}>
                                        <p className={styles.billName}>Electricity</p>
                                        <p className={styles.billDueOrange}>Due Oct 5</p>
                                    </div>
                                    <span className={styles.billAmount}>$120</span>
                                </div>
                                <button className={styles.scheduleBtn}>Schedule</button>
                            </div>
                        </motion.section>

                        {/* Savings Goal */}
                        <motion.section variants={itemVariants} className={styles.sideCard}>
                            <h3>Savings Goal</h3>
                            <p className={styles.goalSubtitle}>Europe Trip 2024</p>
                            <div className={styles.goalProgress}>
                                <svg className={styles.progressRing} viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#2d3748" strokeWidth="8" />
                                    <motion.circle
                                        cx="50" cy="50" r="40"
                                        fill="none"
                                        stroke="var(--primary)"
                                        strokeWidth="8"
                                        strokeDasharray="251.2"
                                        strokeDashoffset="62.8"
                                        strokeLinecap="round"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                        initial={{ strokeDashoffset: 251.2 }}
                                        animate={{ strokeDashoffset: 62.8 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </svg>
                                <div className={styles.progressText}>
                                    <span className={styles.progressPercent}>75%</span>
                                    <span className={styles.progressLabel}>Completed</span>
                                </div>
                            </div>
                            <div className={styles.goalAmounts}>
                                <span>$3,750</span>
                                <span>Target: $5,000</span>
                            </div>
                            <button className={styles.contributeBtn}>Add Contribution</button>
                        </motion.section>

                        {/* Quick Transfer */}
                        <motion.section variants={itemVariants} className={styles.quickTransferCard}>
                            <h3>Quick Transfer</h3>
                            <div className={styles.transferAvatars}>
                                <div className={styles.addAvatar}>
                                    <Plus size={18} />
                                </div>
                                <div className={styles.transferAvatar}>S</div>
                                <div className={styles.transferAvatar}>M</div>
                            </div>
                        </motion.section>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
