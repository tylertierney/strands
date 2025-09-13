import styles from './Board.module.scss'
import { useEffect, useState } from 'react'
import {
  coordIsDetached,
  flattenArrayOfStrings,
  getWordFromStrand,
  isCoordInStrand,
} from '../../utils'
import Letter, { type StrandType } from './Letter/Letter'
import type { Strand } from '../../models/models'

export interface DrawEvent {
  word: string
  strand: Strand
}

interface Props {
  rows: string[]
  onDraw?: (e: DrawEvent) => void
  onConfirm?: (e: DrawEvent) => void
  foundThemeStrands: Strand[]
  foundSpangram: Strand
}

export default function Board({
  rows,
  onDraw,
  onConfirm,
  foundThemeStrands,
  foundSpangram,
}: Props) {
  const [dragging, setDragging] = useState(false)
  const [currentStrand, setCurrentStrand] = useState<Strand>([])

  const width = rows[0].length
  const height = rows.length

  const letters = flattenArrayOfStrings(rows)

  const mouseEnter = (strand: Strand, row: number, col: number) => {
    if (!dragging) return

    if (coordIsDetached(strand, row, col)) return

    const coordAlreadyInStrand = strand.findIndex(
      ([r, c]) => r === row && c === col
    )

    if (coordAlreadyInStrand !== -1) {
      const newStrand = [...strand].slice(0, coordAlreadyInStrand + 1)
      setCurrentStrand(newStrand)
      onDraw?.({
        word: getWordFromStrand({ strand: newStrand, rows }),
        strand: newStrand,
      })
      return
    }

    const newStrand: Strand = [...strand, [row, col]]
    setCurrentStrand(newStrand)
    onDraw?.({
      word: getWordFromStrand({ strand: newStrand, rows }),
      strand: newStrand,
    })
  }

  useEffect(() => {
    const word = getWordFromStrand({ strand: currentStrand, rows })

    onDraw?.({
      word,
      strand: currentStrand,
    })
  }, [currentStrand, onDraw, rows])

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateRows: `repeat(${height}, 1fr)`,
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        touchAction: 'none',
      }}
      onMouseLeave={() => {
        setDragging(false)
        setCurrentStrand([])
      }}
      onMouseUp={() => {
        onConfirm?.({
          word: getWordFromStrand({ strand: currentStrand, rows }),
          strand: currentStrand,
        })
        setDragging(false)
        setCurrentStrand([])
      }}
    >
      {letters.map((letter, idx) => {
        const row = ~~(idx / width)
        const col = idx % width

        let strand: Strand | undefined = undefined
        let strandType: StrandType = undefined

        for (const themeWordStrand of foundThemeStrands) {
          if (isCoordInStrand(row, col, themeWordStrand)) {
            strandType = 'themeWord'
            strand = themeWordStrand
            break
          }
        }

        if (isCoordInStrand(row, col, foundSpangram)) {
          strandType = 'spangram'
          strand = foundSpangram
        }

        if (isCoordInStrand(row, col, currentStrand)) {
          strandType = 'currentStrand'
          strand = currentStrand
        }

        return (
          <Letter
            key={row * width + col}
            row={row}
            col={col}
            strand={strand}
            onMouseDown={() => {
              setDragging(true)
              setCurrentStrand([[row, col]])
            }}
            onPointerDown={() => {
              setDragging(true)
              setCurrentStrand([[row, col]])
            }}
            onMouseEnter={() => {
              mouseEnter(currentStrand, row, col)
            }}
            onPointerEnter={() => {
              mouseEnter(currentStrand, row, col)
            }}
            strandType={strandType}
          >
            {letter}
          </Letter>
        )
      })}
    </div>
  )
}
