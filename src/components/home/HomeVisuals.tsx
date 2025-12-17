"use client";

import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/PremiumCard";
import styles from "./HomeVisuals.module.css";
import { Wallet, TrendingUp, Shield, PieChart, MessageSquare, CreditCard } from "lucide-react";

/**
 * Visual for "Track everything"
 * A list of accounts with balances.
 */
export function VisualTrackEverything() {
    return (
        <div className={styles.visualContainer}>
            <PremiumCard className={styles.cardList}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Net Worth</span>
                    <span className={styles.cardValue}>$1,240,500</span>
                </div>
                <div className={styles.accountRow}>
                    <div className={styles.iconBox}><Wallet size={16} /></div>
                    <div className={styles.rowInfo}>
                        <span>Cash</span>
                        <span className={styles.rowSub}>Chase, BoA</span>
                    </div>
                    <span>$45,200</span>
                </div>
                <div className={styles.accountRow}>
                    <div className={styles.iconBox}><TrendingUp size={16} /></div>
                    <div className={styles.rowInfo}>
                        <span>Investments</span>
                        <span className={styles.rowSub}>Vanguard, Robinhood</span>
                    </div>
                    <span>$850,300</span>
                </div>
                <div className={styles.accountRow}>
                    <div className={styles.iconBox}><Shield size={16} /></div>
                    <div className={styles.rowInfo}>
                        <span>Real Estate</span>
                        <span className={styles.rowSub}>Primary Residence</span>
                    </div>
                    <span>$345,000</span>
                </div>
            </PremiumCard>
        </div>
    );
}

/**
 * Visual for "Stop overspending"
 * A credit card and a spending alert.
 */
export function VisualOverspending() {
    return (
        <div className={styles.visualContainer}>
            <div className={styles.floatingCard}>
                <div className={styles.glassCreditCard}>
                    <div className={styles.cardChip} />
                    <div className={styles.cardLast4}>•••• 4291</div>
                    <div className={styles.cardHolder}>VLADIMIR V.</div>
                </div>
            </div>
            <motion.div
                className={styles.alertBox}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className={styles.alertIcon}><CreditCard size={14} /></div>
                <div>
                    <div className={styles.alertTitle}>High Spending Alert</div>
                    <div className={styles.alertText}>You've exceeded your dining budget.</div>
                </div>
            </motion.div>
        </div>
    );
}

/**
 * Visual for "Origin AI"
 * A chat interface.
 */
export function VisualOriginAI() {
    return (
        <div className={styles.visualContainer}>
            <PremiumCard className={styles.chatInterface}>
                <div className={styles.chatMessageAi}>
                    <div className={styles.aiAvatar}>AI</div>
                    <div className={styles.messageText}>
                        Based on your spending, you can save $450/mo by switching subscriptions.
                    </div>
                </div>
                <div className={styles.chatMessageUser}>
                    <div className={styles.messageText}>Show me the details.</div>
                </div>
                <div className={styles.chatInput}>
                    <div className={styles.placeholder}>Ask Finova anything...</div>
                    <div className={styles.sendBtn}>→</div>
                </div>
            </PremiumCard>
        </div>
    );
}

/**
 * Visual for "Forecast Future"
 * A simple line chart visualization.
 */
export function VisualForecast() {
    return (
        <div className={styles.visualContainer}>
            <PremiumCard className={styles.chartCard}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Projected Wealth</span>
                    <span className={styles.cardValue}>$3.2M by 2040</span>
                </div>
                <div className={styles.chartArea}>
                    {/* CSS Line Chart simulation */}
                    <svg viewBox="0 0 100 50" className={styles.svgChart}>
                        <motion.path
                            d="M0,50 Q25,40 50,30 T100,20"
                            fill="none"
                            stroke="var(--foreground)"
                            strokeWidth="2"
                            className={styles.chartLine}
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <path
                            d="M0,50 Q25,40 50,30 T100,20 V50 H0 Z"
                            fill="url(#gradient)"
                            opacity="0.1"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--foreground)" stopOpacity="1" />
                                <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </PremiumCard>
        </div>
    );
}

/**
 * Visual for "Invest with Intention"
 * Portfolio breakdown pie chart style.
 */
export function VisualInvestIntention() {
    return (
        <div className={styles.visualContainer}>
            <PremiumCard className={styles.chartCard}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardTitle}>Asset Allocation</span>
                </div>
                <div className={styles.pieContainer}>
                    <div className={styles.pieChart}>
                        <div className={styles.pieSegment1} />
                        <div className={styles.pieSegment2} />
                        <div className={styles.pieInner} />
                    </div>
                    <div className={styles.pieLegend}>
                        <div className={styles.legendItem}><div className={styles.dot1} /><span>US Stock</span></div>
                        <div className={styles.legendItem}><div className={styles.dot2} /><span>Intl Stock</span></div>
                        <div className={styles.legendItem}><div className={styles.dot3} /><span>Bonds</span></div>
                    </div>
                </div>
            </PremiumCard>
        </div>
    );
}

/**
 * Visual for "Net Worth"
 * A big number and a rising graph.
 */
// Helper for animated numbers
function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onViewportEnter={(entry) => {
                // In a real app we'd use useSpring/useTransform for counting
            }}
        >
            {prefix}{value.toLocaleString()}
        </motion.span>
    )
}

/**
 * Visual for "Net Worth"
 * A big number and a rising graph.
 */
export function VisualNetWorth() {
    return (
        <div className={styles.visualContainer}>
            <PremiumCard className={styles.netWorthCard}>
                <div className={styles.nwLabel}>TOTAL NET WORTH</div>
                <div className={styles.nwValue}>
                    {/* Simple entry animation for now */}
                    <motion.span
                        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        $1,240,500
                    </motion.span>
                </div>
                <div className={styles.nwChange}>+12.4% last year</div>
                <div className={styles.nwGraph}>
                    {[40, 55, 45, 70, 85, 100].map((h, i) => (
                        <motion.div
                            key={i}
                            className={styles.nwBar}
                            style={{ height: `${h}%` }}
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1, ease: "backOut" }}
                        />
                    ))}
                </div>
            </PremiumCard>
        </div>
    );
}
