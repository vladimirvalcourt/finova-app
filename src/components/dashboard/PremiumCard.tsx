'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'

interface PremiumCardProps {
    account?: any
    index: number
    isEmpty?: boolean
}

export function PremiumCard({ account, index, isEmpty }: PremiumCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    // Mouse position logic for tilt
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useMotionTemplate`calc(${mouseYSpring} * -0.5deg)`
    const rotateY = useMotionTemplate`calc(${mouseXSpring} * 0.5deg)`

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()

        const width = rect.width
        const height = rect.height

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct * 20) // Sensitivity of tilt
        y.set(yPct * 20)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    if (isEmpty) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex h-[200px] w-full min-w-[320px] items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100/80 transition-colors"
            >
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Plus size={32} />
                    <span className="font-medium">Add New Card</span>
                </div>
            </motion.div>
        )
    }

    // Dynamic gradient based on index/type
    const getBackground = (idx: number) => {
        if (idx === 0) return "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800"
        return "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
            className={`cursor-pointer group relative h-[200px] w-full min-w-[320px] overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-500`}
        >
            <div
                className={`absolute inset-0 ${getBackground(index)}`}
            />

            {/* Shine Overlay */}
            <motion.div
                style={{
                    background: useMotionTemplate`radial-gradient(
                        600px circle at ${mouseXSpring}px ${mouseYSpring}px,
                        rgba(255,255,255,0.15),
                        transparent 40%
                    )`,
                }}
                className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />

            {/* Card Content - Translated for depth */}
            <div
                style={{ transform: "translateZ(30px)" }}
                className="relative z-20 flex h-full flex-col justify-between p-6 text-white"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-white/70">Current Balance</p>
                        <h3 className="text-2xl font-bold tracking-tight mt-1">
                            {formatCurrency(Number(account.balance))}
                        </h3>
                    </div>
                    <div className="h-8 w-12 rounded bg-white/20 backdrop-blur-sm" /> {/* Fake chip */}
                </div>

                <div>
                    <div className="mb-4 flex gap-3 text-lg font-medium tracking-widest text-white/90">
                        <span>••••</span>
                        <span>••••</span>
                        <span>••••</span>
                        <span>{account.id.slice(-4)}</span>
                    </div>

                    <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-white/60">
                        <span>{account.type}</span>
                        <span>EXP 12/28</span>
                    </div>
                </div>
            </div>

            {/* Glass Texture */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>
    )
}
