import { Sidebar } from '@/components/layout/Sidebar'
import { RightPanel } from '@/components/dashboard/RightPanel/RightPanel'
import { ModalProvider } from '@/components/providers/ModalProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'
import styles from './layout.module.css'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <ModalProvider>
                <div className={styles.container}>
                    <Sidebar />
                    <main className={styles.mainContent}>
                        {/* Dynamic ambient background for dashboard */}
                        <div className={styles.ambientLight} />
                        {children}
                    </main>
                    <aside className={styles.rightPanel}>
                        <RightPanel />
                    </aside>
                </div>
            </ModalProvider>
        </SessionProvider>
    )
}
