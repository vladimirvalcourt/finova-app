'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function FinRoast() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', text: string }>>([
        { type: 'ai', text: "I'm FinAI. Ask me a finance question and I'll be brutally honest." }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const roasts = {
        crypto: [
            "Ah, crypto. The astrological sign for men who don't know how to save money. Good luck with that.",
            "Buying high and selling low isn't a strategy, it's a cry for help. Need a real plan?",
            "Unless you're a time traveler from 2011, maybe focus on maxing out your 401k first."
        ],
        coffee: [
            "Spending $7 on bean water daily is why you'll be renting until you're 90. Make it at home.",
            "That latte cost you $2,500 a year. compounded. Ouch.",
            "I can smell the overpriced espresso from here. Your wallet is crying."
        ],
        save: [
            "Saving money isn't rocket science, but for you, it seems to be. Try spending less than you earn?",
            "Your savings account has cobwebs. Time to automate that before you buy another useless gadget.",
            "You want to save? Stop buying things you saw on TikTok. Start there."
        ],
        invest: [
            "Investing? Let's master 'not overdrafting' first, shall we?",
            "Index funds are boring. Being poor is exciting. Choose your fighter.",
            "Don't try to beat the market. You can't even beat the urge to order UberEats."
        ],
        default: [
            "I've seen better financial planning from a raccoon. You need help.",
            "Is that really a question or a confession? Your bank account needs therapy.",
            "Yikes. With logic like that, no wonder you're asking an AI for help.",
            "I'd calculate your net worth, but I don't like negative numbers."
        ]
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isTyping) return

        const userQuestion = input.trim()
        setInput('')
        setMessages(prev => [...prev, { type: 'user', text: userQuestion }])
        setIsTyping(true)

        // Simulate thinking time
        setTimeout(() => {
            const lowerInput = userQuestion.toLowerCase()
            let response = ""

            if (lowerInput.includes('crypto') || lowerInput.includes('bitcoin') || lowerInput.includes('nft')) {
                response = roasts.crypto[Math.floor(Math.random() * roasts.crypto.length)]
            } else if (lowerInput.includes('coffee') || lowerInput.includes('starbucks') || lowerInput.includes('latte')) {
                response = roasts.coffee[Math.floor(Math.random() * roasts.coffee.length)]
            } else if (lowerInput.includes('save') || lowerInput.includes('saving')) {
                response = roasts.save[Math.floor(Math.random() * roasts.save.length)]
            } else if (lowerInput.includes('invest') || lowerInput.includes('stock')) {
                response = roasts.invest[Math.floor(Math.random() * roasts.invest.length)]
            } else {
                response = roasts.default[Math.floor(Math.random() * roasts.default.length)]
            }

            // Append CTA to response
            response += " Serious about fixing this? Sign up for Finova."

            setIsTyping(false)
            setMessages(prev => [...prev, { type: 'ai', text: response }])
        }, 1500)
    }

    return (
        <section style={{ padding: '6rem 2rem', background: '#FFFFFF' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{
                        fontFamily: 'serif',
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        color: '#18181B'
                    }}>
                        Ask FinAI
                    </h2>
                    <p style={{ color: '#71717A' }}>
                        Warning: I'm not a financial advisor. I'm a roaster.
                    </p>
                </div>

                <div style={{
                    background: '#F4F4F5',
                    borderRadius: '1.5rem',
                    padding: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Chat Area */}
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            maxHeight: '400px'
                        }}
                    >
                        <AnimatePresence initial={false}>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    style={{
                                        alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '80%',
                                        background: msg.type === 'user' ? '#18181B' : '#FFFFFF',
                                        color: msg.type === 'user' ? '#FFFFFF' : '#18181B',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '1rem',
                                        borderBottomRightRadius: msg.type === 'user' ? '0.25rem' : '1rem',
                                        borderBottomLeftRadius: msg.type === 'ai' ? '0.25rem' : '1rem',
                                        boxShadow: msg.type === 'ai' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                        fontSize: '0.95rem',
                                        lineHeight: 1.5
                                    }}
                                >
                                    {msg.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    alignSelf: 'flex-start',
                                    background: '#FFFFFF',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '1rem',
                                    borderBottomLeftRadius: '0.25rem',
                                    fontSize: '0.875rem',
                                    color: '#71717A',
                                    fontStyle: 'italic'
                                }}
                            >
                                FinAI is judging you...
                            </motion.div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Roast my spending..."
                            style={{
                                flex: 1,
                                padding: '1rem 1.25rem',
                                borderRadius: '9999px',
                                border: '1px solid #E4E4E7',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#18181B'}
                            onBlur={(e) => e.target.style.borderColor = '#E4E4E7'}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            style={{
                                background: '#18181B',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0 1.5rem',
                                borderRadius: '9999px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                opacity: !input.trim() || isTyping ? 0.5 : 1,
                                transition: 'opacity 0.2s'
                            }}
                        >
                            Ask
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
