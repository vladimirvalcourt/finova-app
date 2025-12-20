import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, DollarSign, Wallet } from 'lucide-react'

export function HeroVisual() {
    return (
        <div className="relative w-full h-[600px] flex items-center justify-center">
            {/* Abstract Background Blurs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-500/20 rounded-full blur-[80px] translate-x-20 -translate-y-20" />

            {/* Main Floating Balance Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 bg-white/80 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-[380px]"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="text-sm text-gray-500 font-medium">Total Balance</div>
                        <div className="text-3xl font-serif font-bold text-gray-900">$24,500.00</div>
                    </div>
                    <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center">
                        <Wallet size={20} />
                    </div>
                </div>

                {/* Expenses Graph Visual */}
                <div className="h-32 flex items-end justify-between gap-2 mb-8">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                            className="w-full bg-gray-900/5 rounded-t-sm relative group overflow-hidden"
                        >
                            <div className="absolute bottom-0 left-0 w-full bg-gray-900 transition-all duration-500 h-0 group-hover:h-full" />
                        </motion.div>
                    ))}
                </div>

                {/* Floating Action Elements */}
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-16 top-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
                >
                    <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Income</div>
                        <div className="text-sm font-bold">+$4,200</div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-12 bottom-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100"
                >
                    <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Spending</div>
                        <div className="text-sm font-bold">-$1,250</div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    )
}
