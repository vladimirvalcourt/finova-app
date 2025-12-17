'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Wallet, Target, CreditCard, Sparkles } from 'lucide-react'
import styles from './WelcomeModal.module.css'

interface WelcomeModalProps {
    onComplete: () => void
    onAddAccount: () => void
    onAddGoal: () => void
    onAddTransaction: () => void
}

const STORAGE_KEY = 'finova_onboarding_complete'

export function WelcomeModal({ onComplete, onAddAccount, onAddGoal, onAddTransaction }: WelcomeModalProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        // Check if user has completed onboarding
        const completed = localStorage.getItem(STORAGE_KEY)
        if (!completed) {
            setIsVisible(true)
        }
    }, [])

    const handleComplete = () => {
        localStorage.setItem(STORAGE_KEY, 'true')
        setIsVisible(false)
        onComplete()
    }

    const handleSkip = () => {
        localStorage.setItem(STORAGE_KEY, 'true')
        setIsVisible(false)
    }

    const steps = [
        {
            icon: Wallet,
            title: 'Welcome to Finova! 🎉',
            description: 'Your personal finance command center. Let\'s get you set up in 3 quick steps.',
            action: null,
        },
        {
            icon: CreditCard,
            title: 'Add Your Accounts',
            description: 'Start by adding your checking, savings, or credit card accounts to track your balances.',
            action: onAddAccount,
            buttonText: 'Add Account',
        },
        {
            icon: Target,
            title: 'Set a Savings Goal',
            description: 'What are you saving for? A vacation, emergency fund, or new car? Set a goal to stay motivated.',
            action: onAddGoal,
            buttonText: 'Create Goal',
        },
        {
            icon: Sparkles,
            title: 'Log Your First Transaction',
            description: 'Use AI Quick Add or the + button to log expenses and income. Try typing: "Spent $45 on groceries"',
            action: onAddTransaction,
            buttonText: 'Add Transaction',
        },
    ]

    const currentStep = steps[step]

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className={styles.modal}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                >
                    <button className={styles.closeBtn} onClick={handleSkip}>
                        <X size={20} />
                    </button>

                    <div className={styles.content}>
                        <div className={styles.iconWrapper}>
                            <currentStep.icon size={32} />
                        </div>

                        <h2 className={styles.title}>{currentStep.title}</h2>
                        <p className={styles.description}>{currentStep.description}</p>

                        <div className={styles.progress}>
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.dot} ${i === step ? styles.active : ''} ${i < step ? styles.completed : ''}`}
                                />
                            ))}
                        </div>

                        <div className={styles.actions}>
                            {step > 0 && (
                                <button className={styles.secondaryBtn} onClick={() => setStep(step - 1)}>
                                    Back
                                </button>
                            )}

                            {currentStep.action ? (
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => {
                                        currentStep.action?.()
                                        if (step < steps.length - 1) {
                                            setStep(step + 1)
                                        } else {
                                            handleComplete()
                                        }
                                    }}
                                >
                                    {currentStep.buttonText}
                                    <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => setStep(step + 1)}
                                >
                                    Get Started
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>

                        {step > 0 && (
                            <button className={styles.skipBtn} onClick={handleComplete}>
                                Skip for now
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
