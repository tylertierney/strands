export type Coords = [number, number]
export type Strand = Array<Coords>

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
