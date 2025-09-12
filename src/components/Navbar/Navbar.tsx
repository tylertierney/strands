import useTheme from '../../hooks/useTheme'
import { moonIcon } from '../../svg/moon'
import { sunIcon } from '../../svg/sun'
import styles from './Navbar.module.scss'

export default function Navbar() {
  const [lightTheme, setLightTheme] = useTheme()

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo}>strings</span>
      <button
        className={styles.themeButton}
        onClick={() => setLightTheme((prev) => !prev)}
      >
        {lightTheme ? moonIcon : sunIcon}
      </button>
    </nav>
  )
}
