import { Link } from 'react-router-dom'

import styles from './Logo.module.css'

function Logo() {
  return (
    <Link to="/" className={styles.logo}>
      <img src="/images/logo_ref.png" alt="Petpal Logo" className={styles.img} />
      <span className={styles.span}>PetPal</span>
    </Link>
  )
}

export default Logo