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
                        <span style={{
                            display: 'inline-block',
                            width: '0.5rem',
                            height: '0.5rem',
                            backgroundColor: '#FACC15',
                            borderRadius: '50%',
                            marginLeft: '0.25rem',
                            marginBottom: '0.25rem',
                            animation: 'pulse 2s infinite'
                        }} />
                    </span>
                </Link>

                {/* Center Navigation */}
                <nav style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2.5rem'
                }}>
                    {['Features', 'Pricing', 'About'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#52525B',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }}
                        >
                            {item}
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
                                            width: '11rem',
                                            background: 'white',
                                            borderRadius: '0.75rem',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                            border: '1px solid #F4F4F5',
                                            padding: '0.5rem 0',
                                            zIndex: 50
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

                    {/* Log in */}
                    <Link
                        href="/login"
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#3F3F46',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }}
                    >
                        Log in
                    </Link>

                    {/* Get Started */}
                    <Link
                        href="/signup"
                        style={{
                            padding: '0.625rem 1.25rem',
                            backgroundColor: '#18181B',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            transition: 'background 0.2s, transform 0.2s',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </motion.header>
    )
}
