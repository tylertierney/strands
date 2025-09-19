export type Coords = [number, number]
export type Strand = Array<Coords>

export interface Game {
  status: string
  id: number
  printDate: string
  themeWords: string[]
  editor: string
  constructors: string
  spangram: string
  clue: string
  startingBoard: string[]
  solutions: string[]
  themeCoords: Record<string, Strand>
  spangramCoords: Strand
  index: number
}

export type ResultItem = 'themeWord' | 'spangram' | 'hint'

export interface FoundWords {
  themeWords: string[]
  spangram: string
  other: string[]
  hintsUsed: number
  hintStrand: Strand
  result: ResultItem[]
}

export const defaultFoundWords: FoundWords = {
  themeWords: [],
  spangram: '',
  other: [],
  hintsUsed: 0,
  hintStrand: [],
  result: [],
}
