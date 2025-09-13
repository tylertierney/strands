import fs from 'fs'
import games from './games.json'

const getNewGame = async () => {
  // const mostRecentGame = connections.at(-1);
  // if (!mostRecentGame) return;

  const today = new Date()

  const date = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(today)

  // if (date === mostRecentGame.date) {
  //   console.log(
  //     `Connection game #${mostRecentGame.id} from ${mostRecentGame.date} already exists.`
  //   );
  //   return;
  // }

  const url = `https://www.nytimes.com/svc/strands/v2/${date}.json`

  try {
    const response = await fetch(url)
    const game = (await response.json()) as unknown

    // const game = convertNytGameToConnectionsGame(
    //   data,
    //   date,
    //   mostRecentGame.id + 1
    // );
    const gamesArr = games as unknown[]
    gamesArr.push(game)

    fs.writeFileSync('games.json', JSON.stringify(gamesArr, null, 2))
    // console.log(game, gamesArr)
  } catch (err) {
    console.log(`Failed to fetch newest game`, err)
    return
  }
}

getNewGame()
