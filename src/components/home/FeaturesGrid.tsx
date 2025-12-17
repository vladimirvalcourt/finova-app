"use client";

import { motion } from "framer-motion";
import { PieChart, TrendingUp, Target, ShieldCheck, Smartphone, BrainCircuit } from "lucide-react";
import styles from "./FeaturesGrid.module.css";
import { PremiumCard } from "@/components/ui/PremiumCard";

const FEATURES = [
    {
        icon: <PieChart size={32} />,
        title: "Smart Budgeting",
        description: "Set budgets by category and get real-time alerts when you're approaching limits.",
        color: "hsl(250, 70%, 55%)", // Primary Purple
    },
    {
        icon: <TrendingUp size={32} />,
        title: "Insightful Analytics",
        description: "Beautiful visualizations that make understanding your spending patterns effortless.",
        color: "hsl(142, 76%, 45%)", // Success Green
    },
    {
        icon: <Target size={32} />,
        title: "Goal Tracking",
        description: "Set financial goals and watch your progress with motivating milestones.",
        color: "hsl(38, 92%, 50%)", // Warning Orange
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Bank-Level Security",
        description: "Your data is encrypted and protected with industry-leading security standards.",
        color: "hsl(210, 40%, 98%)", // White/Blue
    },
    {
        icon: <Smartphone size={32} />,
        title: "Multi-Device Sync",
        description: "Access your finances anywhere with seamless sync across all your devices.",
        color: "hsl(280, 70%, 55%)", // Pinkish Purple
    },
    {
        icon: <BrainCircuit size={32} />,
        title: "Smart Insights",
        description: "Get personalized AI recommendations to optimize your spending and savings.",
        color: "hsl(190, 90%, 50%)", // Cyan
    },
];

export function FeaturesGrid() {
    return (
        <div className={styles.gridContainer}>
            {FEATURES.map((feature, index) => (
                <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <PremiumCard className={styles.featureCard}>
                        <div className={styles.iconWrapper} style={{ color: feature.color }}>
                            <div className={styles.iconGlow} style={{ background: feature.color }} />
                            {feature.icon}
                        </div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDesc}>{feature.description}</p>
                    </PremiumCard>
                </motion.div>
            ))}
        </div>
    );
}
