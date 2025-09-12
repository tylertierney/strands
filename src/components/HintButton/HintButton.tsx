import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import styles from './HintButton.module.scss'

export default function HintButton({
  children,
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={styles.button} {...rest}>
      <div className={styles.overlay}>{children}</div>
      <div className={styles.inner}>{children}</div>
    </button>
  )
}
