import { Link } from 'react-router-dom'
import styles from './Home.module.scss'
import { constructDateFromString, isGameCompleted } from '../../utils'
import gamesArr from '../../../games.json'
import type { Game, FoundWords } from '../../models/models'

const games = gamesArr as unknown as Game[]

const checkmarkIcon = (
  <svg
    fill='color-mix(in hsl, #0f0, var(--text-color))'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    width='1rem'
    height='1rem'
    viewBox='0 0 78.369 78.369'
    xmlSpace='preserve'
  >
    <g>
      <path d='M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704   c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704   C78.477,17.894,78.477,18.586,78.049,19.015z' />
    </g>
  </svg>
)

const getFoundWordsFromLocalStorage = (g: Game): FoundWords | null => {
  const fromLocalStorage = localStorage.getItem(`strings-state-${String(g.id)}`)
  if (!fromLocalStorage) {
    return null
  }
  return JSON.parse(fromLocalStorage) as FoundWords
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
                  {isGameCompleted(getFoundWordsFromLocalStorage(game), game)
                    ? checkmarkIcon
                    : ''}
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
