'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useState, useEffect, ReactNode } from 'react'

import enUS from '../../../messages/en-US.json'
import esMX from '../../../messages/es-MX.json'
import esAR from '../../../messages/es-AR.json'
import esCO from '../../../messages/es-CO.json'
import esDO from '../../../messages/es-DO.json'
import esPR from '../../../messages/es-PR.json'
import esCU from '../../../messages/es-CU.json'
import esSV from '../../../messages/es-SV.json'
import esGT from '../../../messages/es-GT.json'
import esHN from '../../../messages/es-HN.json'
import esVE from '../../../messages/es-VE.json'
import esPE from '../../../messages/es-PE.json'
import esEC from '../../../messages/es-EC.json'
import esCL from '../../../messages/es-CL.json'
import esBO from '../../../messages/es-BO.json'
import esPY from '../../../messages/es-PY.json'
import esUY from '../../../messages/es-UY.json'
import htHT from '../../../messages/ht-HT.json'

// Default messages (English)
const defaultMessages = enUS

const messageMap: Record<string, typeof enUS> = {
    'en-US': enUS,
    'es-MX': esMX,
    'es-AR': esAR,
    'es-CO': esCO,
    'es-DO': esDO,
    'es-PR': esPR,
    'es-CU': esCU,
    'es-SV': esSV,
    'es-GT': esGT,
    'es-HN': esHN,
    'es-VE': esVE,
    'es-PE': esPE,
    'es-EC': esEC,
    'es-CL': esCL,
    'es-BO': esBO,
    'es-PY': esPY,
    'es-UY': esUY,
    'ht-HT': htHT,
}

interface IntlProviderProps {
    children: ReactNode
}

export function IntlProvider({ children }: IntlProviderProps) {
    const [locale, setLocale] = useState('en-US')
    const [messages, setMessages] = useState(defaultMessages)

    useEffect(() => {
        const loadMessages = () => {
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

                const msgs = messageMap[fullLocale]
                if (msgs) {
                    setMessages(msgs)
                } else {
                    console.warn(`Could not load messages for ${fullLocale}, using default`)
                    setMessages(defaultMessages)
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
