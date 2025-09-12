import styles from './Clue.module.scss'

interface Props {
  clue: string
}

export default function Clue({ clue }: Props) {
  return (
    <div className={styles.clue}>
      <div className={styles.label}>TODAY'S THEME</div>
      <div className={styles.content}>{clue}</div>
    </div>
  )
}
