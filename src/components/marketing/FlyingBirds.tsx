'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Bird SVG path - simple V-shape bird silhouette
const BirdPath = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
        <path d="M12 4C10 6 6 8 2 8C6 10 10 10 12 8C14 10 18 10 22 8C18 8 14 6 12 4Z" />
    </svg>
)

interface BirdProps {
    delay: number;
    duration: number;
    startY: number;
    size: number;
    opacity: number;
}

const Bird = ({ delay, duration, startY, size, opacity }: BirdProps) => {
    return (
        <motion.div
            style={{
                position: 'absolute',
                top: `${startY}%`,
                left: '-50px',
                width: `${size}px`,
                height: `${size}px`,
                color: 'rgba(0, 0, 0, 0.15)',
                opacity: opacity,
                pointerEvents: 'none'
            }}
            animate={{
                x: ['0vw', '110vw'],
                y: [0, Math.sin(delay) * 30, 0, Math.sin(delay + 1) * -20, 0],
            }}
            transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: 'linear',
            }}
        >
            {/* Wing flapping animation */}
            <motion.div
                animate={{ scaleY: [1, 0.6, 1] }}
                transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            >
                <BirdPath />
            </motion.div>
        </motion.div>
    )
}

export function FlyingBirds() {
    // Create multiple birds with different properties - BIGGER sizes
    const birds: BirdProps[] = [
        { delay: 0, duration: 15, startY: 15, size: 45, opacity: 0.35 },
        { delay: 2, duration: 18, startY: 25, size: 35, opacity: 0.3 },
        { delay: 4, duration: 12, startY: 10, size: 55, opacity: 0.4 },
        { delay: 6, duration: 20, startY: 35, size: 40, opacity: 0.35 },
        { delay: 8, duration: 14, startY: 20, size: 50, opacity: 0.4 },
        { delay: 10, duration: 16, startY: 30, size: 30, opacity: 0.25 },
        { delay: 12, duration: 22, startY: 8, size: 45, opacity: 0.35 },
        { delay: 14, duration: 13, startY: 40, size: 38, opacity: 0.3 },
    ]

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'hidden'
        }}>
            {birds.map((bird, index) => (
                <Bird key={index} {...bird} />
            ))}
        </div>
    )
}
