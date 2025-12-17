"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./Navbar.module.css";

export function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    return (
        <motion.header
            className={cn(styles.navbar, isScrolled && styles.scrolled)}
        >
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.logo}>
                        Finova
                    </Link>
                </div>

                <nav className={styles.navLinks}>
                    <Link href="/product" className={styles.navLink}>Product</Link>
                    <Link href="/customers" className={styles.navLink}>Customers</Link>
                    <Link href="/pricing" className={styles.navLink}>Pricing</Link>
                    <Link href="/company" className={styles.navLink}>Company</Link>
                </nav>

                <div className={styles.ctaContainer}>
                    <Link href="/login" className={styles.loginLink}>Log in</Link>
                    <Link href="/signup" className={styles.getStartedButton}>
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
