'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export function AiDemoChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hola! 👋 I'm your Finova AI assistant. I can help you in English, Español, Kreyòl, and more. Try asking: \"How can I save $500 for a trip?\""
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    const handleSendMessage = async (text?: string) => {
        const messageText = text || inputValue
        if (!messageText.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText
        }

        setMessages(prev => [...prev, userMsg])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI thinking and response
        setTimeout(() => {
            let responseContent = ""

            // Check for joke request
            if (messageText.toLowerCase().includes('joke')) {
                const jokes = [
                    "Why did the banker break up with his girlfriend? She lost interest! 😂💸",
                    "Why is money called dough? Because we all knead it! 🍞💵",
                    "What did the dollar say to the penny? You make no cents. 🪙😅",
                    "Why don't chickens invest in the stock market? They prefer distinct-eggs! 🥚📈",
                    "I told my budget I needed more space... now there's just a lot of checking and no savings. 🏦💔"
                ]
                responseContent = jokes[Math.floor(Math.random() * jokes.length)]
            } else {
                const responses = [
                    "That's a great goal! 🎯 With Finova, you can set a 'Travel Goal' and I'll help you save automatically every time you get paid.",
                    "Entendido. 🏦 Puedo analizar tus gastos y encontrar dónde ahorrar. ¿Te gustaría ver un presupuesto de ejemplo?",
                    "Mwen ka ede w konprann kote lajan w ap ale. 📉 Let's track your expenses together so you can send more home.",
                    "Smart move! 💡 Investing just $50 a month can grow significantly over time. Want to see a projection?"
                ]
                responseContent = responses[Math.floor(Math.random() * responses.length)]
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent
            }

            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] overflow-hidden rounded-2xl border border-white/20 bg-black/80 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                            <div className="flex items-center gap-3">
                                <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-indigo-500 p-1">
                                    <Image
                                        src="/icon-192x192.png"
                                        alt="AI"
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 animate-pulse bg-white/20" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Finova AI</h3>
                                    <p className="text-xs text-indigo-200">Online • Ready to help</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-[350px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white/10 text-white/90 rounded-bl-none border border-white/5'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-1 rounded-2xl bg-white/10 px-4 py-3 rounded-bl-none border border-white/5">
                                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                                    </div>
                                </div>
                            )}
                            {messages.length < 3 && !isTyping && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <button
                                        onClick={() => handleSendMessage("Tell me a financial joke 😂")}
                                        className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 hover:border-indigo-400 transition-all"
                                    >
                                        Tell me a joke 😂
                                    </button>
                                    <button
                                        onClick={() => handleSendMessage("How can I save $1000?")}
                                        className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 hover:border-indigo-400 transition-all"
                                    >
                                        How to save $1000? 💰
                                    </button>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-white/10 p-4 bg-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 transition-shadow hover:shadow-indigo-500/50"
            >
                {isOpen ? (
                    <X className="text-white" size={24} />
                ) : (
                    <MessageCircle className="text-white" size={24} />
                )}

                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#0a0a0f]"></span>
                    </span>
                )}
            </motion.button>
        </div>
    )
}
