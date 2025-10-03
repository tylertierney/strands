import styles from './Badge.module.scss'
import type { PropsWithChildren } from 'react'

export type BadgeType = 'success' | 'warning' | 'danger' | 'info'

interface Props {
  type?: BadgeType
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function Badge({
  type = 'info',
  size = 'md',
  children,
}: PropsWithChildren<Props>) {
  return (
    <span className={`${styles.badge} ${styles[type]} ${styles[size]}`}>
      {children}
    </span>
  )
}
