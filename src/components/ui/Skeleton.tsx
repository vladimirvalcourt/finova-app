import styles from './Skeleton.module.css'

interface SkeletonProps {
    width?: string | number
    height?: string | number
    borderRadius?: string
    className?: string
}

export function Skeleton({
    width = '100%',
    height = '1rem',
    borderRadius = '8px',
    className = '',
}: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                borderRadius,
            }}
        />
    )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`${styles.card} ${className}`}>
            <div className={styles.cardHeader}>
                <Skeleton width={120} height={16} />
                <Skeleton width={20} height={20} borderRadius="50%" />
            </div>
            <Skeleton width="60%" height={32} />
            <Skeleton width="40%" height={14} />
        </div>
    )
}

export function SkeletonList({ count = 5, className = '' }: { count?: number; className?: string }) {
    return (
        <div className={`${styles.list} ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={styles.listItem}>
                    <Skeleton width={40} height={40} borderRadius="8px" />
                    <div className={styles.listContent}>
                        <Skeleton width="70%" height={14} />
                        <Skeleton width="40%" height={12} />
                    </div>
                    <Skeleton width={60} height={16} />
                </div>
            ))}
        </div>
    )
}

export function SkeletonChart({ className = '' }: { className?: string }) {
    return (
        <div className={`${styles.chart} ${className}`}>
            <Skeleton width="100%" height="200px" borderRadius="12px" />
        </div>
    )
}
