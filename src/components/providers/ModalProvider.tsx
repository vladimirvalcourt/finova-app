'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { TransactionFormModal, AccountFormModal, GoalFormModal, BudgetFormModal } from '@/components/forms'

interface ModalContextType {
    openTransactionModal: () => void
    openAccountModal: () => void
    openGoalModal: () => void
    openBudgetModal: () => void
    closeAllModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [showAccountModal, setShowAccountModal] = useState(false)
    const [showGoalModal, setShowGoalModal] = useState(false)
    const [showBudgetModal, setShowBudgetModal] = useState(false)

    const openTransactionModal = () => setShowTransactionModal(true)
    const openAccountModal = () => setShowAccountModal(true)
    const openGoalModal = () => setShowGoalModal(true)
    const openBudgetModal = () => setShowBudgetModal(true)
    
    const closeAllModals = () => {
        setShowTransactionModal(false)
        setShowAccountModal(false)
        setShowGoalModal(false)
        setShowBudgetModal(false)
    }

    return (
        <ModalContext.Provider value={{
            openTransactionModal,
            openAccountModal,
            openGoalModal,
            openBudgetModal,
            closeAllModals
        }}>
            {children}
            
            <TransactionFormModal
                isOpen={showTransactionModal}
                onClose={() => setShowTransactionModal(false)}
            />
            <AccountFormModal
                isOpen={showAccountModal}
                onClose={() => setShowAccountModal(false)}
            />
            <GoalFormModal
                isOpen={showGoalModal}
                onClose={() => setShowGoalModal(false)}
            />
            <BudgetFormModal
                isOpen={showBudgetModal}
                onClose={() => setShowBudgetModal(false)}
            />
        </ModalContext.Provider>
    )
}

export function useModals() {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModals must be used within a ModalProvider')
    }
    return context
}
