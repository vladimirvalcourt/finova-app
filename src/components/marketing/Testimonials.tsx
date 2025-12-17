'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import styles from './Testimonials.module.css'

interface Testimonial {
    id: number
    name: string
    location: string
    flag: string
    quote: string
    language: string
    avatar: string
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'María González',
        location: 'Los Angeles, CA',
        flag: '🇲🇽',
        quote: 'Finova me ayudó a ahorrar $300 al mes. Ahora puedo enviar más dinero a mi familia en México.',
        language: 'es-MX',
        avatar: 'MG',
    },
    {
        id: 2,
        name: 'Jean-Pierre Louis',
        location: 'Miami, FL',
        flag: '🇭🇹',
        quote: 'Mwen te toujou pèdi lajan nan frè kache. Finova montre m tout bagay klè.',
        language: 'ht-HT',
        avatar: 'JL',
    },
    {
        id: 3,
        name: 'Rosa Martínez',
        location: 'New York, NY',
        flag: '🇩🇴',
        quote: 'Con Finova sé exactamente cuánto mando a mi mamá cada mes. Ya no hay confusión con los cuartos.',
        language: 'es-DO',
        avatar: 'RM',
    },
    {
        id: 4,
        name: 'Carlos Rodríguez',
        location: 'Houston, TX',
        flag: '🇸🇻',
        quote: 'El pisto que ahorro con Finova me ayuda a planear mejor. Mi familia en El Salvador está agradecida.',
        language: 'es-SV',
        avatar: 'CR',
    },
    {
        id: 5,
        name: 'Ana Lucia Pérez',
        location: 'Chicago, IL',
        flag: '🇬🇹',
        quote: 'Antes no sabía en qué se iba mi pisto. Ahora tengo control total de mis finanzas.',
        language: 'es-GT',
        avatar: 'AP',
    },
    {
        id: 6,
        name: 'Michael Johnson',
        location: 'Atlanta, GA',
        flag: '🇺🇸',
        quote: 'Finally an app that understands how immigrant families manage money. Game changer.',
        language: 'en-US',
        avatar: 'MJ',
    },
    {
        id: 7,
        name: 'Valentina Ruiz',
        location: 'San Diego, CA',
        flag: '🇦🇷',
        quote: 'La guita que ahorro con Finova me permite mandarle más a mi vieja en Buenos Aires. Increíble.',
        language: 'es-AR',
        avatar: 'VR',
    },
    {
        id: 8,
        name: 'Pedro Sánchez',
        location: 'Orlando, FL',
        flag: '🇵🇷',
        quote: 'Con Finova manejo mis chavos como un profesional. Mi familia en la isla está orgullosa.',
        language: 'es-PR',
        avatar: 'PS',
    },
]

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const nextTestimonial = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    // Auto-rotate every 5 seconds
    useEffect(() => {
        const timer = setInterval(nextTestimonial, 5000)
        return () => clearInterval(timer)
    }, [])

    const current = testimonials[currentIndex]

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
        }),
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Community Stories</h3>
                <p className={styles.subtitle}>Real people, real savings</p>
            </div>

            <div className={styles.carousel}>
                <button
                    className={styles.navBtn}
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className={styles.testimonialWrapper}>
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={current.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className={styles.testimonial}
                        >
                            <Quote size={24} className={styles.quoteIcon} />
                            <p className={styles.quote}>{current.quote}</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>{current.avatar}</div>
                                <div className={styles.authorInfo}>
                                    <span className={styles.name}>
                                        {current.flag} {current.name}
                                    </span>
                                    <span className={styles.location}>{current.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button
                    className={styles.navBtn}
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className={styles.dots}>
                {testimonials.map((_, idx) => (
                    <button
                        key={idx}
                        className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                        onClick={() => {
                            setDirection(idx > currentIndex ? 1 : -1)
                            setCurrentIndex(idx)
                        }}
                        aria-label={`Go to testimonial ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
