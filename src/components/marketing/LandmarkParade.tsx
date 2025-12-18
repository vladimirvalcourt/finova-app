'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LandmarkParadeProps {
    currentLang: string;
}

// All landmarks in parade order
const landmarks = [
    { id: 'en', src: '/landmark-usa.png', name: 'Statue of Liberty', color: '#3B82F6' },
    { id: 'es', src: '/landmark-mexico.png', name: 'Ángel de la Independencia', color: '#DC2626' },
    { id: 'es-PR', src: '/landmark-puerto-rico.png', name: 'El Morro', color: '#EF4444' },
    { id: 'ht', src: '/landmark-haiti.png', name: 'Citadelle Laferrière', color: '#0891B2' },
    { id: 'pt', src: '/landmark-brazil.png', name: 'Cristo Redentor', color: '#16A34A' },
]

export function LandmarkParade({ currentLang }: LandmarkParadeProps) {
    // Determine active landmark based on specificity
    const activeLandmarkId = React.useMemo(() => {
        if (currentLang === 'es-PR') return 'es-PR'
        if (currentLang.startsWith('es')) return 'es'
        if (currentLang.startsWith('pt')) return 'pt'
        if (currentLang.startsWith('ht')) return 'ht'
        return 'en'
    }, [currentLang])

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '200px',
            pointerEvents: 'none',
            zIndex: 5,
            overflow: 'hidden'
        }}>
            {/* Animated parade of landmarks */}
            <motion.div
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '80px',
                    position: 'absolute',
                    bottom: '20px',
                    left: 0,
                }}
                animate={{
                    x: ['-100%', '100vw']
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            >
                {/* Repeat landmarks twice for seamless loop */}
                {[...landmarks, ...landmarks].map((landmark, index) => (
                    <motion.div
                        key={`${landmark.id}-${index}`}
                        style={{
                            position: 'relative',
                            width: '120px',
                            height: '180px',
                            opacity: activeLandmarkId === landmark.id ? 1 : 0.3,
                            filter: activeLandmarkId === landmark.id ? 'none' : 'grayscale(50%)',
                            transition: 'opacity 0.5s, filter 0.5s'
                        }}
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                            ease: 'easeInOut'
                        }}
                    >
                        <Image
                            src={landmark.src}
                            alt={landmark.name}
                            fill
                            style={{ objectFit: 'contain' }}
                        />

                        {/* Glow effect for active landmark */}
                        {activeLandmarkId === landmark.id && (
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    bottom: '-10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '80px',
                                    height: '20px',
                                    background: `radial-gradient(ellipse, ${landmark.color}40, transparent)`,
                                    borderRadius: '50%'
                                }}
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            />
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
