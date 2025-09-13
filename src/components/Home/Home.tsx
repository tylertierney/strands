import { Link } from 'react-router-dom'
import styles from './Home.module.scss'
import { constructDateFromString } from '../../utils'
import games from '../../../games.json'

export default function Home() {
  return (
    <div className={styles.page}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th className={`${styles.th} ${styles.id}`} scope="col">
              ID
            </th>
            <th className={styles.th} scope="col">
              Date
            </th>
            <th className={styles.th} scope="col">
              Completed
            </th>
          </tr>
        </thead>
        <tbody>
          {games.toReversed().map((game, i) => {
            return (
              <tr key={i}>
                <th className={`${styles.td} ${styles.id}`} scope="row">
                  <Link
                    style={{ color: 'var(--text-color)' }}
                    to={`/games/${game.id}`}
                  >
                    Game #{game.id}{' '}
                  </Link>
                </th>
                <td className={styles.td}>
                  {constructDateFromString(game.printDate).toLocaleDateString(
                    'en-us',
                    {
                      month: 'short',
                      year: 'numeric',
                      day: '2-digit',
                    }
                  )}
                </td>
                <td className={styles.td}>
                  {/* {userHasCompletedGame(game) ? checkmarkIcon : ''} */}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
