'use client'

import { animate, useInView, useIsomorphicLayoutEffect, useMotionValue } from 'framer-motion'
import { useRef } from 'react'

interface CountUpProps {
    to: number
    from?: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
    className?: string
}

export function CountUp({
    to,
    from = 0,
    duration = 1.5,
    prefix = '',
    suffix = '',
    decimals = 0,
    className = ''
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })
    const value = useMotionValue(from)

    useIsomorphicLayoutEffect(() => {
        if (inView) {
            const controls = animate(value, to, {
                duration,
                ease: "easeOut",
                onUpdate: (latest) => {
                    if (ref.current) {
                        ref.current.textContent = prefix + latest.toFixed(decimals) + suffix
                    }
                }
            })
            return controls.stop
        }
    }, [inView, to, from, duration, decimals, prefix, suffix, value])

    // Handle currency formatting if needed inside the component or outside
    // For simplicity, we just use text update. If complex formatting is needed, 
    // we can use Intl inside onUpdate but it's heavier.

    return <span ref={ref} className={className} />
}

// Specialized component for Currency to handle the formatting correctly
export function CountUpCurrency({
    amount,
    className = ''
}: { amount: number, className?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })
    const value = useMotionValue(0)

    useIsomorphicLayoutEffect(() => {
        if (inView) {
            animate(value, amount, {
                duration: 2,
                ease: [0.22, 1, 0.36, 1], // Custom cubic bezier
                onUpdate: (latest) => {
                    if (ref.current) {
                        ref.current.textContent = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0
                        }).format(latest)
                    }
                }
            })
        }
    }, [inView, amount, value])

    return <span ref={ref} className={className}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(0)}</span>
}
