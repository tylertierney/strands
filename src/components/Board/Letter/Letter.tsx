import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { type Strand } from '../../../models/models'
import { getConnectorPositions } from '../../../utils'
import styles from './Letter.module.scss'

export type StrandType =
  | undefined
  | 'themeWord'
  | 'spangram'
  | 'currentStrand'
  | 'hint'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  row: number
  col: number
  strand?: Strand
  strandType?: StrandType
  extraHint: boolean
}

export default function Letter({
  row,
  col,
  strand,
  strandType,
  extraHint = false,
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

  const classes = inStrand
    ? `${styles.highlighted}
      ${strandType ? styles[strandType] : ''}
      ${idxInStrand === strand.length - 1 ? styles.endOfStrand : ''}
      ${extraHint && strandType === 'hint' ? styles.extraHint : ''}`
    : ''

  return (
    <button
      className={`
        ${styles.letter} 
        ${classes}`}
      style={{
        animationDelay:
          extraHint && strandType === 'hint'
            ? (idxInStrand + 1) * 0.5 + 's'
            : 'unset',
      }}
      {...rest}
    >
      {inStrand && (
        <div
          className={`${styles.connector} ${
            styles[getConnectorPositions(strand, idxInStrand)]
          }`}
        ></div>
      )}
      {children}
    </button>
  )
}
