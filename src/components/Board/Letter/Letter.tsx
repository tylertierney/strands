import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { getConnectorPositions, type Strand } from '../../../utils'
import styles from './Letter.module.scss'

export type StrandType = undefined | 'themeWord' | 'spangram' | 'currentStrand'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  row: number
  col: number
  strand?: Strand
  strandType?: StrandType
}

export default function Letter({
  row,
  col,
  strand,
  strandType,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  if (!strand) {
    return (
      <button className={styles.letter} {...rest}>
        {children}
      </button>
    )
  }

  const idxInStrand = strand.findIndex(([r, c]) => r === row && c === col)

  const inStrand = idxInStrand > -1

  if (row === 4 && col === 0) {
    console.log(children)
    console.log(idxInStrand)
    console.log(styles[strandType || ''])
  }

  const classes = inStrand
    ? `${styles.connector} 
      ${styles[getConnectorPositions(strand, idxInStrand)]}
      ${strandType ? styles[strandType] : ''}`
    : ''

  return (
    <button
      className={`
        ${styles.letter} 
        ${classes}`}
      {...rest}
    >
      {children}
    </button>
  )
}
