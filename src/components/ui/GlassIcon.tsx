"use client";

import { ReactNode } from "react";
import styles from "./GlassIcon.module.css";
import { cn } from "@/lib/utils";

interface GlassIconProps {
    icon: ReactNode;
    className?: string;
}

export function GlassIcon({ icon, className }: GlassIconProps) {
    return (
        <div className={cn(styles.glassIcon, className)}>
            <div className={styles.iconInner}>{icon}</div>
            <div className={styles.glow} />
        </div>
    );
}
