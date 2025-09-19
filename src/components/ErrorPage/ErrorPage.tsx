import styles from './ErrorPage.module.scss'
import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className={styles.page}>
      <span className={styles.emoji}>🥲</span>
      <p className={styles.p}>Something went wrong...</p>
      <p className={styles.p}>A game doesn't exist with the provided ID.</p>
      <p className={styles.p}>
        You can go back to the full{' '}
        <Link className={styles.link} to=''>
          game list
        </Link>{' '}
        and try again.
      </p>
    </div>
  )
}
