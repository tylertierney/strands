import type { Coords, Strand } from './models/models'

export const getWordFromStrand = ({
  strand,
  rows,
}: {
  strand: Strand
  rows: Array<string>
}) => {
  return strand.reduce((acc, [r, c]) => acc + rows[r][c], '')
}

export type ConnectorPosition =
  | ''
  | 'top'
  | 'topRight'
  | 'right'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'left'
  | 'topLeft'

export const getConnectorPosition = (
  start: Coords,
  end: Coords
): ConnectorPosition => {
  // position is applied to "start" coords

  const startR = start[0]
  const startC = start[1]

  const endR = end[0]
  const endC = end[1]

  if (startR < endR) {
    if (startC < endC) {
      return 'bottomRight'
    }
    if (startC === endC) {
      return 'bottom'
    }
    if (startC > endC) {
      return 'bottomLeft'
    }
  }

  if (startR === endR) {
    if (startC < endC) {
      return 'right'
    }
    if (startC === endC) {
      return ''
    }
    if (startC > endC) {
      return 'left'
    }
  }

  if (startR > endR) {
    if (startC < endC) {
      return 'topRight'
    }

    if (startC === endC) {
      return 'top'
    }

    if (startC > endC) {
      return 'topLeft'
    }
  }

  return ''
}

export const getConnectorPositions = (strand: Strand, idx: number) => {
  if (strand.length <= 1) return ''
  if (idx === 0) return ''

  return getConnectorPosition(strand[idx], strand[idx - 1])
}

export const flattenArrayOfStrings = (arr: string[]): string[] => {
  return arr.flatMap((str) => str.split(''))
}

export const coordIsDetached = (strand: Strand, row: number, col: number) => {
  if (!strand.length) return false

  const [endR, endC] = strand.at(-1) as Coords

  const rowDiff = Math.abs(endR - row)
  const colDiff = Math.abs(endC - col)

  return rowDiff > 1 || colDiff > 1
}

export const matchStrands = (a: Strand, b: Strand): boolean => {
  if (a.length !== b.length) return false
  return a.every(
    (coord, idx) => coord[0] === b[idx][0] && coord[1] === b[idx][1]
  )
}

export const isCoordInStrand = (row: number, col: number, strand: Strand) => {
  const idx = strand.findIndex(([r, c]) => r === row && c === col)
  return idx > -1
}

export const constructDateFromString = (str: string): Date => {
  const [year, month, day] = str.split('-').map(Number)
  const correctDate = new Date(year, month - 1, day)
  return correctDate
}
