'use client'

import { LandingHeader } from '@/components/marketing/LandingHeader'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false)
    const [currentLangIndex, setCurrentLangIndex] = useState(0)
    const [isManualSelection, setIsManualSelection] = useState(false)

    // Translations
    const translations = {
        en: {
            headerTitle: "Simple, fair pricing.",
            headerSubtitle: "No hidden bank fees.",
            trustedHeadline: "Trusted by 10,000+ families",
            toggleMonthly: "Monthly",
            toggleYearly: "Yearly",
            saveText: "SAVE 20%",
            starterTitle: "Starter",
            starterPrice: "$0",
            starterDesc: "Perfect for individuals starting their financial journey in a new country.",
            starterButton: "Get Started Free",
            starterFeatures: ['Basic Budgeting', 'Standard Translation', '1 Connected Account', 'Standard Support'],
            familyTitle: "Family",
            familyPriceMonthly: "$7",
            familyPriceYearly: "$5",
            familyDesc: "Complete financial tools for your entire household.",
            familyButton: "Start 14-Day Free Trial",
            familyFeatures: ['Advanced AI Budgeting', 'Unlimited Translations', 'Up to 5 Family Members', 'Priority Support', 'Fee-Free Remittances'],
            popularTag: "POPULAR",
            perMonth: "/mo"
        },
        es: {
            headerTitle: "Precios simples y justos.",
            headerSubtitle: "Sin comisiones bancarias ocultas.",
            trustedHeadline: "Confiado por más de 10,000 familias",
            toggleMonthly: "Mensual",
            toggleYearly: "Anual",
            saveText: "AHORRA 20%",
            starterTitle: "Inicial",
            starterPrice: "$0",
            starterDesc: "Perfecto para personas que inician su vida financiera en un nuevo país.",
            starterButton: "Empezar Gratis",
            starterFeatures: ['Presupuesto Básico', 'Traducción Estándar', '1 Cuenta Conectada', 'Soporte Estándar'],
            familyTitle: "Familia",
            familyPriceMonthly: "$7",
            familyPriceYearly: "$5",
            familyDesc: "Herramientas financieras completas para todo tu hogar.",
            familyButton: "Prueba Gratis de 14 Días",
            familyFeatures: ['Presupuesto con IA Avanzada', 'Traducciones Ilimitadas', 'Hasta 5 Miembros', 'Soporte Prioritario', 'Remesas Sin Comisiones'],
            popularTag: "POPULAR",
            perMonth: "/mes"
        },
        ht: {
            headerTitle: "Pri senp, onèt.",
            headerSubtitle: "Pa gen frè bank kache.",
            trustedHeadline: "Fanmi 10,000+ fè konfyans",
            toggleMonthly: "Chak Mwa",
            toggleYearly: "Chak Ane",
            saveText: "EKONOMIZE 20%",
            starterTitle: "Kòmanse",
            starterPrice: "$0",
            starterDesc: "Pafè pou moun k ap kòmanse lavi finansye yo nan yon nouvo peyi.",
            starterButton: "Kòmanse Gratis",
            starterFeatures: ['Bidjè Debaz', 'Tradiksyon Estanda', '1 Kont Konekte', 'Sipò Estanda'],
            familyTitle: "Fanmi",
            familyPriceMonthly: "$7",
            familyPriceYearly: "$5",
            familyDesc: "Zouti finans konplè pou tout kay ou.",
            familyButton: "Eseye Gratis pou 14 Jou",
            familyFeatures: ['Bidjè AI Avanse', 'Tradiksyon San Limit', 'Jiska 5 Manm Fanmi', 'Sipò Priyorite', 'Transfè San Frè'],
            popularTag: "POPILÈ",
            perMonth: "/mwa"
        },
        pt: {
            headerTitle: "Preços simples e justos.",
            headerSubtitle: "Sem taxas bancárias ocultas.",
            trustedHeadline: "Confiado por mais de 10.000 famílias",
            toggleMonthly: "Mensal",
            toggleYearly: "Anual",
            saveText: "ECONOMIZE 20%",
            starterTitle: "Iniciante",
            starterPrice: "$0",
            starterDesc: "Perfeito para quem está começando a vida financeira em um novo país.",
            starterButton: "Começar Grátis",
            starterFeatures: ['Orçamento Básico', 'Tradução Padrão', '1 Conta Conectada', 'Suporte Padrão'],
            familyTitle: "Família",
            familyPriceMonthly: "$7",
            familyPriceYearly: "$5",
            familyDesc: "Ferramentas financeiras completas para toda sua casa.",
            familyButton: "Teste Grátis de 14 Dias",
            familyFeatures: ['Orçamento com IA Avançada', 'Traduções Ilimitadas', 'Até 5 Membros', 'Suporte Prioritário', 'Remessas Sem Taxas'],
            popularTag: "POPULAR",
            perMonth: "/mês"
        }
    }

    // Map all locales to base languages
    const localeMap: Record<string, keyof typeof translations> = {
        'en-US': 'en',
        'es-MX': 'es',
        'es-AR': 'es',
        'es-BO': 'es',
        'es-CL': 'es',
        'es-CO': 'es',
        'es-CR': 'es',
        'es-CU': 'es',
        'es-DO': 'es',
        'es-EC': 'es',
        'es-GT': 'es',
        'es-HN': 'es',
        'es-NI': 'es',
        'es-PA': 'es',
        'es-PE': 'es',
        'es-PR': 'es',
        'es-PY': 'es',
        'es-SV': 'es',
        'es-UY': 'es',
        'es-VE': 'es',
        'ht-HT': 'ht',
        'pt-BR': 'pt',
    }

    const languageKeys = Object.keys(localeMap)
    const currentLangKey = languageKeys[currentLangIndex]
    const baseLang = localeMap[currentLangKey] || 'en'
    const t = translations[baseLang]

    const languageNames: Record<string, { name: string; flag: string }> = {
        'en-US': { name: 'English', flag: '🇺🇸' },
        'es-MX': { name: 'Español (México)', flag: '🇲🇽' },
        'es-AR': { name: 'Español (Argentina)', flag: '🇦🇷' },
        'es-BO': { name: 'Español (Bolivia)', flag: '🇧🇴' },
        'es-CL': { name: 'Español (Chile)', flag: '🇨🇱' },
        'es-CO': { name: 'Español (Colombia)', flag: '🇨🇴' },
        'es-CR': { name: 'Español (Costa Rica)', flag: '🇨🇷' },
        'es-CU': { name: 'Español (Cuba)', flag: '🇨🇺' },
        'es-DO': { name: 'Español (Rep. Dominicana)', flag: '🇩🇴' },
        'es-EC': { name: 'Español (Ecuador)', flag: '🇪🇨' },
        'es-GT': { name: 'Español (Guatemala)', flag: '🇬🇹' },
        'es-HN': { name: 'Español (Honduras)', flag: '🇭🇳' },
        'es-NI': { name: 'Español (Nicaragua)', flag: '🇳🇮' },
        'es-PA': { name: 'Español (Panamá)', flag: '🇵🇦' },
        'es-PE': { name: 'Español (Perú)', flag: '🇵🇪' },
        'es-PR': { name: 'Español (Puerto Rico)', flag: '🇵🇷' },
        'es-PY': { name: 'Español (Paraguay)', flag: '🇵🇾' },
        'es-SV': { name: 'Español (El Salvador)', flag: '🇸🇻' },
        'es-UY': { name: 'Español (Uruguay)', flag: '🇺🇾' },
        'es-VE': { name: 'Español (Venezuela)', flag: '🇻🇪' },
        'ht-HT': { name: 'Kreyòl Ayisyen', flag: '🇭🇹' },
        'pt-BR': { name: 'Português (Brasil)', flag: '🇧🇷' },
    }

    const selectLanguage = (langKey: string) => {
        const index = languageKeys.indexOf(langKey)
        if (index !== -1) {
            setCurrentLangIndex(index)
            setIsManualSelection(true) // Stop auto-rotation if implemented later
        }
    }

    return (
        <div style={{
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: 'linear-gradient(135deg, #FAFAF9 0%, #F0F4F8 100%)',
            minHeight: '100vh',
            color: '#181818',
            overflowX: 'hidden'
        }}>
            <LandingHeader
                currentLang={currentLangKey}
                languageNames={languageNames}
                onLanguageSelect={selectLanguage}
                availableLanguages={languageKeys}
            />

            <main style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <motion.h1
                            key={`header-${currentLangKey}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                fontFamily: 'serif',
                                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                                lineHeight: 1.1,
                                fontWeight: 500,
                                marginBottom: '1.5rem',
                                letterSpacing: '-0.03em'
                            }}
                        >
                            {t.headerTitle}<br />
                            <span style={{ color: '#71717A', fontStyle: 'italic' }}>{t.headerSubtitle}</span>
                        </motion.h1>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#52525B',
                                border: '1px solid rgba(0,0,0,0.05)',
                                marginBottom: '2rem'
                            }}
                        >
                            <span style={{ display: 'flex' }}>⭐️⭐️⭐️⭐️⭐️</span>
                            {t.trustedHeadline || "Trusted by 10,000+ families"}
                        </motion.div>

                        {/* Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                            <span style={{ fontSize: '0.925rem', color: !isYearly ? '#18181B' : '#71717A', fontWeight: !isYearly ? 600 : 400 }}>{t.toggleMonthly}</span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                style={{
                                    width: '3.5rem',
                                    height: '2rem',
                                    background: '#18181B',
                                    borderRadius: '9999px',
                                    position: 'relative',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <motion.div
                                    animate={{ x: isYearly ? '1.5rem' : '0.25rem' }}
                                    style={{
                                        width: '1.5rem',
                                        height: '1.5rem',
                                        background: 'white',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '0.25rem',
                                        left: '0'
                                    }}
                                />
                            </button>
                            <span style={{ fontSize: '0.925rem', color: isYearly ? '#18181B' : '#71717A', fontWeight: isYearly ? 600 : 400 }}>
                                {t.toggleYearly} <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>{t.saveText}</span>
                            </span>
                        </div>
                    </div>

                    {/* Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

                        {/* Free Plan */}
                        <motion.div
                            key={`starter-${currentLangKey}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{
                                background: 'white',
                                borderRadius: '2rem',
                                padding: '3rem',
                                border: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>{t.starterTitle}</h3>
                            <div style={{ fontSize: '3.5rem', fontFamily: 'serif', marginBottom: '2rem' }}>{t.starterPrice}<span style={{ fontSize: '1.125rem', fontFamily: 'sans-serif', color: '#71717A' }}>{t.perMonth}</span></div>
                            <p style={{ color: '#52525B', marginBottom: '2rem', lineHeight: 1.6 }}>{t.starterDesc}</p>

                            <button style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '9999px',
                                border: '1px solid #E4E4E7',
                                background: 'transparent',
                                fontSize: '1rem',
                                fontWeight: 500,
                                marginBottom: '2rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                {t.starterButton}
                            </button>

                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {t.starterFeatures.map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#52525B' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Family Plan */}
                        <motion.div
                            key={`family-${currentLangKey}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{
                                background: '#18181B',
                                borderRadius: '2rem',
                                padding: '3rem',
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-0.75rem',
                                right: '2rem',
                                background: '#3B82F6',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                padding: '0.25rem 1rem',
                                borderRadius: '9999px'
                            }}>
                                {t.popularTag}
                            </div>

                            <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>{t.familyTitle}</h3>
                            <div style={{ fontSize: '3.5rem', fontFamily: 'serif', marginBottom: '2rem' }}>
                                {isYearly ? t.familyPriceYearly : t.familyPriceMonthly}
                                <span style={{ fontSize: '1.125rem', fontFamily: 'sans-serif', color: '#A1A1AA' }}>{t.perMonth}</span>
                            </div>
                            <p style={{ color: '#A1A1AA', marginBottom: '2rem', lineHeight: 1.6 }}>{t.familyDesc}</p>

                            <button style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '9999px',
                                border: 'none',
                                background: 'white',
                                color: '#18181B',
                                fontSize: '1rem',
                                fontWeight: 500,
                                marginBottom: '2rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                {t.familyButton}
                            </button>

                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {t.familyFeatures.map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#E4E4E7' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </main>
        </div>
    )
}
