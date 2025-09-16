import fs from 'fs'
import gamesArr from './games.json'

export type Coords = [number, number]
export type Strand = Array<Coords>

interface Game {
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

const games = gamesArr as Game[]

const getNewGame = async (date: Date) => {
  const formattedDate = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

  const url = `https://www.nytimes.com/svc/strands/v2/${formattedDate}.json`

  try {
    const response = await fetch(url)
    const game = (await response.json()) as Game

    if (game.status === 'OK') {
      games.unshift({
        ...game,
        index: games.length,
      })

      fs.writeFileSync('games.json', JSON.stringify(games, null, 2))
    }
  } catch (err) {
    console.log(`Failed to fetch newest game`, err)
    return
  }
}

getNewGame(new Date())
