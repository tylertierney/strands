import styles from './Result.module.scss'
import type { HTMLAttributes } from 'react'
import type { ResultItem } from '../../models/models'

function chunkArray<T>(arr: T[], chunkSize: number) {
  const result = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }
  return result
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  result: ResultItem[]
}

export default function Result({ result, className = '', ...rest }: Props) {
  const chunked = chunkArray(result, 4)

  const hintsUsed = result.reduce(
    (acc, curr) => acc + Number(curr === 'hint'),
    0
  )

  return (
    <div className={`${styles.result} ${className}`} {...rest}>
      <div className={styles.resultItemGrid}>
        {chunked.map((row, idx) => (
          <div key={idx} className={styles.resultRow}>
            {row.map((resultItem, key) => (
              <div key={key} className={`${styles.icon} ${styles[resultItem]}`}>
                {resultItem === 'hint' ? '💡' : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className={styles.p}>
        Nice job finding the theme words 🔵 and Spangram 🟡. You used{' '}
        <b>{hintsUsed}</b> hint{hintsUsed === 1 ? '' : 's'} 💡.
      </p>
    </div>
  )
}
