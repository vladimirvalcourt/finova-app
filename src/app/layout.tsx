import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { IntlProvider } from "@/components/providers/IntlProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: "Finova - Smart Money Management",
  description: "Smart money management in English, Kreyòl Ayisyen, and Español. Track expenses, create budgets, and achieve your financial goals.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Finova",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finova.app",
    siteName: "Finova",
    title: "Finova - Smart Money Management",
    description: "Smart money management in English, Kreyòl Ayisyen, and Español.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finova - Smart Money Management",
    description: "Smart money management in English, Kreyòl Ayisyen, and Español.",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        playfair.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <IntlProvider>
            <ErrorBoundary>
              {children}
              <InstallPrompt />
            </ErrorBoundary>
          </IntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


