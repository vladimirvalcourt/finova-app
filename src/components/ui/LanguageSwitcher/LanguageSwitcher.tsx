'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import styles from './LanguageSwitcher.module.css'

interface Language {
    code: string
    name: string
    flag: string
    brand: string
}

const languages: Language[] = [
    { code: 'en-US', name: 'English', flag: '🇺🇸', brand: 'FINOVA' },
    { code: 'ht-HT', name: 'Kreyòl Ayisyen', flag: '🇭🇹', brand: 'LAJAN' },
    { code: 'es-MX', name: 'Español (México)', flag: '🇲🇽', brand: 'DINERO' },
    { code: 'es-DO', name: 'Español (Dominicano)', flag: '🇩🇴', brand: 'CUARTOS' },
    { code: 'es-PR', name: 'Español (Puerto Rico)', flag: '🇵🇷', brand: 'CHAVOS' },
    { code: 'es-CU', name: 'Español (Cuba)', flag: '🇨🇺', brand: 'FULA' },
    { code: 'es-SV', name: 'Español (El Salvador)', flag: '🇸🇻', brand: 'PISTO' },
    { code: 'es-GT', name: 'Español (Guatemala)', flag: '🇬🇹', brand: 'LANA' },
    { code: 'es-HN', name: 'Español (Honduras)', flag: '🇭🇳', brand: 'LANA' },
    { code: 'es-CO', name: 'Español (Colombia)', flag: '🇨🇴', brand: 'PLATA' },
    { code: 'es-VE', name: 'Español (Venezuela)', flag: '🇻🇪', brand: 'PLATA' },
    { code: 'es-PE', name: 'Español (Perú)', flag: '🇵🇪', brand: 'PLATA' },
    { code: 'es-EC', name: 'Español (Ecuador)', flag: '🇪🇨', brand: 'PLATA' },
    { code: 'es-AR', name: 'Español (Argentina)', flag: '🇦🇷', brand: 'GUITA' },
    { code: 'es-CL', name: 'Español (Chile)', flag: '🇨🇱', brand: 'LUCAS' },
    { code: 'es-BO', name: 'Español (Bolivia)', flag: '🇧🇴', brand: 'PLATA' },
    { code: 'es-PY', name: 'Español (Paraguay)', flag: '🇵🇾', brand: 'GUITA' },
    { code: 'es-UY', name: 'Español (Uruguay)', flag: '🇺🇾', brand: 'GUITA' },
]

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentLocale, setCurrentLocale] = useState('en-US')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    // Get current language
    useEffect(() => {
        const stored = localStorage.getItem('locale')
        if (stored) {
            setCurrentLocale(stored)
        }
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

    const handleLanguageChange = (language: Language) => {
        setCurrentLocale(language.code)
        localStorage.setItem('locale', language.code)
        setIsOpen(false)

        // In a real implementation, this would update the locale
        // For now, we'll just store it in localStorage
        // The app would need to be set up with next-intl routing
        console.log('Language changed to:', language.code)
    }

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select language"
            >
                <span className={styles.flag}>{currentLanguage.flag}</span>
                <span className={styles.name}>{currentLanguage.name}</span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                        <span>🌍</span>
                        <span>Select Language</span>
                    </div>
                    <div className={styles.dropdownList}>
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                className={`${styles.option} ${language.code === currentLocale ? styles.optionActive : ''}`}
                                onClick={() => handleLanguageChange(language)}
                            >
                                <span className={styles.optionFlag}>{language.flag}</span>
                                <div className={styles.optionContent}>
                                    <span className={styles.optionName}>{language.name}</span>
                                    <span className={styles.optionBrand}>{language.brand}</span>
                                </div>
                                {language.code === currentLocale && (
                                    <span className={styles.checkmark}>✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
