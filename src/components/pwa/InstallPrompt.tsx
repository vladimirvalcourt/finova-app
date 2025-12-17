'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share, PlusSquare } from 'lucide-react'

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        // Check if iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        setIsIOS(isIOSDevice)

        // Handle Android/Desktop installation
        const handler = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setShowPrompt(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Show iOS prompt on first visit if not standalone
        if (isIOSDevice && !(window.navigator as any).standalone) {
            // Check if already shown in session
            if (!sessionStorage.getItem('iosPromptShown')) {
                setShowPrompt(true)
                sessionStorage.setItem('iosPromptShown', 'true')
            }
        }

        return () => window.removeEventListener('beforeinstallprompt', handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            setShowPrompt(false)
        }
        setDeferredPrompt(null)
    }

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl shadow-2xl">
                        {/* Glass shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                        <button
                            onClick={() => setShowPrompt(false)}
                            className="absolute top-2 right-2 text-white/50 hover:text-white"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                                <img src="/icon-192x192.png" alt="Finova" className="h-full w-full object-cover" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-white">Install Finova</h3>
                                <p className="text-xs text-white/70 mt-1">
                                    Install our app for a better full-screen experience and offline access.
                                </p>

                                {isIOS ? (
                                    <div className="mt-3 flex flex-col gap-2 text-xs text-white/90">
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10">
                                                <Share size={12} />
                                            </span>
                                            Tap the Share button
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10">
                                                <PlusSquare size={12} />
                                            </span>
                                            Select "Add to Home Screen"
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleInstall}
                                        className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg bg-white/10 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                                    >
                                        <Download size={14} />
                                        Install App
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
