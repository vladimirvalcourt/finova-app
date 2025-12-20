'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll } from 'framer-motion'

interface LandingHeaderProps {
    currentLang?: string;
    languageNames?: Record<string, { name: string; flag: string }>;
    onLanguageSelect?: (langKey: string) => void;
    availableLanguages?: string[];
}

export function LandingHeader({
    currentLang = 'en',
    languageNames,
    onLanguageSelect,
    availableLanguages = []
}: LandingHeaderProps) {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50)
        })
    }, [scrollY])

    const baseLang = currentLang.split('-')[0] as 'en' | 'es' | 'ht' | 'pt'

    const t = {
        en: {
            features: 'Features',
            pricing: 'Pricing',
            about: 'About'
        },
        es: {
            features: 'Funciones',
            pricing: 'Precios',
            about: 'Nosotros'
        },
        ht: {
            features: 'Karakteristik',
            pricing: 'Pri',
            about: 'Enfomasyon'
        },
        pt: {
            features: 'Recursos',
            pricing: 'Preços',
            about: 'Sobre'
        }
    }[baseLang] || {
        features: 'Features',
        pricing: 'Pricing',
        about: 'About'
    }

    return (
        <motion.header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '1rem 2rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s',
                padding: isScrolled ? '0.75rem 2rem' : '0.5rem 1rem',
                background: isScrolled ? 'rgba(255,255,255,0.8)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                borderRadius: isScrolled ? '9999px' : '0',
                border: isScrolled ? '1px solid rgba(255,255,255,0.2)' : 'none',
                boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}>
                {/* Logo */}
                <Link href="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
                    <span style={{
                        fontFamily: 'var(--font-serif), Georgia, serif',
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        color: '#18181B',
                        fontStyle: 'italic'
                    }}>
                        Finova

                    </span>
                </Link>

                {/* Center Navigation */}
                <nav style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5rem'
                }}>
                    {[
                        { name: t.features, path: '/design-v1/features' },
                        { name: t.pricing, path: '/design-v1/pricing' },
                        { name: t.about, path: '/design-v1/about' }
                    ].map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#52525B',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexShrink: 0
                }}>
                    {/* Language Selector */}
                    {languageNames && onLanguageSelect && (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.5rem 0.75rem',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{languageNames[currentLang]?.flag}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, marginLeft: '0.25rem' }}>
                                    {languageNames[currentLang]?.name}
                                </span>
                                <span style={{ fontSize: '0.625rem', color: '#A1A1AA' }}>▼</span>
                            </button>

                            <AnimatePresence>
                                {showLanguageMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '0.5rem',
                                            width: '18rem',
                                            background: 'white',
                                            borderRadius: '0.75rem',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                            border: '1px solid #F4F4F5',
                                            padding: '0.5rem 0',
                                            zIndex: 50,
                                            maxHeight: '60vh',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {availableLanguages.map((langKey) => (
                                            <button
                                                key={langKey}
                                                onClick={() => {
                                                    onLanguageSelect(langKey)
                                                    setShowLanguageMenu(false)
                                                }}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.625rem 1rem',
                                                    background: currentLang === langKey ? '#F4F4F5' : 'white',
                                                    border: 'none',
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s',
                                                    fontWeight: currentLang === langKey ? 500 : 400,
                                                    color: '#18181B'
                                                }}
                                            >
                                                <span style={{ fontSize: '1.25rem' }}>{languageNames[langKey]?.flag}</span>
                                                <span style={{ fontSize: '0.875rem' }}>{languageNames[langKey]?.name}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    )
}
