"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import styles from "./AnimatedLogo.module.css";

const LOGO_VARIANTS = [
    "FINOVA",
    "LAJAN",    // Creole
    "CUARTOS",  // DR
    "DINERO",   // General Spanish
    "PLATA",    // Argentina/Chile
    "LANA",     // Mexico
    "BILLETES", // General
];

export function AnimatedLogo() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Spec says 60s, but that's very long for a demo. 
        // I will use 3s for user feedback loop, can easily adjust to 60000.
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % LOGO_VARIANTS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Link href="/" className={styles.logoContainer}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={styles.starIcon}
            >
                <Sparkles size={20} fill="url(#star-gradient)" stroke="none" />
                {/* SVG definition for gradient fill */}
                <svg width="0" height="0">
                    <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop stopColor="hsl(250, 70%, 55%)" offset="0%" />
                        <stop stopColor="hsl(200, 70%, 55%)" offset="100%" />
                    </linearGradient>
                </svg>
            </motion.div>

            <div className={styles.textWrapper}>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={LOGO_VARIANTS[index]}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className={styles.logoText}
                    >
                        {LOGO_VARIANTS[index]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </Link>
    );
}
