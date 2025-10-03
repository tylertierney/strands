import { Link } from 'react-router-dom'
import styles from './Home.module.scss'
import {
  constructDateFromString,
  isGameCompleted,
  isGameInProgress,
} from '../../utils'
import gamesArr from '../../../games.json'
import type { Game, FoundWords } from '../../models/models'
import Badge from '../Badge/Badge'
import type { ReactNode } from 'react'

const games = gamesArr as unknown as Game[]

const getFoundWordsFromLocalStorage = (g: Game): FoundWords | null => {
  const fromLocalStorage = localStorage.getItem(`strings-state-${String(g.id)}`)
  if (!fromLocalStorage) {
    return null
  }
  return JSON.parse(fromLocalStorage) as FoundWords
}

const getBadge = (foundWords: FoundWords | null, game: Game): ReactNode => {
  if (isGameCompleted(foundWords, game)) {
    return (
      <Badge size='xs' type='success'>
        Completed
      </Badge>
    )
  }

  if (isGameInProgress(foundWords)) {
    return (
      <Badge size='xs' type='warning'>
        In Progress
      </Badge>
    )
  }

  return ''
}

export default function Home() {
  return (
    <div className={styles.page}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={`${styles.th} ${styles.id}`} scope='col'>
              ID
            </th>
            <th className={styles.th} scope='col'>
              Date
            </th>
            <th className={`${styles.th} ${styles.completed}`} scope='col'>
              Completed
            </th>
            <th className={styles.th} scope='col'>
              Clue
            </th>
          </tr>
        </thead>
        <tbody>
          {(games as Game[]).map((gameFromJson, i) => {
            const game = gameFromJson as unknown as Game

            return (
              <tr key={i} className={styles.tr}>
                <td className={`${styles.td} ${styles.id}`}>{game.index}</td>
                <td className={styles.td}>
                  <Link
                    style={{ color: 'var(--text-color)' }}
                    to={`/games/${game.index}`}
                  >
                    {constructDateFromString(game.printDate).toLocaleDateString(
                      'en-us',
                      {
                        month: 'short',
                        year: 'numeric',
                        day: '2-digit',
                      }
                    )}
                  </Link>
                </td>
                <td className={`${styles.td} ${styles.completed}`}>
                  {getBadge(getFoundWordsFromLocalStorage(game), game)}
                </td>
                <td className={styles.td}>{game.clue}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
