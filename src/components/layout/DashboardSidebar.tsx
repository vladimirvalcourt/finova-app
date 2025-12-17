'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Target, Wallet, Settings, LogOut } from 'lucide-react'
import styles from './DashboardSidebar.module.css'

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { href: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { href: '/dashboard/accounts', icon: Wallet, label: 'Accounts' },
    { href: '/dashboard/budgets', icon: PiggyBank, label: 'Budgets' },
    { href: '/dashboard/goals', icon: Target, label: 'Goals' },
]

export function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span className={styles.logoIcon}>💎</span>
                <span className={styles.logoText}>Finova</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map(item => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className={styles.footer}>
                <Link href="/settings" className={styles.navItem}>
                    <Settings size={18} />
                    <span>Settings</span>
                </Link>
                <button className={styles.navItem}>
                    <LogOut size={18} />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    )
}
