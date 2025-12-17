"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Activity, DollarSign, Wallet } from "lucide-react";
import styles from "./DashboardPreview.module.css";
import { cn } from "@/lib/utils";

export function DashboardPreview() {
    const [isDark, setIsDark] = useState(true);

    return (
        <div className={styles.previewContainer}>
            {/* Toggle */}
            <div className={styles.toggleWrapper}>
                <span className={styles.toggleLabel}>Theme Preview</span>
                <button
                    className={styles.themeToggle}
                    onClick={() => setIsDark(!isDark)}
                    aria-label="Toggle Preview Theme"
                >
                    <div className={cn(styles.toggleThumb, isDark ? styles.toggleRight : styles.toggleLeft)}>
                        {isDark ? <Moon size={14} /> : <Sun size={14} />}
                    </div>
                </button>
            </div>

            {/* Browser Frame */}
            <motion.div
                className={cn(styles.browserFrame, isDark ? styles.darkTheme : styles.lightTheme)}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className={styles.browserHeader}>
                    <div className={styles.dots}>
                        <div className={styles.dotRed} />
                        <div className={styles.dotYellow} />
                        <div className={styles.dotGreen} />
                    </div>
                    <div className={styles.addressBar} />
                </div>

                <div className={styles.dashboardContent}>
                    {/* Sidebar */}
                    <div className={styles.sidebar}>
                        <div className={styles.sidebarItemActive}><Activity size={18} /> Overview</div>
                        <div className={styles.sidebarItem}><Wallet size={18} /> Wallet</div>
                        <div className={styles.sidebarItem}><DollarSign size={18} /> Budget</div>
                    </div>

                    {/* Main Content */}
                    <div className={styles.mainArea}>
                        <div className={styles.headerArea}>
                            <h1>Welcome back, Alex</h1>
                        </div>

                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statLabel}>Total Balance</div>
                                <div className={styles.statValue}>$124,500.00</div>
                                <div className={styles.statChange}>+12.5%</div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statLabel}>Monthly Spending</div>
                                <div className={styles.statValue}>$2,450.00</div>
                                <div className={styles.statChangeWarn}>+2.1%</div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statLabel}>Savings Goal</div>
                                <div className={styles.statValue}>$15,000.00</div>
                                <div className={styles.statProgress}>
                                    <div className={styles.progressBar} style={{ width: '75%' }} />
                                </div>
                            </div>
                        </div>

                        {/* Chart Area Simulation */}
                        <div className={styles.chartArea}>
                            <div className={styles.chartBar} style={{ height: '40%' }} />
                            <div className={styles.chartBar} style={{ height: '60%' }} />
                            <div className={styles.chartBar} style={{ height: '45%' }} />
                            <div className={styles.chartBar} style={{ height: '70%' }} />
                            <div className={styles.chartBar} style={{ height: '55%' }} />
                            <div className={styles.chartBar} style={{ height: '80%' }} />
                            <div className={styles.chartBarActive} style={{ height: '90%' }} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
