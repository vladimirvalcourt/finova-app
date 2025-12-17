"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import styles from "./SocialProof.module.css";
import { PremiumCard } from "@/components/ui/PremiumCard";

const TESTIMONIALS = [
    {
        name: "Sarah Jenkins",
        role: "Freelance Designer",
        text: "Finova completely changed how I manage my irregular income. The visuals make it actually fun to budget.",
        rating: 5,
    },
    {
        name: "David Chen",
        role: "Software Engineer",
        text: "The investment tracking is top-notch. I love seeing my net worth grow in real-time across all accounts.",
        rating: 5,
    },
    {
        name: "Elena Rodriguez",
        role: "Small Business Owner",
        text: "Finally, a finance app that speaks my language. The Spanish support is perfect for my family.",
        rating: 5,
    },
];

const STATS = [
    { value: "50k+", label: "Active Users" },
    { value: "$10M+", label: "Money Saved" },
    { value: "4.9", label: "App Rating" },
];

export function SocialProof() {
    return (
        <div className={styles.container}>
            {/* Stats Row */}
            <div className={styles.statsRow}>
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className={styles.statItem}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statLabel}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Testimonials */}
            <div className={styles.testimonialGrid}>
                {TESTIMONIALS.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                    >
                        <PremiumCard className={styles.testimonialCard}>
                            <div className={styles.stars}>
                                {[...Array(t.rating)].map((_, idx) => (
                                    <Star key={idx} size={16} fill="currentColor" className="text-yellow-400" />
                                ))}
                            </div>
                            <p className={styles.quote}>"{t.text}"</p>
                            <div className={styles.author}>
                                <div className={styles.authorAvatar}>{t.name[0]}</div>
                                <div>
                                    <div className={styles.authorName}>{t.name}</div>
                                    <div className={styles.authorRole}>{t.role}</div>
                                </div>
                            </div>
                        </PremiumCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
