import { Sidebar } from '@/components/layout/Sidebar'
import { RightPanel } from '@/components/dashboard/RightPanel/RightPanel'
import styles from './layout.module.css'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
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
    )
}
