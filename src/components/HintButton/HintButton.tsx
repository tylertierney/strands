import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import styles from './HintButton.module.scss'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  percentage: number
}

export default function HintButton({
  percentage = 100,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  const clipPath = `inset(0px ${100 - percentage}% 0px 0px)`
  // const clipPath = `inset(0px % 0px 0px)`
  // const clipPath = `polygon(0 0, 0 ${percentage}%, ${percentage}% 100%, 0 100%)`

  return (
    <button className={styles.button} {...rest}>
      <div className={styles.overlay}>{children}</div>
      <div className={styles.inner} style={{ clipPath }}>
        {children}
      </div>
    </button>
  )
}
