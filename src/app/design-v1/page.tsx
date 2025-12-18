'use client'

import { LandingHeader } from '@/components/marketing/LandingHeader'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const translations = {
    en: {
        badge: "Built for families like yours",
        headline1: "Manage money.",
        headline2: "In your language.",
        subheadline: "The first finance app that speaks Spanish, Tagalog, Creole, and 15+ more languages. Because you shouldn't have to translate your bank account.",
        cta1: "Start budgeting in your language",
        cta2: "See it in action →",
        featuresTitle: "Features",
        featuresHeadline: "Made for how you actually live",
        featuresSubheadline: "Not another generic bank app. This one gets you.",
        feature1Label: "01 / Language",
        feature1Title: "Talk to your money.",
        feature1Desc: "Type in Spanish, Tagalog, or Creole. Our AI understands you.",
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
        footer2: "18 languages",
        footer3: "Secure",
        footerCopyright: "Built by immigrants, for immigrants. © 2024"
    },
    es: {
        badge: "Hecho para familias como la tuya",
        headline1: "Maneja tu dinero.",
        headline2: "En tu idioma.",
        subheadline: "La primera app de finanzas que habla español, tagalo, criollo y más de 15 idiomas. Porque no deberías tener que traducir tu banco.",
        cta1: "Empieza a presupuestar en tu idioma",
        cta2: "Míralo en acción →",
        featuresTitle: "Características",
        featuresHeadline: "Hecha para cómo vives de verdad",
        featuresSubheadline: "No es otra app de banco genérica. Esta te entiende.",
        feature1Label: "01 / Idioma",
        feature1Title: "Habla con tu plata.",
        feature1Desc: "Escribe en español, tagalo o criollo. Nuestra IA te entiende.",
        feature2Label: "02 / Familia",
        feature2Title: "Una familia. Un presupuesto.",
        feature2Desc: "Trabajen juntos en los gastos de la casa y las metas de dinero.",
        feature3Label: "03 / Futuro",
        feature3Title: "Construyan riqueza juntos.",
        feature3Desc: "Pongan metas familiares para la casa, el carro o los quince.",
        ctaHeadline: "Muéstrale a tu familia que hay una mejor forma.",
        ctaSubheadline: "Gratis para siempre. Sin tarjeta. Sin trucos.",
        ctaButton: "Empezar — Es Gratis",
        footer1: "Funciona en cualquier teléfono",
        footer2: "18 idiomas",
        footer3: "Seguro",
        footerCopyright: "Hecho por inmigrantes, para inmigrantes. © 2024"
    },
    tl: {
        badge: "Para sa mga pamilyang tulad mo",
        headline1: "Pamahalaan ang pera.",
        headline2: "Sa sarili mong wika.",
        subheadline: "Ang unang finance app na nagsasalita ng Espanyol, Tagalog, Creole, at 15+ pang wika. Kasi hindi mo kailangan mag-translate ng bank account mo.",
        cta1: "Magsimula mag-budget sa sarili mong wika",
        cta2: "Tingnan kung paano →",
        featuresTitle: "Mga Feature",
        featuresHeadline: "Para sa tunay mong buhay",
        featuresSubheadline: "Hindi isa pang generic na banking app. Naiintindihan ka nito.",
        feature1Label: "01 / Wika",
        feature1Title: "Kausapin ang pera mo.",
        feature1Desc: "Mag-type sa Espanyol, Tagalog, o Creole. Gets ka ng AI namin.",
        feature2Label: "02 / Pamilya",
        feature2Title: "Isang pamilya. Isang budget.",
        feature2Desc: "Magtulungan sa gastos ng bahay at financial goals.",
        feature3Label: "03 / Kinabukasan",
        feature3Title: "Mag-ipon nang magkasama.",
        feature3Desc: "Magtakda ng family goals para sa bahay, kotse, o debut.",
        ctaHeadline: "Ipakita sa pamilya mo na may mas magandang paraan.",
        ctaSubheadline: "Libre forever. Walang credit card. Walang tricks.",
        ctaButton: "Simulan — Libre To",
        footer1: "Gumagana sa kahit anong phone",
        footer2: "18 wika",
        footer3: "Secure",
        footerCopyright: "Gawa ng mga imigrante, para sa mga imigrante. © 2024"
    },
    ht: {
        badge: "Fèt pou fanmi tankou pa w",
        headline1: "Jere lajan w.",
        headline2: "Nan lang pa w.",
        subheadline: "Premye app finans ki pale Panyòl, Tagalog, Kreyòl, ak plis pase 15 lòt lang. Paske ou pa bezwen tradui kont bank ou.",
        cta1: "Kòmanse fè bidjè nan lang pa w",
        cta2: "Gade l nan aksyon →",
        featuresTitle: "Sa li genyen",
        featuresHeadline: "Fèt pou jan w ap viv",
        featuresSubheadline: "Se pa yon lòt app bank òdinè. Sa a konprann ou.",
        feature1Label: "01 / Lang",
        feature1Title: "Pale ak lajan w.",
        feature1Desc: "Tape nan Panyòl, Tagalog, oswa Kreyòl. AI nou konprann ou.",
        feature2Label: "02 / Fanmi",
        feature2Title: "Yon fanmi. Yon bidjè.",
        feature2Desc: "Travay ansanm sou depans lakay ak objektif lajan.",
        feature3Label: "03 / Lavni",
        feature3Title: "Bati richès ansanm.",
        feature3Desc: "Mete objektif fanmi pou kay, machin, oswa fèt.",
        ctaHeadline: "Montre fanmi w gen yon pi bon fason.",
        ctaSubheadline: "Gratis pou tout tan. Pa gen kat. Pa gen trik.",
        ctaButton: "Kòmanse — Li Gratis",
        footer1: "Mache sou nenpòt telefòn",
        footer2: "18 lang",
        footer3: "Sekirize",
        footerCopyright: "Fèt pa imigran, pou imigran. © 2024"
    },
    pt: {
        badge: "Feito pra famílias como a sua",
        headline1: "Cuida do seu dinheiro.",
        headline2: "No seu idioma.",
        subheadline: "O primeiro app financeiro que fala espanhol, tagalo, crioulo e mais de 15 idiomas. Porque você não precisa traduzir sua conta.",
        cta1: "Comece a fazer orçamento no seu idioma",
        cta2: "Veja como funciona →",
        featuresTitle: "Recursos",
        featuresHeadline: "Feito pra como você vive de verdade",
        featuresSubheadline: "Não é mais um app de banco genérico. Esse aqui te entende.",
        feature1Label: "01 / Idioma",
        feature1Title: "Fale com seu dinheiro.",
        feature1Desc: "Digite em espanhol, tagalo ou crioulo. Nossa IA te entende.",
        feature2Label: "02 / Família",
        feature2Title: "Uma família. Um orçamento.",
        feature2Desc: "Trabalhem juntos nas despesas de casa e nas metas financeiras.",
        feature3Label: "03 / Futuro",
        feature3Title: "Construam riqueza juntos.",
        feature3Desc: "Definam metas pra casa, pro carro ou pra festa de 15.",
        ctaHeadline: "Mostre pra sua família que tem um jeito melhor.",
        ctaSubheadline: "Grátis pra sempre. Sem cartão. Sem pegadinhas.",
        ctaButton: "Começar — É Grátis",
        footer1: "Funciona em qualquer celular",
        footer2: "18 idiomas",
        footer3: "Seguro",
        footerCopyright: "Feito por imigrantes, pra imigrantes. © 2024"
    },
    fr: {
        badge: "Fait pour des familles comme la vôtre",
        headline1: "Gérez votre argent.",
        headline2: "Dans votre langue.",
        subheadline: "La première app financière qui parle espagnol, tagalog, créole et plus de 15 langues. Parce que vous ne devriez pas avoir à traduire votre compte.",
        cta1: "Commencez à budgéter dans votre langue",
        cta2: "Voir comment ça marche →",
        featuresTitle: "Fonctionnalités",
        featuresHeadline: "Fait pour votre vraie vie",
        featuresSubheadline: "Pas une autre app bancaire générique. Celle-ci vous comprend.",
        feature1Label: "01 / Langue",
        feature1Title: "Parlez à votre argent.",
        feature1Desc: "Tapez en espagnol, tagalog ou créole. Notre IA vous comprend.",
        feature2Label: "02 / Famille",
        feature2Title: "Une famille. Un budget.",
        feature2Desc: "Collaborez sur les dépenses du foyer et les objectifs financiers.",
        feature3Label: "03 / Avenir",
        feature3Title: "Construisez la richesse ensemble.",
        feature3Desc: "Fixez des objectifs familiaux pour la maison, la voiture ou la fête.",
        ctaHeadline: "Montrez à votre famille qu'il y a une meilleure façon.",
        ctaSubheadline: "Gratuit pour toujours. Pas de carte. Pas de pièges.",
        ctaButton: "Commencer — C'est Gratuit",
        footer1: "Marche sur n'importe quel téléphone",
        footer2: "18 langues",
        footer3: "Sécurisé",
        footerCopyright: "Fait par des immigrants, pour des immigrants. © 2024"
    }
}

const languageKeys = ['en', 'es', 'tl', 'ht', 'pt', 'fr']

const languageNames = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    tl: { name: 'Tagalog', flag: '🇵🇭' },
    ht: { name: 'Kreyòl', flag: '🇭🇹' },
    pt: { name: 'Português', flag: '🇧🇷' },
    fr: { name: 'Français', flag: '🇫🇷' }
}

export default function DesignPreviewPage() {
    const [currentLangIndex, setCurrentLangIndex] = useState(0)
    const [isManualSelection, setIsManualSelection] = useState(false)
    const [showLanguageMenu, setShowLanguageMenu] = useState(false)
    const currentLang = languageKeys[currentLangIndex]
    const t = translations[currentLang]

    useEffect(() => {
        if (isManualSelection) return // Don't auto-rotate if user selected a language

        const interval = setInterval(() => {
            setCurrentLangIndex((prev) => (prev + 1) % languageKeys.length)
        }, 3500)
        return () => clearInterval(interval)
    }, [isManualSelection])

    const selectLanguage = (index: number) => {
        setCurrentLangIndex(index)
        setIsManualSelection(true)
        setShowLanguageMenu(false)
    }

    return (
        <div style={{
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: '#FAFAF9',
            minHeight: '100vh',
            color: '#18181B',
            overflowX: 'hidden'
        }}>
            <LandingHeader
                currentLang={currentLang}
                languageNames={languageNames}
                availableLanguages={languageKeys}
                onLanguageSelect={(langKey) => {
                    const index = languageKeys.indexOf(langKey)
                    selectLanguage(index)
                }}
            />

            {/* Hero Section */}
            <section style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '10rem 2rem 8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '4rem'
            }}>
                <div style={{ maxWidth: '600px' }}>
                    <motion.div
                        key={`badge-${currentLang}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(0,0,0,0.04)',
                            borderRadius: '100px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#52525B',
                            width: 'fit-content',
                            marginBottom: '1.5rem'
                        }}
                    >
                        <span>{t.badge}</span>
                    </motion.div>

                    <motion.h1
                        key={`headline-${currentLang}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{
                            fontFamily: 'serif',
                            fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
                            lineHeight: 1,
                            fontWeight: 500,
                            letterSpacing: '-0.04em',
                            margin: 0,
                            marginBottom: '1.5rem'
                        }}
                    >
                        {t.headline1}<br />
                        <span style={{ color: '#71717A', fontStyle: 'italic' }}>{t.headline2}</span>
                    </motion.h1>

                    <motion.p
                        key={`subheadline-${currentLang}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{
                            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
                            lineHeight: 1.6,
                            color: '#52525B',
                            maxWidth: '480px',
                            margin: 0,
                            marginBottom: '2rem'
                        }}
                    >
                        {t.subheadline}
                    </motion.p>

                    <motion.div
                        key={`cta-${currentLang}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
                    >
                        <button style={{
                            padding: '1.1rem 2.2rem',
                            background: '#18181B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '100px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                        }}>
                            {t.cta1}
                        </button>

                        <button style={{
                            padding: '1.1rem 2.2rem',
                            background: 'transparent',
                            color: '#18181B',
                            border: '1.5px solid #E4E4E7',
                            borderRadius: '100px',
                            fontSize: '1rem',
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
                        key={`features-header-${currentLang}`}
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
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                        marginTop: '4rem',
                    }}>
                        {[
                            { label: t.feature1Label, title: t.feature1Title, desc: t.feature1Desc },
                            { label: t.feature2Label, title: t.feature2Title, desc: t.feature2Desc },
                            { label: t.feature3Label, title: t.feature3Title, desc: t.feature3Desc }
                        ].map((item, i) => (
                            <motion.div
                                key={`feature-${i}-${currentLang}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '2rem',
                                    padding: '3rem 0',
                                    borderBottom: '1px solid #E4E4E7',
                                    alignItems: 'baseline'
                                }}
                            >
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#A1A1AA',
                                    letterSpacing: '0.05em'
                                }}>
                                    {item.label}
                                </span>

                                <h3 style={{
                                    fontFamily: 'serif',
                                    fontSize: '2rem',
                                    fontWeight: 500,
                                    margin: 0,
                                    color: '#18181B'
                                }}>
                                    {item.title}
                                </h3>

                                <p style={{
                                    fontSize: '1.125rem',
                                    color: '#52525B',
                                    margin: 0,
                                    maxWidth: '300px',
                                    lineHeight: 1.6
                                }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section style={{
                background: 'transparent',
                padding: '10rem 2rem',
                textAlign: 'center'
            }}>
                <motion.div
                    key={`cta-section-${currentLang}`}
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

            {/* Footer */}
            <footer style={{
                padding: '3rem 2rem',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                background: 'transparent'
            }}>
                <motion.div
                    key={`footer-${currentLang}`}
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
        </div>
    )
}
