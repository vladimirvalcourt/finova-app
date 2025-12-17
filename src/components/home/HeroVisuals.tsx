"use client";

import { motion } from "framer-motion";
import { TrendingUp, Shield, PieChart } from "lucide-react";
import styles from "./HeroVisuals.module.css";
import { PremiumCard } from "@/components/ui/PremiumCard";

export function HeroVisuals() {
    return (
        <div className={styles.container}>
            {/* Main Dashboard Card (Center/Back) */}
            <motion.div
                className={styles.mainCardWrapper}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <PremiumCard className={styles.mainCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.circle} />
                        <div className={styles.lineLong} />
                    </div>
                    <div className={styles.graphArea}>
                        {/* Simulated Graph */}
                        <svg viewBox="0 0 400 200" className={styles.graphSvg}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="hsl(250, 70%, 55%)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="hsl(250, 70%, 55%)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,150 C50,150 100,100 150,120 C200,140 250,50 300,80 C350,110 380,20 400,10 V200 H0 Z" fill="url(#chartGradient)" />
                            <path d="M0,150 C50,150 100,100 150,120 C200,140 250,50 300,80 C350,110 380,20 400,10" fill="none" stroke="hsl(250, 70%, 55%)" strokeWidth="3" />
                        </svg>
                    </div>
                </PremiumCard>
            </motion.div>

            {/* Floating Stats Card 1 (Left) */}
            <motion.div
                className={styles.floatCardLeft}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <div className={styles.glassPill}>
                    <div className={styles.iconBoxSuccess}>
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <div className={styles.label}>Total Savings</div>
                        <div className={styles.value}>$24,500</div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Stats Card 2 (Right) */}
            <motion.div
                className={styles.floatCardRight}
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <div className={styles.glassPill}>
                    <div className={styles.iconBoxPrimary}>
                        <PieChart size={20} />
                    </div>
                    <div>
                        <div className={styles.label}>Monthly Budget</div>
                        <div className={styles.value}>On Track</div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Stats Card 3 (Bottom) */}
            <motion.div
                className={styles.floatCardBottom}
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
                <div className={styles.glassPill}>
                    <div className={styles.iconBoxWarning}>
                        <Shield size={20} />
                    </div>
                    <div>
                        <div className={styles.label}>Security</div>
                        <div className={styles.value}>Verified</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
