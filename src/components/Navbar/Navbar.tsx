import useTheme from '../../hooks/useTheme'
import { moonIcon } from '../../svg/moon'
import { sunIcon } from '../../svg/sun'
import styles from './Navbar.module.scss'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [lightTheme, setLightTheme] = useTheme()

  return (
    <nav className={styles.navbar}>
      <Link className={styles.logo} to="home">
        strings
      </Link>
      <button
        className={styles.themeButton}
        onClick={() => setLightTheme((prev) => !prev)}
      >
        {lightTheme ? moonIcon : sunIcon}
      </button>
    </nav>
  )
}
