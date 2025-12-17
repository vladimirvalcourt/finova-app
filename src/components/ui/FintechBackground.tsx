"use client";

import { cn } from "@/lib/utils";
import styles from "./FintechBackground.module.css";
import { ReactNode } from "react";

interface FintechBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children?: ReactNode;
}

export function FintechBackground({
    className,
    children,
    ...props
}: FintechBackgroundProps) {
    return (
        <div className={cn(styles.root, className)} {...props}>
            <div className={styles.gridContainer}>
                {/* Horizontal scanning lines */}
                <div className={styles.scanlines} />
                {/* Vertical grid lines */}
                <div className={styles.grid} />
                {/* Moving light spot */}
                <div className={styles.spotlight} />
            </div>
            {/* Radial vignette to fade edges */}
            <div className={styles.vignette} />
            <div className={styles.content}>{children}</div>
        </div>
    );
}
