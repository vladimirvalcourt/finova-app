'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useState, useEffect, ReactNode } from 'react'

// Default messages (English)
const defaultMessages = {
    landing: {
        badge: 'Built for families like yours',
        headline: 'Your money. Your language.',
        headlineGradient: 'Your way.',
        subtitle: "The first finance app that speaks Spanish, Tagalog, Creole, and 15 more languages. Because you shouldn't have to translate your bank account in your head.",
        cta: 'Try it free — no English required',
        ctaDemo: 'See it in action',
        stats: {
            languages: 'Languages',
            free: 'Forever free',
            family: 'For your family'
        },
        features: {
            title: 'Made for how you actually live',
            subtitle: 'Not another generic bank app. This one gets you.',
            ai: {
                title: '"Le mandé $200 a mamá"',
                desc: 'Just type it. Our AI understands you—in any language.'
            },
            home: {
                title: 'Track money home & here',
                desc: 'See what you sent to family abroad and what stays local. One app.'
            },
            goals: {
                title: 'Goals your family can see',
                desc: 'Save for the trip home. Share progress with the people who matter.'
            },
            spending: {
                title: 'See where la quincena goes',
                desc: 'Beautiful charts. No surprises. No math.'
            },
            bills: {
                title: 'Never miss a bill',
                desc: "Get alerts before it's due. Protect the credit you're building."
            },
            security: {
                title: 'Your data stays yours',
                desc: "Bank-level security. We don't sell your information. Period."
            }
        },
        socialProof: {
            quote: 'Maria shared it with her mom. Her mom shared it with her comadre. Now 47 families in their church use Finova.',
            note: 'Trusted by word of mouth, not ads.'
        },
        testimonials: {
            title: 'Real families. Real languages.',
            subtitle: 'See what people are saying—in their own words.'
        },
        ctaSection: {
            title: "Show your family there's a better way.",
            subtitle: 'Free forever. No credit card. No tricks.',
            button: "Get Started — It's Free",
            trust: 'Works on any phone • Available in 18 languages • Secure'
        },
        footer: {
            tagline: 'Built by immigrants, for immigrants.',
            copyright: '© 2024 Finova. All rights reserved.'
        }
    }
}

interface IntlProviderProps {
    children: ReactNode
}

export function IntlProvider({ children }: IntlProviderProps) {
    const [locale, setLocale] = useState('en-US')
    const [messages, setMessages] = useState(defaultMessages)

    useEffect(() => {
        const loadMessages = async () => {
            const savedLocale = localStorage.getItem('finova-lang')
            if (savedLocale) {
                // Map short codes to full locale codes
                const localeMap: Record<string, string> = {
                    'en': 'en-US',
                    'es-mx': 'es-MX',
                    'es-ar': 'es-AR',
                    'es-co': 'es-CO',
                    'es-do': 'es-DO',
                    'es-pr': 'es-PR',
                    'es-cu': 'es-CU',
                    'es-sv': 'es-SV',
                    'es-gt': 'es-GT',
                    'es-hn': 'es-HN',
                    'es-ve': 'es-VE',
                    'es-pe': 'es-PE',
                    'es-ec': 'es-EC',
                    'es-cl': 'es-CL',
                    'es-bo': 'es-BO',
                    'es-py': 'es-PY',
                    'es-uy': 'es-UY',
                    'ht': 'ht-HT',
                }
                const fullLocale = localeMap[savedLocale] || savedLocale
                setLocale(fullLocale)

                try {
                    const msgs = await import(`../../messages/${fullLocale}.json`)
                    setMessages(msgs.default)
                } catch (e) {
                    console.warn(`Could not load messages for ${fullLocale}, using default`)
                }
            }
        }
        loadMessages()

        // Listen for language changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'finova-lang') {
                loadMessages()
            }
        }
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    )
}
