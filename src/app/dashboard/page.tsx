'use client'

import React from 'react'
import { Bell, Eye, Plus, Send, TrendingUp, Car, Film, ShoppingCart, DollarSign } from 'lucide-react'
import { useRecentTransactions, useMonthlyStats } from '@/hooks/useTransactions'
import { useTotalBalance, useAccounts } from '@/hooks/useAccounts'
import { useInvestments } from '@/hooks/useInvestments'
import { useSession } from 'next-auth/react'
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

    return (
        <div className={styles.dashboardContainer}>
            {/* Top Header */}
            <header className={styles.topHeader}>
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
            </header>

            {/* Scrollable Content */}
            <div className={styles.scrollContent}>
                {/* Hero Stats Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroLeft}>
                        <div className={styles.balanceLabel}>
                            <span>Total Balance</span>
                            <button className={styles.visibilityBtn}>
                                <Eye size={16} />
                            </button>
                        </div>
                        <div className={styles.balanceRow}>
                            <h2 className={styles.balanceAmount}>{formatCurrency(totalBalance)}</h2>
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
                </div>

                {/* Main Grid */}
                <div className={styles.mainGrid}>
                    {/* Left Column */}
                    <div className={styles.leftColumn}>
                        {/* My Cards Section */}
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>My Cards</h3>
                                <button className={styles.linkBtn}>Manage Cards</button>
                            </div>
                            <div className={styles.cardsGrid}>
                                {accounts.slice(0, 2).map((account, i) => (
                                    <div key={account.id} className={i === 0 ? styles.cardPrimary : styles.cardSecondary}>
                                        <div className={styles.cardTop}>
                                            <div>
                                                <span className={styles.cardLabel}>Current Balance</span>
                                                <span className={styles.cardBalance}>{formatCurrency(Number(account.balance))}</span>
                                            </div>
                                            <div className={styles.cardLogo}>
                                                {i === 0 ? 'VISA' : '••'}
                                            </div>
                                        </div>
                                        <div className={styles.cardBottom}>
                                            <div className={styles.cardNumber}>
                                                <span>••••</span>
                                                <span>••••</span>
                                                <span>••••</span>
                                                <span>{account.id.slice(-4)}</span>
                                            </div>
                                            <div className={styles.cardInfo}>
                                                <div>
                                                    <span className={styles.cardInfoLabel}>Card Holder</span>
                                                    <span className={styles.cardInfoValue}>{userName}</span>
                                                </div>
                                                <div>
                                                    <span className={styles.cardInfoLabel}>Expires</span>
                                                    <span className={styles.cardInfoValue}>12/26</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {accounts.length === 0 && (
                                    <div className={styles.emptyCard}>
                                        <Plus size={24} />
                                        <span>Add your first card</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Cash Flow Section */}
                        <section className={styles.section}>
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
                                <div className={styles.chartBars}>
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                                        <div key={day} className={styles.barGroup}>
                                            <div className={styles.bars}>
                                                <div className={styles.barExpense} style={{ height: `${30 + Math.random() * 40}%` }}></div>
                                                <div className={styles.barIncome} style={{ height: `${40 + Math.random() * 45}%` }}></div>
                                            </div>
                                            <span className={styles.barLabel}>{day}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Recent Activity */}
                        <section className={styles.section}>
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
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className={styles.rightColumn}>
                        {/* Upcoming Bills */}
                        <section className={styles.sideCard}>
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
                        </section>

                        {/* Savings Goal */}
                        <section className={styles.sideCard}>
                            <h3>Savings Goal</h3>
                            <p className={styles.goalSubtitle}>Europe Trip 2024</p>
                            <div className={styles.goalProgress}>
                                <svg className={styles.progressRing} viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#2d3748" strokeWidth="8" />
                                    <circle 
                                        cx="50" cy="50" r="40" 
                                        fill="none" 
                                        stroke="var(--primary)" 
                                        strokeWidth="8"
                                        strokeDasharray="251.2"
                                        strokeDashoffset="62.8"
                                        strokeLinecap="round"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
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
                        </section>

                        {/* Quick Transfer */}
                        <section className={styles.quickTransferCard}>
                            <h3>Quick Transfer</h3>
                            <div className={styles.transferAvatars}>
                                <div className={styles.addAvatar}>
                                    <Plus size={18} />
                                </div>
                                <div className={styles.transferAvatar}>S</div>
                                <div className={styles.transferAvatar}>M</div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
