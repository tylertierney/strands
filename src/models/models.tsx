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
