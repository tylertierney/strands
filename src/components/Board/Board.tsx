import { useEffect, useState, type PointerEvent } from 'react'
import type { Coords, Strand } from '../../models/models'
import {
  coordIsDetachedFromEnd,
  flattenArrayOfStrings,
  getWordFromStrand,
  isCoordInStrand,
} from '../../utils'
import styles from './Board.module.scss'
import Letter, { type StrandType } from './Letter/Letter'

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
  hintStrand: Strand
  disabled?: boolean
}

export default function Board({
  rows,
  onDraw,
  onConfirm,
  foundThemeStrands = [],
  foundSpangram = [],
  hintStrand = [],
  disabled = false,
}: Props) {
  const [currentStrand, setCurrentStrand] = useState<Strand>([])

  const width = rows[0].length
  const height = rows.length

  const letters = flattenArrayOfStrings(rows)

  const selectLetter = (strand: Strand, row: number, col: number) => {
    if (draggingFrom) {
      if (coordIsDetachedFromEnd(strand, row, col)) {
        setCurrentStrand([])
        return
      }
    }

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

  const getCoordsFromPointerEvent = (
    e: PointerEvent<HTMLDivElement | HTMLButtonElement>
  ): [number, number] | null => {
    const x = e.clientX
    const y = e.clientY
    const el = document.elementFromPoint(x, y) as HTMLButtonElement
    if (!el || !el.dataset.letter) return null
    const r = parseInt(el.dataset.row ?? '', 10)
    const c = parseInt(el.dataset.col ?? '', 10)
    return [r, c]
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.pointerType === 'touch' && e.buttons === 1) || draggingFrom) {
      const coords = getCoordsFromPointerEvent(e)
      if (!coords) return
      const [r, c] = coords
      selectLetter(currentStrand, r, c)
    }
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const coords = getCoordsFromPointerEvent(e)
    if (!coords) return
    const [row, col] = coords

    const hasDraggedFromAnotherNode =
      draggingFrom?.row !== row || draggingFrom?.col !== col

    if (hasDraggedFromAnotherNode) {
      onConfirm?.({
        word: getWordFromStrand({ strand: currentStrand, rows }),
        strand: currentStrand,
      })
      setCurrentStrand([])
    } else {
      if (
        currentStrand.at(-1)?.[0] === row &&
        currentStrand.at(-1)?.[1] === col
      ) {
        onConfirm?.({
          word: getWordFromStrand({ strand: currentStrand, rows }),
          strand: currentStrand,
        })
        setCurrentStrand([])
      } else {
        selectLetter(currentStrand, row, col)
      }
    }

    setDraggingFrom(null)
  }

  const [draggingFrom, setDraggingFrom] = useState<{
    row: number
    col: number
  } | null>(null)

  return (
    <div
      className={styles.board}
      style={{
        touchAction: disabled ? 'auto' : 'none',
      }}
    >
      <div
        className={styles.grid}
        style={{
          gridTemplateRows: `repeat(${height}, 1fr)`,
          gridTemplateColumns: `repeat(${width}, 1fr)`,
        }}
        onPointerLeave={() => {
          if (disabled) return
          setDraggingFrom(null)
        }}
        onPointerMove={disabled ? undefined : onPointerMove}
        onPointerUp={disabled ? undefined : onPointerUp}
      >
        {letters.map((letter, idx) => {
          const row = ~~(idx / width)
          const col = idx % width

          let strand: Strand | undefined = undefined
          let strandType: StrandType = undefined

          if (isCoordInStrand(row, col, hintStrand)) {
            strandType = 'hint'
            strand = hintStrand
          }

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
              data-letter
              data-row={row}
              data-col={col}
              key={row * width + col}
              row={row}
              col={col}
              strand={strand}
              onPointerDown={() => {
                setDraggingFrom({ row, col })
              }}
              strandType={strandType}
              disabled={disabled}
            >
              {letter}
            </Letter>
          )
        })}
      </div>
    </div>
  )
}
