'use client'

import { LandingHeader } from '@/components/marketing/LandingHeader'
import { FinRoast } from '@/components/marketing/FinRoast'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const translations = {
    en: {
        badge: "Built for families like yours",
        headline1: "Manage money.",
        headline2: "In your language.",
        subheadline: "The first finance app that speaks Spanish, Portuguese, Creole, and 20+ more languages. Because you shouldn't have to translate your finances.",
        cta1: "Start budgeting in your language",
        cta2: "See it in action →",
        featuresTitle: "Features",
        featuresHeadline: "Made for how you actually live",
        featuresSubheadline: "Not another generic bank app. This one gets you.",
        feature1Label: "01 / Language",
        feature1Title: "Talk to your money.",
        feature1Desc: "Type in Spanish, Portuguese, or Creole. Our AI understands you.",
        feature2Label: "02 / Family",
        feature2Title: "One family. One budget.",
        feature2Desc: "Collaborate on household expenses and financial goals together.",
        feature3Label: "03 / Future",
        feature3Title: "Build wealth together.",
        feature3Desc: "Set family goals for the house, the car, or the quinceañera.",
        ctaHeadline: "Show your family there's a better way.",
        ctaSubheadline: "Free forever. No credit card. No tricks.",
        ctaButton: "Get Started — It's Free",
        footer1: "Works on any phone",
        footer2: "20+ languages",
        footer3: "Secure",
        footerCopyright: "Built by immigrants, for immigrants. © 2024"
    },
    es: {
        badge: "Hecho para familias como la tuya",
        headline1: "Maneja tu dinero.",
        headline2: "En tu idioma.",
        subheadline: "La primera app de finanzas que habla español, portugués, creole y más de 20 idiomas. Porque no deberías tener que traducir tus finanzas.",
        cta1: "Empieza a presupuestar en tu idioma",
        cta2: "Míralo en acción →",
        featuresTitle: "Funciones",
        featuresHeadline: "Hecha para cómo vives de verdad",
        featuresSubheadline: "No es otra app de banco genérica. Esta te entiende.",
        feature1Label: "01 / Idioma",
        feature1Title: "Habla con tu dinero.",
        feature1Desc: "Escribe en español, portugués o creole. Nuestra IA te entiende.",
        feature2Label: "02 / Familia",
        feature2Title: "Una familia. Un presupuesto.",
        feature2Desc: "Colaboren en los gastos del hogar y metas financieras juntos.",
        feature3Label: "03 / Futuro",
        feature3Title: "Construyan riqueza juntos.",
        feature3Desc: "Pongan metas familiares para la casa, el carro o los quince.",
        ctaHeadline: "Muéstrale a tu familia que hay una mejor forma.",
        ctaSubheadline: "Gratis para siempre. Sin tarjeta. Sin trucos.",
        ctaButton: "Empezar — Es Gratis",
        footer1: "Funciona en cualquier teléfono",
        footer2: "20+ idiomas",
        footer3: "Seguro",
        footerCopyright: "Hecho por inmigrantes, para inmigrantes. © 2024"
    },
    ht: {
        badge: "Fèt pou fanmi tankou pa w",
        headline1: "Jere lajan w.",
        headline2: "Nan lang pa w.",
        subheadline: "Premye app finans ki pale Panyòl, Pòtigè, Kreyòl, ak 20+ lòt lang. Paske ou pa bezwen tradui finans ou.",
        cta1: "Kòmanse fè bidjè nan lang pa w",
        cta2: "Gade l nan aksyon →",
        featuresTitle: "Karakteristik",
        featuresHeadline: "Fèt pou jan w ap viv toutbon",
        featuresSubheadline: "Se pa yon lòt app bank òdinè. Sa a konprann ou.",
        feature1Label: "01 / Lang",
        feature1Title: "Pale ak lajan w.",
        feature1Desc: "Ekri an panyòl, pòtigè, oswa kreyòl. AI nou an konprann ou.",
        feature2Label: "02 / Fanmi",
        feature2Title: "Yon fanmi. Yon bidjè.",
        feature2Desc: "Kolabore sou depans kay ak objektif finansye ansanm.",
        feature3Label: "03 / Lavni",
        feature3Title: "Bati richès ansanm.",
        feature3Desc: "Mete objektif fanmi pou kay, machin, oswa fèt kenzan.",
        ctaHeadline: "Montre fanmi w gen yon pi bon fason.",
        ctaSubheadline: "Gratis pou tout tan. Pa gen kat. Pa gen trik.",
        ctaButton: "Kòmanse — Li Gratis",
        footer1: "Mache sou nenpòt telefòn",
        footer2: "20+ lang",
        footer3: "Sekirize",
        footerCopyright: "Fèt pa imigran, pou imigran. © 2024"
    },
    pt: {
        badge: "Feito pra famílias como a sua",
        headline1: "Cuida do seu dinheiro.",
        headline2: "No seu idioma.",
        subheadline: "O primeiro app financeiro que fala espanhol, português, crioulo e mais de 20 idiomas. Porque você não precisa traduzir suas finanças.",
        cta1: "Comece a fazer orçamento no seu idioma",
        cta2: "Veja como funciona →",
        featuresTitle: "Recursos",
        featuresHeadline: "Feito pra como você vive de verdade",
        featuresSubheadline: "Não é mais um app de banco genérico. Esse aqui te entende.",
        feature1Label: "01 / Idioma",
        feature1Title: "Fale com seu dinheiro.",
        feature1Desc: "Digite em espanhol, português ou crioulo. Nossa IA entende você.",
        feature2Label: "02 / Familia",
        feature2Title: "Uma família. Um orçamento.",
        feature2Desc: "Colaborem nas despesas de casa e metas financeiras juntos.",
        feature3Label: "03 / Futuro",
        feature3Title: "Construam riqueza juntos.",
        feature3Desc: "Definam metas pra casa, pro carro ou pra festa de 15 anos.",
        ctaHeadline: "Mostre pra sua família que tem um jeito melhor.",
        ctaSubheadline: "Grátis pra sempre. Sem cartão. Sem pegadinhas.",
        ctaButton: "Começar — É Grátis",
        footer1: "Funciona em qualquer celular",
        footer2: "20+ idiomas",
        footer3: "Seguro",
        footerCopyright: "Feito por imigrantes, pra imigrantes. © 2024"
    },

}

// Cultural themes - different visual styles for each culture
const culturalThemes: Record<string, {
    background: string;
    accent: string;
    buttonBg: string;
    buttonText: string;
    badgeBg: string;
    badgeText: string;
    gradientStart: string;
    gradientEnd: string;
    landmark: string;
    landmarkName: string;
}> = {
    en: { // USA - Modern, corporate blue
        background: 'linear-gradient(135deg, #FAFAF9 0%, #F0F4F8 100%)',
        accent: '#3B82F6',
        buttonBg: '#18181B',
        buttonText: '#FFFFFF',
        badgeBg: 'rgba(59, 130, 246, 0.1)',
        badgeText: '#3B82F6',
        gradientStart: '#FAFAF9',
        gradientEnd: '#E0E7FF',
        landmark: '/landmark-usa.png',
        landmarkName: 'Statue of Liberty'
    },
    es: { // Mexico - Warm, vibrant reds and oranges
        background: 'linear-gradient(135deg, #FFFBF5 0%, #FFF5EB 100%)',
        accent: '#DC2626',
        buttonBg: '#DC2626',
        buttonText: '#FFFFFF',
        badgeBg: 'rgba(220, 38, 38, 0.1)',
        badgeText: '#DC2626',
        gradientStart: '#FFFBF5',
        gradientEnd: '#FEE2E2',
        landmark: '/landmark-mexico.png',
        landmarkName: 'Ángel de la Independencia'
    },
    'es-PR': { // Puerto Rico - Island vibes, similar to Haiti but with Spanish flair
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        accent: '#EF4444',
        buttonBg: '#EF4444',
        buttonText: '#FFFFFF',
        badgeBg: 'rgba(239, 68, 68, 0.1)',
        badgeText: '#B91C1C',
        gradientStart: '#FFF7ED',
        gradientEnd: '#FECACA',
        landmark: '/landmark-puerto-rico.png',
        landmarkName: 'El Morro'
    },
    ht: { // Haiti - Caribbean, rich blues and island vibes
        background: 'linear-gradient(135deg, #F0FDFF 0%, #CFFAFE 100%)',
        accent: '#0891B2',
        buttonBg: '#0891B2',
        buttonText: '#FFFFFF',
        badgeBg: 'rgba(8, 145, 178, 0.1)',
        badgeText: '#0E7490',
        gradientStart: '#F0FDFF',
        gradientEnd: '#A5F3FC',
        landmark: '/landmark-haiti.png',
        landmarkName: 'Citadelle Laferrière'
    },
    pt: { // Brazil - Green and yellow (flag colors)
        background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        accent: '#16A34A',
        buttonBg: '#16A34A',
        buttonText: '#FFFFFF',
        badgeBg: 'rgba(22, 163, 74, 0.1)',
        badgeText: '#15803D',
        gradientStart: '#F0FDF4',
        gradientEnd: '#FEF9C3',
        landmark: '/landmark-brazil.png',
        landmarkName: 'Cristo Redentor'
    },
}

// Map all locales to base languages for content
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

// Expanded language names
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

export default function DesignPreviewPage() {
    const [currentLangIndex, setCurrentLangIndex] = useState(0)
    const [isManualSelection, setIsManualSelection] = useState(false)
    const currentLangKey = languageKeys[currentLangIndex]
    const baseLang = localeMap[currentLangKey] || 'en'

    // Fallback logic for content
    const t = translations[baseLang]
    const theme = culturalThemes[currentLangKey] || culturalThemes[baseLang] || culturalThemes.en

    useEffect(() => {
        if (isManualSelection) return

        const interval = setInterval(() => {
            setCurrentLangIndex((prev) => (prev + 1) % languageKeys.length)
        }, 10000)
        return () => clearInterval(interval)
    }, [isManualSelection])

    const selectLanguage = (langKey: string) => {
        const index = languageKeys.indexOf(langKey)
        if (index !== -1) {
            setCurrentLangIndex(index)
            setIsManualSelection(true) // Stop auto-rotation
        }
    }

    return (
        <div style={{
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: 'url("/img-v3.png")', // NUCLEAR TEST: Force background
            backgroundSize: 'cover',
            minHeight: '100vh',
            color: '#2C2C2C', // Soft ink black
            overflowX: 'hidden'
        }}>
            <LandingHeader
                currentLang={currentLangKey}
                languageNames={languageNames}
                availableLanguages={languageKeys}
                onLanguageSelect={selectLanguage}
            />

            <main style={{ paddingTop: '0', paddingBottom: '0' }} key={currentLangKey}>



                {/* Hero Section with Animated Background */}
                <section style={{
                    position: 'relative',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // Center content vertically
                    alignItems: 'center',
                    overflow: 'hidden',
                    paddingTop: '80px' // Space for fixed header
                }}>

                    {/* Animated Background Sketch - SIMPLIFIED FOR VISIBILITY */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '75vh', // Covers top 75% of screen
                            zIndex: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <img
                            src="/img-v3.png"
                            alt="Community Sketch"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center top',
                                // Gradient mask to fade bottom into the cream background
                                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                                opacity: 0.8,
                                display: 'block'
                            }}
                        />
                    </div>

                    {/* Text Content (Sitting on top) */}
                    <div style={{
                        position: 'relative',
                        zIndex: 10,
                        maxWidth: '900px',
                        textAlign: 'center',
                        padding: '0 2rem',
                        marginTop: '20vh' // Push text down a bit to sit nicely with image
                    }}>
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(44, 44, 44, 0.05)',
                                borderRadius: '100px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#52525B', // Standard ink
                                marginBottom: '2rem'
                            }}
                        >
                            <span>{t.badge}</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            style={{
                                fontFamily: 'serif',
                                fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                                lineHeight: 1.05,
                                fontWeight: 500,
                                letterSpacing: '-0.04em',
                                margin: 0,
                                marginBottom: '2rem',
                                color: '#18181B' // Darker ink for headline
                            }}
                        >
                            {t.headline1}<br />
                            <span style={{ color: '#0F766E', fontStyle: 'italic' }}>{t.headline2}</span> {/* Teal accent color */}
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                                lineHeight: 1.5,
                                color: '#52525B',
                                maxWidth: '640px',
                                margin: '0 auto',
                                marginBottom: '2.5rem'
                            }}
                        >
                            {t.subheadline}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                        >
                            <button style={{
                                padding: '1.2rem 2.5rem',
                                background: '#0F766E', // Teal matching the accent
                                color: 'white',
                                border: 'none',
                                borderRadius: '100px',
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 14px rgba(15, 118, 110, 0.2)'
                            }}>
                                {t.cta1}
                            </button>

                            <button style={{
                                padding: '1.2rem 2.5rem',
                                background: 'transparent',
                                color: '#18181B',
                                border: '1.5px solid #D4D4D8',
                                borderRadius: '100px',
                                fontSize: '1.125rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}>
                                {t.cta2}
                            </button>
                        </motion.div>
                    </div>



                </section>

                {/* Features Section */}
                <section style={{
                    background: 'transparent',
                    padding: '6rem 2rem',
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <motion.div
                            key={`features-header-${currentLangKey}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            style={{ marginBottom: '4rem', maxWidth: '600px' }}
                        >
                            <p style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#A1A1AA',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '1rem'
                            }}>
                                {t.featuresTitle}
                            </p>
                            <h2 style={{
                                fontFamily: 'serif',
                                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                                lineHeight: 1.1,
                                fontWeight: 500,
                                letterSpacing: '-0.02em',
                                marginBottom: '1rem'
                            }}>
                                {t.featuresHeadline}
                            </h2>
                            <p style={{ fontSize: '1.125rem', color: '#71717A', lineHeight: 1.6 }}>
                                {t.featuresSubheadline}
                            </p>
                        </motion.div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '4rem',
                            marginTop: '6rem',
                        }}>
                            {[
                                { label: t.feature1Label, title: t.feature1Title, desc: t.feature1Desc },
                                { label: t.feature2Label, title: t.feature2Title, desc: t.feature2Desc },
                                { label: t.feature3Label, title: t.feature3Title, desc: t.feature3Desc }
                            ].map((item, i) => (
                                <motion.div
                                    key={`feature-${i}-${currentLangKey}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: '#A1A1AA',
                                        letterSpacing: '0.05em',
                                        borderBottom: '1px solid #E4E4E7',
                                        paddingBottom: '0.5rem',
                                        marginBottom: '0.5rem',
                                        width: '100%'
                                    }}>
                                        {item.label}
                                    </span>

                                    <h3 style={{
                                        fontFamily: 'serif',
                                        fontSize: '2.5rem',
                                        fontWeight: 500,
                                        margin: 0,
                                        color: '#18181B',
                                        lineHeight: 1.1
                                    }}>
                                        {item.title}
                                    </h3>

                                    <p style={{
                                        fontSize: '1.25rem',
                                        color: '#52525B',
                                        margin: 0,
                                        maxWidth: '320px',
                                        lineHeight: 1.6
                                    }}>
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Testimonials Section - Real Stories */}
            <section style={{
                background: 'transparent',
                padding: '8rem 2rem',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: '5rem' }}
                    >
                        <p style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: theme.accent,
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '1.5rem'
                        }}>
                            Real Stories
                        </p>
                        <h2 style={{
                            fontFamily: 'serif',
                            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                            fontWeight: 400,
                            letterSpacing: '-0.03em',
                            color: '#18181B'
                        }}>
                            Trusted by families like yours
                        </h2>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {[
                            {
                                native: "Antes pasaba 2 horas traduciendo mis estados de cuenta. Ahora controlo todo en español en 5 minutos.",
                                translate: "I used to spend 2 hours translating my bank statements. Now I track everything in Spanish in 5 minutes.",
                                name: "María García",
                                location: "Miami, FL",
                                flag: "🇲🇽",
                                saved: "$340 saved/mo"
                            },
                            {
                                native: "Sa wakas, may app na nakakaintindi ng Tagalog. Sabay na kami nagba-budget ni Lola.",
                                translate: "Finally, an app that understands Tagalog. Now my grandma and I can budget together.",
                                name: "Jun Santos",
                                location: "Los Angeles, CA",
                                flag: "🇵🇭",
                                saved: "Family Plan"
                            },
                            {
                                native: "Voye kòb lakay epi swiv bidjè mwen nan menm aplikasyon an? Se sa nou te bezwen.",
                                translate: "Sending money back home and tracking my budget in the same app? This is what we needed.",
                                name: "Rose Jean-Baptiste",
                                location: "Brooklyn, NY",
                                flag: "🇭🇹",
                                saved: "Saved on fees"
                            }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(12px)',
                                    borderRadius: '1rem',
                                    padding: '2.5rem',
                                    boxShadow: '0 4px 40px rgba(0,0,0,0.04)',
                                    border: '1px solid rgba(255,255,255,0.6)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <div>
                                    {/* Quote Icon */}
                                    <div style={{
                                        color: theme.accent,
                                        opacity: 0.3,
                                        fontSize: '2rem',
                                        fontFamily: 'serif',
                                        lineHeight: 1,
                                        marginBottom: '1rem'
                                    }}>“</div>

                                    {/* Native Quote - Primary */}
                                    <p style={{
                                        fontSize: '1.25rem',
                                        lineHeight: 1.5,
                                        color: '#18181B',
                                        marginBottom: '0.75rem',
                                        fontFamily: 'serif',
                                        fontWeight: 400
                                    }}>
                                        {testimonial.native}
                                    </p>

                                    {/* Translation - Secondary */}
                                    <p style={{
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6,
                                        color: '#71717A',
                                        marginBottom: '2rem',
                                        fontStyle: 'italic'
                                    }}>
                                        {testimonial.translate}
                                    </p>
                                </div>

                                {/* Author */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid rgba(0,0,0,0.04)',
                                    paddingTop: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '50%',
                                            background: '#F4F4F5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem'
                                        }}>
                                            {testimonial.flag}
                                        </div>
                                        <div>
                                            <p style={{
                                                fontSize: '0.9375rem',
                                                fontWeight: 600,
                                                color: '#18181B',
                                                marginBottom: '0',
                                                letterSpacing: '-0.01em'
                                            }}>
                                                {testimonial.name}
                                            </p>
                                            <p style={{
                                                fontSize: '0.75rem',
                                                color: '#A1A1AA',
                                                marginTop: '0.125rem'
                                            }}>
                                                {testimonial.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '4rem',
                            marginTop: '6rem',
                            flexWrap: 'wrap',
                            opacity: 0.6
                        }}
                    >
                        {[
                            { label: 'Rating', value: '4.9/5.0' },
                            { label: 'Security', value: 'Bank-Grade AES-256' },
                            { label: 'Community', value: '10,000+ Families' },
                            { label: 'Access', value: '20+ Languages' }
                        ].map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}
                            >
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#A1A1AA'
                                }}>
                                    {item.label}
                                </span>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: '#27272A',
                                    fontFeatureSettings: '"tnum"'
                                }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section >

            {/* FinAI Roasting Section */}
            <FinRoast />

            {/* Final CTA Section */}
            < section style={{
                background: 'transparent',
                padding: '10rem 2rem',
                textAlign: 'center'
            }
            }>
                <motion.div
                    key={`cta-section-${currentLangKey}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{ maxWidth: '700px', margin: '0 auto' }}
                >
                    <h2 style={{
                        fontFamily: 'serif',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        lineHeight: 1.1,
                        fontWeight: 500,
                        letterSpacing: '-0.02em',
                        marginBottom: '1.5rem'
                    }}>
                        {t.ctaHeadline}
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#71717A',
                        marginBottom: '3rem',
                        lineHeight: 1.5
                    }}>
                        {t.ctaSubheadline}
                    </p>
                    <button style={{
                        padding: '1.25rem 3rem',
                        background: '#18181B',
                        color: 'white',
                        border: 'none',
                        borderRadius: '100px',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        marginBottom: '2.5rem'
                    }}>
                        {t.ctaButton}
                    </button>
                    <p style={{
                        color: '#A1A1AA',
                        fontSize: '0.875rem',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        flexWrap: 'wrap'
                    }}>
                        <span>{t.footer1}</span>
                        <span>{t.footer2}</span>
                        <span>{t.footer3}</span>
                    </p>
                </motion.div>
            </section>

        </main>
            
            {/* Footer */ }
    <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        background: 'transparent'
    }}>
        <motion.div
            key={`footer-${currentLangKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}
        >
            <div style={{
                fontFamily: 'serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em'
            }}>
            </div>
            <p style={{
                color: '#A1A1AA',
                fontSize: '0.875rem'
            }}>
                {t.footerCopyright}
            </p>
        </motion.div>
    </footer>
        </div >
    )
}
