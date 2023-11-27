import Logo from '../Logo'
import Nav from '../Nav'

import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Nav />
    </header>
  )
}

export default Header