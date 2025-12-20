'use client'

import { LandingHeader } from '@/components/marketing/LandingHeader'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function FeaturesPage() {
    const [currentLangIndex, setCurrentLangIndex] = useState(0)
    const [isManualSelection, setIsManualSelection] = useState(false)

    // Translations for Features page
    const translations = {
        en: {
            headerTitle: "Built for your",
            headerSubtitle: "financial culture.",
            headerDesc: "Most apps ignore how immigrant families actually handle money. Finova was built from the ground up to support your reality.",
            feature1Tag: "SMART BUDGETING",
            feature1Title: "See where every dollar goes.",
            feature1Desc: "Most budgeting apps ignore how immigrant families actually spend. We categorize remittances, multi-currency transactions, and family support—automatically.",
            feature1List: ['Track remittances you send', 'Multi-currency support', 'Family spending insights'],
            feature2Tag: "LANGUAGE",
            feature2Title: "Financial clarity in your mother tongue.",
            feature2Desc: "Money is hard enough without a language barrier. Finova translates every term, alert, and chart into 20+ regional dialects automatically.",
            feature2List: ['20+ Latin American & Caribbean languages', 'Context-aware translations', 'Bilingual support chat'],
            feature3Tag: "FINANCIAL GOALS",
            feature3Title: "Plan for what matters most.",
            feature3Desc: "Set savings goals your whole family can see. Track progress toward a car, a home, or your child's education—together.",
            feature3List: ['Visual savings goals', 'Family progress sharing', 'Tips tailored to your culture']
        },
        es: {
            headerTitle: "Hecho para tu",
            headerSubtitle: "cultura financiera.",
            headerDesc: "La mayoría de apps ignoran cómo las familias inmigrantes manejan su dinero. Finova fue construida desde cero para tu realidad.",
            feature1Tag: "PRESUPUESTO INTELIGENTE",
            feature1Title: "Mira dónde va cada dólar.",
            feature1Desc: "Categorizamos remesas, transacciones en múltiples monedas y apoyo familiar—automáticamente.",
            feature1List: ['Rastrea las remesas que envías', 'Tablero multimonda', 'Estadísticas de gastos familiares'],
            feature2Tag: "IDIOMA",
            feature2Title: "Claridad financiera en tu lengua materna.",
            feature2Desc: "Finova traduce cada término, alerta y gráfico a más de 20 dialectos regionales automáticamente.",
            feature2List: ['20+ idiomas de Latinoamérica y el Caribe', 'Traducciones con contexto', 'Chat de soporte bilingüe'],
            feature3Tag: "METAS FINANCIERAS",
            feature3Title: "Planea para lo que importa.",
            feature3Desc: "Pon metas de ahorro que toda tu familia pueda ver. Sigue el progreso para un carro, una casa o la educación.",
            feature3List: ['Metas de ahorro visuales', 'Compartir progreso familiar', 'Consejos para tu cultura']
        },
        ht: {
            headerTitle: "Fèt pou",
            headerSubtitle: "kilti finansye ou.",
            headerDesc: "Pifò aplikasyon inyore kijan fanmi imigran jere lajan. Finova te bati depi nan baz pou sipòte reyalite ou.",
            feature1Tag: "BIDJÈ ENTÈLIJAN",
            feature1Title: "Wè kote chak dola ale.",
            feature1Desc: "Nou klase transfè lajan, tranzaksyon nan plizyè lajan, ak sipò fanmi—otomatikman.",
            feature1List: ['Suiv transfè ou voye', 'Tablodbò plizyè lajan', 'Apèsi sou depans fanmi'],
            feature2Tag: "LANG",
            feature2Title: "Klète finansye nan lang manman ou.",
            feature2Desc: "Finova tradui chak tèm, alèt, ak tablo nan 20+ dyalèk rejyonal otomatikman.",
            feature2List: ['20+ lang Amerik Latin & Karayib', 'Tradiksyon ki konprann kontèks', 'Chat sipò bileng'],
            feature3Tag: "OBJEKTIF FINANSYE",
            feature3Title: "Planifye pou sa ki enpòtan.",
            feature3Desc: "Mete objektif epay tout fanmi ou ka wè. Suiv pwogrè pou yon machin, yon kay, oswa edikasyon pitit ou.",
            feature3List: ['Objektif epay vizyèl', 'Pataje pwogrè fanmi', 'Konsèy pou kilti ou']
        },
        pt: {
            headerTitle: "Feito para sua",
            headerSubtitle: "cultura financeira.",
            headerDesc: "A maioria dos apps ignora como famílias imigrantes lidam com dinheiro. Finova foi feito do zero pra sua realidade.",
            feature1Tag: "ORÇAMENTO INTELIGENTE",
            feature1Title: "Veja onde vai cada dólar.",
            feature1Desc: "Categorizamos remessas, transações em várias moedas e apoio familiar—automaticamente.",
            feature1List: ['Rastreie remessas enviadas', 'Painel multimoeda', 'Insights de gastos familiares'],
            feature2Tag: "IDIOMA",
            feature2Title: "Clareza financeira na sua língua.",
            feature2Desc: "Finova traduz cada termo, alerta e gráfico para 20+ dialetos regionais automaticamente.",
            feature2List: ['20+ idiomas da LatAm e Caribe', 'Traduções com contexto', 'Chat de suporte bilíngue'],
            feature3Tag: "METAS FINANCEIRAS",
            feature3Title: "Planeje o que mais importa.",
            feature3Desc: "Defina metas que toda a família pode ver. Acompanhe o progresso pro carro, casa ou educação.",
            feature3List: ['Metas visuais de economia', 'Compartilhar progresso familiar', 'Dicas pra sua cultura']
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

    const currentLangKey = languageKeys[currentLangIndex]
    const baseLang = localeMap[currentLangKey] || 'en'
    const t = translations[baseLang]

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    }

    const staggerItem = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as any
            }
        }
    }

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
            background: 'linear-gradient(135deg, #FAFAF9 0%, #F0F4F8 100%)',
            minHeight: '100vh',
            color: '#181818',
            overflowX: 'hidden'
        }}>
            <LandingHeader
                currentLang={currentLangKey}
                languageNames={languageNames}
                availableLanguages={languageKeys}
                onLanguageSelect={selectLanguage}
            />

            <main style={{ paddingTop: '8rem', paddingBottom: '6rem' }} key={currentLangKey}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
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
                        <motion.p
                            key={`header-desc-${currentLangKey}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{
                                fontSize: '1.25rem',
                                color: '#52525B',
                                maxWidth: '600px',
                                margin: '0 auto',
                                lineHeight: 1.6
                            }}
                        >
                            {t.headerDesc}
                        </motion.p>
                    </div>

                    {/* Feature 1: Remittances */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        style={{ marginBottom: '8rem', maxWidth: '800px', margin: '0 auto 8rem auto', textAlign: 'center' }}
                    >
                        {/* We use key on the motion.div to restart the animation when language changes */}
                        <motion.div key={`f1-${currentLangKey}`} variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.span
                                variants={staggerItem}
                                style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3B82F6',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    display: 'inline-block',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                {t.feature1Tag}
                            </motion.span>
                            <motion.h2
                                variants={staggerItem}
                                style={{ fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '1rem' }}
                            >
                                {t.feature1Title}
                            </motion.h2>
                            <motion.p
                                variants={staggerItem}
                                style={{ fontSize: '1.125rem', color: '#52525B', lineHeight: 1.6, marginBottom: '2rem' }}
                            >
                                {t.feature1Desc}
                            </motion.p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                                {t.feature1List.map((item, i) => (
                                    <motion.li
                                        key={item}
                                        variants={staggerItem}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#18181B' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Feature 2: Native Language */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        style={{ marginBottom: '8rem', maxWidth: '800px', margin: '0 auto 8rem auto', textAlign: 'center' }}
                    >
                        <motion.div key={`f2-${currentLangKey}`} variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.span
                                variants={staggerItem}
                                style={{
                                    background: 'rgba(236, 72, 153, 0.1)',
                                    color: '#EC4899',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    display: 'inline-block',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                {t.feature2Tag}
                            </motion.span>
                            <motion.h2
                                variants={staggerItem}
                                style={{ fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '1rem' }}
                            >
                                {t.feature2Title}
                            </motion.h2>
                            <motion.p
                                variants={staggerItem}
                                style={{ fontSize: '1.125rem', color: '#52525B', lineHeight: 1.6, marginBottom: '2rem' }}
                            >
                                {t.feature2Desc}
                            </motion.p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                                {t.feature2List.map((item, i) => (
                                    <motion.li
                                        key={item}
                                        variants={staggerItem}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#18181B' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Feature 3: Family Wealth */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        style={{ marginBottom: '8rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
                    >
                        <motion.div key={`f3-${currentLangKey}`} variants={staggerContainer} initial="hidden" animate="visible">
                            <motion.span
                                variants={staggerItem}
                                style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: '#10B981',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    display: 'inline-block',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                {t.feature3Tag}
                            </motion.span>
                            <motion.h2
                                variants={staggerItem}
                                style={{ fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '1rem' }}
                            >
                                {t.feature3Title}
                            </motion.h2>
                            <motion.p
                                variants={staggerItem}
                                style={{ fontSize: '1.125rem', color: '#52525B', lineHeight: 1.6, marginBottom: '2rem' }}
                            >
                                {t.feature3Desc}
                            </motion.p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                                {t.feature3List.map((item, i) => (
                                    <motion.li
                                        key={item}
                                        variants={staggerItem}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#18181B' }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                </div>
            </main>
        </div>
    )
}
