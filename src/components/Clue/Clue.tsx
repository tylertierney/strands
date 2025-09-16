import type { HTMLAttributes } from 'react'
import styles from './Clue.module.scss'

interface Props extends HTMLAttributes<HTMLDivElement> {
  clue: string
}

export default function Clue({ clue, className = '', ...rest }: Props) {
  return (
    <div className={`${styles.clue} ${className}`} {...rest}>
      <div className={styles.label}>TODAY'S THEME</div>
      <div className={styles.content}>{clue}</div>
    </div>
  )
}
