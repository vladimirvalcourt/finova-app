"use client";

import { motion } from "framer-motion";
import { Link, Search, Target, Flag } from "lucide-react";
import styles from "./BenefitsTimeline.module.css";
import { cn } from "@/lib/utils";

const STEPS = [
    {
        icon: <Link size={24} />,
        title: "Connect",
        description: "Link your accounts securely in seconds.",
    },
    {
        icon: <Search size={24} />,
        title: "Track",
        description: "See all your transactions in one place.",
    },
    {
        icon: <Target size={24} />,
        title: "Plan",
        description: "Set budgets and goals that matter to you.",
    },
    {
        icon: <Flag size={24} />,
        title: "Succeed",
        description: "Watch your net worth grow over time.",
    },
];

export function BenefitsTimeline() {
    return (
        <div className={styles.timelineContainer}>
            <div className={styles.line} />

            <div className={styles.stepsGrid}>
                {STEPS.map((step, index) => (
                    <motion.div
                        key={step.title}
                        className={styles.stepItem}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <div className={styles.iconCircle}>
                            {step.icon}
                            <div className={styles.pulse} style={{ animationDelay: `${index * 1}s` }} />
                        </div>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepDesc}>{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
