'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight, Globe, MessageCircle, Home, Target, PieChart, Bell, Shield, ChevronDown } from 'lucide-react'
import { Testimonials } from '@/components/marketing'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import Image from 'next/image'
import styles from './landing.module.css'

export default function LandingPage() {
  const t = useTranslations('landing')

  const features = [
    {
      icon: MessageCircle,
      title: t('features.ai.title'),
      description: t('features.ai.desc'),
    },
    {
      icon: Home,
      title: t('features.home.title'),
      description: t('features.home.desc'),
    },
    {
      icon: Target,
      title: t('features.goals.title'),
      description: t('features.goals.desc'),
    },
    {
      icon: PieChart,
      title: t('features.spending.title'),
      description: t('features.spending.desc'),
    },
    {
      icon: Bell,
      title: t('features.bills.title'),
      description: t('features.bills.desc'),
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.desc'),
    },
  ]

  const scrollToContent = () => {
    const featuresSection = document.querySelector(`.${styles.features}`)
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💎</span>
            <span className={styles.logoText}>Finova</span>
          </div>
          <div className={styles.navLinks}>
            <LanguageSwitcher />
            <Link href="/login" className={styles.navLink}>Log in</Link>
            <Link href="/signup" className={styles.navLinkPrimary}>
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className={styles.badge}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span>{t('badge')}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t('headline')}
            {/* <span className={styles.heroGradient}>{t('headlineGradient')}</span> Removed gradient for cleaner look */}
          </h1>

          <p className={styles.heroSubtitle}>
            {t('subtitle')}
          </p>

          <div className={styles.heroCta}>
            <Link href="/signup" className={styles.ctaPrimary}>
              {t('cta')}
            </Link>
            <Link href="/dashboard" className={styles.ctaSecondary}>
              {t('ctaDemo')} <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats removed from hero for cleaner look, potentially move below */}
        </motion.div>

        {/* Hero Illustration - Right Side (Desktop) */}
        <motion.div
          className={styles.heroImageWrapper}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <Image
            src="/hero-illustration.png"
            alt="Finova App Interface"
            width={800}
            height={800}
            className={styles.heroIllustration}
            priority
          />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className={styles.scrollIndicator}
          onClick={scrollToContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('features.subtitle')}
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className={styles.featureIcon}>
                <feature.icon size={28} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className={styles.socialProof}>
        <div className={styles.socialProofContent}>
          <div className={styles.socialProofQuote}>
            <span className={styles.quoteIcon}>"</span>
            <p className={styles.quoteText}>
              {t('socialProof.quote')}
            </p>
          </div>
          <p className={styles.socialProofNote}>
            {t('socialProof.note')}
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsHeader}>
          <h2 className={styles.sectionTitle}>{t('testimonials.title')}</h2>
          <p className={styles.sectionSubtitle}>
            {t('testimonials.subtitle')}
          </p>
        </div>
        <div className={styles.testimonialsWrapper}>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{t('ctaSection.title')}</h2>
          <p className={styles.ctaSubtitle}>
            {t('ctaSection.subtitle')}
          </p>
          <Link href="/signup" className={styles.ctaButton}>
            {t('ctaSection.button')}
            <ArrowRight size={18} />
          </Link>
          <p className={styles.ctaTrust}>
            {t('ctaSection.trust')}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span>💎</span>
            <span>Finova</span>
          </div>
          <p className={styles.footerText}>
            {t('footer.tagline')} 🌟
          </p>
          <p className={styles.footerCopyright}>
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}
