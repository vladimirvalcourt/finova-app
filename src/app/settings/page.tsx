'use client'

import { useState, useEffect } from 'react'
import { User, Globe, Bell, Shield, Palette, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

const LANGUAGES = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽' },
    { code: 'es-AR', name: 'Español (Argentina)', flag: '🇦🇷' },
    { code: 'es-CO', name: 'Español (Colombia)', flag: '🇨🇴' },
    { code: 'ht-HT', name: 'Kreyòl Ayisyen', flag: '🇭🇹' },
]

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [language, setLanguage] = useState('en-US')
    const [notifications, setNotifications] = useState({
        billReminders: true,
        goalProgress: true,
        weeklyReport: false,
        budgetAlerts: true,
    })

    useEffect(() => {
        const saved = localStorage.getItem('finova-lang')
        if (saved) setLanguage(saved)
    }, [])

    const handleLanguageChange = (code: string) => {
        setLanguage(code)
        localStorage.setItem('finova-lang', code)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'language', label: 'Language', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ]

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Settings</h1>
                <p>Manage your account preferences</p>
            </header>

            <div className={styles.layout}>
                {/* Sidebar */}
                <nav className={styles.sidebar}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                    <div className={styles.divider} />
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </nav>

                {/* Content */}
                <div className={styles.content}>
                    {activeTab === 'profile' && (
                        <div className={styles.section}>
                            <h2>Profile</h2>
                            <div className={styles.avatar}>VV</div>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" placeholder="Your name" defaultValue="" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input type="email" placeholder="you@example.com" disabled />
                            </div>
                            <button className={styles.saveBtn}>Save Changes</button>
                        </div>
                    )}

                    {activeTab === 'language' && (
                        <div className={styles.section}>
                            <h2>Language</h2>
                            <p className={styles.hint}>Choose your preferred language for the app.</p>
                            <div className={styles.languageGrid}>
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        className={`${styles.langOption} ${language === lang.code ? styles.selected : ''}`}
                                        onClick={() => handleLanguageChange(lang.code)}
                                    >
                                        <span className={styles.flag}>{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={styles.section}>
                            <h2>Notifications</h2>
                            <div className={styles.toggleList}>
                                <label className={styles.toggle}>
                                    <span>Bill reminders</span>
                                    <input
                                        type="checkbox"
                                        checked={notifications.billReminders}
                                        onChange={e => setNotifications({ ...notifications, billReminders: e.target.checked })}
                                    />
                                </label>
                                <label className={styles.toggle}>
                                    <span>Goal progress updates</span>
                                    <input
                                        type="checkbox"
                                        checked={notifications.goalProgress}
                                        onChange={e => setNotifications({ ...notifications, goalProgress: e.target.checked })}
                                    />
                                </label>
                                <label className={styles.toggle}>
                                    <span>Weekly spending report</span>
                                    <input
                                        type="checkbox"
                                        checked={notifications.weeklyReport}
                                        onChange={e => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                                    />
                                </label>
                                <label className={styles.toggle}>
                                    <span>Budget alerts</span>
                                    <input
                                        type="checkbox"
                                        checked={notifications.budgetAlerts}
                                        onChange={e => setNotifications({ ...notifications, budgetAlerts: e.target.checked })}
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className={styles.section}>
                            <h2>Security</h2>
                            <button className={styles.actionBtn}>Change Password</button>
                            <button className={styles.actionBtn}>Enable Two-Factor Authentication</button>
                            <div className={styles.dangerZone}>
                                <h3>Danger Zone</h3>
                                <button className={styles.dangerBtn}>Delete Account</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className={styles.section}>
                            <h2>Appearance</h2>
                            <p className={styles.hint}>Theme customization coming soon.</p>
                            <div className={styles.themePreview}>
                                <div className={styles.themeDark}>Dark (Current)</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
