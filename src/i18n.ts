import { getRequestConfig } from 'next-intl/server'

export const locales = [
    'en-US',
    'es-MX',
    'es-AR',
    'es-BO',
    'es-CL',
    'es-CO',
    'es-CU',
    'es-DO',
    'es-EC',
    'es-GT',
    'es-HN',
    'es-PE',
    'es-PR',
    'es-PY',
    'es-SV',
    'es-UY',
    'es-VE',
    'ht-HT',
] as const

export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
    'en-US': 'English',
    'es-MX': 'Español (México)',
    'es-AR': 'Español (Argentina)',
    'es-BO': 'Español (Bolivia)',
    'es-CL': 'Español (Chile)',
    'es-CO': 'Español (Colombia)',
    'es-CU': 'Español (Cuba)',
    'es-DO': 'Español (Dominicana)',
    'es-EC': 'Español (Ecuador)',
    'es-GT': 'Español (Guatemala)',
    'es-HN': 'Español (Honduras)',
    'es-PE': 'Español (Perú)',
    'es-PR': 'Español (Puerto Rico)',
    'es-PY': 'Español (Paraguay)',
    'es-SV': 'Español (El Salvador)',
    'es-UY': 'Español (Uruguay)',
    'es-VE': 'Español (Venezuela)',
    'ht-HT': 'Kreyòl Ayisyen',
}

export const localeFlags: Record<Locale, string> = {
    'en-US': '🇺🇸',
    'es-MX': '🇲🇽',
    'es-AR': '🇦🇷',
    'es-BO': '🇧🇴',
    'es-CL': '🇨🇱',
    'es-CO': '🇨🇴',
    'es-CU': '🇨🇺',
    'es-DO': '🇩🇴',
    'es-EC': '🇪🇨',
    'es-GT': '🇬🇹',
    'es-HN': '🇭🇳',
    'es-PE': '🇵🇪',
    'es-PR': '🇵🇷',
    'es-PY': '🇵🇾',
    'es-SV': '🇸🇻',
    'es-UY': '🇺🇾',
    'es-VE': '🇻🇪',
    'ht-HT': '🇭🇹',
}

export default getRequestConfig(async ({ locale }) => ({
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default,
}))
