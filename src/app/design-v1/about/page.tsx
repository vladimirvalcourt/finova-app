'use client'

import { LandingHeader } from '@/components/marketing/LandingHeader'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// Translations for About page
const translations = {
    en: {
        headline1: 'Finance should speak',
        headline2: 'your language.',
        manifesto1: 'We believe the financial system is broken for immigrants.',
        manifesto2: "When you move to a new country, you shouldn't have to relearn how to manage your money in a language you're still mastering. You shouldn't feel anxiety every time you open a banking app because the terms confuse you.",
        manifesto3: "We built Finova because we lived this. Our founders spent hours translating bank statements for their parents. They saw fees eat into money meant for family back home. They saw brilliant people shut out of wealth-building simply because the system wasn't built for them.",
        manifesto4: "Finova isn't just an app. It's a bridge. We're here to ensure that your financial future is determined by your ambition, not your origin story.",
        stat1Label: 'Languages Supported',
        stat2Label: 'Families Helped',
        stat3Label: 'Time Saved',
        joinTitle: 'Join the movement',
        joinText: "We're a small team of immigrants, engineers, and dreamers building the app we wish our families had.",
        joinButton: 'See Open Positions'
    },
    es: {
        headline1: 'Las finanzas deben hablar',
        headline2: 'tu idioma.',
        manifesto1: 'Creemos que el sistema financiero está roto para los inmigrantes.',
        manifesto2: 'Cuando te mudas a un nuevo país, no deberías tener que reaprender a manejar tu dinero en un idioma que todavía estás dominando. No deberías sentir ansiedad cada vez que abres una app bancaria porque los términos te confunden.',
        manifesto3: 'Construimos Finova porque vivimos esto. Nuestros fundadores pasaron horas traduciendo estados de cuenta para sus padres. Vieron cómo las comisiones se comían el dinero destinado a la familia en casa. Vieron a personas brillantes excluidas de la creación de riqueza simplemente porque el sistema no fue construido para ellas.',
        manifesto4: 'Finova no es solo una app. Es un puente. Estamos aquí para asegurar que tu futuro financiero sea determinado por tu ambición, no por tu historia de origen.',
        stat1Label: 'Idiomas Soportados',
        stat2Label: 'Familias Ayudadas',
        stat3Label: 'Tiempo Ahorrado',
        joinTitle: 'Únete al movimiento',
        joinText: 'Somos un pequeño equipo de inmigrantes, ingenieros y soñadores construyendo la app que deseamos que nuestras familias hubieran tenido.',
        joinButton: 'Ver Posiciones Abiertas'
    },

    ht: {
        headline1: 'Finans ta dwe pale',
        headline2: 'lang ou.',
        manifesto1: 'Nou kwè sistèm finansye a kraze pou imigran yo.',
        manifesto2: 'Lè w deplase nan yon nouvo peyi, ou pa ta dwe aprann ankò kijan pou jere lajan ou nan yon lang ou toujou ap aprann. Ou pa ta dwe gen enkyetid chak fwa ou ouvri yon aplikasyon bank paske tèm yo konfonn ou.',
        manifesto3: 'Nou te bati Finova paske nou te viv sa. Fondatè nou yo te pase plizyè èdtan ap tradui relve bank pou paran yo. Yo te wè frè ap manje lajan ki te fèt pou fanmi lakay. Yo te wè moun briye ki pa t kapab patisipe nan kreyasyon richès tou senpleman paske sistèm nan pa t bati pou yo.',
        manifesto4: 'Finova se pa sèlman yon aplikasyon. Se yon pon. Nou la pou asire ke avni finansye ou detèmine pa ambisyon ou, pa istwa orijin ou.',
        stat1Label: 'Lang Sipòte',
        stat2Label: 'Fanmi ki Ede',
        stat3Label: 'Tan Sove',
        joinTitle: 'Rantre nan mouvman an',
        joinText: 'Nou se yon ti ekip imigran, enjenyè, ak moun ki gen rèv kap bati aplikasyon nou te swete fanmi nou te genyen.',
        joinButton: 'Wè Pozisyon Ouvè'
    },
    pt: {
        headline1: 'Finanças devem falar',
        headline2: 'sua língua.',
        manifesto1: 'Acreditamos que o sistema financeiro está quebrado para imigrantes.',
        manifesto2: 'Quando você se muda para um novo país, você não deveria ter que reaprender a gerenciar seu dinheiro em um idioma que ainda está dominando. Você não deveria sentir ansiedade toda vez que abre um app de banco porque os termos te confundem.',
        manifesto3: 'Construímos o Finova porque vivemos isso. Nossos fundadores passaram horas traduzindo extratos bancários para seus pais. Eles viram taxas consumirem o dinheiro destinado à família em casa. Eles viram pessoas brilhantes excluídas da construção de riqueza simplesmente porque o sistema não foi feito para elas.',
        manifesto4: 'Finova não é apenas um app. É uma ponte. Estamos aqui para garantir que seu futuro financeiro seja determinado pela sua ambição, não pela sua história de origem.',
        stat1Label: 'Idiomas Suportados',
        stat2Label: 'Famílias Ajudadas',
        stat3Label: 'Tempo Economizado',
        joinTitle: 'Junte-se ao movimento',
        joinText: 'Somos uma pequena equipe de imigrantes, engenheiros e sonhadores construindo o app que desejamos que nossas famílias tivessem.',
        joinButton: 'Ver Vagas Abertas'
    },

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

export default function AboutPage() {
    const [currentLangIndex, setCurrentLangIndex] = useState(0)
    const [isManualSelection, setIsManualSelection] = useState(false)
    const currentLangKey = languageKeys[currentLangIndex]
    const baseLang = localeMap[currentLangKey] || 'en'
    const t = translations[baseLang]

    useEffect(() => {
        if (isManualSelection) return
        const interval = setInterval(() => {
            setCurrentLangIndex((prev) => (prev + 1) % languageKeys.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [isManualSelection])

    const selectLanguage = (langKey: string) => {
        const index = languageKeys.indexOf(langKey)
        if (index !== -1) {
            setCurrentLangIndex(index)
            setIsManualSelection(true)
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
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <motion.h1
                            key={`headline-${currentLangKey}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                fontFamily: 'serif',
                                fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                                lineHeight: 1.1,
                                fontWeight: 500,
                                marginBottom: '2rem',
                                letterSpacing: '-0.03em'
                            }}
                        >
                            {t.headline1}<br />
                            <span style={{ color: '#71717A', fontStyle: 'italic' }}>{t.headline2}</span>
                        </motion.h1>
                    </div>

                    {/* Manifesto */}
                    <motion.div
                        key={`manifesto-${currentLangKey}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: '1.25rem', lineHeight: 1.8, color: '#52525B', marginBottom: '6rem' }}
                    >
                        <p style={{ marginBottom: '2rem' }}>
                            <strong style={{ color: '#18181B' }}>{t.manifesto1}</strong>
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            {t.manifesto2}
                        </p>
                        <p style={{ marginBottom: '2rem' }}>
                            {t.manifesto3}
                        </p>
                        <p>
                            {t.manifesto4}
                        </p>
                    </motion.div>

                    {/* Values/Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2rem',
                        marginBottom: '6rem',
                        textAlign: 'center'
                    }}>
                        {[
                            { label: t.stat1Label, value: '20+' },
                            { label: t.stat2Label, value: '10k+' },
                            { label: t.stat3Label, value: '100h/mo' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                style={{
                                    background: 'white',
                                    padding: '2rem',
                                    borderRadius: '1.5rem',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                                }}
                            >
                                <div style={{ fontSize: '3rem', fontFamily: 'serif', fontWeight: 500, color: '#18181B', marginBottom: '0.5rem' }}>{stat.value}</div>
                                <div style={{ fontSize: '0.875rem', color: '#71717A', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Team Note */}
                    <motion.div
                        key={`join-${currentLangKey}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', background: '#18181B', color: 'white', padding: '4rem 2rem', borderRadius: '2rem' }}
                    >
                        <h3 style={{ fontFamily: 'serif', fontSize: '2rem', marginBottom: '1.5rem' }}>{t.joinTitle}</h3>
                        <p style={{ color: '#A1A1AA', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                            {t.joinText}
                        </p>
                        <button style={{
                            background: 'white',
                            color: '#18181B',
                            padding: '1rem 2rem',
                            borderRadius: '9999px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            {t.joinButton}
                        </button>
                    </motion.div>

                </div>
            </main>
        </div>
    )
}
