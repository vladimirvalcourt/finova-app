'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useState, useEffect, ReactNode } from 'react'

import enUS from '../../../messages/en-US.json'
import esMX from '../../../messages/es-MX.json'
import esAR from '../../../messages/es-AR.json'
import esBO from '../../../messages/es-BO.json'
import esCL from '../../../messages/es-CL.json'
import esCO from '../../../messages/es-CO.json'
import esCR from '../../../messages/es-CR.json'
import esCU from '../../../messages/es-CU.json'
import esDO from '../../../messages/es-DO.json'
import esEC from '../../../messages/es-EC.json'
import esGT from '../../../messages/es-GT.json'
import esHN from '../../../messages/es-HN.json'
import esNI from '../../../messages/es-NI.json'
import esPA from '../../../messages/es-PA.json'
import esPE from '../../../messages/es-PE.json'
import esPR from '../../../messages/es-PR.json'
import esPY from '../../../messages/es-PY.json'
import esSV from '../../../messages/es-SV.json'
import esUY from '../../../messages/es-UY.json'
import esVE from '../../../messages/es-VE.json'
import htHT from '../../../messages/ht-HT.json'
import ptBR from '../../../messages/pt-BR.json'

// Default messages (English)
const defaultMessages = enUS

const messageMap: Record<string, typeof enUS> = {
    'en-US': enUS,
    'es-MX': esMX,
    'es-AR': esAR,
    'es-BO': esBO,
    'es-CL': esCL,
    'es-CO': esCO,
    'es-CR': esCR,
    'es-CU': esCU,
    'es-DO': esDO,
    'es-EC': esEC,
    'es-GT': esGT,
    'es-HN': esHN,
    'es-NI': esNI,
    'es-PA': esPA,
    'es-PE': esPE,
    'es-PR': esPR,
    'es-PY': esPY,
    'es-SV': esSV,
    'es-UY': esUY,
    'es-VE': esVE,
    'ht-HT': htHT,
    'pt-BR': ptBR,
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
                    'es': 'es-MX',
                    'es-mx': 'es-MX',
                    'es-ar': 'es-AR',
                    'es-bo': 'es-BO',
                    'es-cl': 'es-CL',
                    'es-co': 'es-CO',
                    'es-cr': 'es-CR',
                    'es-cu': 'es-CU',
                    'es-do': 'es-DO',
                    'es-ec': 'es-EC',
                    'es-gt': 'es-GT',
                    'es-hn': 'es-HN',
                    'es-ni': 'es-NI',
                    'es-pa': 'es-PA',
                    'es-pe': 'es-PE',
                    'es-pr': 'es-PR',
                    'es-py': 'es-PY',
                    'es-sv': 'es-SV',
                    'es-uy': 'es-UY',
                    'es-ve': 'es-VE',
                    'ht': 'ht-HT',
                    'pt': 'pt-BR',
                    'pt-br': 'pt-BR',
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
