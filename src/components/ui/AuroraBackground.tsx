"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./AuroraBackground.module.css";
import { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children?: ReactNode;
    showRadial?: boolean;
}

export function AuroraBackground({
    className,
    children,
    showRadial = true,
    ...props
}: AuroraBackgroundProps) {
    return (
        <div className={cn(styles.root, className)} {...props}>
            <div className={styles.auroraContainer}>
                <div className={styles.aurora} />
            </div>
            {showRadial && <div className={styles.radialOverlay} />}
            <div className={styles.content}>{children}</div>
        </div>
    );
}
