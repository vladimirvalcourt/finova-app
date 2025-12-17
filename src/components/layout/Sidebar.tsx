'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CreditCard, PieChart, Wallet, Target, Settings, LogOut, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import styles from './Sidebar.module.css'
import { clsx } from 'clsx'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: CreditCard, label: 'Transactions', href: '/dashboard/transactions' },
    { icon: PieChart, label: 'Budgets', href: '/dashboard/budgets' },
    { icon: Wallet, label: 'Accounts', href: '/dashboard/accounts' },
    { icon: Target, label: 'Goals', href: '/dashboard/goals' },
]

export function Sidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                className={styles.mobileToggle}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop Overlay */}
            <div 
                className={clsx(styles.overlay, isOpen && styles.open)}
                onClick={() => setIsOpen(false)}
            />

            <aside className={clsx(styles.sidebar, isOpen && styles.open)}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoIcon}>💰</div>
                    <h1 className={styles.logoText}>Finova</h1>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href

                        return (
                            <Link key={item.href} href={item.href} className={styles.linkContainer} onClick={() => setIsOpen(false)}>
                                <div
                                    className={clsx(styles.navItem, isActive && styles.active)}
                                >
                                    <item.icon size={20} className={isActive ? styles.iconActive : styles.icon} />
                                    <span className={styles.label}>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={styles.activeBackground}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className={styles.footer}>
                    <Link href="/settings" className={styles.navItem} onClick={() => setIsOpen(false)}>
                        <Settings size={20} className={styles.icon} />
                        <span className={styles.label}>Settings</span>
                    </Link>
                    <button className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
