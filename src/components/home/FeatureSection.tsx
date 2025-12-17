"use client";

import { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./FeatureSection.module.css";

interface FeatureSectionProps {
    title: string;
    description: string;
    visual: ReactNode;
    align?: "left" | "right";
    label?: string; // Small label above title (e.g. "AI-POWERED")
    ctaText?: string;
    ctaLink?: string;
}

export function FeatureSection({
    title,
    description,
    visual,
    align = "left",
    label,
    ctaText,
    ctaLink,
}: FeatureSectionProps) {
    const { scrollYProgress } = useScroll();

    // Parallax effect: Text moves slightly slower/different speed than visual
    const yText = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const yVisual = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <section className={styles.section} style={{ overflow: 'hidden' }}>
            <div className={cn(styles.container, align === "right" && styles.reverse)}>
                {/* Text Side */}
                <motion.div
                    className={styles.content}
                    style={{ y: align === 'left' ? yText : yVisual }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {label && <span className={styles.label}>{label}</span>}
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.description}>{description}</p>
                    {ctaText && ctaLink && (
                        <a href={ctaLink} className={styles.cta}>
                            {ctaText} →
                        </a>
                    )}
                </motion.div>

                {/* Visual Side */}
                <motion.div
                    className={styles.visualWrapper}
                    style={{ y: align === 'left' ? yVisual : yText }}
                    initial={{ opacity: 0, scale: 0.95, rotate: align === 'left' ? 1 : -1 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <div className={styles.visualInner}>{visual}</div>
                </motion.div>
            </div>
        </section>
    );
}
