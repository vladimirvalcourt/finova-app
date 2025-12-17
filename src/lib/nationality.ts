// Nationality and localization types

export interface NationalityConfig {
    code: string
    name: string
    locale: string
    flag: string
    currency: string
    dateFormat: string
    terms: {
        money: string
        groceries?: string
        transportation?: string
        phone?: string
        [key: string]: string | undefined
    }
    defaultCategories: string[]
    enableRemittances: boolean
}

export interface UserLocalePreferences {
    locale: string
    nationality: string | null
    currency: string
    dateFormat: string
    numberFormat: 'US' | 'EU'
    showRemittanceTracking: boolean
    preferredTerms: Record<string, string>
}

export interface Remittance {
    id: string
    userId: string
    transactionId?: string
    type: 'sent' | 'received'
    amount: number
    recipientName?: string
    recipientCountry?: string
    serviceUsed?: string
    fees: number
    exchangeRate?: number
    date: string
    notes?: string
    createdAt: string
}

export const NATIONALITIES: Record<string, NationalityConfig> = {
    HT: {
        code: 'HT',
        name: 'Haiti',
        locale: 'ht-HT',
        flag: '🇭🇹',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'lajan',
            groceries: 'manje',
            transportation: 'transpò',
            phone: 'telefòn',
        },
        defaultCategories: ['Remesas', 'Lwaye', 'Transpò', 'Telefòn', 'Manje'],
        enableRemittances: true,
    },
    DO: {
        code: 'DO',
        name: 'República Dominicana',
        locale: 'es-DO',
        flag: '🇩🇴',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'cuartos',
            groceries: 'colmado',
            transportation: 'guagua',
            phone: 'recarga',
        },
        defaultCategories: ['Remesas', 'Colmado', 'Guagua', 'Luz', 'Recarga'],
        enableRemittances: true,
    },
    PR: {
        code: 'PR',
        name: 'Puerto Rico',
        locale: 'es-PR',
        flag: '🇵🇷',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        terms: {
            money: 'chavos',
            groceries: 'compras',
            transportation: 'guagua',
            gas: 'gasolina',
        },
        defaultCategories: ['Compras', 'Gasolina', 'Renta', 'Utilidades', 'Comida'],
        enableRemittances: false,
    },
    MX: {
        code: 'MX',
        name: 'México',
        locale: 'es-MX',
        flag: '🇲🇽',
        currency: 'MXN',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'lana',
            groceries: 'despensa',
            transportation: 'camión',
            bus: 'camión',
        },
        defaultCategories: ['Despensa', 'Transporte', 'Comida Fuera', 'Luz y Gas', 'Celular'],
        enableRemittances: true,
    },
    CU: {
        code: 'CU',
        name: 'Cuba',
        locale: 'es-CU',
        flag: '🇨🇺',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'fula',
            groceries: 'bodega',
            transportation: 'guagua',
            thousand: 'kilo',
        },
        defaultCategories: ['Remesas', 'Bodega', 'Transporte', 'Recargas', 'Comida'],
        enableRemittances: true,
    },
    SV: {
        code: 'SV',
        name: 'El Salvador',
        locale: 'es-SV',
        flag: '🇸🇻',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'pisto',
            groceries: 'despensa',
        },
        defaultCategories: ['Remesas', 'Despensa', 'Bus', 'Servicios', 'Comida'],
        enableRemittances: true,
    },
    GT: {
        code: 'GT',
        name: 'Guatemala',
        locale: 'es-GT',
        flag: '🇬🇹',
        currency: 'GTQ',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'pisto',
            dollar: 'chivo',
        },
        defaultCategories: ['Remesas', 'Despensa', 'Transporte', 'Servicios', 'Comida'],
        enableRemittances: true,
    },
    HN: {
        code: 'HN',
        name: 'Honduras',
        locale: 'es-HN',
        flag: '🇭🇳',
        currency: 'HNL',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'pisto',
            currency: 'lempiras',
        },
        defaultCategories: ['Remesas', 'Despensa', 'Transporte', 'Servicios', 'Comida'],
        enableRemittances: true,
    },
    CO: {
        code: 'CO',
        name: 'Colombia',
        locale: 'es-CO',
        flag: '🇨🇴',
        currency: 'COP',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'plata',
            groceries: 'mercado',
            delivery: 'domicilios',
        },
        defaultCategories: ['Mercado', 'Transporte', 'Domicilios', 'Servicios Públicos', 'Celular'],
        enableRemittances: true,
    },
    VE: {
        code: 'VE',
        name: 'Venezuela',
        locale: 'es-VE',
        flag: '🇻🇪',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'plata',
            dollars: 'verdes',
        },
        defaultCategories: ['Mercado', 'Transporte', 'Servicios', 'Comida', 'Celular'],
        enableRemittances: true,
    },
    AR: {
        code: 'AR',
        name: 'Argentina',
        locale: 'es-AR',
        flag: '🇦🇷',
        currency: 'ARS',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'guita',
            informal: 'mango',
            million: 'palo',
        },
        defaultCategories: ['Mercado', 'Transporte', 'Servicios', 'Comida', 'Celular'],
        enableRemittances: true,
    },
    CL: {
        code: 'CL',
        name: 'Chile',
        locale: 'es-CL',
        flag: '🇨🇱',
        currency: 'CLP',
        dateFormat: 'DD/MM/YYYY',
        terms: {
            money: 'plata',
            thousand: 'luca',
            hundred: 'gamba',
        },
        defaultCategories: ['Mercado', 'Transporte', 'Servicios', 'Comida', 'Celular'],
        enableRemittances: true,
    },
    US: {
        code: 'US',
        name: 'United States',
        locale: 'en-US',
        flag: '🇺🇸',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        terms: {
            money: 'money',
            groceries: 'groceries',
            transportation: 'transportation',
        },
        defaultCategories: ['Groceries', 'Transportation', 'Dining', 'Utilities', 'Entertainment'],
        enableRemittances: false,
    },
}

// Helper function to get nationality config
export function getNationalityConfig(code: string): NationalityConfig | undefined {
    return NATIONALITIES[code]
}

// Helper function to format currency based on locale
export function formatCurrencyByNationality(
    amount: number,
    nationalityCode: string
): string {
    const config = getNationalityConfig(nationalityCode)
    if (!config) return `$${amount.toFixed(2)}`

    const locale = config.locale
    const currency = config.currency

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount)
}

// Helper function to format date based on nationality
export function formatDateByNationality(
    date: Date | string,
    nationalityCode: string
): string {
    const config = getNationalityConfig(nationalityCode)
    const dateObj = typeof date === 'string' ? new Date(date) : date

    if (!config) {
        return dateObj.toLocaleDateString('en-US')
    }

    return dateObj.toLocaleDateString(config.locale)
}

// Helper to get culturally appropriate category name
export function getCategoryNameForNationality(
    englishName: string,
    nationalityCode: string
): string {
    const config = getNationalityConfig(nationalityCode)
    if (!config) return englishName

    const mapping: Record<string, Record<string, string>> = {
        Groceries: {
            DO: 'Colmado',
            MX: 'Despensa',
            HT: 'Manje',
            CU: 'Bodega',
            CO: 'Mercado',
            PR: 'Compras',
        },
        Transportation: {
            DO: 'Guagua',
            MX: 'Transporte',
            HT: 'Transpò',
            CU: 'Transporte',
            PR: 'Transporte',
        },
    }

    return mapping[englishName]?.[nationalityCode] || englishName
}
